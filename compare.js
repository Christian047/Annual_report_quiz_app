// Compare mode: two fictional companies, six "which is better on X" questions.
function makeCompare(){
  const N=n=>n.toLocaleString('en-US');
  const co=()=>{
    const R=ri(2000,6000,100),np=Math.round(R*ri(40,140)/1000),eq=Math.round(np/(ri(8,25)/100)),debt=ri(100,1500,50);
    const pbt=Math.round(np/.7),i=Math.round(pbt/(ri(15,100)/10-1));
    return{R,np,eq,debt,i,e:pbt+i,ocf:Math.round(np*ri(40,140)/100),sh:ri(100,500,50),price:ri(10,80,2)};
  };
  const M=[
    {f:c=>c.np/c.R,hi:1,q:'Which company has the higher net margin?',fmt:v=>(v*100).toFixed(1)+'%',how:'Net margin = net profit \u00f7 revenue'},
    {f:c=>c.price/(c.np/c.sh),hi:0,q:'Which company is cheaper on earnings (lower P/E)?',fmt:v=>v.toFixed(1)+'x',how:'P/E = share price \u00f7 (net profit \u00f7 shares)'},
    {f:c=>c.debt/c.eq,hi:0,q:'Which company is less leveraged (lower debt to equity)?',fmt:v=>v.toFixed(2)+'x',how:'Debt to equity = total debt \u00f7 equity'},
    {f:c=>c.e/c.i,hi:1,q:'Which company has the stronger interest cover?',fmt:v=>v.toFixed(1)+'x',how:'Interest cover = EBIT \u00f7 interest'},
    {f:c=>c.np/c.eq,hi:1,q:'Which company earns the higher return on equity?',fmt:v=>(v*100).toFixed(1)+'%',how:'ROE = net profit \u00f7 equity'},
    {f:c=>c.ocf/c.np,hi:1,q:'Which company turns more of its profit into operating cash flow?',fmt:v=>v.toFixed(2)+'x',how:'Cash conversion = operating cash flow \u00f7 net profit'}
  ];
  let A,B,n=0;
  // Keep only pairs where every metric differs by at least 20%, so each answer is clear.
  do{A=co();B=co();n++}while(n<500&&M.some(m=>{const x=m.f(A),y=m.f(B);return Math.max(x,y)/Math.min(x,y)<1.2}));
  const row=(l,k)=>[l,N(A[k]),N(B[k])];
  const ctx=[
    {p:'Two fictional companies, one year of figures. All amounts in \u20a6 million except share price (\u20a6) and shares (millions).'},
    {tbl:[['','Company A','Company B'],row('Revenue','R'),row('EBIT','e'),row('Interest','i'),row('Net profit','np'),row('Equity','eq'),row('Total debt','debt'),row('Operating cash flow','ocf'),row('Share price','price'),row('Shares','sh')]}
  ];
  const qs=M.map(m=>{const x=m.f(A),y=m.f(B);return{t:'Compare',q:m.q,o:['Company A','Company B'],a:(m.hi?x>y:x<y)?0:1,why:`${m.how}. Company A: ${m.fmt(x)}. Company B: ${m.fmt(y)}.`}});
  return{ctx,qs};
}
