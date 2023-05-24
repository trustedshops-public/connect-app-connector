interface IReplacement {
  [key: string]: string
}

export const getPhraseWithReplacement = (phrase: string, replacements: IReplacement): string => {
  let phraseWithReplacement = phrase
  for (const replacement in replacements) {
    const interpolationTemplate = `{{ ${replacement} }}`
    phraseWithReplacement = phrase.replace(
      interpolationTemplate,
      // TODO: Do we need to use some defaule value for our current widget? Or just hide it?
      replacements[replacement] || interpolationTemplate
    )
  }
  return phraseWithReplacement
}
