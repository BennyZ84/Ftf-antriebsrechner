// Online-first PWA: die feste Startadresse lädt stets die neueste veröffentlichte Ausgabe.
const CACHE='ftf-rechner-v3.13';
const ASSETS=['./','./index.html','./styles.css?v=3.13','./calculator.js','./compatibility.js','./catalog-pending.js','./vehicle-layout.js','./drive-recommender.js','./auxiliary.js','./stability.js','./roller.js','./app.js?v=3.13','./version.json','./manifest.webmanifest','./icons/icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ftf-rechner-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const request=event.request;
 event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
  return response;
 }).catch(async()=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  if(request.mode==='navigate')return caches.match('./index.html');
  return Response.error();
 }));
});
