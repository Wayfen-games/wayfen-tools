const C='food-v6';const F=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./audio/397506b97aa9.mp3", "./audio/e62865d16fa8.mp3", "./audio/b1a3b656a711.mp3", "./audio/6fe15bace5be.mp3", "./audio/907a6999ecd5.mp3", "./audio/1da8a4462b3f.mp3", "./audio/b9b07d6c828d.mp3", "./audio/ca45b86f4d4a.mp3", "./audio/d6a2fb1ace31.mp3", "./audio/4e5fb89de14f.mp3", "./audio/7e7d3e911625.mp3", "./audio/12c2075e0b7e.mp3", "./audio/d926b71ce2c2.mp3", "./audio/5fef3281e04e.mp3", "./audio/2c5387cbead8.mp3", "./audio/9481f2254edd.mp3", "./audio/4f841d4b285a.mp3", "./audio/8cbd057e2f73.mp3", "./audio/81dfb414e67f.mp3", "./audio/9fcda79cb366.mp3", "./audio/f9272e79a2d7.mp3", "./audio/e8b3a693f1d8.mp3", "./audio/5905bd600af9.mp3", "./audio/c7f37d1176b5.mp3", "./audio/0f4960c1ed2c.mp3", "./audio/12b831a35413.mp3", "./audio/9a08b17a3b86.mp3", "./audio/01ef9a8a3a95.mp3", "./audio/ea401c206fea.mp3", "./audio/cab0d256f7a9.mp3", "./audio/029f884ff941.mp3", "./audio/9a9349146895.mp3", "./audio/3c10c6edf71a.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(C.slice(0,C.lastIndexOf('-v')+2))&&x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 // 화면(HTML)은 인터넷 먼저 → 고친 내용이 바로 보임. 안 되면 저장본
 if(e.request.mode==='navigate'||e.request.destination==='document'){e.respondWith((async()=>{const net=fetch(e.request).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp))}return res});const old=await caches.open(C).then(c=>c.match('./index.html'));if(!old)return net;
  // 신호가 약하면 3초 뒤 저장본(자기 도구 것만 지우므로 다른 도구 저장본은 남음)
  return Promise.race([net.then(r=>r.ok?r:old).catch(()=>old),new Promise(r=>setTimeout(()=>r(old),3000))])})());return}
 // 음악·그림 등은 저장본 먼저
 // 자기 도구 저장본에서만 찾음(다른 도구 것과 섞이지 않게). 주소 뒤 ?는 같은 사이트 파일만 무시(글꼴 주소 등은 그대로)
 const same=new URL(e.request.url).origin===location.origin;
 e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:same})).then(r=>r||fetch(e.request).then(res=>{if(res.ok||(res.type==='opaque'&&e.request.url.includes('fonts.googleapis.com'))){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res})))});
