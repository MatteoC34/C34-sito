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
  const fix=()=>panel.querySelectorAll('a.btn-blue').forEach(a=>{if(/Parliamone/.test(a.textContent))a.innerHTML='Richieda un colloquio <span class="arr">→</span>'});
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
    scost:(b,c)=>'Scostamento '+(c>=b?'+ ':'− ')+eur(Math.abs(c-b))+(b?' ('+(c>=b?'+':'−')+pct(Math.abs(c-b)/b)+')':'')
  };
  document.querySelectorAll('.dz-calc').forEach(box=>{const ins=[...box.querySelectorAll('input')],out=box.querySelector('output'),f=F[box.dataset.calc];if(!f)return;
    const up=()=>{out.textContent=f(...ins.map(i=>Math.max(0,+i.value||0)))};ins.forEach(i=>i.addEventListener('input',up));up()});
})();

const glNorm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
/* la ricerca trova i termini a inizio parola: «iva» trova IVA ma non «attiva» */
const glMatch=(text,t)=>!t||new RegExp('(^|[^a-z0-9])'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(glNorm(text));

/* glossario: dizionario a due pannelli */
(function(){
  const dz=document.getElementById('dz');if(!dz)return;
  const links=[...dz.querySelectorAll('.dz-link')],panels=[...dz.querySelectorAll('.dz-panel')],groups=[...dz.querySelectorAll('.dz-group')];
  const q=document.getElementById('gl-q'),count=document.getElementById('gl-count'),empty=document.getElementById('gl-empty'),main=document.getElementById('dz-main');
  const narrow=()=>matchMedia('(max-width:1060px)').matches;
  const show=id=>{const p=document.getElementById(id);if(!p||!p.classList.contains('dz-panel'))return false;
    panels.forEach(x=>x.classList.toggle('on',x===p));links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+id));
    const act=links.find(l=>l.classList.contains('on')),list=dz.querySelector('.dz-list');
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
    groups.forEach(g=>g.hidden=!g.querySelector('li:not([hidden])'));
    count.textContent=n+(n===1?' voce':' voci');empty.hidden=n>0});
  q.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const f=links.find(l=>!l.parentElement.hidden);if(f){e.preventDefault();const id=f.getAttribute('href').slice(1);show(id);history.replaceState(null,'','#'+id);reveal()}});
})();

/* glossario, prototipi 2 e 3: ricerca, filtro per area, apertura della voce dal link diretto */
(function(){
  document.querySelectorAll('[data-gl-search]').forEach(q=>{
    const root=document.getElementById(q.dataset.glSearch),wrap=q.closest('.g2,.g3');if(!root)return;
    const rows=[...root.querySelectorAll('[data-s]')],count=wrap.querySelector('[data-gl-count]'),empty=wrap.querySelector('[data-gl-empty]');
    let area='*';
    const run=()=>{const t=glNorm(q.value.trim());let n=0;root.classList.toggle('searching',!!t);
      rows.forEach(r=>{const ok=(area==='*'||r.dataset.area===area)&&glMatch(r.dataset.s,t);r.hidden=!ok;if(ok)n++});
      count.textContent=n+(n===1?' voce':' voci');if(empty)empty.hidden=n>0};
    q.addEventListener('input',run);
    wrap.querySelectorAll('[data-g3-area]').forEach((b,_,all)=>b.addEventListener('click',()=>{area=b.dataset.g3Area;all.forEach(x=>x.setAttribute('aria-pressed',x===b));run()}));
  });
  const open=()=>{const id=decodeURIComponent(location.hash.slice(1));const el=id&&document.getElementById(id);if(!el)return;
    if(el.tagName==='DETAILS'){const panel=el.closest('[role=tabpanel]');if(panel&&panel.hidden){const tab=document.querySelector('[aria-controls="'+panel.id+'"]');tab&&tab.click()}el.open=true}
    if(el.classList.contains('g3-row')){el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),1600)}
    requestAnimationFrame(()=>el.scrollIntoView({block:'center'}))};
  addEventListener('hashchange',open);if(document.querySelector('.g2,.g3'))open();
})();
