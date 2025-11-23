// Cash&Go+ PWA — migliorata (front-end demo, salva localStorage)
const CASHGO = {
  key: 'cashgo_v2',
  init() { this.load(); this.routes = {home:this.renderHome.bind(this), earn:this.renderEarn.bind(this), wallet:this.renderWallet.bind(this), referral:this.renderReferral.bind(this)}; this.navigate('home'); },
  load() {
    const raw = localStorage.getItem(this.key);
    if(raw) this.state = JSON.parse(raw);
    else {
      this.state = { username: 'gaetanoubbriaco99-a11y', points: 270, referralCode: 'CG-GAETANO99', attempts: [], payouts: [], metrics: {videosWatched:0,offersCompleted:0} };
      this.save();
    }
  },
  save(){ localStorage.setItem(this.key, JSON.stringify(this.state)); },
  navigate(page){ window.scrollTo(0,0); document.getElementById('app').innerHTML = ''; this.routes[page](); },
  headerCard() {
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><div class="title">Ciao, ${this.state.username}</div><div class="small">Codice referral: <strong>${this.state.referralCode}</strong></div></div>
      <div style="text-align:right"><div class="points">${this.state.points}p</div><div class="small">€ ${(this.state.points/100).toFixed(2)}</div></div>
    </div>`;
    return div;
  },
  renderHome() {
    const app = document.getElementById('app'); app.appendChild(this.headerCard());
    const actions = document.createElement('div'); actions.className='card'; actions.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Guadagna</div>';
    const row = document.createElement('div'); row.className='row';
    const b1 = document.createElement('button'); b1.className='btn'; b1.textContent='Guarda Video (+20)'; b1.onclick = ()=>this.simulateVideo();
    const b2 = document.createElement('button'); b2.className='btn secondary'; b2.textContent='Sondaggi (+80)'; b2.onclick = ()=>this.navigate('earn');
    const b3 = document.createElement('button'); b3.className='btn secondary'; b3.textContent='Wallet'; b3.onclick = ()=>this.navigate('wallet');
    row.appendChild(b1); row.appendChild(b2); row.appendChild(b3); actions.appendChild(row); app.appendChild(actions);
    const tasksCard = document.createElement('div'); tasksCard.className='card'; tasksCard.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Task disponibili</div>';
    const tasks = [{id:'t1',title:'Guarda video reward',reward:20,type:'video'},{id:'t2',title:'Sondaggio breve',reward:80,type:'survey'},{id:'t3',title:'Installa app partner',reward:150,type:'offer'}];
    tasks.forEach(t=>{ const el=document.createElement('div'); el.className='task'; el.innerHTML = `<div><strong>${t.title}</strong><div class="small">${t.type}</div></div><div style="text-align:right"><div class="small">${t.reward} p</div><button class="btn" onclick="CASHGO.handleTask('${t.id}')">Fai</button></div>`; tasksCard.appendChild(el); });
    app.appendChild(tasksCard);
    const navCard = document.createElement('div'); navCard.className='card'; navCard.innerHTML = '<div class="small">Navigazione rapida</div>';
    const navRow = document.createElement('div'); navRow.className='row';
    ['home','earn','wallet','referral'].forEach(p=>{ const a=document.createElement('button'); a.className='btn secondary'; a.textContent = p.charAt(0).toUpperCase()+p.slice(1); a.onclick=()=>this.navigate(p); navRow.appendChild(a); });
    navCard.appendChild(navRow); app.appendChild(navCard);
  },
  renderEarn(){
    const app=document.getElementById('app'); app.appendChild(this.headerCard());
    const card=document.createElement('div'); card.className='card'; card.innerHTML='<div style="font-weight:700;margin-bottom:8px">Scegli come guadagnare</div>';
    const v=document.createElement('div'); v.className='task'; v.innerHTML=`<div><strong>Guarda Video</strong><div class="small">Video rewarded - veloce</div></div><div><button class="btn" onclick="CASHGO.simulateVideo()">Guarda (+20p)</button></div>`;
    const s=document.createElement('div'); s.className='task'; s.innerHTML=`<div><strong>Sondaggio</strong><div class="small">Completa sondaggio esterno</div></div><div><button class="btn" onclick="CASHGO.simulateSurvey()">Fai (+80p)</button></div>`;
    const o=document.createElement('div'); o.className='task'; o.innerHTML=`<div><strong>Offerte</strong><div class="small">Installazioni app partner</div></div><div><button class="btn" onclick="CASHGO.simulateOffer()">Fai (+150p)</button></div>`;
    card.appendChild(v); card.appendChild(s); card.appendChild(o); app.appendChild(card);
  },
  renderWallet(){
    const app=document.getElementById('app'); app.appendChild(this.headerCard());
    const c=document.createElement('div'); c.className='card'; c.innerHTML='<div style="font-weight:700;margin-bottom:8px">Wallet</div>';
    c.innerHTML += `<div class="small">Saldo: <strong>${this.state.points} punti</strong> (€ ${(this.state.points/100).toFixed(2)})</div>`;
    const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Richiedi payout'; btn.style.marginTop='10px'; btn.onclick=()=>this.requestPayout(); c.appendChild(btn); app.appendChild(c);
    const history = document.createElement('div'); history.className='card'; history.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Cronologia</div>';
    if(this.state.attempts.length===0) history.innerHTML += '<div class="small">Nessuna attività</div>'; else { this.state.attempts.slice().reverse().forEach(a=>{ const d=new Date(a.ts).toLocaleString(); history.innerHTML += `<div style="margin-bottom:8px"><strong>${a.value>0?'+':''}${a.value}p</strong> <div class="small">${a.meta.type} — ${d}</div></div>`; }); }
    app.appendChild(history);
  },
  renderReferral(){ const app=document.getElementById('app'); app.appendChild(this.headerCard()); const c=document.createElement('div'); c.className='card'; c.innerHTML = `<div style="font-weight:700;margin-bottom:8px">Invita & Guadagna</div><div class="small">Condividi questo codice: <strong>${this.state.referralCode}</strong></div>`; c.innerHTML += `<div style="margin-top:10px"><button class="btn" onclick="CASHGO.copyReferral()">Copia codice</button></div>`; app.appendChild(c); },
  handleTask(id){ if(id==='t1') this.simulateVideo(); if(id==='t2') this.simulateSurvey(); if(id==='t3') this.simulateOffer(); },
  simulateVideo(){ if(!confirm('Simulare video reward (20 punti)?')) return; setTimeout(()=>{ this.state.points +=20; this.state.attempts.push({id:Date.now(),value:20,meta:{type:'video'},ts:Date.now()}); this.state.metrics.videosWatched++; this.save(); alert('Hai guadagnato +20 punti!'); this.navigate('home'); },700); },
  simulateSurvey(){ if(!confirm('Simulare sondaggio (80 punti)?')) return; setTimeout(()=>{ this.state.points+=80; this.state.attempts.push({id:Date.now(),value:80,meta:{type:'survey'},ts:Date.now()}); this.save(); alert('Hai guadagnato +80 punti!'); this.navigate('home'); },700); },
  simulateOffer(){ if(!confirm('Simulare offerta (150 punti)?')) return; setTimeout(()=>{ this.state.points+=150; this.state.attempts.push({id:Date.now(),value:150,meta:{type:'offer'},ts:Date.now()}); this.state.metrics.offersCompleted++; this.save(); alert('Hai guadagnato +150 punti!'); this.navigate('home'); },900); },
  requestPayout(){ const min=1000; const want=parseInt(prompt('Quanti punti vuoi convertire? (minimo '+min+' punti)','1000'),10); if(!want||want<min){ alert('Soglia minima: '+min+' punti (10€)'); return;} const method=prompt('Metodo di payout (PayPal / Amazon / Mobile)','PayPal'); const dest=prompt('Inserisci destinazione (email/numero):',''); if(!dest){ alert('Destinazione richiesta'); return; } this.state.payouts.push({id:Date.now(),points:want,method,destination:dest,status:'requested',ts:Date.now()}); this.state.points=Math.max(0,this.state.points-want); this.save(); alert('Richiesta payout creata (simulazione).'); this.navigate('wallet'); },
  copyReferral(){ try{ navigator.clipboard.writeText(this.state.referralCode); alert('Codice copiato'); }catch(e){ prompt('Copia manualmente: ', this.state.referralCode); } }
};
window.addEventListener('load', ()=>CASHGO.init());
