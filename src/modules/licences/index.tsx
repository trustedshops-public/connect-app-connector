import { h } from 'preact'
import { FC, useEffect, useState } from 'preact/compat'
import BackgroundCard from '@/components/layouts/backgroundCard'
import getLocalPhrase from '@/locales'
import { IPhraseAuth, IPhraseGlobal } from '@/locales/types'
import licences from '@/licences.json'
import Logo from '@/components/controls/logo'
import TextWithLink from '@/components/layouts/textWithLink'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem } from '@/store/selector'

const LicencesPageModule: FC = () => {
  const [phrases, setPhrases] = useState<Nullable<IPhraseAuth>>(null)
  const [phrasesGlobal, setPhrasesGlobal] = useState<Nullable<IPhraseGlobal>>(null)

  const { language } = useStore(selectorInfoOfSystem)

  useEffect(() => {
    if (!language) return
    const localPhrases = getLocalPhrase(language)
    setPhrases(localPhrases.basic.authentication)
    setPhrasesGlobal(localPhrases.basic.global)
  }, [language])

  return (
    phrases && (
      <div className="flex flex-col items-center justify-center">
        <BackgroundCard customClass="ts-mb-4">
          <div className="w-full px-10 py-5 bg-yellow-500 rounded-t">
            <Logo />
          </div>
          <div className="p-10">
            <p className="text-[32px] leading-[1.2] font-bold mb-2">
              END-USER SOFTWARE LICENSE AGREEMENT FOR TRUSTED SHOPS SOFTWARE
            </p>
            <p className="mb-4">
              This license agreement ("Agreement") is an agreement between you (the person or
              company who is being licensed to use the software, services or documentation –
              "Service") and Trusted Shops GmbH, Subbelrather Str. 15c, Co-logne, Germany
              ("We"/"Us"/"Our"). The agreement applies to all Services made available by Trusted
              Shops through various channels such as, but not limited to, the marketplaces of
              different shop system providers, the Trusted Shops Help Centre or customer backend,
              and others.
            </p>
            <p className="mb-4">
              The Service is to be integrated into a given third party software (e. g. shop-software
              system, CRM system or else) in order to connect to Trusted Shops systems and / or
              display or use Trusted Shops services.
            </p>
            <p className="mb-4">
              By using or accessing any part of the Service you agree that you are at least eighteen
              (18) years old and you acknowledge that you have read the Agreement, and that you
              agree to the content of the Agreement and its terms, and agree to use the Service in
              compliance with the Agreement. If you do not agree to all of these terms and
              condi-tions, you must and may not use or access the Service.
            </p>
            <p className="mb-4">
              1) <span className="font-bold ">Term.</span> The Agreement comes into legal force at
              the moment when you download or execute the Service from its dedicated source (e.g.,
              in a matketplace), or receive it by any other means.
            </p>
            <p className="mb-4">
              2) <span className="font-bold ">Licence.</span> The Agreement grants you the right in
              respect of each license you have acquired, subject to you ac-cepting the terms hereof,
              a non-exclusive, non-sublicensable, non-transferable and, non-assignable license to
              install and use, display and run the Service. The Agreement supersedes all prior
              license agreements between the Parties pertaining to current or prior versions of the
              Service and any terms or conditions in any such prior agreement, currently in force
              and effect, which are inconsistent with the terms or conditions of the Agreement are
              hereby specifically agreed to be modified and conformed to the Agreement.
            </p>
            <p className="mb-4">
              3) <span className="font-bold">Intellectual property rights.</span> Our Service is
              protected by copyright laws and international copyright treaties, as well as other
              intellectual property laws and treaties. Unauthorized reproduction or distribution of
              the Service, or any portion of it, may result in severe civil and criminal penalties,
              and will be prosecuted to the maximum ex-tent possible under law.
            </p>
            <p className="mb-4">
              The Software and associated documentation and all parts thereof and copyright and
              other intellectual property rights therein shall remain the property of Us and save as
              expressly provided herein no such rights shall pass to you.
            </p>
            <p className="mb-4 font-bold">You may:</p>
            <ul className="ml-10 list-disc">
              <li className="">
                <p className="mb-4">copy the whole or any part of the Service;</p>
              </li>
            </ul>
            <p className="mb-4 font-bold">You shall not:</p>
            <ul className="ml-10 list-disc">
              <li className="">
                <p className="mb-4">
                  integrate the Service only into the software for which it has been developed and
                  provided. In such case, You must ensure that the source of the Service – i.e., the
                  name of the Service We are provid-ing to You as well as We as provider / producer
                  of the Service – is clearly indicated and readily available to third parties at
                  all times.
                </p>
              </li>
              <li className="">
                <p className="mb-4">
                  modify, enhance or merge the whole or any part of the Service with any other
                  software (other than the one permitted above), source code or documentation;
                </p>
              </li>
              <li className="">
                <p className="mb-4">
                  assign, transfer, distribute, sell, lease, rent, sub-license, charge or otherwise
                  deal in or encumber the Ser-vice or make available the same to any third party or
                  use the Software to provide service bureau or similar services to third parties;
                </p>
              </li>
              <li className="">
                <p className="mb-4">
                  adapt, translate, reverse engineer, decompile or disassemble the whole or any part
                  of the Service; or
                </p>
              </li>
              <li className="">
                <p className="mb-4">use the Service to develop other software</p>
              </li>
              <li className="">
                <p className="mb-4">
                  register directly or indirectly any of Our trademarks, trade names or symbols,
                  including the Service and its name, nor any Internet domain addresses involving
                  any of Our trademarks, trade names or symbols includ-ing the name of the Service.
                  Any Internet domain addresses involving the above, registered or reserved by you
                  prior to entering hereto, shall be transferred to Us at Our request.
                </p>
              </li>
            </ul>
            <p className="mb-4">
              Our Service partially relies on so-called open source libraries, i.e. open source
              software, which are listed in the Annex to this Agreement together with links to their
              respective licence terms. The source code of such open source libraries is generally
              openly available. Please refer to the Annex for further information.
            </p>
            <p className="mb-4">
              4){' '}
              <span className="font-bold">
                References. We reserve the right to publish a selected list of users of our Service.{' '}
              </span>
              Our Service is protected by copyright laws and international copyright treaties, as
              well as other intellectual property laws and treaties. Unauthorized reproduction or
              distribution of the Service, or any portion of it, may result in severe civil and
              criminal penalties, and will be prosecuted to the maximum ex-tent possible under law.
            </p>
            <p className="mb-4">
              5) <span className="font-bold">Breach of the Agreement.</span> If you fail to use the
              Service in accordance with the terms and conditions of the Agreement, it constitutes a
              breach of the Agreement, and your license to use the Service is revoked.
            </p>
            <p className="mb-4">
              6) <span className="font-bold">Warranties.</span> Except as expressly stated in the
              Agreement, the Service is provided under this License on an "AS IS" BASIS and WITHOUT
              WARRANTY, either express or implied, including, without limitation, the warranties of
              non-infringement, merchantability or fitness for a particular purpose. No advice or
              information, whether oral or written, obtained by you from Us or through or from the
              Service shall create any warranty not expressly stated in this Agreement.
            </p>
            <p className="mb-4">
              7) <span className="font-bold">Limitation of Liability.</span> Under no circumstances
              and under no legal theory, whether in tort (including negli-gence), contract, or
              otherwise, shall the Licensor be liable to anyone for any indirect, special,
              incidental, or consequential damages of any character arising as a result of this
              License or the use of the Original Work in-cluding, without limitation, damages for
              loss of goodwill, work stoppage, computer failure or malfunction, or any and all other
              commercial damages or losses. This limitation of liability shall not apply to the
              extent applicable law prohibits such limitation.
            </p>
            <p className="mb-4">
              8) <span className="font-bold">Termination.</span> Either party may terminate the
              Software license granted hereunder if:
              <br />- the other is in material breach of any of its obligations and fails to remedy
              the same within thirty (30) days of written notice requiring such remedy; or
              <br /> - if the other party goes into liquidation or any proceeding shall be
              instituted seeking to adjudicate it as bankrupt or insolvent or has a receiver
              appointed of any of its assets, or, if an individual or partnership if such individual
              or any of the partners in the partnership, are adjudicated bankrupt or execute an
              assign-ment for the benefit of his/its or their creditors or otherwise compounded with
              his/its or their creditors, (or undergoes any similar act or process in any other
              jurisdiction).
            </p>
            <p className="mb-4">
              Besides We may terminate the Software license granted hereunder with thirty (30) days
              prior written notice if We decide to discontinue the provision of the respective
              Service or the licenced version thereof in general or decide to only offer the Service
              against a license fee. The exercise of such right of termination shall be without
              prejudice to either party's accrued rights or other remedies. Termination shall not
              affect the continuance in force of any provision hereof which is expressly or by
              implica-tion intended to come into or continue in force on or after such termination.
            </p>
            <p className="mb-4">
              9) <span className="font-bold">Notices.</span> All notices given or required under the
              Agreement must be made in writing.
            </p>
            <p className="mb-4">
              10) <span className="font-bold">Assignment.</span> The Agreement shall not be
              assignable or transferable by either party, by operation of law or otherwise, without
              the prior written consent of the other party.
            </p>
            <p className="mb-4">
              11) <span className="font-bold">Contract language.</span> The official contract
              language is English.
            </p>
            <p className="mb-4">
              12) <span className="font-bold">Governing Law.</span> The Agreement is governed by,
              and is to be construed in accordance with, German law. The German Courts will have
              exclusive jurisdiction to deal with any dispute which has arisen or may arise out of,
              or in connection with, the Agreement.
            </p>
            <p className="mb-4">
              13) <span className="font-bold">Entire Agreement.</span> The Agreement constitutes the
              entire agreement between the parties with respect to its subject matter and supersedes
              any prior negotiations, understandings and agreements on that subject.
            </p>
            <p className="mb-4">
              14) <span className="font-bold">Amendments.</span> The Agreement may only be added to
              or modified or amended in writing. However, We may amend the Agreement and/or the fees
              by giving notice in writing to you or at any time for new versions of the Service.
              Such amendments will be deemed to be approved by you unless you object to the
              amendments in writing and terminate the Agreement within thirty 30 days following
              receipt of such notice.
            </p>
            <p className="mb-4">
              15) <span className="font-bold">No Waiver.</span> No waiver of any provision of the
              Agreement, or consent to any departure from the terms of the Agreement, shall be
              effective unless the same shall be in writing and signed by the party waiving or
              consenting thereto.
            </p>
            <p className="mb-4">
              16) <span className="font-bold">Force Majeure.</span> No party shall be liable for
              failure to perform any of its obligations under this Membership Agree-ment when such
              failure is due to a cause (for example, natural disaster, act of war or terrorism,
              riot, labour condi-tion, governmental action, and Internet disturbance) beyond the
              party’s reasonable control.
            </p>

            <p className="text-[32px] leading-[1.2] font-bold mb-2">
              ANNEX TO THE END-USER SOFTWARE LICENSE AGREEMENT
            </p>
            <p className="mb-4">
              Below you will find a list of the open source libraries we use for our Services as
              well links to their respective license terms which also apply to the use of these
              parts of our Services. In case of discrepancies or contradictions between these
              license terms and the terms of this Agreement, the latter shall prevail. Please note
              that the following list may be subject to amendments and modifications, and does not
              thus claim (perpetual) exhaustiveness. You can always return to the following website
              for up-to-date information on the open source software We use: <br />
              <a
                href="https://policies.etrusted.com/IE/en/plugin-licence.html"
                className="text-blue-700 cursor-pointer"
              >
                https://policies.etrusted.com/IE/en/plugin-licence.html
              </a>
            </p>

            <ul className="ml-10 list-disc">
              {Object.keys(licences).map(item => (
                <li key={item}>
                  <p className="">
                    {licences[item].name} -{' '}
                    <a href={licences[item].repository} className="text-blue-700 cursor-pointer">
                      {licences[item].licenses} Licence{' '}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <footer className="relative w-full pt-8 bg-yellow-500 rounded-b before:-skew-y-1 before:absolute before:left-0 before:-top-8 before:w-full before:h-16 before:bg-yellow-500">
            <div className="relative translate-x-[-30px] w-0 h-0 border-solid border-r-[60px] border-b-[60px] border-t-[transparent] border-b-[transparent] border-l-[transparent] border-r-white left-1/2 mt-[-4.3rem]" />
            <div className="flex flex-col items-center w-full px-10 py-5 justify-items-center ">
              <Logo />
              {/* <p className="flex items-center mt-5 text-xs">
              Copyright © {new Date().getFullYear()} Trusted Shops GmbH.
            </p>
            <p className="text-xs">All rights reserved.</p> */}
              {phrasesGlobal && (
                <div className="flex mt-5">
                  <p className="flex items-center mr-1 text-xs">Copyright</p>
                  <TextWithLink
                    id={'copyright'}
                    text={phrasesGlobal?.copyright.text}
                    url={phrasesGlobal?.copyright.url_1}
                    textStyle="font-normal text-xs text-center"
                  />
                </div>
              )}
            </div>
          </footer>
        </BackgroundCard>
      </div>
    )
  )
}

export default {
  routeProps: {
    path: '/ts/plugin-licence',
    component: LicencesPageModule,
  },
  name: 'LicencesPageModule',
}
