var CACHE_NAME='2022-03-01 09:10';var urlsToCache=["/emoji-clicker/","/emoji-clicker/index.js","/emoji-clicker/en/","/emoji-clicker/ja/","/emoji-clicker/data/en.csv","/emoji-clicker/data/ja.csv","/emoji-clicker/mp3/incorrect1.mp3","/emoji-clicker/mp3/correct3.mp3","/emoji-clicker/favicon/favicon-48x48.png","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",];self.addEventListener("install",function(event){event.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(urlsToCache);}),);});self.addEventListener("fetch",function(event){event.respondWith(caches.match(event.request).then(function(response){if(response){return response;}
return fetch(event.request);}),);});self.addEventListener("activate",function(event){var cacheWhitelist=[CACHE_NAME];event.waitUntil(caches.keys().then(function(cacheNames){return Promise.all(cacheNames.map(function(cacheName){if(cacheWhitelist.indexOf(cacheName)===-1){return caches.delete(cacheName);}}),);}),);});