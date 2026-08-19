import { h, Fragment } from 'preact'
import { FC, useState } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import StyledButton from '@/components/controls/styledButton'
import { ScrinSpinner } from '@/components/layouts/spinner'
import useStore from '@/store/useStore'
import {
  selectAllState,
  selectorAuth,
  selectorChannels,
  selectorInfoOfSystem,
} from '@/store/selector'
import { getEtrustedID, putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import { getTrustbadgeDefault } from '@/store/trustbadge/getTrustbadgeDefault'
import { dispatchAction, EVENTS } from '@/eventsLib'
import trustbadgeOverview from '@/assets/trustbadge-overview.svg'
import { InfoCircleOutlinedIcon } from '@/components/layouts/icons/InfoCircleOutlinedIcon'
import { DASHBOARD_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: Nullable<DASHBOARD_KEYS>
  showModal: boolean
  onClose: () => void
}

const TrustSignalsActivationModal: FC<Props> = ({ showModal, onClose, phrasesByKey }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isChecked, setIsChecked] = useState(true)
  const [isJsonLdChecked, setIsJsonLdChecked] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useStore(selectorAuth)
  const allState = useStore(selectAllState)
  const { mappedChannels } = useStore(selectorChannels)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const supportsJsonLd = infoOfSystem?.allowsSupportStructuredMarkup ?? false

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus()
    }
  }, [showModal])

  const waitForChannelDefaultsToSave = (): Promise<void> =>
    new Promise(resolve => {
      if (!useStore.getState().channelState.isSavingChannelDefaults) {
        resolve()
        return
      }
      const unsubscribe = useStore.subscribe(state => {
        if (!state.channelState.isSavingChannelDefaults) {
          unsubscribe()
          resolve()
        }
      })
    })

  const handleGoLive = async () => {
    if (!isChecked || isLoading) return

    const token = user?.access_token
    if (!token) return

    setIsLoading(true)

    await waitForChannelDefaultsToSave()

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

          // JSON-LD (structured markup) can only be live together with the trustbadge
          if (supportsJsonLd) {
            if (EVENTS.SAVE_STRUCTURED_MARKUP_CONFIGURATION) {
              dispatchAction({
                action: EVENTS.SAVE_STRUCTURED_MARKUP_CONFIGURATION,
                payload: {
                  eTrustedChannelRef: channel.eTrustedChannelRef,
                  salesChannelRef: channel.salesChannelRef,
                  tsId: response.tsId,
                  enabled: isJsonLdChecked,
                },
              })
            }

            channelAllState.structuredMarkupState = {
              structuredMarkupEnabled: isJsonLdChecked,
              isLoadingStructuredMarkup: false,
            }
          }
        }

        await handleEtrustedConfiguration(
          token,
          channelAllState,
          'initialConfiguration',
          putEtrustedConfiguration,
        )
      } catch (error) {
        console.error(
          `Error activating trust signals for channel ${channel.eTrustedChannelRef} :`,
          error,
        )
      }
    }

    setIsLoading(false)
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
              style={{ maxWidth: '680px' }}
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
                    {phrasesByKey?.activation_modal_title}
                  </h2>
                  <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
                    {phrasesByKey?.activation_modal_description}
                  </p>

                  <div
                    className="ts-flex"
                    style={{
                      borderRadius: '12px',
                      border: isChecked ? '2px solid #155DFC' : '1.5px solid #E5E7EB',
                      backgroundColor: isChecked ? 'rgba(239, 246, 255, 0.5)' : '#FFFFFF',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center"
                      style={{
                        width: '80px',
                        backgroundColor: '#E6EDFE',
                        padding: '12px',
                      }}
                    >
                      <img
                        src={trustbadgeOverview}
                        alt="Trustbadge"
                        style={{ width: '56px', objectFit: 'contain' }}
                      />
                    </div>
                    <div className="ts-flex-1 ts-min-w-0">
                      <div
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                        className="ts-flex ts-items-start ts-cursor-pointer focus:ts-outline-none focus-visible:ts-ring-2 focus-visible:ts-ring-blue-400 focus-visible:ts-ring-offset-2"
                        style={{ padding: '14px 16px', gap: '14px' }}
                        onClick={() => setIsChecked(!isChecked)}
                        onKeyDown={(e: KeyboardEvent) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault()
                            setIsChecked(!isChecked)
                          }
                        }}
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
                            style={{ color: '#4A5565', fontSize: '13px', lineHeight: '20px' }}
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

                      {supportsJsonLd && (
                        <div
                          role="checkbox"
                          aria-checked={isChecked && isJsonLdChecked}
                          aria-disabled={!isChecked}
                          tabIndex={isChecked ? 0 : -1}
                          className="ts-flex ts-items-start focus:ts-outline-none focus-visible:ts-ring-2 focus-visible:ts-ring-blue-400 focus-visible:ts-ring-offset-2"
                          style={{
                            padding: '14px 16px',
                            gap: '14px',
                            borderTop: '1px solid #E5E7EB',
                            cursor: isChecked ? 'pointer' : 'not-allowed',
                          }}
                          onClick={() => {
                            if (!isChecked) return
                            setIsJsonLdChecked(!isJsonLdChecked)
                          }}
                          onKeyDown={(e: KeyboardEvent) => {
                            if (!isChecked) return
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault()
                              setIsJsonLdChecked(!isJsonLdChecked)
                            }
                          }}
                        >
                          <div className="ts-flex-1 ts-min-w-0">
                            <div style={{ opacity: isChecked ? 1 : 0.5 }}>
                              <p
                                className="ts-text-default ts-font-bold ts-mb-1"
                                style={{ fontSize: '15px', lineHeight: '22px' }}
                              >
                                {phrasesByKey?.activation_modal_jsonLd_title}
                              </p>
                              <p
                                className="ts-font-normal"
                                style={{ color: '#4A5565', fontSize: '13px', lineHeight: '20px' }}
                              >
                                {phrasesByKey?.activation_modal_jsonLd_description}
                              </p>
                            </div>

                            {!isChecked && (
                              <div
                                className="ts-flex ts-items-center ts-gap-2 ts-mt-2"
                                style={{
                                  backgroundColor: '#FFFBEB',
                                  border: '1px solid #FDE68A',
                                  borderRadius: '8px',
                                  padding: '8px 10px',
                                }}
                              >
                                <div
                                  className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center"
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FEF3C7',
                                    color: '#D97706',
                                  }}
                                >
                                  <InfoCircleOutlinedIcon size={14} />
                                </div>
                                <p
                                  style={{
                                    color: '#A16207',
                                    fontSize: '13px',
                                    fontWeight: 400,
                                    lineHeight: '18px',
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: phrasesByKey?.activation_modal_jsonLd_hint ?? '',
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div
                            className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center"
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '4px',
                              border:
                                isChecked && isJsonLdChecked
                                  ? 'none'
                                  : `2px solid ${isChecked ? '#D1D5DB' : '#E5E7EB'}`,
                              backgroundColor:
                                isChecked && isJsonLdChecked
                                  ? '#155DFC'
                                  : isChecked
                                    ? '#FFFFFF'
                                    : '#F9FAFB',
                              marginTop: '2px',
                            }}
                          >
                            {isChecked && isJsonLdChecked && (
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
                      )}
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
                      {phrasesByKey?.activation_modal_button_customize}
                    </StyledButton>
                    <StyledButton
                      id="trustSignalsActivationGoLive"
                      variant="primary"
                      flex1
                      height={44}
                      disabled={!isChecked || isLoading}
                      onClick={handleGoLive}
                    >
                      {phrasesByKey?.activation_modal_button_goLive}
                    </StyledButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black" />
        </Fragment>
      )}
      {isLoading && <ScrinSpinner />}
    </Fragment>
  )
}

export default TrustSignalsActivationModal
