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
