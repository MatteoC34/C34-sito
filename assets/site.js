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

/* glossario: ricerca e filtro per area */
(function(){
  const q=document.getElementById('gl-q'),list=document.getElementById('gl-list');if(!q||!list)return;
  const items=[...list.querySelectorAll('.gl-item')],groups=[...list.querySelectorAll('.gl-group')],btns=[...document.querySelectorAll('[data-glf] button')];
  const count=document.getElementById('gl-count'),empty=document.getElementById('gl-empty');
  let area='*';
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const run=()=>{const t=norm(q.value.trim());let n=0;
    items.forEach(i=>{const ok=(area==='*'||i.dataset.area===area)&&(!t||norm(i.dataset.s).includes(t));i.hidden=!ok;if(ok)n++});
    groups.forEach(g=>g.hidden=!g.querySelector('.gl-item:not([hidden])'));
    count.textContent=n+(n===1?' voce':' voci');empty.hidden=n>0};
  q.addEventListener('input',run);
  btns.forEach(b=>b.addEventListener('click',()=>{area=b.dataset.area;btns.forEach(x=>x.setAttribute('aria-pressed',x===b));run()}));
})();
