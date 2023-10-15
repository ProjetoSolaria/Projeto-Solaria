importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";
const offlineFallbackPage = "paginas-html/offline.html";
const cacheName = "my-site-cache";
const filesToCache = [
  "/Projeto-Solaria/paginas-html/sobre-o-projeto.html",
  "/Projeto-Solaria/paginas-html/como-funciona.html",
  "/Projeto-Solaria/paginas-html/inscricoes.html",
  "/Projeto-Solaria/estilos-css/estilo-main.css",
  "/Projeto-Solaria/estilos-css/estilo-artigos.css",
  "/Projeto-Solaria/codigo-js/menu.js"
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Limpe caches antigos aqui
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== cacheName;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(cacheName);
        const cachedResp = await cache.match(event.request);

        if (cachedResp) {
          return cachedResp;
        }

        const networkResp = await fetch(event.request);

        if (networkResp && networkResp.status === 200) {
          cache.put(event.request, networkResp.clone());
        }

        return networkResp;
      })()
    );
  }
});

// Exibir notificação e solicitar permissão para instalação
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        if (clients.length === 0) {
          // O site não está aberto, exiba uma notificação
          self.registration.showNotification('Bem-vindo ao nosso aplicativo!', {
            body: 'Você pode instalá-lo na tela inicial do seu dispositivo.',
            icon: 'ios/16.png',
            actions: [{ action: 'install', title: 'Instalar' }]
          });
        }
      })
    );
  }
});

// Lidar com o clique no botão "Instalar" da notificação
self.addEventListener('notificationclick', (event) => {
  if (event.action === 'install') {
    event.waitUntil(
      self.registration.showInstallPrompt()
        .then((outcome) => {
          if (outcome === 'accepted') {
            console.log('Usuário aceitou a instalação do app.');
          } else {
            console.log('Usuário recusou a instalação do app.');
          }
        })
    );
  }
  event.notification.close();
});

self.addEventListener('beforeinstallprompt', (event) => {
  // Exibe um popup de instalação
  event.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do app.');
    } else {
      console.log('Usuário recusou a instalação do app.');
    }
  });
});

self.addEventListener('appinstalled', (event) => {
  console.log('O aplicativo foi instalado.', event);
});
