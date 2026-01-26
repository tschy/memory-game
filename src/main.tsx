import { render } from 'preact'
import { App } from './app'
import './index.css'

render(<App />, document.getElementById('app')!)

// Handle PWA updates - notify when ready but don't reload automatically
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker updated')
    })
}
