import { h, Fragment } from 'preact'
import { FC, useState } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import StyledButton from '@/components/controls/styledButton'
import useStore from '@/store/useStore'
import { selectAllState, selectorAuth, selectorChannels, selectorInfoOfSystem } from '@/store/selector'
import { getEtrustedID, putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import { getTrustbadgeDefault } from '@/store/trustbadge/getTrustbadgeDefault'
import { dispatchAction, EVENTS } from '@/eventsLib'
import trustbadgeOverview from '@/assets/trustbadge-overview.svg'
import { DASHBOARD_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: Nullable<DASHBOARD_KEYS>
  showModal: boolean
  onClose: () => void
}

const TrustSignalsActivationModal: FC<Props> = ({ showModal, onClose, phrasesByKey }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isChecked, setIsChecked] = useState(false)

  const { user } = useStore(selectorAuth)
  const allState = useStore(selectAllState)
  const { mappedChannels } = useStore(selectorChannels)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus()
    }
  }, [showModal])

  const handleGoLive = async () => {
    if (!isChecked) return

    const token = user?.access_token
    if (!token) return

    for (const channel of mappedChannels) {
      try {
        const { trstdLoginState: _trstdLoginState, ...stateWithoutTrstdLogin } = allState
        const channelAllState: Record<string, unknown> = {
          ...stateWithoutTrstdLogin,
          channelState: {
            ...allState.channelState,
            selectedShopChannels: channel,
            selectedeTrustedChannelRef: channel.eTrustedChannelRef,
          },
        }

        if (isChecked) {
          const response = await getEtrustedID(channel, infoOfSystem, token)
          const defaultTrustbadge = getTrustbadgeDefault(response.tsId)

          const enabledChild = {
            ...defaultTrustbadge.children[0],
            attributes: {
              ...defaultTrustbadge.children[0].attributes,
              'data-disable-trustbadge': {
                value: false,
                attributeName: 'data-disable-trustbadge',
              },
            },
          }

          dispatchAction({
            action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
            payload: {
              ...defaultTrustbadge,
              children: [enabledChild],
              eTrustedChannelRef: channel.eTrustedChannelRef,
              salesChannelRef: channel.salesChannelRef,
            },
          })

          channelAllState.trustbadgeState = {
            ...allState.trustbadgeState,
            trustbadgeId: response.tsId,
            trustbadgeDataChild: enabledChild,
            initialTrustbadgeDataChild: enabledChild,
          }
        }

        await handleEtrustedConfiguration(
          token,
          channelAllState,
          'initialConfiguration',
          putEtrustedConfiguration,
        )
      } catch (error) {
        console.error(`Error activating trust signals for channel ${channel.eTrustedChannelRef}:`, error)
      }
    }

    onClose()
  }

  return (
    <Fragment>
      {showModal && (
        <Fragment>
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="ts-justify-center ts-items-center ts-flex ts-overflow-x-hidden ts-overflow-y-auto ts-fixed ts-inset-0 ts-z-50 ts-outline-none focus:ts-outline-none ts-font-sans"
          >
            <div
              className="ts-relative ts-w-full ts-mx-4 ts-my-4 sm:ts-mx-auto sm:ts-my-0"
              style={{ maxWidth: '600px' }}
            >
              <div
                className="ts-bg-white"
                style={{
                  borderRadius: '14px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className="ts-p-5 sm:ts-p-10">
                  <h2
                    className="ts-text-default ts-font-bold ts-mb-2"
                    style={{ fontSize: '20px', lineHeight: '28px' }}
                  >
                    Display trust signals for all mapped channels
                  </h2>
                  <p
                    className="ts-text-sm ts-font-normal ts-mb-6"
                    style={{ color: '#6b7280' }}
                  >
                    You can customise per channel anytime.
                  </p>

                  <div
                    className="ts-flex ts-cursor-pointer"
                    style={{
                      borderRadius: '12px',
                      border: isChecked ? '2px solid #155DFC' : '1.5px solid #E5E7EB',
                      backgroundColor: isChecked ? 'rgba(239, 246, 255, 0.5)' : '#FFFFFF',
                      overflow: 'hidden',
                    }}
                    onClick={() => setIsChecked(!isChecked)}
                  >
                    <div
                      className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center"
                      style={{
                        width: '80px',
                        backgroundColor: '#E6EDFE',
                        borderRadius: '10px 0 0 10px',
                        padding: '12px',
                      }}
                    >
                      <img
                        src={trustbadgeOverview}
                        alt="Trustbadge"
                        style={{ width: '56px', objectFit: 'contain' }}
                      />
                    </div>
                    <div
                      className="ts-flex-1 ts-min-w-0 ts-flex ts-items-start"
                      style={{ padding: '14px 16px', gap: '14px' }}
                    >
                      <div className="ts-flex-1 ts-min-w-0">
                        <p
                          className="ts-text-default ts-font-bold ts-mb-1"
                          style={{ fontSize: '15px', lineHeight: '22px' }}
                        >
                          {phrasesByKey?.application_trustbadge_titel}
                        </p>
                        <p
                          className="ts-font-normal"
                          style={{ color: '#6b7280', fontSize: '13px', lineHeight: '20px' }}
                        >
                          {phrasesByKey?.application_trustbadge_description}
                        </p>
                      </div>
                      <div
                        className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center"
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '2px solid #D1D5DB',
                          backgroundColor: isChecked ? '#155DFC' : '#FFFFFF',
                          marginTop: '2px',
                        }}
                      >
                        {isChecked && (
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                            <path
                              d="M1 4L4.5 7.5L11 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ts-flex ts-gap-3 ts-mt-6">
                    <StyledButton
                      id="trustSignalsActivationCustomize"
                      variant="outlined"
                      flex1
                      height={44}
                      onClick={onClose}
                    >
                      Customize per channel
                    </StyledButton>
                    <StyledButton
                      id="trustSignalsActivationGoLive"
                      variant="primary"
                      flex1
                      height={44}
                      disabled={!isChecked}
                      onClick={handleGoLive}
                    >
                      Go live on mapped channels
                    </StyledButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black" />
        </Fragment>
      )}
    </Fragment>
  )
}

export default TrustSignalsActivationModal
