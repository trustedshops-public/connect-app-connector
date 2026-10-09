import { useMemo } from 'preact/hooks'
import useStore from '../useStore'
import { getBookedFeaturesOfChannel, resolveFeatureAvailability } from './featureAvailability'
import { IFeatureAvailability } from './types'

/** Feature availability of the selected channel. */
export const useFeatureAvailability = (): IFeatureAvailability => {
  const infoOfSystem = useStore(store => store.infoState.infoOfSystem)
  const channelRef = useStore(store => store.channelState.selectedeTrustedChannelRef)
  const bookedFeaturesByChannel = useStore(
    store => store.bookedFeaturesState.bookedFeaturesByChannel,
  )

  return useMemo(
    () =>
      resolveFeatureAvailability(
        infoOfSystem,
        getBookedFeaturesOfChannel(bookedFeaturesByChannel, channelRef),
      ),
    [infoOfSystem, channelRef, bookedFeaturesByChannel],
  )
}
