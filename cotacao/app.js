let CAT=[],IDX=[],SRV0=-1,IKMAP={},TABS=[];
const OLDK=["carga_bs|2190","carga_bs|10026689","carga_bs|1237","carga_bs|12099","carga_bs|12094","carga_bs|2200","carga_bs|12118","carga_bs|10028895","carga_bs|1945","carga_bs|10028869","carga_bs|1249","carga_bs|10028896","carga_bs|12126","carga_bs|2014","carga_bs|80992","carga_bs|2359","carga_bs|2191","carga_bs|10110731","carga_bs|11648","carga_bs|10109283","carga_bs|12155","carga_bs|2173","carga_bs|2168","carga_bs|10110730","carga_bs|12124","carga_bs|10016513","carga_bs|2328","carga_bs|2103","carga_bs|2192","carga_bs|12119","carga_bs|10109825","carga_bs|1291","carga_bs|10108719","carga_bs|12156","carga_bs|2174","carga_bs|2113","carga_bs|10110729","carga_bs|65631","carga_bs|10016514","carga_bs|1732","carga_outras|13625","carga_outras|21587","carga_outras|16015414","carga_outras|468","carga_outras|2680","carga_outras|31054","carga_outras|107540","carga_outras|105335","carga_outras|2855","carga_outras|469","carga_outras|107549","carga_outras|29874","carga_outras|9835","carga_outras|3948300","carga_outras|39484","carga_outras|317","carga_outras|39467","carga_outras|3946900","carga_outras|1052832","carga_outras|49400","carga_outras|4121660000","carga_outras|514026","carga_outras|514118","carga_outras|515548","carga_outras|50000","carga_outras|512092","carga_outras|512367","carga_outras|512342","carga_outras|5321","carga_outras|522157","carga_outras|845151","carga_outras|23575","carga_outras|18800","carga_outras|191919","carga_outras|19500","carga_outras|181818","carga_outras|98766","carga_outras|171717","carga_outras|1616","carga_outras|987677","carga_outras|707","passeio_bs|1024 / 80149","passeio_bs|10132439","passeio_bs|2145","passeio_bs|10015985","passeio_bs|2147","passeio_bs|2148","passeio_bs|1057","passeio_bs|2259","passeio_bs|2264","passeio_bs|10546","passeio_bs|2266","passeio_bs|10162","passeio_bs|23420","passeio_bs|11590","passeio_bs|2271","passeio_bs|12152","passeio_bs|2273","passeio_bs|10539","passeio_bs|2211","passeio_bs|11597","passeio_bs|11553","passeio_bs|2210","passeio_bs|11520","passeio_bs|2216","passeio_bs|10108227","passeio_bs|10015900","passeio_bs|2298","passeio_bs|2263","passeio_bs|10023404","passeio_bs|13575","passeio_bs|10022840","passeio_bs|10549","passeio_bs|2213","passeio_bs|2275","passeio_bs|11589","passeio_bs|11551","passeio_bs|10024429","passeio_bs|30142","passeio_bs|11583","passeio_bs|10028922","passeio_bs|10029007","passeio_bs|2209","passeio_bs|10016260","passeio_bs|12133","passeio_bs|11592","passeio_bs|11653","passeio_bs|2236","passeio_bs|2214","passeio_bs|2215","passeio_bs|10108219","passeio_bs|10015992","passeio_bs|11552","passeio_bs|10015903","passeio_bs|15996","passeio_bs|2243","passeio_bs|10108374","passeio_bs|1220077","passeio_bs|10022925","passeio_bs|10023895","passeio_bs|12151","passeio_bs|10024352","passeio_bs|10023433","passeio_bs|10017435","passeio_bs|10541","passeio_bs|3616","passeio_bs|10026685","passeio_bs|11602","passeio_bs|30682","passeio_bs|10107765","passeio_bs|10169","passeio_bs|2347","passeio_bs|11596","passeio_bs|10023784","passeio_bs|12138","passeio_bs|3617","passeio_bs|10017449","passeio_bs|11578","passeio_bs|10021083","passeio_bs|31571","passeio_bs|31549","passeio_bs|10017438","passeio_bs|10023804","passeio_bs|1150019","passeio_bs|10167","passeio_bs|10109538","passeio_bs|10160","passeio_bs|100857","passeio_bs|10015913","passeio_bs|10108220","passeio_bs|10029006","passeio_bs|10016079","passeio_bs|30272","passeio_bs|30346","passeio_bs|10171","passeio_bs|10017530","passeio_bs|10015656","passeio_bs|10002869","passeio_outras|388661","passeio_outras|160052442","passeio_outras|16013266 / 16004775","passeio_outras|16014939","passeio_outras|98020","passeio_outras|404217 / 16005638","passeio_outras|244678","passeio_outras|3262","passeio_outras|16011045 / 16001491","passeio_outras|16009189","passeio_outras|16007246","passeio_outras|16013319","passeio_outras|97626 / 16014648","passeio_outras|16006476 / 16005164","passeio_outras|1082 / 6393","passeio_outras|16014557","passeio_outras|16007247","passeio_outras|16009192","passeio_outras|404241","passeio_outras|16009096","passeio_outras|16014649","passeio_outras|2880","passeio_outras|771177","passeio_outras|86952","passeio_outras|16011565","passeio_outras|16005366","passeio_outras|16011562 / 16013691","passeio_outras|7364","passeio_outras|10052","passeio_outras|16007266","passeio_outras|355216","passeio_outras|2412","passeio_outras|16011144 / 16009456","passeio_outras|102515","passeio_outras|16011048 / 16011078","passeio_outras|23570","passeio_outras|16011604 / 16005642","passeio_outras|16006547 / 16006482","passeio_outras|16005084","passeio_outras|3030","passeio_outras|647364","passeio_outras|16010535","passeio_outras|16015681","passeio_outras|16005346","passeio_outras|16011365","passeio_outras|16008086","passeio_outras|104524","passeio_outras|97256","passeio_outras|15578500000","passeio_outras|15548990000","passeio_outras|15409250000","passeio_outras|15549020000","passeio_outras|4601220000","passeio_outras|15548960000","passeio_outras|15409360000","passeio_outras|4513980000","passeio_outras|3573270000","acessorios|12003673","acessorios|12002799","acessorios|60827","acessorios|60832","acessorios|12002829","acessorios|60884","acessorios|12003687","acessorios|12003797","acessorios|12003811","acessorios|12007294","acessorios|60951","acessorios|60946","acessorios|60960","acessorios|12002865","acessorios|12003772","acessorios|12007335","acessorios|12003774","acessorios|12003726","acessorios|61476","acessorios|61076","acessorios|61492","acessorios|68077","acessorios|12003416","acessorios|5500025","acessorios|5500125","acessorios|5500150","acessorios|5500300","acessorios|5500425","acessorios|130300","acessorios|400700","acessorios|203037","acessorios|203092","acessorios|13030074","acessorios|651651","acessorios|62","acessorios|63","acessorios|644","acessorios|7778","acessorios|203002","acessorios|5558","acessorios|100225","acessorios|456325","acessorios|105610 / 31023 / 245","acessorios|31024","acessorios|972","acessorios|1094","acessorios|3010001","acessorios|3235","acessorios|53150","acessorios|12000","acessorios|5214","acessorios|119035","acessorios|123762","acessorios|122704","acessorios|31236922","acessorios|3123","recapagem|BTL-9|275/80R22,5 · Direcional BTL-9","recapagem|BDV2|275/80R22,5 · Direcional BDV2","recapagem|B440|275/80R22,5 · Direcional B440","recapagem|BTL-2B|275/80R22,5 · Direcional BTL-2B","recapagem|B163|275/80R22,5 · Direcional B163","recapagem|B269|275/80R22,5 · Direcional B269","recapagem|LIGHT D|275/80R22,5 · Tração LIGHT D","recapagem|BDL2|275/80R22,5 · Tração BDL2","recapagem|D4300|275/80R22,5 · Tração D4300","recapagem|BDMS1|275/80R22,5 · Tração BDMS1","recapagem|B736|275/80R22,5 · Tração B736","recapagem|CT|275/80R22,5 · Tração CT","recapagem|CNT-MB|275/80R22,5 · Tração CNT-MB","recapagem|BRMS2|275/80R22,5 · Misto BRMS2","recapagem|BRMS3|275/80R22,5 · Misto BRMS3","recapagem|BZY|275/80R22,5 · Misto 2 (15mm) BZY","recapagem|BTLA|275/80R22,5 · Banda de arrasto c/ aba BTLA","recapagem|BTL3|275/80R22,5 · Banda de arrasto c/ aba BTL3","recapagem|BTL-SA2|275/80R22,5 · Banda de arrasto c/ aba BTL-SA2","recapagem|BTL-9|1000R20 · Direcional BTL-9","recapagem|BDV2|1000R20 · Direcional BDV2","recapagem|B440|1000R20 · Direcional B440","recapagem|BTL-2B|1000R20 · Direcional BTL-2B","recapagem|B163|1000R20 · Direcional B163","recapagem|B269|1000R20 · Direcional B269","recapagem|LIGHT D|1000R20 · Tração LIGHT D","recapagem|BDL2|1000R20 · Tração BDL2","recapagem|D4300|1000R20 · Tração D4300","recapagem|BDMS1|1000R20 · Tração BDMS1","recapagem|B736|1000R20 · Tração B736","recapagem|CT|1000R20 · Tração CT","recapagem|CNT-MB|1000R20 · Tração CNT-MB","recapagem|BRMS2|1000R20 · Misto BRMS2","recapagem|BRMS3|1000R20 · Misto BRMS3","recapagem|BZY|1000R20 · Misto 2 (15mm) BZY","recapagem|BTLA|1000R20 · Banda de arrasto c/ aba BTLA","recapagem|BTL3|1000R20 · Banda de arrasto c/ aba BTL3","recapagem|BTL-SA2|1000R20 · Banda de arrasto c/ aba BTL-SA2","recapagem|BTL-9|295/80R22,5 · Direcional BTL-9","recapagem|BTL-2B|295/80R22,5 · Direcional BTL-2B","recapagem|B440|295/80R22,5 · Direcional B440","recapagem|BDV2|295/80R22,5 · Direcional BDV2","recapagem|B163|295/80R22,5 · Direcional B163","recapagem|B269|295/80R22,5 · Direcional B269","recapagem|LIGHT D|295/80R22,5 · Tração LIGHT D","recapagem|BDL2|295/80R22,5 · Tração BDL2","recapagem|D4300|295/80R22,5 · Tração D4300","recapagem|BDMS1|295/80R22,5 · Tração BDMS1","recapagem|B736|295/80R22,5 · Tração B736","recapagem|CT|295/80R22,5 · Tração CT","recapagem|BRMS2|295/80R22,5 · Misto BRMS2","recapagem|BRMS3|295/80R22,5 · Misto BRMS3","recapagem|BZY|295/80R22,5 · Misto BZY","recapagem|BTLA|295/80R22,5 · Banda de arrasto c/ aba BTLA","recapagem|BTL3|295/80R22,5 · Banda de arrasto c/ aba BTL3","recapagem|BTL-SA2|295/80R22,5 · Banda de arrasto c/ aba BTL-SA2","recapagem|BTL-9|1100R22 · Direcional BTL-9","recapagem|BTL-2B|1100R22 · Direcional BTL-2B","recapagem|B440|1100R22 · Direcional B440","recapagem|BDV2|1100R22 · Direcional BDV2","recapagem|B163|1100R22 · Direcional B163","recapagem|B269|1100R22 · Direcional B269","recapagem|LIGHT D|1100R22 · Tração LIGHT D","recapagem|BDL2|1100R22 · Tração BDL2","recapagem|D4300|1100R22 · Tração D4300","recapagem|BDMS1|1100R22 · Tração BDMS1","recapagem|B736|1100R22 · Tração B736","recapagem|CT|1100R22 · Tração CT","recapagem|BRMS2|1100R22 · Misto BRMS2","recapagem|BRMS3|1100R22 · Misto BRMS3","recapagem|BZY|1100R22 · Misto BZY","recapagem|BTLA|1100R22 · Banda de arrasto c/ aba BTLA","recapagem|BTL3|1100R22 · Banda de arrasto c/ aba BTL3","recapagem|BTL-SA2|1100R22 · Banda de arrasto c/ aba BTL-SA2","recapagem|BRLT2|215/75R17,5 · Direcional BRLT2","recapagem|LIGHT D|215/75R17,5 · Tração LIGHT D","recapagem|CNT-MB|215/75R17,5 · Tração CNT-MB","recapagem|B440|235/75R17,5 · Direcional B440","recapagem|BRLT2|235/75R17,5 · Direcional BRLT2","recapagem|LIGHT D|235/75R17,5 · Tração LIGHT D","recapagem|CNT-MB|235/75R17,5 · Tração CNT-MB","recapagem|BRMS|235/75R17,5 · Misto BRMS","recapagem|BRLT2|900R20 · Direcional BRLT2","recapagem|LIGHT D|900R20 · Tração LIGHT D","recapagem|CNT-MB|900R20 · Tração CNT-MB","recapagem|BZY|900R20 · Misto BZY","recapagem|BRLT2|750x16 · Direcional BRLT2","recapagem|LIGHT S|750x16 · Direcional LIGHT S","recapagem|LIGHT D|750x16 · Tração LIGHT D","recapagem|CT|750x16 · Tração CT","recapagem|LIGHT S|900x20 · Direcional LIGHT S","recapagem|LIGHT D|900x20 · Tração LIGHT D","recapagem|CB|900x20 · Tração CB","recapagem|CNT-MB|900x20 · Tração CNT-MB","recapagem|LIGHT S|1000x20 · Direcional LIGHT S","recapagem|LIGHT D|1000x20 · Tração LIGHT D","recapagem|CB|1000x20 · Tração CB","recapagem|LIGHT S|1100x22 · Direcional LIGHT S","recapagem|LIGHT D|1100x22 · Tração LIGHT D","recapagem|CB|1100x22 · Tração CB","recapagem|CONS|Conserto – todas as medidas","SRV","servicos|S01","servicos|S02","servicos|S03","servicos|S04","servicos|S05","servicos|S06","servicos|S07","servicos|S08","servicos|S09","servicos|S10","servicos|S11","servicos|S12","servicos|S13","servicos|S14","servicos|S15","servicos|S16","servicos|S17","servicos|S18","servicos|S19","servicos|S20","servicos|S21","servicos|S22","servicos|S23","servicos|S24","servicos|S25","servicos|S26","servicos|S27","servicos|S28","servicos|S29","servicos|S30"];
const kOf=o=>{const i=IKMAP[o.ik];return i===undefined?SRV0:i};
const P=o=>CAT[kOf(o)];
const SELLER={nome:"",cargo:"Vendedor Externo",tel:""};
const ENDER="Alta Performance Recauchutadora — Rua Oliveiros Rodrigues Alves, nº 991, Posse, Nova Iguaçu — RJ  |  Tel.: (21) 98265-1148";
const $=id=>document.getElementById(id);
const brl=v=>"R$ "+(+v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const num=s=>{s=String(s).trim();if(s.includes(","))s=s.replace(/\./g,"").replace(",",".");const n=parseFloat(s);return isNaN(n)?0:n};
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const fmtD=s=>s?s.split("-").reverse().join("/"):"";
const autoT=n=>n===0?"à vista.":n<=6?`em ${n} parcelas no boleto bancário.`:`em ${n}x no cartão de crédito.`;
const CLS=["Passeio", "Leve / Van / Caminhonete / SUV", "Meia carga", "Linha pesada"];
const HINT={pneus:"Digite a medida, a marca ou o modelo.",rec:"Escolha o tipo ou digite a medida ou a banda.",srv:"Escolha o grupo ou digite o serviço.",acc:"Escolha o grupo ou digite o produto."};
const TP={pneus:{nome:"Pneus",sub:"Carga e passeio",tit:"COTAÇÃO DE PNEUS",un:"pneus",cats:["Carga","Passeio"],chips:["Carga","Passeio"],def:"Carga",parc:1,ph:"Medida, marca ou modelo (ex.: 275 FS440Z)",add:"Adicionar pneu"},
 rec:{nome:"Recapagem",sub:"Bandas e conserto",tit:"COTAÇÃO DE RECAPAGEM",un:"un.",cats:["Recapagem"],def:"Tudo",ph:"Medida ou banda (ex.: 275 BDV2)",add:"Adicionar recapagem",pag:"em até 6x.",cond:["Conserto:","R$ 190,00, todas as medidas."],ent:"Entrega/Coleta"},
 srv:{nome:"Serviços",sub:"Alinhamento, balanceamento e mais",tit:"COTAÇÃO DE SERVIÇOS",un:"un.",cats:["Serviços"],def:"Tudo",ph:"Buscar serviço (ex.: alinhamento)",add:"Adicionar serviço",livre:"+ Serviço livre (digitar descrição e valor)"},
 acc:{nome:"Acessórios",sub:"Baterias, óleos, rodas e mais",tit:"COTAÇÃO DE ACESSÓRIOS",un:"un.",cats:["Acessórios"],def:"Tudo",ph:"Bateria, óleo, roda... (ex.: Moura 60)",add:"Adicionar acessório",livre:"+ Item livre (digitar descrição e valor)"}};
const blank=(t="pneus")=>({id:Date.now(),tp:t,cls:3,cli:"",ct:"",dt:today(),val:"7 dias.",ent:"de segunda a sexta-feira.",opts:[[]],par:[3],pt:[t==="pneus"?autoT(3):TP[t].pag||""],cur:0});
const fix=q=>{q.tp=q.tp||"pneus";if(q.cls===undefined)q.cls=3;q.ct=q.ct||"";q.par=q.par||[];q.pt=q.pt||[];q.opts.forEach((_,i)=>{if(q.par[i]===undefined)q.par[i]=3;if(!q.pt[i])q.pt[i]=q.pag||autoT(q.par[i])});return q};
const PAR=()=>Q.par[Q.cur];
const tp=()=>TP[Q.tp]||TP.pneus;
const cnd=()=>[["Validade da proposta:",Q.val],...(Q.pt[Q.cur]?[["Pagamento:",Q.pt[Q.cur]]]:[]),...(tp().cond?[tp().cond]:[]),...promoCond(),[(tp().ent||"Entregas")+":",Q.ent]];
// faixa de parcelas de cada coluna da tabela
const rng=l=>{let m;if(/vista/i.test(l))return[0,0];if(m=l.match(/(\d+)x a (\d+)x/))return[+m[1],+m[2]];if(/cart/i.test(l)&&(m=l.match(/(\d+)x/)))return[7,+m[1]];if(m=l.match(/at[eé]\s*(\d+)x/i))return[1,+m[1]];return[0,99]};
function pick(p,n){const R=p.l.map(rng);let b=-1;R.forEach((r,i)=>{if(n>=r[0]&&n<=r[1]&&(b<0||r[1]<R[b][1]))b=i});
 if(b>=0)return{i:b,fb:false};let c=0,dm=1e9;R.forEach((r,i)=>{const d=n<r[0]?r[0]-n:n-r[1];if(d<dm){dm=d;c=i}});return{i:c,fb:true}}
function srvNotes(){return items().filter(o=>{const p=P(o);return p.c==="Serviços"&&p.k!=="SRV"&&p.p[Q.cls]==null}).map(o=>"«"+o.name+"» não consta na tabela para "+CLS[Q.cls]+".")}
function notes(){if(Q.tp==="srv")return srvNotes();if(Q.tp&&Q.tp!=="pneus")return[];const n=PAR(),T=n?n+"x":"à vista",g={};
 for(const o of items()){if(o.man)continue;const p=P(o),r=pick(p,n),mx=rng(p.l[r.i])[1];
  if(r.fb||(n>0&&mx-n>=3)){const k=p.g+"|"+r.i+"|"+r.fb;(g[k]=g[k]||{p,l:p.l[r.i],fb:r.fb,c:0}).c++}}
 return Object.values(g).map(x=>`${x.p.g}: a tabela não tem preço ${x.fb?"para":"específico para"} ${T}; usei «${x.l}» (${x.c} ${x.c>1?"itens":"item"}).`)}
let Q=blank(),cat="Carga",nid=1;
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

const say=t=>{$("msg").textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>$("msg").textContent="",4000)};

// descrição limpa: sem prefixo PNEU, sem índices de carga/velocidade (só pneus)
function limpa(p){
 let s=p.n.replace(/^PNEU\s+/i,"");
 if(p.c!=="Carga"&&p.c!=="Passeio")return s;
 return s.replace(/(\d{3}\/\d{2})\s?R\s?(\d{2}(?:\.\d)?)/,"$1 R$2")
  .replace(/\s+[MK]?\d{3}\/\d{2,3}[A-Z]?(?=\s|$)/g,"").replace(/\s+\d{6}[A-Z](?=\s|$)/g,"")
  .replace(/\s+\d{2,3}[A-Z](?=\s|$)/g,"").replace(/\s+/g," ").trim();
}
const norm=s=>s.toLowerCase().replace(/,/g,".").replace(/[\s\/\-]/g,"");


// busca
function chips(){const t=tp(),L=t.chips||[...new Set(CAT.filter(p=>t.cats.includes(p.c)&&p.k!=="SRV").map(p=>p.g))];
 if(!L.includes(cat)&&cat!=="Tudo")cat=t.def;
 $("chips").innerHTML=[...L,"Tudo"].map(c=>`<button class="${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("")}
function busca(){const t=tp(),q=$("q").value.trim().toLowerCase().split(/\s+/).filter(Boolean).map(norm);
 if(!q.length&&(Q.tp==="pneus"||cat==="Tudo")){$("res").innerHTML='<div class="hint">'+HINT[Q.tp]+'</div>';return}
 const out=[],lim=Q.tp==="pneus"?40:80;
 for(let i=0;i<CAT.length&&out.length<lim;i++){const p=CAT[i];if(!t.cats.includes(p.c)||p.k==="SRV")continue;
  if((cat==="Tudo"||(Q.tp==="pneus"?p.c===cat:p.g===cat))&&q.every(x=>IDX[i].includes(x)))out.push(i)}
 $("res").innerHTML=out.length?out.map(i=>{const p=CAT[i];return `<div data-i="${i}"><span>${limpa(p)}<small>${p.g}${p.sc?" · sucata "+brl(p.sc):""}</small></span><b>${p.c==="Serviços"?(p.p[Q.cls]==null?"não faz":brl(p.p[Q.cls])):brl(p.p[0])}</b></div>`}).join(""):'<div class="hint">Nada encontrado.</div>'}
function add(i){const p=CAT[i];if(p.c==="Serviços"&&p.k!=="SRV"){const v=p.p[Q.cls];if(v==null){say("Não consta na tabela para "+CLS[Q.cls]);return}Q.opts[Q.cur].push({id:nid++,ik:p.ik,name:limpa(p),sulco:"",qty:1,tier:Q.cls,price:v,ptab:v});draw();say("Adicionado: "+limpa(p));return}const r=pick(p,PAR());{const o={id:nid++,ik:p.ik,name:limpa(p),sulco:"",qty:1};setP(o,p,r.i);Q.opts[Q.cur].push(o)}draw();say("Adicionado: "+limpa(p))}

// ---- promoções na cotação ----
function setP(o,p,i){const t=p.p[i],r=p.c==="Serviços"?null:APX.promo(p.ik,p.l[i],t);o.tier=i;o.price=r?r.v:t;o.ptab=t;if(r){o.promo=r.id;o.pfim=r.fim}else{delete o.promo;delete o.pfim}}
const promoCond=()=>{const f=items().filter(o=>o.promo&&o.pfim).map(o=>o.pfim).sort()[0];return f?[["Preço promocional:","válido até "+fmtD(f)+"."]]:[]};
function promoAdd(ik){const i=IKMAP[ik];if(i===undefined){say("Este item não está na tabela atual");return}
 const p=CAT[i],t=p.c==="Recapagem"?"rec":p.c==="Acessórios"?"acc":p.c==="Serviços"?"srv":"pneus";
 $("pPromo").hidden=true;$("pAvi").hidden=true;if((Q.tp||"pneus")!==t){guarda();Q=blank(t)}cat=TP[t].def;$("q").value="";view="edit";add(i);window.scrollTo({top:0})}
// ---- imagem da cotação (vai junto com o PDF; faz o WhatsApp mostrar a prévia) ----
function cotImg(){
 return new Promise((ok,no)=>{try{
 const W=1080,M=54,R=W-M,AZ="#1f4e79",F="Arial,Helvetica,sans-serif",L=items(),{t,q}=totals(),MAXI=18;
 const c=document.createElement("canvas");c.width=W;c.height=7000;const g=c.getContext("2d");
 g.fillStyle="#fff";g.fillRect(0,0,W,7000);
 const wrap=(s,mw)=>{const out=[];let cur="";for(const w of String(s).split(/\s+/)){const x=cur?cur+" "+w:w;if(cur&&g.measureText(x).width>mw){out.push(cur);cur=w}else cur=x}if(cur)out.push(cur);return out.length?out:[""]};
 let y=M+34;
 g.fillStyle=AZ;g.font="bold 44px "+F;g.fillText("ALTA PERFORMANCE RECAUCHUTADORA",M,y);
 y+=46;g.fillStyle="#595959";g.font="30px "+F;g.fillText(tp().tit+(Q.opts.length>1?" · OPÇÃO "+(Q.cur+1):""),M,y);
 y+=20;g.fillStyle=AZ;g.fillRect(M,y,W-2*M,4);y+=46;
 const kv=(k,v)=>{g.fillStyle="#000";g.font="bold 30px "+F;g.fillText(k,M,y);const w=g.measureText(k).width;g.font="30px "+F;g.fillText(v,M+w+10,y);y+=44};
 kv("Cliente:",Q.cli||"—");if(Q.ct&&Q.ct.trim())kv("Contato:",Q.ct);kv("Data da cotação:",fmtD(Q.dt));if(Q.tp==="srv")kv("Categoria do veículo:",CLS[Q.cls]);
 y+=10;
 const xT=R-12,xu=R-244,xq=R-244-230,dw=xq-50-(M+84);
 g.fillStyle=AZ;g.fillRect(M,y,W-2*M,54);g.fillStyle="#fff";g.font="bold 26px "+F;
 g.textAlign="center";g.fillText("Item",M+38,y+36);g.fillText("Qtd.",xq,y+36);g.textAlign="left";g.fillText("Descrição",M+84,y+36);
 g.textAlign="right";g.fillText("Valor unit.",xu,y+36);g.fillText("Total",xT,y+36);y+=54;
 L.slice(0,MAXI).forEach((o,i)=>{g.font="27px "+F;const ls=wrap(dsc(o),dw),h=ls.length*35+22;
  g.fillStyle=i%2?"#fff":"#dce6f1";g.fillRect(M,y,W-2*M,h);g.fillStyle="#1b2430";
  g.textAlign="center";g.fillText(String(i+1),M+38,y+37);g.fillText(String(o.qty),xq,y+37);
  g.textAlign="left";ls.forEach((l,k)=>g.fillText(l,M+84,y+37+k*35));
  g.textAlign="right";g.fillText(brl(o.price),xu,y+37);g.fillText(brl(o.qty*o.price),xT,y+37);
  g.strokeStyle="#9bafc7";g.lineWidth=1;g.strokeRect(M,y,W-2*M,h);y+=h});
 if(L.length>MAXI){g.textAlign="left";g.fillStyle="#595959";g.font="italic 26px "+F;g.fillText("… e mais "+(L.length-MAXI)+" itens (veja todos no PDF)",M+84,y+36);y+=52}
 g.fillStyle=AZ;g.fillRect(M,y,W-2*M,64);g.fillStyle="#fff";g.font="bold 30px "+F;
 g.textAlign="left";g.fillText("TOTAL GERAL",M+16,y+43);g.textAlign="center";g.fillText(String(q),xq,y+43);
 g.textAlign="right";g.font="bold 22px "+F;g.fillText(tp().un,xu,y+42);g.font="bold 30px "+F;g.fillText(brl(t),xT,y+43);y+=64+52;
 g.textAlign="left";g.fillStyle=AZ;g.font="bold 34px "+F;g.fillText("Condições comerciais",M,y);y+=46;
 for(const[k,v]of cnd()){g.font="bold 28px "+F;const kw=g.measureText("• "+k).width+10;g.fillStyle="#000";g.fillText("• "+k,M,y);g.font="28px "+F;
  wrap(v,W-2*M-kw).forEach((l,n)=>{g.fillText(l,M+kw,y);if(n>=0)y+=38});}
 y+=26;g.font="28px "+F;g.fillStyle="#000";g.fillText("Atenciosamente,",M,y);y+=40;g.font="bold 28px "+F;g.fillText(SELLER.nome,M,y);y+=38;g.font="28px "+F;g.fillText(SELLER.cargo+" · "+SELLER.tel,M,y);y+=58;
 g.font="21px "+F;g.fillStyle="#7f7f7f";g.textAlign="center";wrap(ENDER,W-2*M).forEach(l=>{g.fillText(l,W/2,y);y+=28});y+=M-28;
 const o2=document.createElement("canvas");o2.width=W;o2.height=Math.ceil(y);o2.getContext("2d").drawImage(c,0,0);
 o2.toBlob(b=>b?ok(b):no(new Error("sem imagem")),"image/jpeg",.9)}catch(e){no(e)}})}
async function sendPdf(buf){
 const nm=fname("pdf"),pf=new File([buf],nm,{type:"application/pdf"});let files=[pf];
 if(store.get("ap_img")!==false){try{const b=await cotImg();if(b)files=[new File([b],fname("jpg"),{type:"image/jpeg"}),pf]}catch(e){}}
 try{if(navigator.canShare&&navigator.canShare({files})){await navigator.share({files,title:nm});return}}catch(e){if(e&&e.name==="AbortError")return}
 for(const f of files){const u=URL.createObjectURL(f),l=document.createElement("a");l.href=u;l.download=f.name;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}}
$("cfgImg").onchange=e=>store.set("ap_img",e.target.checked);

// itens
const items=()=>Q.opts[Q.cur];
function totals(){let t=0,q=0;for(const o of items()){t+=o.qty*o.price;if((Q.tp||"pneus")!=="pneus"||P(o).c!=="Acessórios")q+=o.qty}return{t,q}}
function unT(q){return(Q.tp||"pneus")==="pneus"?(q===1?"pneu":"pneus"):(q===1?"unidade":"unidades")}
function sums(){const{t,q}=totals();$("tt").textContent=brl(t);$("tq").textContent=q+" "+unT(q)+" · "+items().length+(items().length===1?" item":" itens");
 for(const o of items()){const e=document.querySelector(`[data-s="${o.id}"]`);if(e)e.textContent=brl(o.qty*o.price)}
 const ok=items().length>0&&window.DL;$("bPdf").disabled=$("bXls").disabled=!ok;$("bPrev").disabled=!items().length;const N=notes();$("pn").hidden=!N.length;$("pn").innerHTML="⚠ "+N.join("<br>⚠ ");store.set("cot_draft",Q)}
function draw(){
 const T=tp();$("tpTit").textContent=T.nome;$("addH").textContent=T.add;$("q").placeholder=T.ph;$("par").hidden=!T.parc;$("entL").textContent=T.ent||"Entregas";
 $("clsCard").hidden=Q.tp!=="srv";$("cls").value=Q.cls;$("bLivre").hidden=!T.livre;$("bLivre").textContent=T.livre||"";chips();busca();
 badge();nav();
 $("tabs").innerHTML=Q.opts.length>1?Q.opts.map((_,i)=>`<button class="${i===Q.cur?"on":""}" data-t="${i}">Opção ${i+1}</button>`).join(""):"";
 $("itH").textContent=Q.opts.length>1?"Itens da opção "+(Q.cur+1):"Itens da cotação";
 $("items").innerHTML=items().length?items().map((o,n)=>{const p=P(o);return `<div class="it" data-id="${o.id}">
 <div class="row" style="align-items:center"><b style="flex:none;color:var(--mu)">${n+1}</b><input data-f="name" placeholder="Descrição" value="${o.name.replace(/"/g,"&quot;")}"><button class="rm" data-f="rm" style="flex:none">✕</button></div>${o.promo?`<div class="pmb">🏷 Preço promocional${o.pfim?" até "+fmtD(o.pfim):""} · tabela ${brl(o.ptab)}</div>`:""}
 ${p.c==="Carga"||p.c==="Passeio"||(p.l.length>1&&p.c!=="Serviços")?`<div class="row" style="margin-top:6px">${p.c==="Carga"||p.c==="Passeio"?`<input data-f="sulco" placeholder="Sulco (mm)" inputmode="decimal" value="${o.sulco}">`:""}${p.l.length>1&&p.c!=="Serviços"?`<select data-f="tier">${p.l.map((l,j)=>`<option value="${j}" ${j===o.tier?"selected":""}>${l}</option>`).join("")}</select>`:""}</div>`:""}
 <div class="row" style="margin-top:6px;align-items:center"><div class="q" style="flex:none"><button data-f="m">−</button><input data-f="qty" inputmode="numeric" value="${o.qty}"><button data-f="a">+</button></div><input data-f="price" inputmode="decimal" value="${o.price.toFixed(2).replace(".",",")}"><span class="sub" data-s="${o.id}" style="flex:none"></span></div></div>`}).join(""):'<div class="hint">Nenhum item ainda. Busque acima e toque no item.</div>';
 $("cli").value=Q.cli;$("ct").value=Q.ct||"";selCli();$("dt").value=Q.dt;$("val").value=Q.val;$("pag").value=Q.pt[Q.cur];$("par").value=PAR();$("ent").value=Q.ent;sums();
}

// eventos
$("chips").onclick=e=>{const c=e.target.dataset.c;if(c){cat=c;chips();busca()}};
$("q").oninput=busca;
$("res").onclick=e=>{const d=e.target.closest("[data-i]");if(d)add(+d.dataset.i)};
$("tabs").onclick=e=>{const t=e.target.dataset.t;if(t===undefined)return;if(t==="+"){Q.par.push(PAR());Q.pt.push(Q.pt[Q.cur]);Q.opts.push([]);Q.cur=Q.opts.length-1}else Q.cur=+t;draw()};
for(const [id,k] of [["cli","cli"],["ct","ct"],["dt","dt"],["val","val"],["ent","ent"]])$(id).oninput=e=>{Q[k]=e.target.value;store.set("cot_draft",Q)};
$("pag").oninput=e=>{Q.pt[Q.cur]=e.target.value;store.set("cot_draft",Q)};
$("par").onchange=e=>{Q.par[Q.cur]=+e.target.value;Q.pt[Q.cur]=autoT(PAR());let m=0;
 for(const o of items()){if(o.man){m++;continue}const r=pick(P(o),PAR());setP(o,P(o),r.i)}
 draw();if(m)say(m+(m>1?" itens com preço editado à mão não foram recalculados":" item com preço editado à mão não foi recalculado"))};
const line=e=>{const r=e.target.closest("[data-id]");return r&&items().find(o=>o.id==r.dataset.id)};
$("items").oninput=e=>{const o=line(e),f=e.target.dataset.f;if(!o)return;
 if(f==="name")o.name=e.target.value;else if(f==="sulco")o.sulco=e.target.value;
 else if(f==="qty")o.qty=Math.max(0,parseInt(e.target.value)||0);else if(f==="price"){o.price=num(e.target.value);o.man=1;delete o.promo;delete o.pfim}sums()};
$("items").onchange=e=>{const o=line(e);if(o&&e.target.dataset.f==="tier"){setP(o,P(o),+e.target.value);o.man=1;draw()}};
$("items").onclick=e=>{const o=line(e),f=e.target.dataset.f;if(!o)return;
 if(f==="rm"){Q.opts[Q.cur]=items().filter(x=>x!==o);draw()}
 else if(f==="m"||f==="a"){o.qty=Math.max(0,o.qty+(f==="a"?1:-1));e.target.parentNode.querySelector("input").value=o.qty;sums()}};
const sig=q=>JSON.stringify([q.tp||"pneus",q.cls,q.cli,q.ct||"",q.dt,q.val,q.ent,q.par,q.pt,q.opts.map(o=>o.map(x=>[x.ik,x.name,x.sulco,x.qty,x.tier,x.price]))]);
const vazia=q=>!q.cli&&q.opts.every(o=>!o.length);
function guarda(){if(vazia(Q))return"vazia";const h=store.get("cot_hist")||[],s=sig(Q);
 if(h.some(x=>sig(fix(x))===s))return"igual";
 const c=JSON.parse(JSON.stringify(Q));c.saved=Date.now();const i=h.findIndex(x=>x.id===Q.id);
 c.tabs=APX.tabsRef();if(i<0){h.unshift(c);store.set("cot_hist",h);APX.mark(c.id);return"nova"}h[i]=c;store.set("cot_hist",h);APX.mark(c.id);return"atualizada"}
const MSG={vazia:"Nada para salvar: a cotação está vazia",igual:"Já está no histórico, não salvei outra",nova:"Cotação salva no histórico",atualizada:"Cotação atualizada no histórico"};
$("bNew").onclick=()=>{const r=guarda();Q=blank(Q.tp);draw();window.scrollTo({top:0});say(r==="nova"||r==="atualizada"?"Cotação anterior salva no histórico. Nova cotação em branco":r==="igual"?"Cotação anterior já estava no histórico. Nova cotação em branco":"Nova cotação em branco")};
$("bSave").onclick=()=>{say(MSG[guarda()]);selCli();badge()};
$("cliBtn").onclick=e=>{e.preventDefault();const l=$("cliList");l.hidden=!l.hidden;if(!l.hidden)selCli()};
$("cliList").onclick=e=>{const d=e.target.closest("[data-i]"),c=d&&CL[+d.dataset.i];if(c){Q.cli=c.nome;Q.ct=c.contato||"";$("cli").value=Q.cli;$("ct").value=Q.ct;store.set("cot_draft",Q);$("cliList").hidden=true}};
$("cli").addEventListener("input",()=>{$("cliList").hidden=true});
document.addEventListener("click",e=>{if(!e.target.closest(".cb"))$("cliList").hidden=true});
let view="home";
const nav=()=>{const h=!$("pHist").hidden,c=!$("pCfg").hidden,a=!$("pAdm").hidden,pm=!$("pPromo").hidden,av=!$("pAvi").hidden,ok=!h&&!c&&!a&&!pm&&!av;
 $("tCot").classList.toggle("on",ok);$("bAvi").classList.toggle("on",av);$("bHist").classList.toggle("on",h);$("bAdm").classList.toggle("on",a);$("bPromo").classList.toggle("on",pm);
 $("home").hidden=!(ok&&view==="home");$("hsBox").hidden=$("home").hidden;const e=ok&&view==="edit";$("ed").hidden=!e;$("bNew").hidden=!e;$("bar").hidden=!e;
 if(!$("home").hidden)homeDraw()};
function homeDraw(){const cur=t=>(Q.tp||"pneus")===t&&!vazia(Q)?"Em andamento: "+esc(Q.cli||"sem cliente")+" · "+brl(Q.opts[Q.cur].reduce((a,o)=>a+o.qty*o.price,0)):TP[t].sub;
 const B=(t,c)=>`<button class="tl ${c}" data-t="${t}">${TP[t].nome}<small>${cur(t)}</small></button>`;
 $("home").innerHTML=B("pneus","")+B("rec","")+B("srv","")+B("acc","")+'<div class="hint">'+esc(APX.tabHint())+'</div>'}
function consulta(){const q=$("hs").value.trim().toLowerCase().split(/\s+/).filter(Boolean).map(norm),e=$("hsRes");
 if(!q.length){e.innerHTML="";return}
 const out=[];for(let i=0;i<CAT.length&&out.length<40;i++){const p=CAT[i];if(p.k==="SRV")continue;if(q.every(x=>IDX[i].includes(x)))out.push(p)}
 e.innerHTML=out.length?out.map(p=>{const pr=p.c==="Serviços"?null:APX.promo(p.ik,p.l[0],p.p[0]);
  const cols=p.p.map((v,i)=>v==null?"":esc(p.l[i]||"")+": <b>"+brl(v)+"</b>").filter(Boolean).join(" · ");
  return `<div class="df"><span>${esc(limpa(p))}</span><small>${esc(p.g)}${p.sc?" · sucata "+brl(p.sc):""}</small><small>${cols}</small>${pr?`<div class="pmb">🏷 Promoção: ${brl(pr.v)}${pr.fim?" · até "+pr.fim.split("-").reverse().join("/"):""}</div>`:""}</div>`}).join("")+(out.length===40?'<div class="hint">Mostrando os 40 primeiros. Digite mais para afinar.</div>':""):'<div class="hint">Nada encontrado.</div>'}
$("hs").oninput=consulta;
function setTipo(t){if((Q.tp||"pneus")!==t){guarda();Q=blank(t)}cat=TP[t].def;$("q").value="";view="edit";draw();window.scrollTo({top:0})}
$("home").onclick=e=>{const b=e.target.closest("[data-t]");if(b)setTipo(b.dataset.t)};
$("cls").onchange=e=>{Q.cls=+e.target.value;let k=0;for(const o of items()){const p=P(o);if(p.c!=="Serviços"||p.k==="SRV"||o.man)continue;if(p.p[Q.cls]!=null){o.tier=Q.cls;o.price=p.p[Q.cls];o.ptab=o.price}else k++}draw();say(k?k+" serviço(s) não constam na tabela para esta categoria":"Categoria alterada")};
$("bExp").onclick=()=>{const d=new Date();save("Backup_Cotacao_"+d.toISOString().slice(0,10)+".json",new TextEncoder().encode(JSON.stringify({app:"ap-cotacao",v:1,quando:d.toISOString(),vendedor:SELLER,hist:store.get("cot_hist")||[]})).buffer)};
$("bImp").onclick=()=>$("fImp").click();
$("fImp").onchange=e=>{const f=e.target.files[0];e.target.value="";if(!f)return;const r=new FileReader();
 r.onload=()=>{try{const j=JSON.parse(r.result);if(!j||!Array.isArray(j.hist))throw 0;
  const h=store.get("cot_hist")||[],ids=new Set(h.map(x=>x.id)),sg=new Set(h.map(x=>sig(fix(x))));let n=0;
  for(const x of j.hist){if(!x||!Array.isArray(x.opts))continue;const q=fix(x);APX.legacyQ(q);if(ids.has(q.id)||sg.has(sig(q)))continue;q.saved=q.saved||Date.now();h.push(q);ids.add(q.id);sg.add(sig(q));APX.mark(q.id,1);n++}
  h.sort((a,b)=>(b.saved||0)-(a.saved||0));store.set("cot_hist",h);
  if(j.vendedor&&j.vendedor.nome){Object.assign(SELLER,j.vendedor);APX.saveProf();$("sNome").value=SELLER.nome;$("sCargo").value=SELLER.cargo;$("sTel").value=SELLER.tel}
  APX.run();badge();selCli();say(n+" cotação(ões) importada(s)")}catch(_){say("Arquivo de backup inválido")}};r.readAsText(f)};
$("bLivre").onclick=()=>{Q.opts[Q.cur].push({id:nid++,ik:"SRV",name:"",sulco:"",qty:1,tier:0,price:0,man:1,ptab:null});draw()};
const badge=()=>{const n=(store.get("cot_hist")||[]).length;$("nHist").textContent=n||""};
$("bHist").onclick=()=>{const p=$("pHist");p.hidden=!p.hidden;if(!p.hidden){$("pAvi").hidden=true;$("pCfg").hidden=true;$("pAdm").hidden=true;$("pPromo").hidden=true;hist()}nav()};
$("tCot").onclick=()=>{view="home";$("pAvi").hidden=true;$("pHist").hidden=true;$("pCfg").hidden=true;$("pAdm").hidden=true;$("pPromo").hidden=true;nav()};
$("bCfg").onclick=()=>{const c=$("pCfg");c.hidden=!c.hidden;if(!c.hidden){$("pAvi").hidden=true;$("pHist").hidden=true;$("pAdm").hidden=true;$("pPromo").hidden=true;$("sNome").value=SELLER.nome;$("sCargo").value=SELLER.cargo;$("sTel").value=SELLER.tel}nav()};
$("sSave").onclick=()=>{SELLER.nome=$("sNome").value.trim()||SELLER.nome;SELLER.cargo=$("sCargo").value.trim()||SELLER.cargo;SELLER.tel=$("sTel").value.trim()||SELLER.tel;APX.saveProf();$("pCfg").hidden=true;nav();say("Dados do vendedor salvos")};
let hfT="";
function hist(){badge();const all=store.get("cot_hist")||[],qq=nkey($("hq").value);
 $("hf").innerHTML=[["","Todas"],...Object.entries(TP).map(([k,v])=>[k,v.nome])].map(([k,n])=>`<button class="${k===hfT?"on":""}" data-f="${k}">${n}</button>`).join("");
 const L=all.map((x,i)=>({x,i})).filter(({x})=>(!hfT||(x.tp||"pneus")===hfT)&&(!qq||nkey((x.cli||"")+" "+(x.ct||"")).includes(qq)));
 $("hList").innerHTML=L.length?`<div class="hint">${L.length} de ${all.length} cotações</div>`+L.map(({x,i})=>{let t=0,q=0;for(const o of x.opts[0]||[]){t+=o.qty*o.price;if(P(o)&&((x.tp||"pneus")!=="pneus"||P(o).c!=="Acessórios"))q+=o.qty}
 return `<div class="hl"><div class="hh"><b>${esc(x.cli||"(sem cliente)")}</b><span class="pl">${TP[x.tp||"pneus"].nome} · ${q}</span></div><small>${x.ct?esc(x.ct)+" · ":""}${fmtD(x.dt)}${x.opts.length>1?" · "+x.opts.length+" opções":""}</small><div class="hf"><strong>${brl(t)}</strong></div><div class="row" style="margin-top:8px"><button data-v="${i}">Ver</button><button data-o="${i}">Abrir</button><button data-c="${i}">Duplicar</button><button class="rm" data-d="${i}">✕</button></div></div>`}).join(""):'<div class="hint">'+(all.length?"Nenhuma cotação encontrada.":"Nenhuma cotação salva neste aparelho.")+'</div>'}
function base(x){const q=fix(JSON.parse(JSON.stringify(x)));q.id=Date.now();delete q.saved;q.dt=today();q.cur=0;let up=0,keep=0;
 q.opts.forEach(o=>o.forEach(it=>{const p=P(it);if(!p||p.k==="SRV")return;if(it.man){keep++;return}
  let v,t=it.tier;if(p.c==="Serviços")v=p.p[q.cls];else if(q.tp==="pneus"){const r=pick(p,q.par[0]);v=p.p[r.i];t=r.i}else v=p.p[Math.min(it.tier,p.p.length-1)];
  if(v==null)return;const pr=p.c==="Serviços"?null:APX.promo(p.ik,p.l[Math.min(t,p.l.length-1)],v),nv=pr?pr.v:v;if(nv!==it.price)up++;it.price=nv;it.ptab=v;it.tier=t;if(pr){it.promo=pr.id;it.pfim=pr.fim}else{delete it.promo;delete it.pfim}}));
 Q=q;view="edit";$("pHist").hidden=true;draw();say("Cópia criada: "+up+" preço(s) atualizado(s) pela tabela, "+keep+" mantido(s) (editados à mão). Confira e salve")}
$("hf").onclick=e=>{const f=e.target.dataset.f;if(f!==undefined){hfT=f;hist()}};
$("hq").oninput=hist;
$("hList").onclick=e=>{const h=store.get("cot_hist")||[];const o=e.target.dataset.o,d=e.target.dataset.d,c=e.target.dataset.c;
 const v=e.target.dataset.v;if(v!==undefined){Q=fix(h[+v]);Q.cur=0;view="edit";$("pHist").hidden=true;draw();preview()}else if(o!==undefined){Q=fix(h[+o]);Q.cur=0;view="edit";$("pHist").hidden=true;draw()}else if(c!==undefined){base(h[+c])}else if(d!==undefined){const dq=h.splice(+d,1)[0];store.set("cot_hist",h);if(dq)APX.mark(dq.id);hist()}};

// visualização (mesmo conteúdo e layout do PDF)
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
// clientes frequentes: histórico + guardados + semente; ordem pelos mais usados
const SEED=[];
const nkey=x=>(x||"").normalize("NFD").replace(/[̀-ͯ]/g,"").trim().toLowerCase();
function clientes(){
 const m=new Map(),src=[...(store.get("cot_hist")||[]).filter(x=>x.cli).map(x=>({nome:x.cli,contato:x.ct,t:x.saved||0,n:1})),...SEED.map(c=>({...c,t:-1,n:0}))].sort((a,b)=>b.t-a.t);
 for(const x of src){const k=nkey(x.nome);if(!k)continue;const c=m.get(k)||{nome:x.nome.trim(),contato:"",n:0};c.n+=x.n;if(x.contato&&!c.contato)c.contato=x.contato.trim();m.set(k,c)}
 return[...m.values()].sort((a,b)=>b.n-a.n||a.nome.localeCompare(b.nome,"pt"))}
let CL=[];
function selCli(){CL=clientes();$("cliList").innerHTML=CL.length?CL.map((c,i)=>`<div data-i="${i}">${esc(c.nome)}</div>`).join(""):'<div style="color:var(--mu)">Nenhum cliente salvo ainda</div>'}
function preview(){
 const L=items(),{t,q}=totals(),w=notes();
 if(!Q.cli.trim())w.push("Falta o nome do cliente.");
 if(L.some(o=>!o.qty||!o.price))w.push("Há item com quantidade ou preço zerado.");
 $("pvWarn").hidden=!w.length;$("pvWarn").textContent="⚠ "+w.join(" ");
 $("pvTabs").innerHTML=Q.opts.length>1?Q.opts.map((_,i)=>`<button class="${i===Q.cur?"on":""}" data-t="${i}">Opção ${i+1}</button>`).join(""):"";
 $("paper").innerHTML=`<span class="pt"><b>ALTA PERFORMANCE RECAUCHUTADORA</b></span><div class="ps">${tp().tit}${Q.opts.length>1?" · OPÇÃO "+(Q.cur+1):""}</div>
  <div class="ig"><span><b>Cliente:</b> ${esc(Q.cli||"—")}</span>${Q.ct&&Q.ct.trim()?`<span><b>Contato:</b> ${esc(Q.ct)}</span>`:""}<span><b>Data da cotação:</b> ${fmtD(Q.dt)}</span>${Q.tp==="srv"?`<span><b>Categoria do veículo:</b> ${CLS[Q.cls]}</span>`:""}</div>
 <h4>Relação de produtos</h4><div style="overflow-x:auto"><table><thead><tr><th class="c">Item</th><th>Descrição</th><th class="c">Qtd.</th><th class="r">Valor unitário</th><th class="r">Total</th></tr></thead><tbody>${L.map((o,i)=>`<tr><td class="c">${i+1}</td><td>${esc(dsc(o))}</td><td class="c">${o.qty}</td><td class="r">${brl(o.price)}</td><td class="r">${brl(o.qty*o.price)}</td></tr>`).join("")}</tbody>
 <tfoot><tr><td colspan="2">TOTAL GERAL</td><td class="c">${q}</td><td class="r">${tp().un}</td><td class="r">${brl(t)}</td></tr></tfoot></table></div>
 <h4>Condições comerciais</h4>${cnd().map(([k,v])=>`<div>• <b>${k}</b> ${esc(v)}</div>`).join("")}
 <p style="margin-top:14px">Atenciosamente,<br><b>${SELLER.nome}</b><br>${SELLER.cargo} · ${SELLER.tel}</p><div class="pf">${ENDER}</div>`;
 $("pv").hidden=false;$("pv").scrollTop=0;
}
$("bPrev").onclick=preview;$("pvBack").onclick=()=>{$("pv").hidden=true};$("pvSend").onclick=()=>$("bPdf").onclick();
$("pvTabs").onclick=e=>{const t=e.target.dataset.t;if(t!==undefined){Q.cur=+t;draw();preview()}};
// exportação
const fname=ext=>"Cotacao_"+tp().nome.normalize("NFD").replace(/[^\w]/g,"")+"_"+(Q.cli||"cliente").normalize("NFD").replace(/[^\w ]/g,"").trim().replace(/\s+/g,"_")+"_"+fmtD(Q.dt).replace(/\//g,"-")+(Q.opts.length>1?"_Opcao_"+(Q.cur+1):"")+"."+ext;
const dsc=o=>o.name+(o.sulco?" (sulco "+o.sulco+" mm)":"");
async function save(name,data){const f=new File([data],name,{type:name.endsWith("pdf")?"application/pdf":name.endsWith("json")?"application/json":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
 try{if(/\.(pdf|xlsx)$/.test(name)&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return}}catch(e){if(e&&e.name==="AbortError")return}
 const u=URL.createObjectURL(f),l=document.createElement("a");l.href=u;l.download=name;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
$("bPdf").onclick=()=>{
 const{jsPDF}=window.jspdf,d=new jsPDF({unit:"mm",format:"a4"}),W=210,L=items(),{t,q}=totals(),AZ=[31,78,121];
 d.setFont("helvetica","bold").setFontSize(18).setTextColor(...AZ).text("ALTA PERFORMANCE RECAUCHUTADORA",18,22);
 d.setFontSize(11).setTextColor(89,89,89).text(tp().tit+(Q.opts.length>1?" · OPÇÃO "+(Q.cur+1):""),18,28);
 d.setDrawColor(...AZ).setLineWidth(.6).line(18,31,W-18,31);
 const kv=(k,v,y)=>{d.setFontSize(10.5).setTextColor(0).setFont("helvetica","bold").text(k,18,y);const w=d.getTextWidth(k);d.setFont("helvetica","normal").text(v,18+w+1.5,y)};
 let hy=39;kv("Cliente:",Q.cli||"—",hy);if(Q.ct&&Q.ct.trim()){hy+=6;kv("Contato:",Q.ct,hy)}hy+=6;kv("Data da cotação:",fmtD(Q.dt),hy);if(Q.tp==="srv"){hy+=6;kv("Categoria do veículo:",CLS[Q.cls],hy)}
 d.setFont("helvetica","bold").setFontSize(12).setTextColor(...AZ).text("Relação de produtos",18,hy+11);
 const wh=[255,255,255],tc={fillColor:AZ,textColor:wh,fontStyle:"bold",fontSize:11};
 d.autoTable({startY:hy+15,theme:"grid",margin:{left:18,right:18,bottom:24},
  head:[["Item","Descrição","Qtd.","Valor unitário","Total"]],
  body:[...L.map((o,i)=>[i+1,dsc(o),o.qty,brl(o.price),brl(o.qty*o.price)]),[{content:"TOTAL GERAL",colSpan:2,styles:tc},{content:String(q),styles:{...tc,halign:"center"}},{content:tp().un,styles:{...tc,fontSize:9.5,halign:"right"}},{content:brl(t),styles:{...tc,halign:"right"}}]],
  styles:{fontSize:9.5,cellPadding:2.4,lineColor:[155,175,199],lineWidth:.2,textColor:[27,36,48],valign:"middle"},
  headStyles:{fillColor:AZ,textColor:wh,fontStyle:"bold"},alternateRowStyles:{fillColor:[220,230,241]},
  columnStyles:{0:{cellWidth:12,halign:"center"},2:{cellWidth:16,halign:"center"},3:{cellWidth:32,halign:"right"},4:{cellWidth:34,halign:"right"}},
  didParseCell:h=>{if(h.section==="head"){h.cell.styles.halign=[0,2].includes(h.column.index)?"center":h.column.index>2?"right":"left"}},
  didDrawPage:()=>{const n=d.internal.getNumberOfPages();d.setFont("helvetica","normal").setFontSize(8).setTextColor(127,127,127).text(ENDER,W/2,284,{align:"center"}).text("Página "+d.internal.getCurrentPageInfo().pageNumber,W/2,289,{align:"center"})}});
 let y=d.lastAutoTable.finalY+12;if(y>297-24-48){d.addPage();y=24}
 d.setFont("helvetica","bold").setFontSize(12).setTextColor(...AZ).text("Condições comerciais",18,y);y+=7;
 for(const[k,v]of cnd()){d.setFontSize(10).setTextColor(0).setFont("helvetica","bold").text("• "+k,18,y);d.setFont("helvetica","normal").text(v,18+d.getTextWidth("• "+k)+2,y);y+=6}
 y+=7;d.setFont("helvetica","normal").text("Atenciosamente,",18,y);d.setFont("helvetica","bold").text(SELLER.nome,18,y+6);d.setFont("helvetica","normal").text(SELLER.cargo+" · "+SELLER.tel,18,y+12);
 sendPdf(d.output("arraybuffer"));
};
$("bXls").onclick=()=>{
 const L=items(),hd=[["ALTA PERFORMANCE RECAUCHUTADORA"],[tp().tit+(Q.opts.length>1?" · OPÇÃO "+(Q.cur+1):"")],["Cliente: "+(Q.cli||"—")],...(Q.ct&&Q.ct.trim()?[["Contato: "+Q.ct]]:[]),["Data da cotação: "+fmtD(Q.dt)],...(Q.tp==="srv"?[["Categoria do veículo: "+CLS[Q.cls]]]:[])],h=hd.length+1,aoa=[...hd,["Item","Descrição","Qtd.","Valor unitário","Total"],
  ...L.map((o,i)=>[i+1,dsc(o),o.qty,o.price,o.qty*o.price])],ws=XLSX.utils.aoa_to_sheet(aoa),f='"R$" #,##0.00',e=h+L.length;
 L.forEach((o,i)=>{const r=h+1+i;ws["D"+r].z=f;ws["E"+r]={t:"n",f:`C${r}*D${r}`,v:o.qty*o.price,z:f}});
 ws["A"+(e+1)]={t:"s",v:"TOTAL GERAL"};ws["C"+(e+1)]={t:"n",f:`SUM(C${h+1}:C${e})`,v:totals().q+0};ws["E"+(e+1)]={t:"n",f:`SUM(E${h+1}:E${e})`,v:totals().t,z:f};
 ws["A"+(e+3)]={t:"s",v:"Condições: "+cnd().map(([k,v])=>k+" "+v).join(" ")};
 ws["!ref"]="A1:E"+(e+3);ws["!cols"]=[{wch:6},{wch:56},{wch:8},{wch:16},{wch:18}];
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,Q.opts.length>1?"Opção "+(Q.cur+1):"Cotação");
 save(fname("xlsx"),XLSX.write(wb,{bookType:"xlsx",type:"array"}));
};

// início
function startUI(){window.DL=true;window.UIREADY=true;const dr=store.get("cot_draft");if(dr&&dr.opts)Q=fix(dr);nid=Date.now()%1e6;view="home";$("cfgImg").checked=store.get("ap_img")!==false;chips();busca();draw()}
APX.boot();
