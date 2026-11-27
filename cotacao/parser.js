const AP=(function(){const module={};
// parser.js — leitura das tabelas de preço em PDF (funções puras, sem DOM)
const FONTES=[
 {id:"carga_bs",nome:"Pneus de carga · Bridgestone",curto:"Carga BS",c:"Carga",def:"Carga Bridgestone",det:/CARGA\s*-\s*BRIDGESTONE/i,pdf:true},
 {id:"carga_outras",nome:"Pneus de carga · Outras marcas",curto:"Carga outras marcas",c:"Carga",pref:"Carga ",det:/CARGA\s*-\s*OUTRAS/i,pdf:true,
  map:{"importados":"Carga importados","diagonal goodyear/pirelli":"Carga diagonal Goodyear/Pirelli","continental":"Carga Continental","linha eudemon/rovelo":"Carga Eudemon/Rovelo"}},
 {id:"passeio_bs",nome:"Pneus de passeio · Bridgestone/Firestone",curto:"Passeio BS",c:"Passeio",def:"Passeio Bridgestone/Firestone",det:/PASSEIO\s*-\s*BRIDGESTONE/i,pdf:true},
 {id:"passeio_outras",nome:"Pneus de passeio · Importados e Continental",curto:"Passeio importados",c:"Passeio",pref:"Passeio ",det:/PASSEIO\s*-\s*(OUTRAS|IMPORT|CONTINENTAL)/i,pdf:true,
  map:{"importados":"Passeio importados","continental":"Passeio Continental","pneu passeio outras marcas":"Passeio importados","pneu passeio continental":"Passeio Continental"}},
 {id:"acessorios",nome:"Acessórios",curto:"Acessórios",c:"Acessórios",pref:"",det:/ACESS[ÓO]RIOS/i,pdf:true,
  map:{"bateria moura":"Bateria Moura","bateria zetta":"Bateria Zetta","rodas":"Rodas","protetor":"Protetor","camara de ar":"Câmara de ar","oleo mobil":"Óleo Mobil","oleo ipiranga":"Óleo Ipiranga"}},
 {id:"recapagem",nome:"Recapagem",curto:"Recapagem",c:"Recapagem",det:/RECAPAGEM/i,pdf:true,nameKey:true,pg:true},
 {id:"servicos",nome:"Serviços",curto:"Serviços",c:"Serviços",det:/TABELA DE SERVI[ÇC]OS/i,pdf:true,pg:true}
];
const nk=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s*-\s*/g," ").replace(/\s*\/\s*/g,"/").replace(/\s+/g," ").trim();
const titulo=s=>s.toLowerCase().split(" ").map((w,i)=>i&&/^(de|da|do|e)$/.test(w)?w:w.charAt(0).toUpperCase()+w.slice(1)).join(" ");

// chave estável de cada item: fonte|código (e |nome quando o código se repete)
function mkIk(items,fonte,nameKey){
 const cnt={};items.forEach(p=>{const b=fonte+"|"+p.k;cnt[b]=(cnt[b]||0)+1});
 const seen={};
 items.forEach(p=>{const b=fonte+"|"+p.k;let k=(nameKey||cnt[b]>1)?b+"|"+p.n:b;
  if(seen[k]){seen[k]++;k+="#"+seen[k]}else seen[k]=1;p.ik=k});
 return items}

const ROW=/^(.*?)\s+((?:R\$\s*-?[\d.]+,\d{2}\s*)+)$/;
const REF=/^(JANEIRO|FEVEREIRO|MAR[ÇC]O|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO)\s*[\/-]\s*(\d{4})$/i;
const LBL=/[AÀ]\s*VISTA|(?:DE\s+)?\d+\s*X\s+(?:A|AT[ÉE])\s+\d+\s*X(?:\s+NO\s+CART[ÃA]O)?|(?:EM\s+)?AT[ÉE]\s+\d+\s*X(?:\s+NO\s+CART[ÃA]O)?(?:\s+S\/\s*JUROS)?|SUCATA/gi;
const num=s=>parseFloat(s.replace(/\./g,"").replace(",","."));

function labelOf(s){s=s.toUpperCase().replace(/\s+/g," ");let m;
 if(/SUCATA/.test(s))return{sc:1};
 if(/VISTA/.test(s))return{l:"À vista"};
 if(m=s.match(/^(?:DE )?(\d+) ?X (?:A|AT[ÉE]) (\d+) ?X( NO CART)?/))return{l:(m[3]?"Cartão ":"")+m[1]+"x a "+m[2]+"x"};
 if(m=s.match(/AT[ÉE] (\d+) ?X/))return{l:/CART/.test(s)?"Cartão até "+m[1]+"x":"Até "+m[1]+"x"+(/JUROS/.test(s)?" s/ juros":"")};
 return null}
function parseLabels(L){const out=[];let m;LBL.lastIndex=0;while(m=LBL.exec(L)){const o=labelOf(m[0]);if(o)out.push(o)}return out}
function normRef(m){return m[1].toUpperCase()+"/"+m[2]}

function detect(lines){const head=lines.slice(0,8).join(" ");return FONTES.find(f=>f.pdf&&f.det.test(head))||null}

function groupOf(F,sec){
 if(F.def)return F.def;
 if(!sec)return F.nome;
 const k=nk(sec);
 return (F.map&&F.map[k])||((F.pref||"")+titulo(sec.replace(/\s*-\s*/g," - ")))}

// ---- leitores por posição (PDFs em colunas): recebem pages=[{w,items:[{s,x,y}]}]
function rowsOf(items){
 const its=items.filter(i=>i.s&&String(i.s).trim()).map(i=>({s:String(i.s).trim(),x:i.x,y:i.y})).sort((a,b)=>b.y-a.y||a.x-b.x);
 const rows=[];let cur=null;
 for(const it of its){if(cur&&Math.abs(cur.y-it.y)<=3)cur.a.push(it);else{cur={y:it.y,a:[it]};rows.push(cur)}}
 rows.forEach(r=>r.a.sort((a,b)=>a.x-b.x));return rows}
const PRC=/(\d{1,3}(?:\.\d{3})*,\d{2})/;
function measNorm(t){
 return t.replace(/^MEDIDA\s+/i,"").split(/\s+E\s+/i).map(m=>{
  m=m.replace(/\s*-?\s*\d+\s*MM\s*$/i,"").replace(/\s+/g,"").toUpperCase();
  if(/^\d{3}$/.test(m))m+="/80R22,5";
  return m.replace(/^(\d+)X(\d+)$/,"$1x$2")}).filter(Boolean)}
function parseRecap(pages){
 const items=[],warn=[],ign=[];let ref="";const seen=new Map();
 for(const pg of pages){
  const rows=rowsOf(pg.items),w=pg.w||Math.max(...pg.items.map(i=>i.x))*1.08,cut=w*0.52;
  for(const side of [0,1]){
   let meas=[];
   for(const r of rows){
    const t=r.a.filter(i=>side?i.x>=cut:i.x<cut).map(i=>i.s);if(!t.length)continue;
    const L=t.join(" ");
    if(!side&&!ref){const m=L.match(REF);if(m)ref=normRef(m)}
    if(/^MEDIDA\b/i.test(t[0])){meas=measNorm(t[0]);continue}
    const pi=t.findIndex(x=>PRC.test(x)&&!/[A-Za-z]/.test(x));
    if(pi<0){ign.push(L);continue}
    const price=num(t[pi].match(PRC)[1]);
    if(/^CONSERTO/i.test(t[0])){items.push({c:"Recapagem",g:"Conserto",k:"CONS",n:"Conserto – todas as medidas",p:[price],l:["Valor único"]});continue}
    const ri=t.findIndex(x=>/^R\$$/.test(x));
    if(ri<2||!meas.length){warn.push("Linha não reconhecida: "+L);continue}
    const code=t[ri-1],ty=t.slice(0,ri-1).join(" ").trim();
    const g=/^BANDA/i.test(ty)?"Arrasto":titulo(ty.split(" ")[0]);
    const tl=ty.toLowerCase();const tn=tl.charAt(0).toUpperCase()+tl.slice(1);
    for(const m of meas){
     const n=`${m} · ${tn} ${code}`,key=n;
     if(seen.has(key)){if(seen.get(key)!==price)warn.push(`Item repetido com preços diferentes: ${n}`);continue}
     seen.set(key,price);items.push({c:"Recapagem",g,k:code,n,p:[price],l:["Até 6x"]})}}}}
 if(!ref)warn.push("Não achei a referência (mês/ano) no PDF.");
 return{items:mkIk(items,"recapagem",true),ref,warn,ign}}

const SV_L=["Passeio","Leve / Van / Caminhonete / SUV","Meia carga","Linha pesada"];
function parseServ(pages,prev){
 const recs=[],warn=[],ign=[];let names=[];
 pages.forEach((pg,pi)=>{
  for(const r of rowsOf(pg.items)){
   const cells=[[],[],[],[]];let any=false;
   for(const i of r.a){if(i.x<260){names.push({s:i.s,x:i.x,y:r.y,pi});continue}
    if(i.x<=470&&/^P\//.test(i.s)&&i.x<260)continue;
    const b=i.x<310?0:i.x<400?1:i.x<470?2:3;cells[b].push(i.s);
    if(/R\$|\d,\d{2}|N[ÃA]O FAZ|N\/A/i.test(i.s))any=true}
   if(any&&!/PASSEIO|CARGA|PESADA/i.test(r.a.map(i=>i.s).join(" ")))
    recs.push({y:r.y,pi,p:cells.map(c=>{const m=c.join(" ").match(PRC);return m?num(m[1]):null})})}});
 const ptxt=(pg)=>0;
 let out=[];
 if(prev&&prev.length===recs.length){
  out=recs.map((r,i)=>({c:"Serviços",g:prev[i].g,k:prev[i].k,n:prev[i].n,p:r.p,l:prev[i].l||SV_L}))}
 else{
  warn.push(`O PDF tem ${recs.length} serviços e a tabela ativa ${prev?prev.length:0}. Confira nomes e grupos.`);
  const nm=recs.map(()=>[]);
  for(const t of names){if(/^(TABELA|ALTA|SERVI[ÇC]O|COBRAN)/i.test(t.s)||/^(LEVE|CAMINHONETE|P\/)/i.test(t.s)&&t.x>200)continue;
   if(t.x>=200)continue;let bi=-1,bd=1e9;recs.forEach((r,i)=>{if(r.pi!==t.pi)return;const d=Math.abs(r.y-t.y);if(d<bd){bd=d;bi=i}});
   if(bi>=0)nm[bi].push(t)}
  const toks=s=>new Set(nk(s).split(/[^a-z0-9]+/).filter(x=>x.length>2));
  let mx=0;(prev||[]).forEach(p=>{const q=parseInt(String(p.k).replace(/\D/g,""));if(q>mx)mx=q});
  const used=new Set();
  out=recs.map((r,i)=>{
   const n=nm[i].sort((a,b)=>b.y-a.y).map(t=>t.s).join(" ").replace(/\s+/g," ").trim()||("Serviço "+(i+1));
   const A=toks(n);let best=null,bs=0;
   for(const p of prev||[]){if(used.has(p.ik))continue;const B=toks(p.n);let c=0;A.forEach(x=>{if(B.has(x))c++});
    const sc=c/Math.max(1,Math.min(A.size,B.size));if(sc>bs){bs=sc;best=p}}
   if(best&&bs>=0.7){used.add(best.ik);return{c:"Serviços",g:best.g,k:best.k,n:best.n,p:r.p,l:best.l||SV_L}}
   mx++;warn.push("Serviço novo ou renomeado: "+n);
   return{c:"Serviços",g:"Serviços",k:"S"+String(mx).padStart(2,"0"),n,p:r.p,l:SV_L}})}
 return{items:mkIk(out,"servicos",false),ref:"2026",warn,ign}}

function parseLines(lines,F,prev){
 if(F&&F.pg){const pg=lines&&lines.pages;if(!pg||!pg.length)return{items:[],ref:"",warn:["Este PDF precisa ser lido por posição; reabra o arquivo."],ign:[]};
  return F.id==="recapagem"?parseRecap(pg):parseServ(pg,prev)}
 const items=[],warn=[],ign=[];let ref="",sec=null,sub="",labels=null;
 for(const raw of lines){
  const L=String(raw).replace(/\s+/g," ").trim();if(!L)continue;
  const m=L.match(ROW);
  if(m){
   let t=m[1].split(" ");let code=t.shift();
   while(t.length>1&&t[0]==="/"){code+=" / "+t[1];t.splice(0,2)}
   const name=t.join(" ").trim();
   const vals=[...m[2].matchAll(/R\$\s*(-?[\d.]+,\d{2})/g)].map(x=>num(x[1]));
   if(!labels){warn.push("Linha antes do cabeçalho de colunas: "+L);continue}
   if(!name||!code){warn.push("Linha sem código ou descrição: "+L);continue}
   if(vals.length!==labels.length){warn.push(`Linha com ${vals.length} valor(es), esperado ${labels.length}: ${L}`);continue}
   const it={c:F.c,g:groupOf(F,sec&&sub?sec+" "+sub:sec),k:code,n:name,p:[],l:[]};
   labels.forEach((lb,i)=>{if(lb.sc)it.sc=vals[i];else{it.p.push(vals[i]);it.l.push(lb.l)}});
   if(!it.p.length||it.p.some(v=>!(v>0)))warn.push("Preço zerado ou inválido: "+L);
   items.push(it);continue}
  if(/^(TABELA DE PRE|PNEUS\b)/i.test(L))continue;
  const mr=L.match(REF);if(mr){if(!ref)ref=normRef(mr);continue}
  if(/^COD\b\.?/i.test(L)){labels=parseLabels(L);if(!labels.length)warn.push("Cabeçalho de colunas não reconhecido: "+L);
   LBL.lastIndex=0;const f=LBL.exec(L),ti=(f?L.slice(0,f.index):L).replace(/^COD\.?\s*/i,"").trim();
   sub=ti&&!/^(ITEM|MODELO|DESCRI[ÇC][ÃA]O|PRODUTO)$/i.test(ti)?ti:"";continue}
  if(/R\$/.test(L)){ign.push(L);continue}
  if(L===L.toUpperCase()&&/[A-ZÀ-Ú]{3}/.test(L)&&L.length<=45&&!/^\d/.test(L)){sec=L;sub="";continue}
  ign.push(L)}
 mkIk(items,F.id,F.nameKey);
 return{items,ref,warn,ign}}

function sameP(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i])}
function diffTabs(prev,next){
 const pm=new Map(prev.map(p=>[p.ik,p])),nm=new Map(next.map(p=>[p.ik,p]));
 const nov=[],rem=[],alt=[];let igu=0;
 for(const n of next){const o=pm.get(n.ik);
  if(!o)nov.push(n);
  else if(!sameP(o.p,n.p)||JSON.stringify(o.l)!==JSON.stringify(n.l)||(o.sc||0)!==(n.sc||0)||o.n!==n.n||o.g!==n.g)alt.push({o,n});
  else igu++}
 for(const o of prev)if(!nm.has(o.ik))rem.push(o);
 return{nov,rem,alt,igu}}

function validar(items,prev,warn){
 const errs=[],w=[...warn];
 if(!items.length)errs.push("Nenhum item foi lido deste PDF.");
 if(prev.length&&items.length&&items.length<prev.length*0.6)w.push(`Só ${items.length} itens no PDF contra ${prev.length} na tabela ativa. Confira se não faltou página.`);
 return{errs,warn:w}}

if(typeof module!=="undefined")module.exports={rowsOf,FONTES,nk,mkIk,parseLines,parseLabels,diffTabs,validar,detect,groupOf};

return module.exports})();
