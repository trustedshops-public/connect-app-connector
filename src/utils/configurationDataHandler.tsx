/* eslint-disable */
export const handleEtrustedInteraction = async (
  token: string | undefined,
  allState: any,
  interactionType: string,
  callback: (token: string, payload: unknown) => Promise<void>
): Promise<void> => {
  if (!token) {
    console.error('Token is not available')
    return
  }

  try {
    await callback(token, { action: interactionType, allState })
  } catch (error) {
    console.error(`Error during ${callback.name}:`, error)
  }
}

export const handleEtrustedConfiguration = async (
  token: string | undefined,
  allState: any,
  callback: (token: string, payload: unknown) => Promise<void>
): Promise<void> => {
  if (!token) {
    console.error('Token is not available')
    return
  }

  try {
    await callback(token, allState)
  } catch (error) {
    console.error(`Error during ${callback.name}:`, error)
  }
}
