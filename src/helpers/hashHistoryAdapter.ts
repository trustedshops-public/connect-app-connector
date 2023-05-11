import { HashHistory } from 'history'
import { CustomHistory } from 'preact-router'

export const hashHistoryAdapter = (hashHistory: HashHistory): CustomHistory => {
  return {
    listen: callback => hashHistory.listen(({ location }) => callback(location)),
    location: hashHistory.location,
    push: hashHistory.push,
    replace: hashHistory.replace,
  }
}
