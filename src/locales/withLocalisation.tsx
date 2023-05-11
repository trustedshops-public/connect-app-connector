import { ComponentType, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import getLocalPhrase from '@/locales'
import { IResourses } from '@/locales/types'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem } from '@/store/selector'

const getPhraseString = (phrases: IResourses, arrKeys: Array<string>): string => {
  try {
    switch (arrKeys.length) {
      case 0:
        return ''
      case 1:
        return phrases[arrKeys[0]]
      case 2:
        return phrases[arrKeys[0]][arrKeys[1]]
      case 3:
        return phrases[arrKeys[0]][arrKeys[1]][arrKeys[2]]
      case 4:
        return phrases[arrKeys[0]][arrKeys[1]][arrKeys[2]][arrKeys[3]]
      case 5:
        return phrases[arrKeys[0]][arrKeys[1]][arrKeys[2]][arrKeys[3]][arrKeys[4]]
      case 6:
        return phrases[arrKeys[0]][arrKeys[1]][arrKeys[2]][arrKeys[3]][arrKeys[4]][arrKeys[5]]
      case 7:
        return phrases[arrKeys[0]][arrKeys[1]][arrKeys[2]][arrKeys[3]][arrKeys[4]][arrKeys[5]][
          arrKeys[6]
        ]
      case 8:
        return phrases[arrKeys[0]][arrKeys[1]][arrKeys[2]][arrKeys[3]][arrKeys[4]][arrKeys[5]][
          arrKeys[6]
        ][arrKeys[7]]
      default:
        return ''
    }
  } catch (error) {
    return ''
  }
}

function withLocalisation<P>(Component: ComponentType<P>): ComponentType<P> {
  return function Location(props: Omit<P, 'setPhrasesByKey' | 'phrasesByKey'>) {
    const { language } = useStore(selectorInfoOfSystem)

    const [phrasesByKey, onPhrasesByKey] = useState<Nullable<{ [key: string]: string }>>(null)

    const [keys, setPhrasesByKey] = useState<Nullable<{ [key: string]: string }>>(null)
    const [phrases, setPhrases] = useState<Nullable<IResourses>>(null)
    const [duplicatePhrases, setDuplicatePhrases] = useState<Nullable<IResourses>>(null)

    useEffect(() => {
      if (!language) return
      const localPhrases = getLocalPhrase(language)

      setPhrases(localPhrases.basic)
      setDuplicatePhrases(localPhrases.duplicate)
    }, [language])

    useEffect(() => {
      if (!keys || !phrases || !duplicatePhrases) return
      let obj = {}
      Object.keys(keys).forEach(item => {
        const arrKeys = keys[item].split('.')

        obj = {
          ...obj,
          [item]: (
            getPhraseString(phrases, arrKeys) ||
            getPhraseString(duplicatePhrases, arrKeys) ||
            ''
          )
            .replace('[Placeholder]', '')
            .replace('[STAGE]', process.env.VITE_CONTROL_CENTER_STAGE || 'site'),
        }
      })
      onPhrasesByKey(obj)
    }, [keys, phrases, duplicatePhrases])

    return (
      <Component {...(props as P)} setPhrasesByKey={setPhrasesByKey} phrasesByKey={phrasesByKey} />
    )
  }
}

export default withLocalisation
