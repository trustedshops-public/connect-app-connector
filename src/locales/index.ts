/* eslint-disable @typescript-eslint/no-explicit-any */
import Locale from './Locale'
import deDE from './resources/de-DE.json'
import enGB from './resources/en-GB.json'
import esES from './resources/es-ES.json'
import frFR from './resources/fr-FR.json'
import itIT from './resources/it-IT.json'
import nlNL from './resources/nl-NL.json'
import plPL from './resources/pl-PL.json'
// import { IResourses } from './types'
import ptPT from './resources/pt-PT.json'

const getLocalPhrase = (navigatorLng: string): { basic: any; duplicate: any } => {
  //any need to change on IResourses
  switch (navigatorLng.toLocaleUpperCase().replace('_', '-').split('-')[0]) {
    case Locale.EN_GB.toLocaleUpperCase():
      return { basic: enGB, duplicate: enGB }
    case Locale.DE_DE.toLocaleUpperCase():
      return { basic: deDE, duplicate: enGB }
    case Locale.ES_ES.toLocaleUpperCase():
      return { basic: esES, duplicate: enGB }
    case Locale.FR_FR.toLocaleUpperCase():
      return { basic: frFR, duplicate: enGB }
    case Locale.IT_IT.toLocaleUpperCase():
      return { basic: itIT, duplicate: enGB }
    case Locale.NL_NL.toLocaleUpperCase():
      return { basic: nlNL, duplicate: enGB }
    case Locale.pl_PL.toLocaleUpperCase():
      return { basic: plPL, duplicate: enGB }
    case Locale.pt_PT.toLocaleUpperCase(): // TODO: no Portuguese translation yet
      return { basic: ptPT, duplicate: enGB }

    default:
      return { basic: enGB, duplicate: enGB }
  }
}

export default getLocalPhrase
