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
              <div className="ts-flex-1 ts-flex ts-items-center ts-justify-center ts-px-5 sm:ts-px-20">
                <div className="ts-w-full" style={{ maxWidth: '400px' }}>
                  <h1 className="ts-text-xl ts-font-bold ts-text-default ts-mb-8">
                    {phrasesByKey.authentication_credentials_connect_title}
                  </h1>

                  <form className="ts-flex ts-flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="ts-flex ts-flex-col ts-gap-5 ts-mb-6">
                      <div>
                        <InputH
                          id={'clientId'}
                          label={phrasesByKey.authentication_client}
                          registerName="clientId"
                          register={register}
                          isError={!!errors.clientId || !!clientIdError}
                          placeholder="Enter your Trusted Shops Client ID"
                          customClass="!ts-h-[44px] !ts-p-3 !ts-shadow-none !ts-border !ts-border-gray-100 !ts-rounded-[4px]"
                          required
                        />
                      </div>
                      <div>
                        <InputH
                          id={'clientSecret'}
                          label={phrasesByKey.authentication_secret}
                          registerName="clientSecret"
                          register={register}
                          placeholder='*************'   
                          type="password"
                          isError={!!errors.clientSecret || !!clientSecretError}
                          customClass="!ts-h-[44px] !ts-p-3 !ts-shadow-none !ts-border !ts-border-gray-100 !ts-rounded-[4px]"
                          required
                        />
                      </div>
                    </div>

                    {isAuthFailed && (
                      <p className="ts-text-sm ts-text-error ts-mb-4">
                        {phrasesByKey.authentication_error}
                      </p>
                    )}

                    <p className="ts-text-sm ts-text-default ts-mb-1">
                      {phrasesByKey.authentication_credentials_help_text}
                    </p>
                    <a
                      id="link_credentialsRequest"
                      href={phrasesByKey.authentication_credentials_help_button_url.concat(
                        `?plugin=${nameOfSystem}`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="ts-text-sm ts-font-normal ts-cursor-pointer ts-inline-flex ts-items-center ts-gap-1 ts-mb-8 ts-underline"
                      style={{ color: '#024DF0' }}
                    >
                      {phrasesByKey.authentication_credentials_help_button_text} &rarr;
                    </a>

                    <StyledButton id="credentialsSubmit" variant="primary" type="submit" fullWidth height={48} className="ts-mb-8">
                      {phrasesByKey.authentication_button_submit}
                    </StyledButton>
                  </form>

                  <p className="ts-text-sm ts-text-default ts-mb-1">
                    {phrasesByKey.global_help_text}
                  </p>
                  <a
                    id="link_integrationGuide"
                    href={phrasesByKey.global_help_link_url_1}
                    target="_blank"
                    rel="noreferrer"
                    className="ts-text-sm ts-cursor-pointer ts-inline-flex ts-items-center ts-gap-1"
                    style={{ color: '#024DF0' }}
                  >
                    {phrasesByKey.global_help_link_text}
                    <ExternalLinkIcon color="#155DFC" />
                  </a>
                </div>
              </div>

              <div className="ts-px-5 sm:ts-px-20 ts-py-6 ts-text-center">
                {phrasesByKey && (
                  <TextWithLink
                    id={'copyright'}
                    text={phrasesByKey.global_copyright_text}
                    url={phrasesByKey.global_copyright_url_1}
                    textStyle="ts-text-secondary ts-font-normal ts-text-sm ts-text-center"
                    linkStyle="!ts-text-[#024DF0]"
                  />
                )}
              </div>
            </div>
       
            <div className="ts-hidden sm:ts-block ts-w-1/2 sm:ts-h-screen">
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
