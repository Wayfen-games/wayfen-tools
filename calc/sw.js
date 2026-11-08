const C='calc-v5';const F=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(C.slice(0,C.lastIndexOf('-v')+2))&&x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 // 화면(HTML)은 인터넷 먼저 → 고친 내용이 바로 보임. 안 되면 저장본
 if(e.request.mode==='navigate'||e.request.destination==='document'){e.respondWith((async()=>{const net=fetch(e.request).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp))}return res});const old=await caches.match('./index.html');if(!old)return net;
  // 신호가 약하면 3초 뒤 저장본(자기 도구 것만 지우므로 다른 도구 저장본은 남음)
  return Promise.race([net.catch(()=>old),new Promise(r=>setTimeout(()=>r(old),3000))])})());return}
 // 음악·그림 등은 저장본 먼저
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})))});
