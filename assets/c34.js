document.documentElement.classList.add('js');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const eur=v=>{const a=Math.abs(v);return (v<0?'− ':'')+'€ '+(a>=1e6?(a/1e6).toFixed(a>=1e7?1:2).replace('.',',')+'M':a>=1e3?Math.round(a/1e3)+'k':String(Math.round(a)))};

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
$$('.rv,#timebar').forEach(el=>io.observe(el));

/* nav: scroll state, progress, active link, mobile menu, sticky mobile cta */
const nav=$('#nav'),prog=$('#progress'),mcta=$('#mcta');
addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;nav&&nav.classList.toggle('sc',y>10);prog&&(prog.style.width=(y/h*100)+'%');mcta&&mcta.classList.toggle('show',y>innerHeight*.8)},{passive:true});
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$$('.links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
$$('.links a[href^="#"]').forEach(a=>{const t=document.getElementById(a.getAttribute('href').slice(1));if(t)secIO.observe(t)});
const burger=$('#burger'),mm=$('#mmenu');
if(burger&&mm){const setMenu=o=>{burger.setAttribute('aria-expanded',o);mm.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''};
burger.addEventListener('click',()=>setMenu(burger.getAttribute('aria-expanded')!=='true'));
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));}

/* hero: parallax + count-up */
(function(){
  const col=$('#collage');if(!col)return;
  if(!reduce&&matchMedia('(pointer:fine)').matches){
    col.closest('.hero').addEventListener('pointermove',e=>{const r=col.getBoundingClientRect();col.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));col.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3))});
    col.closest('.hero').addEventListener('pointerleave',()=>{col.style.setProperty('--mx',0);col.style.setProperty('--my',0)});
  }
  if(reduce)return;
  const el=$('#heroCash'),arc=$('#heroArc');if(!el||!arc)return;arc.style.strokeDashoffset=238.8;
  setTimeout(()=>{arc.style.strokeDashoffset=109.5;const t0=performance.now();const tick=n=>{const p=Math.min(1,(n-t0)/1500),e=1-Math.pow(1-p,3);el.textContent='€ '+Math.round(842*e)+'k';if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)},500);
})();

/* flip cards */
$$('.sym').forEach(b=>b.addEventListener('click',()=>{const on=!b.classList.contains('on');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)}));
if(!reduce&&$('.sym')){const first=$('.sym');new IntersectionObserver((es,o)=>{if(!es[0].isIntersecting)return;o.disconnect();setTimeout(()=>{first.classList.add('on');setTimeout(()=>first.classList.remove('on'),1600)},700)},{threshold:.6}).observe(first)}

/* before / after */
(function(){
  const ba=$('#ba');if(!ba)return;const inp=ba.querySelector('input');let touched=false;
  const set=v=>ba.style.setProperty('--pos',v+'%');
  inp.addEventListener('input',()=>{touched=true;set(inp.value)});
  if(reduce)return;
  new IntersectionObserver((es,o)=>{if(!es[0].isIntersecting)return;o.disconnect();
    const keys=[[0,50],[700,22],[1500,78],[2300,50]],t0=performance.now()+400,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const tick=now=>{if(touched)return;const t=now-t0;if(t<0)return requestAnimationFrame(tick);const i=keys.findIndex(k=>k[0]>t);if(i===-1){set(50);inp.value=50;return}
      const [ta,va]=keys[i-1],[tb,vb]=keys[i],v=va+(vb-va)*ease((t-ta)/(tb-ta));set(v);inp.value=v;requestAnimationFrame(tick)};
    requestAnimationFrame(tick)},{threshold:.5}).observe(ba);
})();

/* simulator */
(function(){
  if(!$('#r-cash'))return;
  const fill=r=>r.style.setProperty('--p',((r.value-r.min)/(r.max-r.min)*100)+'%');
  const tabs=$$('.tabs [role=tab]');
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.setAttribute('aria-selected',x===t));const run=t.id==='t-run';
    $('#p-run').hidden=!run;$('#p-dso').hidden=run;$('#res-run').hidden=!run;$('#res-dso').hidden=run;
    $('#sim-note').textContent=run?'Stima semplificata a flussi costanti. Nella realtà incassi e pagamenti cambiano ogni mese: per questo li monitoriamo ogni settimana.':'Stima semplificata: crediti medi ≈ fatturato annuo ÷ 365 × DSO. Esclude IVA e stagionalità.'}));
  const svg=$('#runChart'),mesi=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  function run(){
    const c=+$('#r-cash').value,o=+$('#r-out').value,i=+$('#r-in').value,burn=o-i;
    $('#o-cash').textContent=eur(c);$('#o-out').textContent=eur(o);$('#o-in').textContent=eur(i);
    const st=$('#run-status'),num=$('#run-num'),meta=$('#run-meta');
    let months=burn>0?c/burn:Infinity;
    if(burn<=0){num.innerHTML='∞<small>cassa in crescita</small>';st.className='status g';st.lastChild.textContent='Generi cassa ogni mese';meta.innerHTML='La cassa cresce di <b>'+eur(-burn)+'</b> al mese. Il CFO ti aiuta a decidere dove investirla.'}
    else{num.innerHTML=(months>=100?'99+':months.toFixed(1).replace('.',','))+'<small>mesi</small>';
      const d=new Date();d.setMonth(d.getMonth()+Math.floor(months));
      st.className='status '+(months<6?'r':months<12?'a':'g');st.lastChild.textContent=months<6?'Meno di 6 mesi · priorità cassa':months<12?'6–12 mesi · da pianificare ora':'Oltre 12 mesi · margine per crescere';
      meta.innerHTML='Bruci <b>'+eur(burn)+'</b> al mese. '+(months<100?'A questo ritmo la cassa finisce a <b>'+mesi[d.getMonth()]+' '+d.getFullYear()+'</b>.':'')}
    const W=480,H=150,n=25,bw=W/n,max=Math.max(c,c-burn*24,1);let h='';
    for(let m=0;m<n;m++){const v=Math.max(0,c-burn*m),bh=v/max*(H-8),left=burn>0?(c-burn*m)/burn:99;
      const col=v<=0?'rgba(255,255,255,.06)':left<6?'#FF8A70':left<12?'#F2A93B':'#6C8BFF';
      h+=`<rect x="${(m*bw+2).toFixed(1)}" y="${(H-Math.max(bh,3)).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${Math.max(bh,3).toFixed(1)}" rx="3" fill="${col}"/>`}
    svg.innerHTML=h;
    ['#r-cash','#r-out','#r-in'].forEach(s=>fill($(s)));
  }
  const revSteps=[500e3,750e3,1e6,1.5e6,2e6,3e6,4e6,5e6,7.5e6,10e6,15e6,20e6,30e6,40e6,50e6];
  function dso(){
    const rev=revSteps[+$('#r-rev').value],d=+$('#r-dso').value,tg=$('#r-tgt');
    if(+tg.value>d)tg.value=d;const t=+tg.value;
    $('#o-rev').textContent=eur(rev);$('#o-dso').textContent=d+' gg';$('#o-tgt').textContent=t+' gg';
    const now=rev/365*d,tgt=rev/365*t,free=now-tgt;
    $('#dso-num').textContent=eur(free);
    $('#dso-meta').innerHTML='Oggi hai circa <b>'+eur(now)+'</b> ferma nei crediti verso clienti. Ogni giorno di DSO in meno vale <b>'+eur(rev/365)+'</b> di cassa.';
    $('#v-now').textContent=eur(now);$('#v-tgt').textContent=eur(tgt);
    $('#bar-now').style.width='100%';$('#bar-tgt').style.width=(now?tgt/now*100:0)+'%';
    ['#r-rev','#r-dso','#r-tgt'].forEach(s=>fill($(s)));
  }
  ['#r-cash','#r-out','#r-in'].forEach(s=>$(s).addEventListener('input',run));
  ['#r-rev','#r-dso','#r-tgt'].forEach(s=>$(s).addEventListener('input',dso));
  run();dso();
})();

/* quiz */
(function(){
  const steps=$$('.qstep'),dots=$$('#dots i'),ans={};let cur=0;if(!steps.length)return;
  const go=i=>{cur=i;steps.forEach((s,j)=>s.classList.toggle('cur',j===i));dots.forEach((d,j)=>d.classList.toggle('on',j<=Math.min(i,2)))};
  const R={q2:{cassa:'Cash flow a 30, 60 e 90 giorni e alert preventivi sulla liquidità',plan:'Budget, forecast e scenari a 12 mesi aggiornati con i dati reali',contab:'Contabilità, IVA, dichiarativi e bilancio gestiti dallo stesso team',ma:'Consulenza strategica e supporto nelle operazioni di M&A'},
           q3:{startup:'Requisiti da startup innovativa presidiati, reporting per investitori',pmi:'Controllo di gestione per BU e report credibili per le banche',founder:'Un interlocutore finanziario strategico, con una call ogni mese',deal:'Reportistica CFO-grade pronta per la due diligence'}};
  function result(){
    const deal=ans.q3==='deal'||ans.q2==='ma';
    const f=ans.q2==='contab'&&!deal?3:(ans.q1==='si'&&(ans.q2==='cassa'||ans.q2==='plan')&&!deal?1:2);
    const T={1:'Formula 01 · Fractional CFO',2:'Formula 02 · CFO + Contabilità, Fiscale e Strategia',3:'Formula 03 · Contabilità e Fiscale'};
    const sub={1:'Tieni il tuo commercialista: noi ci affianchiamo su pianificazione, controllo e reporting.',
      2:ans.q1==='si'?'Ci chiedi più del controllo di gestione: la formula completa unisce CFO, contabilità, fiscale, strategia ed M&A in un unico team.':'Un unico partner per numeri, tasse, strategia ed M&A.',
      3:ans.q1==='si'?'Vuoi conti e adempimenti in ordine: ce ne occupiamo noi, con uno studio interamente digitale.':'Conti in ordine e scadenze presidiate, senza rincorrere nulla a fine anno.'};
    const items=f===3?['Scritture contabili e registri IVA sempre aggiornati','Liquidazioni IVA, LIPE, Redditi, IRAP, CU e 770',R.q3[ans.q3]]:[R.q2[ans.q2],R.q3[ans.q3],'Report CFO entro il 10 e operatività in 48 ore'];
    const alt={1:'Se in futuro vorrai un unico partner anche per contabilità e fiscale, c\'è la Formula 02.',2:'',3:'Vuoi anche cash flow, budget e controllo di gestione? Guarda la Formula 02.'};
    $('#qr-title').textContent=T[f];$('#qr-sub').textContent=sub[f];$('#qr-alt').textContent=alt[f];
    $('#qr-list').innerHTML=items.map(x=>'<li>'+x+'</li>').join('');
    $('#qr-cta').href='#contatto';const fi=$('#f-interesse');if(fi)fi.value={1:'Fractional CFO',2:'CFO + Contabilità, Fiscale e Strategia',3:'Contabilità e Fiscale'}[f];
    if($('#cmp'))$('#cmp').dataset.rec=String(f);
  }
  $$('.opt').forEach(b=>b.addEventListener('click',()=>{ans[b.dataset.q]=b.dataset.v;if(cur===2){result();go(3)}else go(cur+1)}));
  $$('[data-back]').forEach(b=>b.addEventListener('click',()=>go(Math.max(0,cur-1))));
  $('#qr-reset').addEventListener('click',()=>{if($('#cmp'))delete $('#cmp').dataset.rec;go(0)});
  $('#qr-see').addEventListener('click',e=>{e.preventDefault();$('#cmp').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})});
})();

/* audience selector */
(function(){
  const J=$('#audData'),CFG=J?JSON.parse(J.textContent):{};
  const D0={
    startup:{h:'Startup &amp; Scale-up',d:'Struttura finanziaria per convincere investitori, gestire burn rate e runway e pianificare i prossimi round.',k:['Burn rate','Runway','MRR / ARR','Cash position','Gross margin'],l:['Budget e forecast costruiti per il round','Reporting mensile per investitori e board','Supporto a fundraising, bandi e finanziamenti','Esperienza su startup e PMI innovative (D.L. 179/2012)']},
    pmi:{h:'PMI in crescita',d:'Per imprese oltre la fase artigianale che vogliono un controllo di gestione professionale e scalabile.',k:['EBITDA','Marginalità per BU','DSO','DPO','Posizione finanziaria netta'],l:['Controllo di gestione per business unit e commessa','Cash flow a 30, 60 e 90 giorni','Report credibili per le banche','Riconciliazione settimanale fino a 3 conti']},
    founder:{h:'Imprenditori founder-led',d:'Per chi sente che la contabilità non basta più e cerca un interlocutore finanziario strategico.',k:['Cassa','Margini','EBITDA','Working capital','Budget vs actual'],l:['Una call ogni mese per decidere con i numeri','Priorità chiare su cassa, margini e investimenti','Alert preventivi prima che il problema diventi strutturale']},
    deal:{h:'Aziende pre M&amp;A',d:'Società verso acquisizione, cessione o fusione che necessitano di reportistica CFO-grade.',k:['EBITDA','P&amp;L riclassificato','Posizione finanziaria netta','Working capital'],l:['Reportistica pronta per la due diligence','P&amp;L gestionale riclassificato ed EBITDA','Consulenza strategica e supporto nelle operazioni di M&amp;A']}
  };
  const D=CFG.segs||D0,kl1=CFG.kl1||'I numeri che seguiamo con te',kl2=CFG.kl2||'Come ti aiutiamo',c2=CFG.cta2||{href:'#quiz',label:'Trova la formula'};
  const tabs=$$('.aud-tab'),panel=$('#audPanel');if(!tabs.length||!panel)return;
  const show=k=>{const x=D[k];tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.seg===k));
    panel.innerHTML=`<div class="swap"><h3>${x.h}</h3><p class="d">${x.d}</p><div class="ctas" style="margin-top:26px"><a href="#contatto" class="btn btn-blue btn-sm">Parliamone in call <span class="arr">→</span></a><a href="${c2.href}" class="btn btn-line btn-sm">${c2.label}</a></div></div>
      <div class="swap"><p class="kl">${kl1}</p><div class="kpis">${x.k.map(v=>'<span>'+v+'</span>').join('')}</div><p class="kl">${kl2}</p><ul>${x.l.map(v=>'<li>'+v+'</li>').join('')}</ul></div>`};
  tabs.forEach(t=>t.addEventListener('click',()=>show(t.dataset.seg)));show(tabs[0].dataset.seg);
})();
/* platform demo */
(function(){
  const pf=document.getElementById('pf');if(!pf)return;
  const M=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const MF=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  const COL={r:'#1F4BFF',c:'#FF5B3A',b:'#0A0F1F',p:'#A7AEC0',gm:'#AFC0FF'};
  const sumA=a=>a.reduce((t,v)=>t+v,0);
  const Y={2026:{n:9,upd:'Aggiornato al 30 set 2026',noteD:'· settembre 2026',
    ric:[118240,96410,142380,151120,138050,162300,170880,125930,179250],
    cos:[109120,104380,115940,118260,112470,121380,128150,118930,124710],
    bud:[121000,106000,129000,136000,133000,146000,151000,126000,161600,170000,175000,95400],
    prev:[95200,88100,110400,118300,119800,125100,130200,95900,138000,145300,129600,114100],
    inf:[131800,100900,150200,158400,148700,169900,176300,128100,175120,168000,172000,150000],
    out:[118100,112200,131000,129300,124100,132800,139200,126100,161720,131000,128000,140000],
    gm:[.38,.40,.42,.41,.39,.43,.44,.40,.43],cash0:677410,
    note:'Ricavi YTD sopra budget del 6,2%, trainati dalla BU2 Growth; EBITDA al 18% del fatturato. Da monitorare: runway a 6,5 mesi e tempi di incasso in aumento. Proposta: rivedere i termini di pagamento con i primi cinque clienti e anticipare il confronto con la banca sulla linea di credito.'}};
  const P=Y[2026].prev,cf=[.9,.93,.88,.87,.9,.86,.85,.92,.84,.86,.88,.9];
  const c25=P.map((v,i)=>Math.round(v*cf[i]/10)*10),i25=P.map(v=>Math.round(v*1.05/10)*10),o25=c25.map(v=>Math.round(v*1.08/10)*10);
  Y[2025]={n:12,upd:'Esercizio chiuso',noteD:'· chiusura 2025',ric:P.slice(),cos:c25,bud:P.map((v,i)=>Math.round(v*(i%3?0.97:1.03)/100)*100),prev:P.map((v,i)=>Math.round(v*(.8+(i%4)*.015)/10)*10),
    inf:i25,out:o25,gm:P.map((_,i)=>.36+(i%4)*.01),cash0:677410-sumA(i25)+sumA(o25),
    note:'Esercizio chiuso con ricavi a 1,41 milioni e margine operativo in crescita nel secondo semestre. Per il 2026: budget a 1,65 milioni, focus sulla BU2 Growth e sul controllo dei tempi di incasso.'};
  const BU={tutti:{r:1,c:1},core:{r:.58,c:.52},growth:{r:.32,c:.36},gen:{r:.10,c:.12}};
  const S={y:2026,p:'anno',bu:'tutti',view:'dash'};
  const g=id=>document.getElementById(id);
  const grp=v=>String(Math.round(Math.abs(v))).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  const eur=v=>(v<0?'−':'')+grp(v)+' €';
  const eurC=v=>{const a=Math.abs(v),s=v<0?'−':'';return s+'€ '+(a>=1e6?(a/1e6).toFixed(2).replace('.',',')+'M':a>=1e3?Math.round(a/1e3)+'k':Math.round(a))};
  const pct=(v,s)=>(s&&v>0?'+':v<0?'−':'')+Math.abs(v*100).toFixed(1).replace('.',',')+'%';
  const k=v=>(v<0?'−':'')+(Math.abs(v)>=1000?Math.round(Math.abs(v)/1000)+'k':Math.round(Math.abs(v)));
  const range=()=>{const n=Y[S.y].n;return S.p==='anno'?[...Array(12).keys()]:S.p==='ytd'?[...Array(n).keys()]:[0,1,2].map(i=>i+3*(+S.p[1]-1))};
  function nice(s){const p=Math.pow(10,Math.floor(Math.log10(s)));const n=s/p;return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p}
  function smooth(p){let d=`M${p[0][0]},${p[0][1]}`;for(let i=0;i<p.length-1;i++){const a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;d+=` C${b[0]+(c[0]-a[0])/6},${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6},${c[1]-(e[1]-b[1])/6} ${c[0]},${c[1]}`}return d}
  function chart(el,o){
    const W=Math.max(240,el.clientWidth),H=o.h||200,L=38,Rr=o.y2?36:4,T=10,Bt=22,pw=W-L-Rr,ph=H-T-Bt;
    const vals=[];(o.bars||[]).forEach(b=>b.d.forEach(v=>v!=null&&vals.push(v)));(o.lines||[]).forEach(l=>!l.y2&&l.d.forEach(v=>v!=null&&vals.push(v)));
    let mx=Math.max(1,...vals),mn=Math.min(0,...vals);const st=nice((mx-mn)/4||1);mx=Math.ceil(mx/st)*st;mn=Math.floor(mn/st)*st;
    const y=v=>T+ph-(v-mn)/(mx-mn)*ph,gw=pw/12,x=i=>L+gw*i+gw/2;
    let s=`<defs><linearGradient id="${el.id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F4BFF" stop-opacity=".22"/><stop offset="1" stop-color="#1F4BFF" stop-opacity="0"/></linearGradient></defs>`;
    for(let v=mn;v<=mx+st/2;v+=st){const z=Math.abs(v)<1e-6;s+=`<line x1="${L}" x2="${W-Rr}" y1="${y(v)}" y2="${y(v)}" stroke="${z?'#C3C8D4':'#EDEFF4'}" ${z?'':'stroke-dasharray="3 5"'}/><text class="ax" x="${L-8}" y="${y(v)+3.5}" text-anchor="end">${k(v)}</text>`}
    if(o.y2)for(let j=0;j<=4;j++)s+=`<text class="ax" x="${W-Rr+6}" y="${T+ph-ph*j/4+3.5}">${Math.round(o.y2.max*j/4*100)}%</text>`;
    M.forEach((m,i)=>{if(W>440||i%2===0)s+=`<text class="ax" x="${x(i)}" y="${H-4}" text-anchor="middle">${m}</text>`});
    const nb=(o.bars||[]).length,bw=Math.max(3,Math.min(gw*(nb>1?.32:.5),20));
    (o.bars||[]).forEach((b,j)=>b.d.forEach((v,i)=>{if(v==null)return;const x0=x(i)-(nb*bw+(nb-1)*3)/2+j*(bw+3),y0=y(Math.max(v,0)),y1=y(Math.min(v,0));
      const op=(o.sel&&!o.sel[i]?.22:1)*(b.fc&&b.fc[i]?.38:1);s+=`<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,y1-y0).toFixed(1)}" rx="${Math.min(5,bw/2)}" fill="${b.c}" opacity="${op}"/>`}));
    (o.lines||[]).forEach(l=>{let seg=[],segs=[];l.d.forEach((v,i)=>{if(v==null){if(seg.length)segs.push(seg);seg=[]}else seg.push([x(i),l.y2?T+ph-v/o.y2.max*ph:y(v)])});if(seg.length)segs.push(seg);
      segs.forEach(p=>{if(p.length<2)return;const d=smooth(p);if(l.area)s+=`<path d="${d} L${p.at(-1)[0]},${y(Math.max(mn,0))} L${p[0][0]},${y(Math.max(mn,0))}Z" fill="url(#${el.id}g)"/>`;
        s+=`<path d="${d}" fill="none" stroke="${l.c}" stroke-width="${l.w||2.4}" ${l.dash?'stroke-dasharray="6 6"':''} stroke-linecap="round"/>`;if(l.dots)p.forEach(q=>s+=`<circle cx="${q[0]}" cy="${q[1]}" r="3.4" fill="#fff" stroke="${l.c}" stroke-width="2"/>`)})});
    for(let i=0;i<12;i++)s+=`<rect class="hit" data-i="${i}" x="${L+gw*i}" y="${T}" width="${gw}" height="${ph}" rx="8" fill="transparent"/>`;
    el.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg><div class="pf-tip"></div>`;
    const tip=el.querySelector('.pf-tip');
    el.querySelectorAll('.hit').forEach(r=>{r.addEventListener('mouseenter',()=>{const i=+r.dataset.i,h=o.tip&&o.tip(i);r.setAttribute('fill','rgba(31,75,255,.06)');if(!h){tip.style.opacity=0;return}
        tip.innerHTML=h;const tw=tip.offsetWidth/2;tip.style.left=Math.min(W-tw,Math.max(tw,x(i)))+'px';tip.style.top=T+'px';tip.style.opacity=1});
      r.addEventListener('mouseleave',()=>{tip.style.opacity=0;r.setAttribute('fill','transparent')})});
  }
  function spark(svg,d,c){const v=d.filter(x=>x!=null);if(v.length<2){svg.innerHTML='';return}const mx=Math.max(...v),mn=Math.min(...v),p=v.map((q,i)=>[i/(v.length-1)*50+2,21-(q-mn)/((mx-mn)||1)*18]);
    svg.setAttribute('viewBox','0 0 54 24');svg.innerHTML=`<path d="${smooth(p)}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/><circle cx="${p.at(-1)[0]}" cy="${p.at(-1)[1]}" r="2.6" fill="${c}"/>`}
  function ring(svg,f,c){const C=2*Math.PI*14;svg.innerHTML=`<circle cx="18" cy="18" r="14" fill="none" stroke="#EDEFF4" stroke-width="5"/><circle cx="18" cy="18" r="14" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-Math.max(0,Math.min(1,f)))}" transform="rotate(-90 18 18)"/>`}
  const row=(n,s,v,c)=>`<li><i class="${c||''}"></i><div><b>${n}</b><small>${s}</small></div><em>${v}</em></li>`;
  function render(){
    const D=Y[S.y],f=BU[S.bu],R=i=>i<D.n?D.ric[i]*f.r:null,C=i=>i<D.n?D.cos[i]*f.c:null,B=i=>D.bud[i]*f.r,Pv=i=>D.prev[i]*f.r;
    const sel=range(),a=sel.filter(i=>i<D.n),inSel=M.map((_,i)=>sel.includes(i)),none=!a.length,last=a.length?Math.max(...a):-1;
    const per=S.p==='anno'?String(S.y):S.p.toUpperCase()+(S.p==='ytd'?' '+S.y:' '+S.y);
    g('pfUpd').textContent=D.upd;g('pfPer').textContent=per+(S.bu==='tutti'?'':' · '+{core:'BU1 Core',growth:'BU2 Growth',gen:'Generali'}[S.bu]);g('pfNoteD').textContent=D.noteD;
    const cashAt=i=>D.cash0+sumA(D.inf.slice(0,i+1))-sumA(D.out.slice(0,i+1));
    const fatt=sumA(a.map(R)),opex=sumA(a.map(C)),ebitda=fatt-opex,bud=sumA(a.map(B)),prev=sumA(a.map(Pv)),net=sumA(a.map(i=>D.inf[i]-D.out[i])),inflow=sumA(a.map(i=>D.inf[i])),outflow=sumA(a.map(i=>D.out[i]));
    const cash=cashAt(last>=0?last:D.n-1),burn=a.length?outflow/a.length:0,run=burn?cash/burn:0,gmE=sumA(a.map(i=>R(i)*D.gm[i])),gm=fatt?gmE/fatt:0,db=bud?fatt/bud-1:0,yoy=prev?fatt/prev-1:0;
    const set=(id,v)=>{g(id).textContent=none?'—':v},chip=(id,cls,t)=>{const e=g(id);e.className='pf-p '+cls;e.textContent=none?'Nessun consuntivo':t};
    const rc=run<3?'#FF5B3A':run<9?'#F2A93B':'#0E9F62',rw=run.toFixed(1).replace('.',',');
    g('kFattL').textContent='Fatturato '+(S.p==='anno'?S.y:S.p.toUpperCase());
    set('kFatt',eurC(fatt));chip('kFattP','',(yoy>=0?'▲ ':'▼ ')+pct(yoy,1)+' vs anno prec.');
    set('kEbitda',eurC(ebitda));chip('kEbitdaP','',pct(fatt?ebitda/fatt:0)+' del fatturato');
    g('kCash').textContent=eurC(cash);chip('kCashP','gr',last>=0&&last<D.n-1?'Al 30 '+M[last].toLowerCase():'Ultimo dato disponibile');
    set('kNet',eurC(net));chip('kNetP',net>=0?'g':'r','Entrate '+eurC(inflow));
    set('kBud',pct(db,1));chip('kBudP',db>=0?'g':'r',(db>=0?'+':'')+eurC(fatt-bud)+' sul budget');
    set('kRun',rw+' mesi');ring(g('kRing'),none?0:run/12,rc);chip('kRunP',run<3?'r':run<9?'a':'g',run<9?'Sotto la soglia di 9 mesi':'Sopra la soglia');
    set('kBurn',eurC(burn));set('kGm',pct(gm));chip('kGmP','pu',pct(gm-.392,1).replace('%',' pt')+' vs anno prec.');
    spark(g('sp1'),a.map(R),'#fff');spark(g('sp2'),a.map(i=>R(i)-C(i)),COL.r);spark(g('sp3'),a.map(cashAt),COL.r);let cum=0;spark(g('sp4'),a.map(i=>cum+=D.inf[i]-D.out[i]),COL.r);
    const mom=a.length>1?R(last)/R(last-1)-1:null;
    const strip=[['Opex totale',eurC(opex)],[a.length>1?`MoM ${M[last]}/${M[last-1]}`:'MoM',mom==null?'—':pct(mom,1)],['Ricavi per dip.',eurC(fatt/15)],['Costi servizi',eurC(opex*.58)],['Costi personale',eurC(opex*.34)],['Costi G&A',eurC(opex*.08)],['Budget '+S.y,eurC(sumA(D.bud)*f.r),1],['Ricavi '+(S.y-1),eurC(sumA(D.prev)*f.r),1]];
    g('pfStrip').innerHTML=strip.map(([l,v,keep])=>`<div><span>${l}</span><b>${none&&!keep?'—':v}</b></div>`).join('');
    g('pfNote').textContent=D.note;
    g('pfWatch').innerHTML=none?row('Nessun dato','Periodo senza consuntivo','—',''):
      row('Runway',rw+' mesi di cassa',rw+' m',run<3?'r':run<9?'a':'g')+
      row('Cassa disponibile',run<9?'Sotto la soglia di attenzione':'Sopra la soglia di attenzione',eurC(cash),run<9?'a':'g')+
      row('EBITDA %',ebitda/fatt<.1?'Sotto il 10% del fatturato':'Margine operativo del periodo',pct(ebitda/fatt),ebitda/fatt<.1?'a':'g')+
      row('Gross margin',pct(gm)+' dei ricavi',eurC(gmE),'')+
      row('Δ vs budget',pct(db,1)+' vs obiettivo del periodo',(db>=0?'+':'')+eurC(fatt-bud),db>=0?'g':'r');
    const tipM=i=>`<b>${MF[i]} ${S.y}</b>`,dot=c=>`<i style="background:${c}"></i>`;
    chart(g('ch1'),{h:250,sel:inSel,bars:[{d:M.map((_,i)=>R(i)),c:COL.r},{d:M.map((_,i)=>C(i)),c:COL.c}],
      lines:[{d:M.map((_,i)=>B(i)),c:COL.b,dash:1,w:1.8},{d:M.map((_,i)=>Pv(i)),c:COL.p,dash:1,w:1.8}],
      tip:i=>tipM(i)+(R(i)!=null?`${dot(COL.r)}Ricavi ${eur(R(i))}<br>${dot(COL.c)}Costi ${eur(C(i))}<br>`:'<span style="opacity:.6">Nessun consuntivo</span><br>')+`${dot(COL.b)}Budget ${eur(B(i))}<br>${dot(COL.p)}Anno prec. ${eur(Pv(i))}`});
    chart(g('ch2'),{h:190,lines:[{d:M.map((_,i)=>R(i)==null?null:R(i)-C(i)),c:COL.r,area:1},{d:M.map((_,i)=>B(i)*.155),c:COL.b,dash:1,w:1.6}],
      tip:i=>tipM(i)+(R(i)!=null?`${dot(COL.r)}EBITDA ${eur(R(i)-C(i))}<br>`:'')+`${dot(COL.b)}Budget ${eur(B(i)*.155)}`});
    let cc=D.cash0;const cumD=M.map((_,i)=>cc+=D.inf[i]-D.out[i]),fc=M.map((_,i)=>i>=D.n);
    const cfo=h=>({h,sel:inSel,bars:[{d:D.inf,c:COL.r,fc},{d:D.out,c:COL.c,fc}],lines:[{d:cumD.map((v,i)=>i<D.n?v-D.cash0:null),c:COL.b,dots:1,w:2},{d:cumD.map((v,i)=>i>=D.n-1&&D.n<12?v-D.cash0:null),c:COL.b,dash:1,w:2}],
      tip:i=>tipM(i)+(fc[i]?' <span style="opacity:.6">forecast</span><br>':'')+`${dot(COL.r)}Inflow ${eur(D.inf[i])}<br>${dot(COL.c)}Outflow ${eur(D.out[i])}<br>${dot(COL.b)}Cumulato ${eur(cumD[i]-D.cash0)}`});
    chart(g('ch3'),cfo(190));
    chart(g('ch4'),{h:190,sel:inSel,y2:{max:.6},bars:[{d:M.map((_,i)=>R(i)==null?null:R(i)*D.gm[i]),c:COL.gm}],lines:[{d:M.map((_,i)=>R(i)==null?null:D.gm[i]),c:COL.b,y2:1,dots:1,w:1.8}],
      tip:i=>R(i)==null?null:tipM(i)+`${dot(COL.gm)}Gross margin ${eur(R(i)*D.gm[i])}<br>${dot(COL.b)}${pct(D.gm[i])} dei ricavi`});
    g('cCash').textContent=eurC(cash);set('cNet',eurC(net));set('cIn',eurC(inflow));set('cOut',eurC(outflow));set('cBurn',eurC(burn));set('cRun',rw+' mesi');
    if(S.view==='cash')chart(g('ch5'),cfo(280));
    let ci=D.cash0;const rows={'Entrate (inflow)':[],'Uscite (outflow)':[],'Net cash flow':[],'Cassa iniziale':[],'Cassa finale':[]};
    M.forEach((_,i)=>{rows['Entrate (inflow)'].push(D.inf[i]);rows['Uscite (outflow)'].push(-D.out[i]);rows['Net cash flow'].push(D.inf[i]-D.out[i]);rows['Cassa iniziale'].push(ci);ci+=D.inf[i]-D.out[i];rows['Cassa finale'].push(ci)});
    const tot={'Entrate (inflow)':sumA(D.inf),'Uscite (outflow)':-sumA(D.out),'Net cash flow':sumA(D.inf)-sumA(D.out),'Cassa iniziale':D.cash0,'Cassa finale':ci};
    g('pfTable').innerHTML=`<table><thead><tr><th>Voce</th>${M.map(m=>`<th>${m}</th>`).join('')}<th>Totale</th></tr></thead><tbody>${Object.keys(rows).map(r=>`<tr class="${/Net|finale/.test(r)?'hl':''}"><td>${r}</td>${rows[r].map((v,i)=>`<td class="${i>=D.n?'fc':''}">${eur(v)}</td>`).join('')}<td>${eur(tot[r])}</td></tr>`).join('')}</tbody>${D.n<12?`<caption>${M[D.n]}–Dic in corsivo: forecast aggiornato ogni mese.</caption>`:''}</table>`;
  }
  const toast=g('pfToast');let tt;const say=t=>{toast.textContent=t;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2200)};
  const mark=(sel,fn)=>pf.querySelectorAll(sel).forEach(x=>x.classList.toggle('on',fn(x)));
  const setView=v=>{S.view=v;pf.dataset.view=v;g('pfDash').hidden=v!=='dash';g('pfCash').hidden=v!=='cash';g('pfTitle').textContent=v==='cash'?'Cash Flow':'Dashboard';
    mark('.pf-nav [data-view], .pf-mbar [data-view]',b=>b.dataset.view===v);render()};
  const setBu=b=>{S.bu=b;mark('[data-bu]',x=>x.dataset.bu===b);g('pfBuM').value=b;render()};
  pf.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  pf.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>say(b.title?b.title+': disponibile nella piattaforma':'Nell\'anteprima puoi esplorare Dashboard e Cash Flow')));
  pf.querySelectorAll('[data-y]').forEach(b=>b.addEventListener('click',()=>{S.y=+b.dataset.y;mark('[data-y]',x=>x===b);render()}));
  pf.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{S.p=b.dataset.p;mark('[data-p]',x=>x===b);render()}));
  pf.querySelectorAll('[data-bu]').forEach(b=>b.addEventListener('click',()=>setBu(b.dataset.bu)));
  g('pfBuM').addEventListener('change',e=>setBu(e.target.value));
  render();let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(render,150)});
  if('fonts' in document)document.fonts.ready.then(render);
})();

/* tab e stepper generici: [data-tabs] con [role=tab] (aria-controls -> pannello) */
$$('[data-tabs]').forEach(box=>{
  const tabs=[...box.querySelectorAll('[role=tab]')];if(!tabs.length)return;
  const bar=box.querySelector('[data-bar]'),auto=+box.dataset.auto||0;
  let cur=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true')),timer=null,touched=false;
  const show=(i,user)=>{cur=i;tabs.forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1;const id=t.getAttribute('aria-controls'),p=id&&document.getElementById(id);if(p)p.hidden=j!==i});
    if(bar)bar.style.width=((i+1)/tabs.length*100)+'%';if(user){touched=true;clearInterval(timer)}};
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>show(i,true));
    t.addEventListener('keydown',e=>{const n=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;if(!n)return;e.preventDefault();show((cur+n+tabs.length)%tabs.length,true);tabs[cur].focus()})});
  show(cur);
  if(auto&&!reduce)new IntersectionObserver(es=>es.forEach(e=>{clearInterval(timer);if(e.isIntersecting&&!touched)timer=setInterval(()=>show((cur+1)%tabs.length),auto)}),{threshold:.35}).observe(box);
});

/* checklist documenti */
$$('[data-docs]').forEach(box=>{
  const cbs=[...box.querySelectorAll('input[type=checkbox]')],bar=box.querySelector('.docs-prog i'),msg=box.querySelector('.docs-msg');
  const up=()=>{const n=cbs.filter(c=>c.checked).length;cbs.forEach(c=>c.closest('.doc').classList.toggle('on',c.checked));
    if(bar)bar.style.width=(n/cbs.length*100)+'%';if(msg)msg.textContent=n===cbs.length?'Fatto. Al resto pensiamo noi.':n?n+' di '+cbs.length+' caricati':msg.dataset.empty};
  cbs.forEach(c=>c.addEventListener('change',up));up();
});

/* simulatore partner: valori scelti dallo studio */
(function(){
  const box=$('[data-psim]');if(!box)return;
  const n=$('#ps-n'),pr=$('#ps-price'),mg=$('#ps-margin');
  const fmt=v=>'€ '+String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  const fill=r=>r.style.setProperty('--p',((r.value-r.min)/(r.max-r.min)*100)+'%');
  const up=()=>{const c=+n.value,p=+pr.value,m=+mg.value/100,arr=c*p*12,mar=arr*m;
    $('#ps-o-n').textContent=c+(c===1?' cliente':' clienti');$('#ps-o-price').textContent=fmt(p)+' / mese';$('#ps-o-margin').textContent=Math.round(m*100)+'%';
    $('#ps-arr').textContent=fmt(arr);$('#ps-marg').textContent=fmt(mar);$('#ps-per').textContent=fmt(p*12);
    $('#ps-bar-m').style.width=(m*100)+'%';$('#ps-bar-c').style.width=((1-m)*100)+'%';[n,pr,mg].forEach(fill)};
  [n,pr,mg].forEach(r=>r.addEventListener('input',up));up();
})();

/* form di contatto (Netlify Forms): invio senza ricaricare la pagina, con ripiego sul normale invio se JavaScript non è attivo */
$$('form.cform').forEach(form=>{
  const status=form.querySelector('.cform-status'),btn=form.querySelector('button[type=submit]'),ok=form.querySelector('.cform-ok');
  form.addEventListener('invalid',()=>form.classList.add('tried'),true);
  form.addEventListener('submit',async e=>{
    e.preventDefault();form.classList.add('tried');status.textContent='';
    if(!form.checkValidity()){form.reportValidity();return}
    const label=btn.innerHTML;btn.disabled=true;btn.textContent='Invio in corso…';
    try{
      const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()});
      if(!r.ok)throw new Error('HTTP '+r.status);
      form.classList.add('sent');ok.hidden=false;ok.focus();
    }catch(err){
      status.textContent='Invio non riuscito. Riprova tra poco, oppure scrivici a hello@consulting34.com.';
      btn.disabled=false;btn.innerHTML=label;
    }
  });
});
