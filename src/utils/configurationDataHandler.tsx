/* eslint-disable */
export const handleEtrustedInteraction = (
  token: string | undefined,
  allState: any,
  interactionType: string,
  callback: (token: string, payload: any) => Promise<void>
): void => {
  if (!token) {
    console.error('Token is not available')
    return
  }

  try {
    callback(token, { action: interactionType, allState }).catch(error => {
      console.error(`Error during ${callback.name}:`, error)
    })
  } catch (error) {
    console.error(`Error during ${callback.name} invocation:`, error)
  }
}

export const handleEtrustedConfiguration = (
  token: string | undefined,
  allState: any,
  callback: (token: string, payload: any) => Promise<void>
): void => {
  if (!token) {
    console.error('Token is not available')
    return
  }

  try {
    callback(token, allState).catch(error => {
      console.error(`Error during ${callback.name}:`, error)
    })
  } catch (error) {
    console.error(`Error during ${callback.name} invocation:`, error)
  }
}
