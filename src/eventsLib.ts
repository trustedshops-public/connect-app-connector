const EVENTS = window.eventsLib.EVENTS
const dispatchAction = window.eventsLib.dispatchAction
const registerEvents = window.eventsLib.registerEvents
console.log('EVENTS', EVENTS, registerEvents, dispatchAction)
export { registerEvents, dispatchAction, EVENTS }
export default { registerEvents, dispatchAction, EVENTS }
