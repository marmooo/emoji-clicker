var CACHE_NAME="2022-09-11 08:49",urlsToCache=["/emoji-clicker/","/emoji-clicker/index.js","/emoji-clicker/ja/","/emoji-clicker/ja/index.yomi","/emoji-clicker/data/ja.csv","/emoji-clicker/mp3/incorrect1.mp3","/emoji-clicker/mp3/correct3.mp3","/emoji-clicker/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js","https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})