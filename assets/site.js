/* consulting34.com — interazioni aggiuntive (le altre sono in c34.js) */
(function(){
  /* filtro per categoria nella pagina Risorse */
  const bar=document.querySelector('[data-filters]'),list=document.getElementById('posts');
  if(!bar||!list)return;
  const posts=[...list.querySelectorAll('.post')],btns=[...bar.querySelectorAll('button')];
  btns.forEach(b=>{
    const c=b.dataset.filter,n=c==='*'?posts.length:posts.filter(p=>p.dataset.cats.split(',').includes(c)).length;
    b.insertAdjacentHTML('beforeend',' <small>'+n+'</small>');
    b.addEventListener('click',()=>{
      btns.forEach(x=>x.setAttribute('aria-pressed',x===b));
      posts.forEach(p=>{p.hidden=c!=='*'&&!p.dataset.cats.split(',').includes(c);p.classList.add('in')});
    });
  });
})();

/* pannello "A chi ci rivolgiamo": il modello di c34.js è condiviso con cfoesterno.com,
   qui si adegua il testo del pulsante al registro del sito dello Studio */
(function(){
  const panel=document.getElementById('audPanel');if(!panel)return;
  const fix=()=>panel.querySelectorAll('a.btn-blue').forEach(a=>{if(/Parliamone/.test(a.textContent))a.innerHTML='Richiedi una call <span class="arr">→</span>'});
  new MutationObserver(fix).observe(panel,{childList:true});fix();
})();

/* glossario: calcolatori degli indicatori (in qualsiasi layout) */
(function(){
  const nf=d=>new Intl.NumberFormat('it-IT',{maximumFractionDigits:d});
  const eur=v=>'€ '+nf(0).format(Math.round(v)),pct=v=>nf(1).format(v*100)+'%';
  const F={
    runway:(a,b)=>b>0?nf(1).format(a/b)+' mesi di autonomia':'Nessun consumo netto di liquidità',
    burn:(u,e)=>u>e?'Burn rate netto di '+eur(u-e)+' al mese':'Nessun consumo: le entrate coprono le uscite',
    ebitda:(r,c)=>'EBITDA di '+eur(r-c)+(r>0?' · margine '+pct((r-c)/r):''),
    be:(f,m)=>m>0?'Break-even a '+eur(f/(m/100))+' di ricavi':'Inserire un margine positivo',
    dso:(c,r)=>r>0?'DSO di '+nf(0).format(c/r*365)+' giorni':'Inserire i ricavi annui',
    pfn:(d,l)=>d>=l?'PFN di '+eur(d-l):'Liquidità netta di '+eur(l-d),
    post:(p,i)=>p+i>0?'Post-money di '+eur(p+i)+' · quota investitore '+pct(i/(p+i)):'Inserire i valori',
    arr:m=>'ARR di '+eur(m*12),
    dil:(q,p,i)=>p+i>0?'Quota dopo il round '+nf(1).format(q*p/(p+i))+'%':'Inserire i valori',
    scost:(b,c)=>'Scostamento '+(c>=b?'+ ':'− ')+eur(Math.abs(c-b))+(b?' ('+(c>=b?'+':'−')+pct(Math.abs(c-b)/b)+')':'')
  };
  document.querySelectorAll('.dz-calc').forEach(box=>{const ins=[...box.querySelectorAll('input')],out=box.querySelector('output'),f=F[box.dataset.calc];if(!f)return;
    const up=()=>{out.textContent=f(...ins.map(i=>Math.max(0,+i.value||0)))};ins.forEach(i=>i.addEventListener('input',up));up()});
})();

const glNorm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
/* la ricerca trova i termini a inizio parola («iva» trova IVA ma non «attiva»); fino a 3 lettere cerca la parola intera (sigle).
   Con più parole devono esserci tutte, in qualsiasi ordine; si ignorano quelle di una o due lettere («di», «e») e,
   oltre le 4 lettere, la vocale finale, così singolare e plurale si equivalgono («categoria» trova «categorie»). */
const glMatch=(text,t)=>{if(!t)return true;const s=glNorm(text);let ws=t.split(/[^a-z0-9.&]+/).filter(Boolean);if(ws.length>1)ws=ws.filter(w=>w.length>2);
  return ws.every(w=>{const st=w.length>4?w.replace(/[aeiou]$/,''):w;return new RegExp('(^|[^a-z0-9])'+st.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+(w.length<=3?'($|[^a-z0-9])':'')).test(s)})};

/* glossario: dizionario a due pannelli */
(function(){
  const dz=document.getElementById('dz');if(!dz)return;
  const links=[...dz.querySelectorAll('.dz-link')],panels=[...dz.querySelectorAll('.dz-panel')],groups=[...dz.querySelectorAll('.dz-group')];
  const q=document.getElementById('gl-q'),count=document.getElementById('gl-count'),empty=document.getElementById('gl-empty'),main=document.getElementById('dz-main');
  const narrow=()=>matchMedia('(max-width:1060px)').matches;
  const areaBtns=[...dz.querySelectorAll('.dz-areas button')];let area=(areaBtns.find(b=>b.getAttribute('aria-pressed')==='true')||{}).dataset?.area;
  const setArea=a=>{if(!areaBtns.length)return;area=a;areaBtns.forEach(b=>b.setAttribute('aria-pressed',b.dataset.area===a));if(!q.value.trim())groups.forEach(g=>g.hidden=g.dataset.area!==a)};
  areaBtns.forEach(b=>b.addEventListener('click',()=>{q.value='';links.forEach(l=>l.parentElement.hidden=false);setArea(b.dataset.area);
    const g=groups.find(x=>x.dataset.area===b.dataset.area),l=g&&g.querySelector('.dz-link');if(l){const id=l.getAttribute('href').slice(1);show(id);history.replaceState(null,'','#'+id)}
    count.textContent=links.length+' voci';empty.hidden=true}));
  const show=id=>{const p=document.getElementById(id);if(!p||!p.classList.contains('dz-panel'))return false;
    panels.forEach(x=>x.classList.toggle('on',x===p));links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+id));
    const act=links.find(l=>l.classList.contains('on')),list=dz.querySelector('.dz-list');
    if(act&&areaBtns.length&&!q.value.trim()){const g=act.closest('.dz-group');if(g&&g.dataset.area!==area)setArea(g.dataset.area)}
    if(act&&list&&!narrow()){const y=act.getBoundingClientRect().top-list.getBoundingClientRect().top+list.scrollTop;if(y<list.scrollTop||y>list.scrollTop+list.clientHeight-48)list.scrollTop=y-list.clientHeight/3}
    return true};
  const reveal=()=>{const t=(narrow()?main:dz).getBoundingClientRect().top;if(t<0||narrow())(narrow()?main:dz).scrollIntoView({behavior:'smooth',block:'start'})};
  dz.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);
    if(show(id)){e.preventDefault();history.replaceState(null,'','#'+id);reveal()}});
  const fromHash=()=>{const id=decodeURIComponent(location.hash.slice(1));if(id&&show(id))requestAnimationFrame(()=>dz.scrollIntoView({block:'start'}))};
  addEventListener('hashchange',fromHash);
  const cur=panels.find(p=>p.classList.contains('on'));if(cur)show(cur.id);fromHash();
  q.addEventListener('input',()=>{const t=glNorm(q.value.trim());let n=0;
    links.forEach(l=>{const ok=glMatch(l.dataset.s,t);l.parentElement.hidden=!ok;if(ok)n++});
    groups.forEach(g=>g.hidden=!g.querySelector('li:not([hidden])')||(areaBtns.length&&!t&&g.dataset.area!==area));
    count.textContent=n+(n===1?' voce':' voci');empty.hidden=n>0});
  setArea(area);
  q.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const f=links.find(l=>!l.parentElement.hidden);if(f){e.preventDefault();const id=f.getAttribute('href').slice(1);show(id);history.replaceState(null,'','#'+id);reveal()}});
})();
