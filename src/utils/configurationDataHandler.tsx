/* eslint-disable */
import { SelectedTab } from '@/locales/types'

/**
 * Structured markup (JSON-LD) is injected by the Trustbadge script, so it can
 * never be live while the Trustbadge itself is disabled. Every configuration
 * call goes through here, so the coupling is enforced on the payload instead of
 * in each single caller - otherwise a flow that only flips
 * `data-disable-trustbadge` (trustbadge deactivation, adding a new channel with
 * the disabled defaults, saving another tab afterwards) would keep
 * `structuredMarkupEnabled: true` in the saved configuration.
 *
 * `structuredMarkupState` is added even when it is missing from the payload:
 * `selectAllState` leaves it out for shop systems that do not report
 * `allowsSupportStructuredMarkup`, and a request without the key lets an
 * already saved `true` survive. Without the Trustbadge nothing is injected, so
 * `false` is the truthful value for those systems as well.
 */
const withStructuredMarkupCoupledToTrustbadge = (allState: any): any => {
  // only an explicit `true` counts as disabled - an empty trustbadgeDataChild
  // means "not loaded yet" and must not switch structured markup off
  const isTrustbadgeDisabled =
    allState?.trustbadgeState?.trustbadgeDataChild?.attributes?.['data-disable-trustbadge']
      ?.value === true

  if (!isTrustbadgeDisabled) return allState

  const structuredMarkupState = allState.structuredMarkupState

  // already sent as off - nothing to correct
  if (structuredMarkupState && !structuredMarkupState.structuredMarkupEnabled) return allState

  return {
    ...allState,
    structuredMarkupState: {
      isLoadingStructuredMarkup: false,
      ...structuredMarkupState,
      structuredMarkupEnabled: false,
    },
  }
}

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
    await callback(token, {
      action: interactionType,
      allState: withStructuredMarkupCoupledToTrustbadge(allState),
      selectedTab,
    })
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
    await callback(token, {
      allState: withStructuredMarkupCoupledToTrustbadge(allState),
      selectedTab,
    })
  } catch (error) {
    console.error(`Error during ${callback.name}:`, error)
  }
}
