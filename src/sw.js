let CACHE_NAME = 'jpeer-cache-v2';

let urlsToCache = [
  '/index.html',
  '/favicon.ico',
  '/assets/js/app.js',
  '/assets/js/main.js',
  '/assets/js/template.js',
  '/assets/js/vendor.js',
  '/assets/fonts/fontawesome-webfont.eot',
  '/assets/css/global.css',
  '/assets/img/balloons.svg',
  '/assets/img/ci.png',
  '/assets/img/code.svg',
  '/assets/img/github-logo.png',
  '/assets/img/logo.svg',
  '/assets/img/me_bw.png',
  '/assets/img/og_jpeer.jpg',
  '/assets/img/promo_5.png',
  '/assets/img/responsive-default.png',
  '/assets/img/projects/portalbee.jpg',
  '/assets/img/projects/prazna.jpg',
  '/assets/img/projects/railroad-medium.png',
  '/assets/img/projects/railroad.png',
  '/assets/img/projects/schwarzkoenig-medium.png',
  '/assets/img/projects/schwarzkoenig.png',
  '/assets/img/projects/somnia.jpg',
  '/assets/img/projects/volxpop.jpg',
  '/assets/img/slider/fish.jpg',
  '/assets/img/slider/hoverfly.jpg',
  '/i18n/locale-de-de.json',
  '/i18n/locale-en-us.json',
]

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', function (event) {
  let cacheWhitelist = ['jpeer-cache-v2'];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
