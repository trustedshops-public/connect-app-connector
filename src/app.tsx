/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, Fragment } from 'preact'
import Router, { Route, RouterOnChangeArgs } from 'preact-router'
import { FC, useEffect, useState } from 'preact/compat'
import modules from '@/modules'
import { createHashHistory } from 'history'
import EventsContainer from './eventsContainer'
import { baseLayerDev } from './baseLayers/baseLayerDev'
import styles from './style.css?inline'
import { dispatchAction, EVENTS } from './eventsLib'
import useStore from './store/useStore'
import { selectorAuth, selectorInfoOfSystem } from './store/selector'
import { hashHistoryAdapter } from './helpers/hashHistoryAdapter'

const isUseMockBaseLayer = Boolean(Number(process.env.VITE_USE_MOCK_BASELAYER))
const history = hashHistoryAdapter(createHashHistory())

export const App: FC = () => {
  const { isAuthenticated, user } = useStore(selectorAuth)
  const { setUser } = useStore()
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const [currentRouter, setCurrentRouter] = useState<RouterOnChangeArgs>()

  useEffect(() => {
    if (Object.hasOwn(infoOfSystem, 'nameOfSystem')) {
      setUser()
    }
  }, [infoOfSystem])

  useEffect(() => {
    if (isUseMockBaseLayer) {
      baseLayerDev()
    }
  }, [])

  useEffect(() => {
    let timeOut: NodeJS.Timeout
    if (!!user && user?.expires_in) {
      timeOut = setTimeout(() => {
        dispatchAction({ action: EVENTS.GET_CREDENTIALS_PROVIDED, payload: null })
      }, user?.expires_in * 1000)
    }
    return () => clearTimeout(timeOut)
  }, [user])

  useEffect(() => {
    isAuthenticated
      ? currentRouter
        ? handleRoute(currentRouter)
        : history.push('/ts/dashboard')
      : history.push('/ts/authentication')
  }, [isAuthenticated])

  const handleRoute = async (e: RouterOnChangeArgs): Promise<void> => {
    switch (e.url) {
      case '/ts':
        return history.push('/ts/authentication')
      case '/ts/authentication':
        return history.push(isAuthenticated ? '/ts/dashboard' : '/ts/authentication')
      case '/ts/dashboard':
        setCurrentRouter(e)
        history.push(isAuthenticated ? '/ts/dashboard' : '/ts/authentication')
        return
    }
  }

  return (
    <EventsContainer>
      <>
        <Router onChange={handleRoute} history={history}>
          {modules.map(item => (
            <Route {...(item.routeProps as any)} key={item.name} />
          ))}
        </Router>
        <style type="text/css">{styles}</style>
      </>
    </EventsContainer>
  )
}
