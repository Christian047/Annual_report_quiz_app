// Scenario mode: builds a random, internally consistent mini annual report, then asks questions about it.
function makeScenario(){
  const N=n=>n.toLocaleString('en-US'),pick=a=>a[Math.floor(Math.random()*a.length)];
  let c;
  do{
    const R=ri(2000,6000,100),cg=Math.round(R*ri(55,70)/100),ox=Math.round(R*ri(8,14)/100),D=ri(50,200,10),I=ri(20,100,5);
    const ebit=R-cg-ox-D,pbt=ebit-I,tax=Math.round(pbt*.3),np=pbt-tax;
    const inv=Math.round(cg*ri(40,100)/365),rec=Math.round(R*ri(30,90)/365),cash=ri(50,400,10),nca=ri(1500,3500,50);
    const pay=Math.round(cg*ri(30,80)/365),stl=ri(50,300,10),ltd=ri(200,1000,50);
    const ta=nca+inv+rec+cash;
    c={R,cg,ox,D,I,ebit,tax,np,inv,rec,cash,nca,pay,stl,ltd,ta,eq:ta-pay-stl-ltd};
  }while(c.eq<200||c.np<=0);
  const {R,cg,ox,D,I,ebit,tax,np,inv,rec,cash,nca,pay,stl,ltd,ta,eq}=c;
  const ocf=np+D+ri(-150,150,10),capex=ri(100,400,10),div=Math.round(np*ri(20,50)/100),sh=ri(100,500,50),price=ri(10,80,2);
  const ca=inv+rec+cash,cl=pay+stl,debt=stl+ltd;
  const name=pick(['Sunbird','Maple','Kestrel','Riverbend','Ironwood'])+' '+pick(['Foods','Packaging','Textiles','Logistics','Plastics'])+' Plc';
  const ctx=[
    {p:`<b>${name}</b> (fictional). All figures in \u20a6 million. Share price \u20a6${price}, shares in issue ${sh}m.`},
    {tbl:[['Income statement','\u20a6m'],['Revenue',N(R)],['Cost of sales',N(cg)],['Operating expenses (excl. depreciation)',N(ox)],['Depreciation',N(D)],['EBIT',N(ebit)],['Interest',N(I)],['Tax',N(tax)],['Net profit',N(np)]]},
    {tbl:[['Balance sheet','\u20a6m'],['Non-current assets',N(nca)],['Inventory',N(inv)],['Receivables',N(rec)],['Cash',N(cash)],['Total assets',N(ta)],['Payables',N(pay)],['Short-term loans',N(stl)],['Long-term debt',N(ltd)],['Equity',N(eq)]]},
    {tbl:[['Cash flow','\u20a6m'],['Operating cash flow',N(ocf)],['Capex',N(capex)],['Dividends paid',N(div)]]}
  ];
  const nq=(q,a,d,u,why)=>({t:'Scenario',num:1,q,a,d,u,why});
  const ok=ocf>=np;
  const qs=[
    nq('What is the current ratio?',ca/cl,2,'x',`Current assets = ${inv} + ${rec} + ${cash} = ${ca}. Current liabilities = ${pay} + ${stl} = ${cl}. ${ca} \u00f7 ${cl}.`),
    nq('What is the debt to equity ratio?',debt/eq,2,'x',`Total debt = ${stl} + ${ltd} = ${debt}. ${debt} \u00f7 ${eq}.`),
    nq('What is the net margin?',np/R*100,1,'%',`${np} \u00f7 ${R} \u00d7 100.`),
    nq('What is the interest cover?',ebit/I,1,'x',`EBIT \u00f7 interest = ${ebit} \u00f7 ${I}.`),
    nq('What is the P/E ratio?',price/(np/sh),1,'x',`EPS = ${np} \u00f7 ${sh} = \u20a6${(np/sh).toFixed(2)}. P/E = ${price} \u00f7 EPS.`),
    nq('What is free cash flow in \u20a6m?',ocf-capex,0,'\u20a6m',`${ocf} \u2212 ${capex}.`),
    {t:'Scenario',q:'Is the profit backed by cash this year?',o:['Yes, operating cash flow is at least net profit','No, operating cash flow is below net profit'],a:ok?0:1,why:`Operating cash flow is ${ocf} and net profit is ${np}.`},
    nq('How many receivable days does the company have?',rec/R*365,0,'days',`${rec} \u00f7 ${R} \u00d7 365.`)
  ];
  return{ctx,qs};
}
