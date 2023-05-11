const CONTROL_CENTER_STAGE = process.env.VITE_CONTROL_CENTER_STAGE || ''

const getStringWithUrlFromPhrases = (
  text: string,
  url: string | Array<string>
): Array<{ text: string; url?: string }> => {
  const splitedText = text.split('[%s]')
  let cauntLink = 0
  const newArr = []
  for (let i = 0; i < splitedText.length; i++) {
    if (i % 2 === 0 && splitedText[i].length !== 0) {
      newArr.push({ text: splitedText[i].replace('[YEAR]', new Date().getFullYear().toString()) })
    } else if (i % 2 === 1 && splitedText[i].length !== 0) {
      if (typeof url === 'string') {
        newArr.push({
          text: splitedText[i].replace('[year]', new Date().getFullYear().toString()),
          url: url.replace('[STAGE]', CONTROL_CENTER_STAGE),
        })
      } else {
        newArr.push({
          text: splitedText[i].replace('[year]', new Date().getFullYear().toString()),
          url: url[cauntLink].replace('[STAGE]', CONTROL_CENTER_STAGE),
        })
      }
      cauntLink++
    }
  }
  return newArr
}
export default getStringWithUrlFromPhrases
