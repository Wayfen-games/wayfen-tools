const C='shop-v6';const F=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
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
