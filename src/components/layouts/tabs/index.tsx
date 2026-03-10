import { ComponentChildren, Fragment, h } from 'preact'
import { FC } from 'preact/compat'

export interface ITabsConfig {
  name: string
  id: number
  component: ComponentChildren
  isAvailable?: boolean
}
interface Props {
  setOpenTab: (id: number) => void
  openTab: number
  tabs: Array<ITabsConfig>
  children?: ComponentChildren
  renderContent?: boolean
}

const Tabs: FC<Props> = ({ openTab, tabs, setOpenTab, renderContent = true }) => {
  return (
    <>
      <style>{`#tabslist::-webkit-scrollbar { display: none; }`}</style>
      <div className="ts-flex ts-w-full ts-flex-wrap">
        <div className="ts-w-full">
          <ul
            id={`tabslist`}
            className="ts-flex ts-w-full ts-gap-4 sm:ts-gap-6 ts-pb-0"
            role="tablist"
            style={{ minHeight: '40px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map(({ name, id, isAvailable = true }) => {
              return (
                isAvailable && (
                  <button
                    id={`tab_${id}`}
                    key={id}
                    onClick={e => {
                      e.preventDefault()
                      setOpenTab(id)
                    }}
                    className={`ts-px-1 ts-py-2 ts-flex ts-items-center ts-justify-center ts-cursor-pointer ts-bg-transparent ts-border-0 ts-border-b-2 ts-whitespace-nowrap ts-flex-shrink-0
                ${
                  id === openTab
                    ? ''
                    : 'ts-border-transparent'
                } `}
                    style={{
                      color: id === openTab ? '#155DFC' : '#4A5565',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.15px',
                      borderBottomColor: id === openTab ? '#155DFC' : 'transparent',
                    }}
                  >
                    {name}
                  </button>
                )
              )
            })}
          </ul>
          {renderContent && (
            <div className="ts-relative ts-flex-auto ts-flex ts-flex-col ts-min-w-0">
              {tabs.find(item => item.id === openTab)?.component}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Tabs
