import { Fragment, h } from 'preact'
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
import { ExternalLinkIcon } from '@/components/layouts/icons/ExternalLinkIcon'
import StyledButton from '@/components/controls/styledButton'

type IFormLogin = Pick<IFormValues, 'clientId' | 'clientSecret'>

const LoginPageModule: FC<{
  setPhrasesByKey: (keys: AUTH_KEYS) => void
  phrasesByKey: AUTH_KEYS
}> = ({ setPhrasesByKey, phrasesByKey }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>()

  const { signIn } = useStore()
  const { isAuthFailed, isAuthLoading } = useStore(selectorAuth)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const [nameOfSystem, setNameOfSystem] = useState('')
  const [clientIdError, setClientIdError] = useState<string | null>(null)
  const [clientSecretError, setClientSecretError] = useState<string | null>(null)
  useEffect(() => {
    setNameOfSystem(
      infoOfSystem.nameOfSystem ? infoOfSystem.nameOfSystem.replace(/[^a-zA-Z0-9._/-]/g, '') : ''
    )
  }, [infoOfSystem])

  useEffect(() => {
    setPhrasesByKey(PHRASES_AUTH_KEYS)
  }, [])

  const onSubmit: SubmitHandler<IFormLogin> = data => {
    if (!data.clientId) {
      setClientIdError('Client Id is a required field')
      return
    }
    setClientIdError(null)

    if (!data.clientSecret) {
      setClientSecretError('Client secret is a required field')
      return
    }
    setClientSecretError(null)

    signIn(data)
  }

  return (
    phrasesByKey && (
      <div className="ts-font-sans ts-flex ts-min-h-screen sm:ts-h-screen sm:ts-overflow-hidden ts-bg-white">
        {isAuthLoading ? (
          <div className="ts-flex ts-flex-col ts-items-center ts-justify-center ts-h-full ts-w-full">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="ts-w-full sm:ts-w-1/2 ts-flex ts-flex-col ts-min-h-screen sm:ts-h-screen sm:ts-overflow-y-auto">
              <div className="ts-flex-1 ts-flex ts-items-center ts-justify-center ts-px-5 sm:ts-px-16">
                <div className="ts-w-full" style={{ maxWidth: '380px' }}>
                  <h1 className="ts-font-bold ts-text-default ts-mb-3" style={{ fontSize: '22px', lineHeight: '1.3' }}>
                    {phrasesByKey.authentication_credentials_connect_title}
                  </h1>

                  {phrasesByKey && (
                    <div style={{ color: '#374151' }}>
                      <TextWithLink
                        id="credentialsRequest"
                        text={phrasesByKey.authentication_credentials_help_button_text}
                        url={phrasesByKey.authentication_credentials_help_button_url.concat(
                          `?plugin=${nameOfSystem}`,
                        )}
                        textStyle="ts-text-sm ts-font-normal ts-mb-8"
                        linkStyle="ts-underline ts-cursor-pointer ts-text-[#024DF0]"
                      />
                    </div>
                  )}

                  <form className="ts-flex ts-flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="ts-flex ts-flex-col ts-gap-4 ts-mb-4">
                      <div>
                        <InputH
                          id={'clientId'}
                          registerName="clientId"
                          register={register}
                          isError={!!errors.clientId || !!clientIdError}
                          placeholder={phrasesByKey.authentication_client}
                          customClass="!ts-h-[46px] !ts-px-4 !ts-py-3 !ts-shadow-none !ts-border !ts-border-[#D1D5DC] !ts-rounded-lg !ts-text-sm"
                          required
                        />
                      </div>
                      <div>
                        <InputH
                          id={'clientSecret'}
                          registerName="clientSecret"
                          register={register}
                          placeholder={phrasesByKey.authentication_secret}
                          type="password"
                          isError={!!errors.clientSecret || !!clientSecretError}
                          customClass="!ts-h-[46px] !ts-px-4 !ts-py-3 !ts-shadow-none !ts-border !ts-border-[#D1D5DC] !ts-rounded-lg !ts-text-sm"
                          required
                        />
                      </div>
                    </div>

                    {isAuthFailed && (
                      <p className="ts-text-sm ts-text-error ts-mb-3">
                        {phrasesByKey.authentication_error}
                      </p>
                    )}

                    <p className="ts-text-sm ts-font-normal ts-mb-5" style={{ color: '#6B7280' }}>
                      {phrasesByKey.authentication_credentials_help_text}
                    </p>

                    <StyledButton id="credentialsSubmit" variant="primary" type="submit" fullWidth height={46} className="ts-mb-0">
                      {phrasesByKey.authentication_button_submit}
                    </StyledButton>
                  </form>
                </div>
              </div>

              <div className="ts-px-5 sm:ts-px-16 ts-pb-6 ts-flex ts-flex-col ts-items-center ts-gap-2">
                <a
                  id="link_integrationGuide"
                  href={phrasesByKey.authentication_integration_guide_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ts-text-sm ts-font-normal ts-cursor-pointer ts-inline-flex ts-items-center ts-gap-1"
                  style={{ color: '#2563EB' }}
                >
                  {phrasesByKey.authentication_integration_guide_text}
                  <ExternalLinkIcon color="#2563EB" />
                </a>
                {phrasesByKey && (
                  <TextWithLink
                    id={'copyright'}
                    text={phrasesByKey.global_copyright_text}
                    url={phrasesByKey.global_copyright_url_1}
                    textStyle="ts-font-normal ts-text-xs ts-text-center"
                    linkStyle="!ts-text-default !ts-underline"
                  />
                )}
              </div>
            </div>

            <div className="ts-hidden sm:ts-flex ts-flex-col ts-w-1/2 sm:ts-h-screen" style={{ position: 'relative' }}>
              <div
                className="ts-flex ts-justify-center ts-px-8 ts-py-5"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1, color: '#667085' }}
              >
                {phrasesByKey && (
                  <TextWithLink
                    id="salesLink"
                    text={phrasesByKey.authentication_salesLink_text}
                    url={phrasesByKey.authentication_salesLink_url_1.concat(
                      `?a_aid=${nameOfSystem}`,
                    )}
                    textStyle="ts-text-default ts-font-normal ts-text-sm"
                    
                    linkStyle="ts-underline ts-cursor-pointer ts-text-[#667085]"
                  />
                )}
              </div>
              <img
                src={LoginIllustration}
                alt="Trusted Shops Integration"
                className="ts-w-full ts-h-full"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </>
        )}
      </div>
    )
  )
}

export default {
  routeProps: {
    path: '/ts/authentication',
    component: withLocalisation(LoginPageModule),
  },
  name: 'LoginPageModule',
}
