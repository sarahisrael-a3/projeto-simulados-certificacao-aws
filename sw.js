const CACHE_NAME = 'aws-simulador-v1';

// Ficheiros e rotas que queremos guardar no cache do dispositivo
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.js',
  '/data/clf-c02.json',
  '/data/saa-c03.json',
  '/data/aif-c01.json'
];

// Instalação do Service Worker (Faz o download inicial)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto com sucesso!');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Interceção de pedidos (Verifica se já existe offline antes de ir à net)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se encontrou no cache (offline), devolve. Se não, faz fetch à rede.
        return cachedResponse || fetch(event.request);
      })
  );
});