const CACHE_NAME="2023-09-19 00:15",urlsToCache=["/emoji-clicker/","/emoji-clicker/index.js","/emoji-clicker/ja/","/emoji-clicker/ja/index.yomi","/emoji-clicker/data/ja.csv","/emoji-clicker/mp3/end.mp3","/emoji-clicker/mp3/correct3.mp3","/emoji-clicker/favicon/favicon.svg","https://marmooo.github.io/yomico/yomico.min.js"];self.addEventListener("install",a=>{a.waitUntil(caches.open(CACHE_NAME).then(a=>a.addAll(urlsToCache)))}),self.addEventListener("fetch",a=>{a.respondWith(caches.match(a.request).then(b=>b||fetch(a.request)))}),self.addEventListener("activate",a=>{a.waitUntil(caches.keys().then(a=>Promise.all(a.filter(a=>a!==CACHE_NAME).map(a=>caches.delete(a)))))})