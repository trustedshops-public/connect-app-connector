/* eslint-disable */
import { SelectedTab } from '@/locales/types'

export const handleEtrustedInteraction = async (
  token: string | undefined,
  allState: any,
  interactionType: string,
  selectedTab: SelectedTab,
  callback: (token: string, payload: object) => Promise<void>
): Promise<void> => {
  if (!token) {
    console.error('Token is not available')
    return
  }

  try {
    await callback(token, { action: interactionType, allState, selectedTab })
  } catch (error) {
    console.error(`Error during ${callback.name}:`, error)
  }
}

export const handleEtrustedConfiguration = async (
  token: string | undefined,
  allState: any,
  selectedTab: SelectedTab,
  callback: (token: string, payload: object) => Promise<void>
): Promise<void> => {
  if (!token) {
    console.error('Token is not available')
    return
  }

  try {
    await callback(token, {allState, selectedTab})
  } catch (error) {
    console.error(`Error during ${callback.name}:`, error)
  }
}
