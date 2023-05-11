import { h } from 'preact'
import { FC } from 'preact/compat'
import Button, { ButtonThemes } from '@/components/controls/buttun'
import Modal from '@/components/layouts/modal'
import { ExclamationCircleIcon } from '@/components/layouts/icons'
import { ITrustbadgeChildren } from '@/baseLayers/types'
import { DASHBOADR_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: Nullable<DASHBOADR_KEYS>
  showModal: boolean
  handleCancel: (value: boolean) => void
  diactivateTB: (data: Nullable<ITrustbadgeChildren>) => void
  data: Nullable<ITrustbadgeChildren>
}

const ApproveDisableModal: FC<Props> = ({
  phrasesByKey,
  showModal,
  handleCancel,
  diactivateTB,
  data,
}) => {
  return (
    <Modal
      showModal={showModal}
      footerContent={
        <div className="ts-flex ts-gap-2">
          <Button
            id={'cancelDiactivateTB'}
            label={phrasesByKey && phrasesByKey?.global_button_cancel}
            theme={ButtonThemes.Secondary}
            onClick={() => handleCancel(false)}
          />
          <Button
            id={'submitDiactivateTB'}
            label={phrasesByKey && phrasesByKey?.application_trustbadge_popup_submit}
            theme={ButtonThemes.Warning}
            onClick={() => diactivateTB(data)}
          />
        </div>
      }
    >
      <div className="ts-flex ts-w-[580px]">
        <span className="ts-w-20 ts-h-20 ts-text-red-600">
          <ExclamationCircleIcon customClass="ts-w-20 ts-h-20" />
        </span>
        <div className="ts-ml-8">
          <p className="ts-text-default ts-text-md ts-font-bold">
            {phrasesByKey?.application_trustbadge_popup_titel}
          </p>
          <p className="ts-text-default ts-text-sm ts-font-normal ts-mt-8">
            {phrasesByKey?.application_trustbadge_popup_text}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default ApproveDisableModal
