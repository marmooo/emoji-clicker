const CACHE_NAME="2024-03-11 09:50",urlsToCache=["/emoji-clicker/","/emoji-clicker/index.js","/emoji-clicker/en/","/emoji-clicker/data/en.csv","/emoji-clicker/mp3/end.mp3","/emoji-clicker/mp3/correct3.mp3","/emoji-clicker/favicon/favicon.svg"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})