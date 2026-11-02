// Analyse a real report: type in figures (\u20a6 million), get every ratio with a plain-English reading.
const FIELDS=[['rev','Revenue'],['cogs','Cost of sales'],['dep','Depreciation'],['ebit','EBIT (operating profit)'],['int','Interest expense'],['np','Net profit'],['ca','Current assets'],['inv','Inventory'],['rec','Receivables'],['cash','Cash'],['cl','Current liabilities'],['debt','Total borrowings'],['eq','Shareholders\u2019 equity'],['ocf','Operating cash flow'],['capex','Capital expenditure'],['div','Dividends paid'],['price','Share price (\u20a6)'],['sh','Shares in issue (millions)'],['rev0','Revenue, previous year'],['np0','Net profit, previous year'],['rec0','Receivables, previous year']];
const FM={x:x=>x.toFixed(2)+'x',p:x=>x.toFixed(1)+'%',n:x=>'\u20a6'+x.toFixed(2),d:x=>Math.round(x)+' days',m:x=>'\u20a6'+Math.round(x).toLocaleString('en-US')+'m'};
const pos=(v,x)=>v>0?x:NaN;
const RATIOS=[
{n:'Current ratio',k:['ca','cl'],u:'x',f:v=>pos(v.cl,v.ca/v.cl),r:x=>x<1?['bad','Short-term bills exceed short-term assets.']:x<1.5?['warn','Adequate but thin. Industry matters.']:['ok','Comfortable cover for short-term bills.']},
{n:'Quick ratio',k:['ca','inv','cl'],u:'x',f:v=>pos(v.cl,(v.ca-v.inv)/v.cl),r:x=>x<.5?['bad','Very little cash-like cover without selling stock.']:x<1?['warn','Relies on selling inventory to pay bills.']:['ok','Bills can be met without selling stock.']},
{n:'Debt to equity',k:['debt','eq'],u:'x',f:v=>pos(v.eq,v.debt/v.eq),r:x=>x>2?['bad','Heavily reliant on borrowing.']:x>1?['warn','Debt exceeds equity. Check interest cover and when debt falls due.']:['ok','Moderate use of debt.']},
{n:'Interest cover',k:['ebit','int'],u:'x',f:v=>pos(v.int,v.ebit/v.int),r:x=>x<1.5?['bad','Earnings barely cover interest.']:x<3?['warn','Limited cushion if earnings fall.']:['ok','Earnings comfortably cover interest.']},
{n:'Net margin',k:['np','rev'],u:'p',f:v=>pos(v.rev,v.np/v.rev*100),r:x=>x<0?['bad','The company made a loss.']:x<5?['warn','Thin margin. Compare with peers, since margins differ by industry.']:['ok','Healthy margin. Compare with peers.']},
{n:'Return on equity',k:['np','eq'],u:'p',f:v=>pos(v.eq,v.np/v.eq*100),r:x=>x<0?['bad','Shareholders\u2019 money lost value.']:x<10?['warn','Modest return. Compare with peers and with what safe investments pay.']:['ok','Solid return. Check how much of it comes from debt.']},
{n:'Earnings per share',k:['np','sh'],u:'n',f:v=>pos(v.sh,v.np/v.sh),r:()=>['info','Profit attributable to each share.']},
{n:'P/E ratio',k:['price','np','sh'],u:'x',f:v=>pos(v.np,v.price/(v.np/v.sh)),r:x=>[x>30?'warn':'info',x>30?'Expensive on current earnings unless strong growth is expected.':'You pay \u20a6'+x.toFixed(1)+' for each \u20a61 of yearly profit. Compare with peers.']},
{n:'Dividend yield',k:['div','sh','price'],u:'p',f:v=>pos(v.price*v.sh,v.div/v.sh/v.price*100),r:()=>['info','Yearly cash return from dividends at today\u2019s price.']},
{n:'Payout ratio',k:['div','np'],u:'p',f:v=>pos(v.np,v.div/v.np*100),r:x=>x>100?['bad','Pays out more than it earned. Hard to sustain.']:x>80?['warn','Little profit retained for growth.']:['ok','Reasonable share of profit paid out.']},
{n:'Price to book',k:['price','sh','eq'],u:'x',f:v=>pos(v.eq,v.price/(v.eq/v.sh)),r:()=>['info','Price relative to book value. Below 1 can mean value, or doubt about the assets.']},
{n:'EV/EBITDA',k:['price','sh','debt','cash','ebit','dep'],u:'x',f:v=>pos(v.ebit+v.dep,(v.price*v.sh+v.debt-v.cash)/(v.ebit+v.dep)),r:()=>['info','Price of the whole business relative to operating earnings. Compare with peers.']},
{n:'Free cash flow',k:['ocf','capex'],u:'m',f:v=>v.ocf-v.capex,r:x=>x<0?['warn','Investing more than operations generate. Check how it is funded.']:['ok','Cash left after investment, available for dividends and debt.']},
{n:'Cash conversion',k:['ocf','np'],u:'x',f:v=>pos(v.np,v.ocf/v.np),r:x=>x<.5?['bad','Profit is not turning into cash. Check receivables and revenue recognition.']:x<.9?['warn','Some profit is tied up in working capital.']:['ok','Profit is well backed by cash.']},
{n:'Receivable days',k:['rec','rev'],u:'d',f:v=>pos(v.rev,v.rec/v.rev*365),r:()=>['info','Average time taken to collect from customers.']},
{n:'Inventory days',k:['inv','cogs'],u:'d',f:v=>pos(v.cogs,v.inv/v.cogs*365),r:()=>['info','Average time stock sits before it is sold.']},
{n:'Revenue growth',k:['rev','rev0'],u:'p',f:v=>pos(v.rev0,(v.rev/v.rev0-1)*100),r:()=>['info','Compare with inflation and with peers.']},
{n:'Receivables growth minus revenue growth',k:['rec','rec0','rev','rev0'],u:'p',f:v=>pos(v.rec0*v.rev0,(v.rec/v.rec0-v.rev/v.rev0)*100),r:x=>x>20?['bad','Receivables are growing much faster than sales. Check collections and revenue recognition.']:['ok','Collections are keeping pace with sales.']},
{n:'Net margin change (points)',k:['np','rev','np0','rev0'],u:'p',f:v=>pos(v.rev*v.rev0,(v.np/v.rev-v.np0/v.rev0)*100),r:x=>x<-2?['warn','Margin fell sharply. Find which cost line grew.']:['ok','Margin is stable or improving.']}
];

function analyse(){
  S.rep=S.rep||{};
  app.innerHTML=`<h1>Analyse a real report</h1><p class="meta">Type figures in \u20a6 million from a real annual report. Fill what you have. Ratios that need a missing figure are skipped.</p><div class="fg">${FIELDS.map(([k,l])=>`<label>${l}<input data-k="${k}" inputmode="decimal" autocomplete="off" value="${S.rep[k]??''}"></label>`).join('')}</div><div class="row"><button class="primary" id="go">Calculate</button><button id="cl">Clear</button><button id="hm">Back to home</button></div><div id="res"></div>`;
  $('#hm').onclick=home;
  $('#cl').onclick=()=>{S.rep={};save();analyse()};
  $('#go').onclick=()=>{
    const v={};
    document.querySelectorAll('.fg input').forEach(e=>{const t=e.value.replace(/,/g,'').trim(),n=parseFloat(t);S.rep[e.dataset.k]=e.value;if(t!==''&&isFinite(n))v[e.dataset.k]=n});
    save();
    const out=RATIOS.filter(R=>R.k.every(k=>k in v)).map(R=>({R,x:R.f(v)})).filter(o=>isFinite(o.x)).map(o=>({...o,l:o.R.r(o.x)}));
    const bad=out.filter(o=>o.l[0]==='bad').length,warn=out.filter(o=>o.l[0]==='warn').length;
    $('#res').innerHTML=out.length?`<h2>Results</h2><p>${bad+warn?`${bad} red and ${warn} amber. Review those first, then read the matching lesson.`:'No warning signs on the figures entered.'} These are rules of thumb, so compare with peers and read the notes. This is a learning tool, not investment advice.</p>`+out.map(o=>`<div class="rc ${o.l[0]}"><b>${o.R.n}</b> <span class="rv">${FM[o.R.u](o.x)}</span><p>${o.l[1]}</p></div>`).join(''):'<p>Enter at least two related figures, for example current assets and current liabilities.</p>';
    $('#res').scrollIntoView({behavior:'smooth'});
  };
}
