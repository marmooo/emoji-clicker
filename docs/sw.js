var CACHE_NAME="2023-06-24 10:16",urlsToCache=["/emoji-clicker/","/emoji-clicker/index.js","/emoji-clicker/data/en.csv","/emoji-clicker/mp3/end.mp3","/emoji-clicker/mp3/correct3.mp3","/emoji-clicker/favicon/favicon.svg"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})