const $=s=>document.querySelector(s),app=$('#app'),KEY='arq1';
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const day=d=>d.toISOString().slice(0,10);
let S={st:{},box:{},miss:[],streak:0,last:''};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
S.read=S.read||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const T=[...new Set([...BANK.map(b=>b.t),...GEN.map(g=>g.t)])];
let Q=[],i=0,sc=0,CTX='';

const weak=()=>T.filter(t=>(S.st[t]||{}).n>=3).sort((a,b)=>S.st[a].c/S.st[a].n-S.st[b].c/S.st[b].n).slice(0,3);

function home(){
  const m=S.miss.length,wk=weak();
  app.innerHTML=`<h1>Annual report trainer</h1>
  <p class="meta">Streak: ${S.streak} day${S.streak==1?'':'s'}</p>
  <div class="row"><button class="primary" id="ln">Learn</button><button id="d5">Daily 5</button><button id="p10">Mixed practice</button><button id="sn">Scenario</button><button id="rh">Red flag hunt</button><button id="cp">Compare two</button><button id="an">Analyse a real report</button>${m?`<button id="rv">Review mistakes (${m})</button>`:''}${wk.length?`<button id="ws">Weak spots</button>`:''}<button id="fx">Formula sheet</button></div>
  <h2>Topics</h2>
  <div class="topics">${T.map(t=>{const s=S.st[t]||{c:0,n:0},p=s.n?Math.round(100*s.c/s.n):0;return`<button class="topic" data-t="${t}"><span>${t}<div class="bar"><i style="width:${p}%"></i></div></span><span class="meta">${s.n?p+'% of '+s.n:'new'}</span></button>`}).join('')}</div>
  <div class="row"><button id="ex">Export progress</button><button id="im">Import progress</button><input type="file" id="fi" hidden accept=".json"></div>`;
  $('#ln').onclick=learn;
  $('#d5').onclick=()=>start('',5);
  $('#p10').onclick=()=>start('',10);
  $('#sn').onclick=runScenario;
  $('#rh').onclick=runHunt;
  $('#cp').onclick=runCompare;
  $('#an').onclick=analyse;
  if($('#rv'))$('#rv').onclick=()=>start('',10,1);
  if($('#ws'))$('#ws').onclick=()=>start(wk,10);
  $('#fx').onclick=formulas;
  document.querySelectorAll('.topic').forEach(b=>b.onclick=()=>start(b.dataset.t,10));
  $('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='arq-progress.json';a.click()};
  $('#im').onclick=()=>$('#fi').click();
  $('#fi').onchange=e=>{const f=e.target.files[0];if(f)f.text().then(t=>{try{Object.assign(S,JSON.parse(t));save();home()}catch(x){alert('That file is not a valid progress export.')}})};
}

function start(topic,n,review){
  CTX='';
  let bank=BANK.filter(b=>(!topic||[].concat(topic).includes(b.t))&&(!review||S.miss.includes(b.id)));
  const gens=review?[]:GEN.filter(g=>!topic||[].concat(topic).includes(g.t));
  // Questions in lower Leitner boxes (missed more often) are drawn first.
  bank=bank.map(b=>[Math.random()*(4-(S.box[b.id]||1)),b]).sort((x,y)=>y[0]-x[0]).map(x=>x[1]);
  Q=[];
  while(Q.length<n&&(bank.length||gens.length)){
    if(bank.length&&(!gens.length||Math.random()<.4))Q.push(bank.shift());
    else{const g=rnd(gens);Q.push({...g.f(),t:g.t,num:1})}
  }
  Q=shuf(Q);i=0;sc=0;show();
}

function show(){
  const q=Q[i];if(!q)return end();
  let h=(CTX?`<details class="ctx"${i?'':' open'}><summary>Company statements</summary>${CTX}</details>`:'')+`<p class="meta">${q.t}, question ${i+1} of ${Q.length}</p><h2>${q.q}</h2>`;
  if(q.num)h+=`<input id="in" inputmode="decimal" autocomplete="off" aria-label="Your answer"><button class="primary" id="ck">Check</button> <span class="meta">${q.u}</span>`;
  else h+=shuf(q.o.map((_,k)=>k)).map(k=>`<button class="opt" data-k="${k}">${q.o[k]}</button>`).join('');
  app.innerHTML=h+'<div id="fb" hidden></div>';
  if(q.num){
    const inp=$('#in');
    $('#ck').onclick=()=>{const v=parseFloat(inp.value.replace(/,/g,''));if(isNaN(v))return inp.focus();done(Math.abs(v-q.a)<=Math.max(Math.abs(q.a)*.01,.5*10**-q.d))};
    inp.onkeydown=e=>{if(e.key==='Enter')$('#ck').click()};inp.focus();
  }else document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>done(+b.dataset.k===q.a,+b.dataset.k));
}

function done(ok,k){
  const q=Q[i],s=S.st[q.t]=S.st[q.t]||{c:0,n:0};
  s.n++;if(ok){s.c++;sc++}
  if(q.id){S.box[q.id]=ok?Math.min(3,(S.box[q.id]||1)+1):1;S.miss=S.miss.filter(x=>x!==q.id);if(!ok)S.miss.push(q.id)}
  save();
  document.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(+b.dataset.k===q.a)b.classList.add('ok');else if(+b.dataset.k===k)b.classList.add('bad')});
  if(q.num){$('#in').disabled=true;$('#ck').hidden=true}
  const fb=$('#fb');fb.hidden=false;fb.className=ok?'ok':'bad';
  fb.innerHTML=`<strong>${ok?'Correct.':'Not quite.'}</strong> ${q.why}${q.num&&!ok?` The answer is ${q.a.toFixed(q.d)} ${q.u}.`:''}<div class="row"><button class="primary" id="nx">${i+1<Q.length?'Next question':'See results'}</button>${!ok&&LESSONS.some(l=>l.t===q.t)?'<button id="rl">Read the lesson</button>':''}</div>`;
  $('#nx').onclick=()=>{i++;show()};$('#nx').focus();
  if($('#rl'))$('#rl').onclick=()=>lesson(LESSONS.findIndex(l=>l.t===q.t));
}

function end(){
  const t=day(new Date()),y=day(new Date(Date.now()-864e5));
  if(S.last!==t){S.streak=S.last===y?S.streak+1:1;S.last=t;save()}
  app.innerHTML=`<h1>${sc} of ${Q.length}</h1><p>${sc==Q.length?'Perfect round.':sc>=Q.length*.7?'Solid. Review the misses to lock them in.':'Keep going. Missed questions come back more often.'}</p><div class="row"><button class="primary" id="hm">Back to topics</button></div>`;
  $('#hm').onclick=home;
}

function formulas(){
  const by={};GEN.forEach(g=>(by[g.t]=by[g.t]||[]).push(g.fx));
  app.innerHTML=`<h1>Formula sheet</h1>`+Object.entries(by).map(([t,a])=>`<h2>${t}</h2>${a.map(x=>`<p>${x}</p>`).join('')}`).join('')+`<div class="row"><button class="primary" id="hm">Back to topics</button></div>`;
  $('#hm').onclick=home;
}

const block=b=>b.tbl?`<table class="tb">${b.tbl.map((r,k)=>`<tr>${r.map(c=>k?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</table>`:b.h?`<h2>${b.h}</h2>`:b.p?`<p>${b.p}</p>`:b.list?`<ul>${b.list.map(x=>`<li>${x}</li>`).join('')}</ul>`:b.eq?`<div class="eq">${b.eq}</div>`:b.ex?`<div class="ex"><strong>Example</strong><p>${b.ex}</p></div>`:b.tip?`<div class="tip"><strong>Watch out</strong><p>${b.tip}</p></div>`:b.flow?`<div class="flow">${b.flow.map(x=>`<span class="fb">${x}</span>`).join('<span class="ar">\u2192</span>')}</div>`:b.bars?(m=>`<div class="bars">${b.bars.map(([l,v])=>`<div class="br"><span>${l}</span><div class="tr"><i style="width:${v/m*100}%"></i></div><b>${v}</b></div>`).join('')}</div>`)(Math.max(...b.bars.map(x=>x[1]))):'';

function runScenario(){
  const s=makeScenario();CTX=s.ctx.map(block).join('');Q=s.qs;i=0;sc=0;show();
}

function runHunt(){
  const s=makeHunt();CTX=s.ctx.map(block).join('');Q=s.qs;i=0;sc=0;show();
}

function runCompare(){
  const s=makeCompare();CTX=s.ctx.map(block).join('');Q=s.qs;i=0;sc=0;show();
}

function learn(){
  app.innerHTML=`<h1>Learn</h1><p class="meta">Short lessons with worked examples. Start with the reading guide.</p><div class="topics">${LESSONS.map((l,k)=>`<button class="topic" data-k="${k}"><span>${l.title}</span><span class="meta">${S.read[l.id]?'read':'new'}</span></button>`).join('')}</div><div class="row"><button id="hm">Back to home</button></div>`;
  document.querySelectorAll('.topic').forEach(b=>b.onclick=()=>lesson(+b.dataset.k));
  $('#hm').onclick=home;
}

function lesson(k){
  const l=LESSONS[k];S.read[l.id]=1;save();
  app.innerHTML=`<h1>${l.title}</h1>${l.blocks.map(block).join('')}<div class="row">${T.includes(l.t)?'<button class="primary" id="qc">Quick check (3 questions)</button><button id="pr">Practise 10</button>':''}${LESSONS[k+1]?'<button id="nl">Next lesson</button>':''}<button id="bk">All lessons</button></div>`;
  window.scrollTo(0,0);
  if($('#qc'))$('#qc').onclick=()=>start(l.t,3);
  if($('#pr'))$('#pr').onclick=()=>start(l.t,10);
  if($('#nl'))$('#nl').onclick=()=>lesson(k+1);
  $('#bk').onclick=learn;
}

home();
