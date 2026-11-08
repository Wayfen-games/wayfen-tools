const C='pharmacy-v4';const F=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./audio/headache.mp3", "./audio/fever.mp3", "./audio/cold.mp3", "./audio/cough.mp3", "./audio/throat.mp3", "./audio/nose.mp3", "./audio/indigestion.mp3", "./audio/heartburn.mp3", "./audio/diarrhea.mp3", "./audio/constipation.mp3", "./audio/nausea.mp3", "./audio/motion.mp3", "./audio/period.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 // 화면(HTML)은 인터넷 먼저 → 고친 내용이 바로 보임. 안 되면 저장본
 if(e.request.mode==='navigate'||e.request.destination==='document'){e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));return}
 // 음악·그림 등은 저장본 먼저
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})))});
