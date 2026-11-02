// Red flag hunt: a fictional company with two years of figures. Some warning signs are planted at random.
function makeHunt(){
  const N=n=>n.toLocaleString('en-US'),pick=a=>a[Math.floor(Math.random()*a.length)];
  const pc=(a,b)=>((b/a-1)*100).toFixed(0),fl=()=>Math.random()<.4;
  const g=ri(5,15)/100,R0=ri(2000,5000,100),R1=Math.round(R0*(1+g)),cg0=Math.round(R0*ri(60,70)/100);
  const grow=(base,flag)=>Math.round(base*(1+g+(flag?ri(30,60):ri(-5,5))/100));
  const pRec=fl(),pInv=fl(),pMar=fl(),pCash=fl(),pInt=fl();
  const rec0=Math.round(R0*ri(40,60)/365),rec1=grow(rec0,pRec);
  const inv0=Math.round(cg0*ri(50,80)/365),inv1=grow(inv0,pInv);
  const m0=ri(60,100)/1000,m1=pMar?m0-ri(30,50)/1000:m0+ri(-5,10)/1000;
  const np0=Math.round(R0*m0),np1=Math.round(R1*m1);
  const ocf0=Math.round(np0*ri(90,120)/100),ocf1=Math.round(np1*(pCash?ri(10,40):ri(90,130))/100);
  const pbt0=Math.round(np0/.7),pbt1=Math.round(np1/.7);
  const i0=Math.round(pbt0/(ri(40,80)/10-1)),i1=Math.round(pbt1/((pInt?ri(12,18):ri(40,100))/10-1));
  const e0=pbt0+i0,e1=pbt1+i1;
  // Flags are decided from the displayed numbers, so every answer can be checked from the table.
  const f={
    rec:rec1/rec0-R1/R0>.2,
    inv:inv1/inv0-R1/R0>.2,
    cash:ocf1<np1*.5,
    int:e1/i1<2,
    mar:np0/R0-np1/R1>.02
  };
  const name=pick(['Sunbird','Maple','Kestrel','Riverbend','Ironwood'])+' '+pick(['Foods','Packaging','Textiles','Logistics','Plastics'])+' Plc';
  const ctx=[
    {p:`<b>${name}</b> (fictional). All figures in \u20a6 million. Compare the two years and look for warning signs.`},
    {tbl:[['','2025','2024'],['Revenue',N(R1),N(R0)],['EBIT',N(e1),N(e0)],['Interest',N(i1),N(i0)],['Net profit',N(np1),N(np0)],['Receivables',N(rec1),N(rec0)],['Inventory',N(inv1),N(inv0)],['Operating cash flow',N(ocf1),N(ocf0)]]}
  ];
  const yn=(q,flag,why)=>({t:'Red flags',q,o:['Yes, this is a red flag','No, this looks fine'],a:flag?0:1,why});
  const cnt=Object.values(f).filter(Boolean).length;
  const names={rec:'receivables',inv:'inventory',cash:'cash conversion',int:'interest cover',mar:'net margin'};
  const hit=Object.keys(f).filter(k=>f[k]).map(k=>names[k]);
  const qs=[
    yn('Compare receivables with revenue. Is that a red flag?',f.rec,`Receivables grew ${pc(rec0,rec1)}% while revenue grew ${pc(R0,R1)}%. Receivables growing much faster than sales (more than about 20 points) suggests slow collections or doubtful sales.`),
    yn('Compare inventory with revenue. Is that a red flag?',f.inv,`Inventory grew ${pc(inv0,inv1)}% while revenue grew ${pc(R0,R1)}%. Stock growing much faster than sales can mean weak demand or write-down risk.`),
    yn('Compare operating cash flow with net profit. Is that a red flag?',f.cash,`Operating cash flow of ${ocf1} is ${Math.round(ocf1/np1*100)}% of net profit of ${np1}. Below about half is a warning that profit is not turning into cash.`),
    yn('Is interest cover a red flag?',f.int,`Interest cover = EBIT \u00f7 interest = ${e1} \u00f7 ${i1} = ${(e1/i1).toFixed(1)}x. Below about 2x leaves little room for a bad year.`),
    yn('Has the net margin worsened enough to be a red flag?',f.mar,`Net margin moved from ${(np0/R0*100).toFixed(1)}% to ${(np1/R1*100).toFixed(1)}%. A fall of more than 2 points means costs are eating the growth.`),
    {t:'Red flags',num:1,q:'How many of those five areas show a red flag?',a:cnt,d:0,u:'red flags',why:cnt?`Flags: ${hit.join(', ')}. Several together are a reason to dig into the notes before investing.`:'None. The company looks clean on these five checks.'}
  ];
  return{ctx,qs};
}
