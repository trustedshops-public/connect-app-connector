/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import { App } from './app'
import 'tailwindcss/tailwind.css'
import ShadowWrapper from './components/controls/shadowWrapper'

// Reserve the host page's scrollbar space permanently so the centered
// connector content doesn't shift horizontally when switching between
// tabs that are shorter/taller than the viewport. Only applied when the
// host page hasn't configured a scrollbar gutter itself.
const hostHtml = document.documentElement
const hostScrollbarGutter = getComputedStyle(hostHtml).getPropertyValue('scrollbar-gutter').trim()
if (hostScrollbarGutter === '' || hostScrollbarGutter === 'auto') {
  hostHtml.style.setProperty('scrollbar-gutter', 'stable')
}

render(
  <ShadowWrapper mode="open">
    <App />
  </ShadowWrapper>,
  document.getElementById('eTrusted-connector')!,
)
