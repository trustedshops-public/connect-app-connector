/* eslint-disable no-console */
import axios from 'axios'
import { GetState, SetState } from 'zustand'
import { getBookedFeatures } from '@/api/api'
import {
  getBookedFeaturesMock,
  isBookedFeaturesMockScenario,
} from '@/baseLayers/testData/getBookedFeatures'
import { AppStore } from '../useStore'
import {
  BookedFeature,
  BookedFeaturesByChannel,
  IBookedFeaturesResponseItem,
  IBookedFeaturesState,
  IBookedFeaturesStore,
} from './types'

// Only defined when the variable is set - `process` does not exist in the shop's browser otherwise
const readMockScenario = (): string => {
  try {
    return process.env.bookedFeatures || ''
  } catch {
    return ''
  }
}

const BOOKED_FEATURES_MOCK_SCENARIO = readMockScenario()

if (BOOKED_FEATURES_MOCK_SCENARIO && !isBookedFeaturesMockScenario(BOOKED_FEATURES_MOCK_SCENARIO)) {
  console.warn(`Unknown bookedFeatures mock scenario "${BOOKED_FEATURES_MOCK_SCENARIO}"`)
}

const IS_BOOKED_FEATURES_MOCK = isBookedFeaturesMockScenario(BOOKED_FEATURES_MOCK_SCENARIO)

// Until the middleware endpoint is live, the dashboard keeps showing what the shop system supports
const IS_BOOKED_FEATURES_ENABLED =
  Boolean(Number(process.env.VITE_USE_BOOKED_FEATURES)) || IS_BOOKED_FEATURES_MOCK

const KNOWN_FEATURES: string[] = Object.values(BookedFeature)

const initialState: IBookedFeaturesState = {
  bookedFeaturesByChannel: null,
  isBookedFeaturesLoading: false,
}

export const parseBookedFeatures = (
  response: IBookedFeaturesResponseItem[],
): BookedFeaturesByChannel =>
  response.reduce<BookedFeaturesByChannel>((result, { channel, bookedFeatures }) => {
    const features = (bookedFeatures || []).flatMap(item => Object.keys(item || {}))
    result[channel] = [...new Set(features)].filter(feature => KNOWN_FEATURES.includes(feature))
    return result
  }, {})

// A response that arrives after a logout is dropped
let latestRequestId = 0

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * The real endpoint knows the channels of the account, the mock does not: it answers for
 * the mapped channels first - in the order of the channel select - then for the other
 * channels of the account, once those have been loaded.
 */
const waitForMockChannelRefs = async (get: GetState<AppStore>): Promise<string[]> => {
  for (let attempt = 0; attempt < 100 && !get().channelState.channelsFromTSC.length; attempt++) {
    await sleep(100)
  }
  const { mappedChannels, channelsFromTSC } = get().channelState
  const refs = [
    ...mappedChannels.map(item => item.eTrustedChannelRef),
    ...channelsFromTSC.map(item => item.id),
  ]
  return [...new Set(refs)]
}

export const bookedFeaturesStore = (
  set: SetState<AppStore>,
  get: GetState<AppStore>,
): IBookedFeaturesStore => ({
  bookedFeaturesState: initialState,
  clearBookedFeaturesState: () => {
    latestRequestId++
    set(() => ({ bookedFeaturesState: { ...initialState } }))
  },
  // Once per login - switching the channel only looks the features up
  getBookedFeatures: async () => {
    const { bookedFeaturesState } = get()
    const isRequestedAlready =
      bookedFeaturesState.isBookedFeaturesLoading || !!bookedFeaturesState.bookedFeaturesByChannel
    if (!IS_BOOKED_FEATURES_ENABLED || isRequestedAlready) return

    const requestId = ++latestRequestId
    set(store => ({
      bookedFeaturesState: { ...store.bookedFeaturesState, isBookedFeaturesLoading: true },
    }))

    let bookedFeaturesByChannel: Nullable<BookedFeaturesByChannel> = null
    try {
      const response = IS_BOOKED_FEATURES_MOCK
        ? await getBookedFeaturesMock(
            BOOKED_FEATURES_MOCK_SCENARIO,
            await waitForMockChannelRefs(get),
          )
        : await getBookedFeatures(
            get().infoState.infoOfSystem,
            get().auth.user?.access_token as string,
          )
      bookedFeaturesByChannel = parseBookedFeatures(response)
    } catch (err) {
      // Fail open: an outage of the endpoint must not hide every feature of the dashboard
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      console.warn(`Booked features could not be loaded (status ${status ?? 'unknown'})`, err)
    }

    if (requestId !== latestRequestId) return
    set(() => ({
      bookedFeaturesState: { bookedFeaturesByChannel, isBookedFeaturesLoading: false },
    }))
  },
})
