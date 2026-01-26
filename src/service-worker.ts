/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', () => {
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({type: 'SKIP_WAITING'}))
    })
})

export {}
