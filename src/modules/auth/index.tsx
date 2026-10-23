import { h } from 'preact'
import { FC, useEffect, useState } from 'preact/compat'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IFormValues, InputH } from '@/components/controls/input'
import TextWithLink from '@/components/layouts/textWithLink'
import Spinner from '@/components/layouts/spinner'
import withLocalisation from '../../locales/withLocalisation'
import { PHRASES_AUTH_KEYS } from '@/locales/keys'
import { AUTH_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'
import { selectorAuth, selectorInfoOfSystem } from '@/store/selector'
import LoginIllustration from '@/assets/login-section-illustration.svg'
import ExternalLinkLarge from '@/assets/connect/icon-external-link.svg'
import { ExternalLinkIcon } from '@/components/layouts/icons/ExternalLinkIcon'
import StyledButton from '@/components/controls/styledButton'
import Callout from '@/components/layouts/callout'
import {
  buildManualCredentialsUrl,
  focusConnectWindow,
  isConnectFlowAvailable,
} from '@/authentication/connectFlow'
import { ConnectCard, ConnectCardNotice, FinishingCard, WaitingCard } from './connectCards'

type IFormLogin = Pick<IFormValues, 'clientId' | 'clientSecret'>

const FIELD_CLASS =
  '!ts-h-auto !ts-mt-0 !ts-px-4 !ts-py-3 !ts-shadow-none !ts-border !ts-border-solid !ts-rounded-[10px] !ts-text-sm !ts-leading-[22px] ts-tracking-[0.15px] ts-text-[#101828] ts-bg-white placeholder:ts-text-[#99A1AF] disabled:!ts-bg-none disabled:!ts-bg-[#F9FAFB] disabled:!ts-text-[#101828] disabled:!ts-text-opacity-100 disabled:!ts-border-[#D1D5DC] disabled:!ts-cursor-not-allowed'
const fieldClass = (isError: boolean) =>
  `${FIELD_CLASS} ${isError ? '!ts-bg-white !ts-border-[#E7000B]' : '!ts-border-[#D1D5DC]'}`
const LABEL_CLASS =
  'ts-font-inter ts-font-medium !ts-text-[#364153] ts-tracking-[0.1px] ts-leading-5 ts-mb-2'

const LoginPageModule: FC<{
  setPhrasesByKey: (keys: AUTH_KEYS) => void
  phrasesByKey: AUTH_KEYS
}> = ({ setPhrasesByKey, phrasesByKey }) => {
  const { register, handleSubmit } = useForm<IFormValues>()

  const { signIn, connectWithControlCenter, cancelConnectWithControlCenter } = useStore()
  const {
    isAuthFailed,
    isAuthLoading,
    isConnecting,
    isConnectFinishing,
    connectError,
    connectNotice,
  } = useStore(selectorAuth)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const [nameOfSystem, setNameOfSystem] = useState('')
  const [emptyFields, setEmptyFields] = useState({ clientId: false, clientSecret: false })
  // The manual form was submitted: its sign-in is running or has failed.
  const [isSubmitted, setIsSubmitted] = useState(false)
  // "Connect with Trusted Shops" comes first when it is configured; the client
  // ID and secret form is offered once it didn't work, or while waiting.
  const [connectAvailable] = useState(isConnectFlowAvailable)
  const [showManualForm, setShowManualForm] = useState(!connectAvailable)

  useEffect(() => {
    setNameOfSystem(
      infoOfSystem.nameOfSystem ? infoOfSystem.nameOfSystem.replace(/[^a-zA-Z0-9._/-]/g, '') : '',
    )
  }, [infoOfSystem])

  useEffect(() => {
    setPhrasesByKey(PHRASES_AUTH_KEYS)
  }, [])

  const onSubmit: SubmitHandler<IFormLogin> = data => {
    const empty = { clientId: !data.clientId, clientSecret: !data.clientSecret }
    setEmptyFields(empty)
    if (empty.clientId || empty.clientSecret) return
    setIsSubmitted(true)
    signIn(data)
  }

  // Leaving the waiting card for the form gives up on the Control Centre window.
  const openManualForm = () => {
    cancelConnectWithControlCenter()
    setShowManualForm(true)
  }

  if (!phrasesByKey) return null

  const isManualBusy = isSubmitted && isAuthLoading
  const isManualRejected = isSubmitted && isAuthFailed && !isAuthLoading
  const hasEmptyField = emptyFields.clientId || emptyFields.clientSecret

  // The token endpoint can't say which value is wrong; the secret is the one
  // usually mistyped, so it gets the red border.
  const clientIdError = emptyFields.clientId
  const clientSecretError = emptyFields.clientSecret || (isManualRejected && !hasEmptyField)

  const credentialsUrl =
    buildManualCredentialsUrl({
      nameOfSystem,
      versionNumberOfSystem: infoOfSystem.versionNumberOfSystem,
    }) ?? phrasesByKey.authentication_credentials_help_button_url.concat(`?plugin=${nameOfSystem}`)

  const connectNoticeOf = (): Nullable<ConnectCardNotice> => {
    switch (connectError) {
      case 'popup_blocked':
        return {
          tone: 'warning',
          title: phrasesByKey.authentication_connect_popup_blocked_title,
          text: phrasesByKey.authentication_connect_popup_blocked_text,
          hint: phrasesByKey.authentication_connect_popup_blocked_hint,
        }
      case 'closed':
        return {
          tone: 'warning',
          title: phrasesByKey.authentication_connect_closed_title,
          text: phrasesByKey.authentication_connect_closed_text,
          hint: phrasesByKey.authentication_connect_closed_hint,
        }
      case 'access_denied':
        return {
          tone: 'warning',
          title: phrasesByKey.authentication_connect_access_denied_title,
          text: phrasesByKey.authentication_connect_access_denied_text,
          hint: phrasesByKey.authentication_connect_closed_hint,
        }
      case 'failed':
        return {
          tone: 'warning',
          title: phrasesByKey.authentication_connect_failed_title,
          text: phrasesByKey.authentication_connect_failed_text,
          hint: phrasesByKey.authentication_connect_closed_hint,
        }
    }
    switch (connectNotice) {
      case 'credentialsRejected':
        return {
          tone: 'warning',
          title: phrasesByKey.authentication_connect_credentials_rejected_title,
          text: phrasesByKey.authentication_connect_credentials_rejected_text,
        }
      case 'disconnected':
        return {
          tone: 'success',
          title: phrasesByKey.authentication_connect_disconnected_title,
          text: phrasesByKey.authentication_connect_disconnected_text,
        }
    }
    return null
  }

  const connectSection = isConnectFinishing ? (
    <FinishingCard
      title={phrasesByKey.authentication_connect_finishing_title}
      text={phrasesByKey.authentication_connect_finishing_text}
    />
  ) : isConnecting ? (
    <WaitingCard
      title={phrasesByKey.authentication_connect_waiting}
      text={phrasesByKey.authentication_connect_waiting_hint}
      windowNotShowing={phrasesByKey.authentication_connect_window_not_showing}
      openWindowLabel={phrasesByKey.authentication_connect_open_window}
      manualLabel={phrasesByKey.authentication_connect_manual}
      onOpenWindow={focusConnectWindow}
      onManual={openManualForm}
    />
  ) : (
    <ConnectCard
      title={phrasesByKey.authentication_credentials_connect_title}
      text={phrasesByKey.authentication_connect_text}
      buttonLabel={phrasesByKey.authentication_connect_button}
      retryLabel={phrasesByKey.authentication_connect_retry}
      manualLabel={phrasesByKey.authentication_connect_manual}
      notice={connectNoticeOf()}
      onConnect={connectWithControlCenter}
      onManual={openManualForm}
    />
  )

  const manualForm = (
    <div
      id="manualCredentials"
      className="ts-bg-white ts-border ts-border-solid ts-border-[#EAECF0] ts-rounded-[12px] ts-flex ts-flex-col ts-items-start ts-gap-6 ts-w-full ts-px-6 ts-py-8 sm:ts-px-12 sm:ts-py-10"
      style={{
        maxWidth: '560px',
        boxShadow: '0px 1px 2px -1px rgba(0,0,0,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1)',
      }}
    >
      <div className="ts-flex ts-flex-col ts-gap-2 ts-w-full" style={{ letterSpacing: '0.15px' }}>
        <h1
          className="ts-font-semibold"
          style={{ fontSize: '24px', lineHeight: '32px', color: '#101828' }}
        >
          {phrasesByKey.authentication_manual_title}
        </h1>
        <p
          className="ts-font-normal"
          style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}
        >
          {phrasesByKey.authentication_manual_text}
        </p>
      </div>

      <a
        id="link_getCredentials"
        href={credentialsUrl}
        target="_blank"
        rel="noreferrer"
        className={`ts-font-sans ts-font-bold ts-flex ts-items-center ts-gap-2 ts-cursor-pointer ${
          isManualBusy ? 'ts-opacity-60 ts-pointer-events-none' : ''
        }`}
        style={{ height: '50px', paddingRight: '24px', fontSize: '18px', color: '#005AA0' }}
      >
        {phrasesByKey.authentication_manual_get_credentials}
        <img src={ExternalLinkLarge} alt="" width={24} height={24} />
      </a>

      {(isManualRejected || hasEmptyField) && (
        <Callout id="credentialsError" tone="error" padding="14px 16px">
          {phrasesByKey.authentication_error}
        </Callout>
      )}

      <form
        className="ts-flex ts-flex-col ts-gap-6 ts-w-full"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <InputH
          id={'clientId'}
          label={phrasesByKey.authentication_client}
          labelClass={LABEL_CLASS}
          registerName="clientId"
          register={register}
          isError={clientIdError}
          disabled={isManualBusy}
          placeholder={phrasesByKey.authentication_manual_client_placeholder}
          customClass={fieldClass(clientIdError)}
          required
        />
        <div className="ts-flex ts-flex-col ts-gap-2">
          <InputH
            id={'clientSecret'}
            label={phrasesByKey.authentication_secret}
            labelClass={LABEL_CLASS}
            registerName="clientSecret"
            register={register}
            type="password"
            isError={clientSecretError}
            disabled={isManualBusy}
            placeholder={phrasesByKey.authentication_manual_secret_placeholder}
            customClass={fieldClass(clientSecretError)}
            required
          />
          <p
            className="ts-font-normal"
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.4px',
              color: '#4A5565',
            }}
          >
            {phrasesByKey.authentication_credentials_help_text}
          </p>
        </div>

        <div className="ts-flex ts-items-center ts-gap-4">
          {connectAvailable && (
            <StyledButton
              id="backToConnect"
              variant="outlined"
              height={46}
              disabled={isManualBusy}
              className="disabled:!ts-opacity-60"
              onClick={() => setShowManualForm(false)}
            >
              {phrasesByKey.authentication_manual_back}
            </StyledButton>
          )}
          <StyledButton
            id="credentialsSubmit"
            variant="primary"
            type="submit"
            height={46}
            disabled={isManualBusy}
            className="disabled:!ts-opacity-60"
          >
            {isManualBusy
              ? phrasesByKey.authentication_manual_connecting
              : phrasesByKey.authentication_button_submit}
          </StyledButton>
        </div>
      </form>
    </div>
  )

  // The start-up check of the saved credentials shows a spinner; a connect or
  // a manual sign-in keeps its own card.
  if (isAuthLoading && !isConnectFinishing && !isSubmitted) {
    return (
      <div className="ts-font-sans ts-flex ts-min-h-screen sm:ts-h-screen ts-bg-white">
        <div className="ts-flex ts-flex-col ts-items-center ts-justify-center ts-h-full ts-w-full">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="ts-font-inter ts-flex ts-min-h-screen sm:ts-h-screen sm:ts-overflow-hidden ts-bg-white">
      <div className="ts-w-full sm:ts-w-1/2 ts-flex ts-flex-col ts-min-h-screen sm:ts-h-screen sm:ts-overflow-y-auto">
        <div className="ts-flex-1 ts-flex ts-items-center ts-justify-center ts-px-4 sm:ts-px-8 ts-py-6">
          {showManualForm ? manualForm : connectSection}
        </div>

        <div className="ts-px-4 sm:ts-px-8 ts-py-8 ts-flex ts-flex-col ts-items-center">
          <a
            id="link_integrationGuide"
            href={phrasesByKey.authentication_integration_guide_url}
            target="_blank"
            rel="noreferrer"
            className="ts-font-normal ts-cursor-pointer ts-inline-flex ts-items-center ts-gap-[10px] ts-px-[10px]"
            style={{ fontSize: '14px', lineHeight: '20px', color: '#024DF0' }}
          >
            {phrasesByKey.authentication_integration_guide_text}
            <ExternalLinkIcon color="#155DFC" />
          </a>
          <TextWithLink
            id={'copyright'}
            text={phrasesByKey.global_copyright_text}
            url={phrasesByKey.global_copyright_url_1}
            textStyle="ts-font-normal ts-text-center ts-text-[14px] ts-leading-5 ts-text-[#535862]"
            linkStyle="!ts-text-[#344054] ts-underline"
          />
        </div>
      </div>

      <div
        className="ts-hidden sm:ts-flex ts-w-1/2 sm:ts-h-screen"
        style={{ backgroundColor: '#E6EDFE' }}
      >
        <img
          src={LoginIllustration}
          alt="Trusted Shops Integration"
          className="ts-w-full ts-h-full"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

export default {
  routeProps: {
    path: '/ts/authentication',
    component: withLocalisation(LoginPageModule),
  },
  name: 'LoginPageModule',
}
