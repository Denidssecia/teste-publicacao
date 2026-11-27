// lib.js — login, tabelas centrais, sincronização e tela de administração
const APX=(function(){
const A=AP,CFG=window.AP_CFG||{};
const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
let SESS=LS.get("ap_sess"),PROF=LS.get("ap_prof"),ENTERED=false,UP=null,busy=false,again=false,state="ok",lastErr="",waitT=null;
const dmy=s=>s?String(s).slice(0,10).split("-").reverse().join("/"):"";
const dirty=()=>LS.get("ap_dirty")||[];

// ---------- rede ----------
const hdr=t=>({apikey:CFG.key,"Content-Type":"application/json",Authorization:"Bearer "+(t||CFG.key)});
async function http(url,o){let r;
 try{r=await fetch(url,o)}catch(e){const x=new Error("Sem internet");x.net=true;throw x}
 const t=await r.text();let j=null;try{j=t?JSON.parse(t):null}catch(e){}
 if(!r.ok){const x=new Error((j&&(j.msg||j.message||j.error_description||j.error))||("Erro "+r.status));x.status=r.status;throw x}
 return j}
function saveSess(j){SESS={access_token:j.access_token,refresh_token:j.refresh_token,expires_at:j.expires_at||Math.floor(Date.now()/1000)+(j.expires_in||3600),uid:(j.user&&j.user.id)||(SESS&&SESS.uid),email:(j.user&&j.user.email)||(SESS&&SESS.email)};LS.set("ap_sess",SESS)}
async function refresh(){const j=await http(CFG.url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:hdr(),body:JSON.stringify({refresh_token:SESS.refresh_token})});saveSess(j)}
async function token(){
 if(!SESS)throw Object.assign(new Error("Sem sessão"),{status:401});
 if(SESS.expires_at-60>Date.now()/1000)return SESS.access_token;
 try{await refresh()}catch(e){if(e.net)return SESS.access_token;if(e.status>=400&&e.status<500)authLost();throw e}
 return SESS.access_token}
async function rest(path,o={}){
 const run=t=>http(CFG.url+"/rest/v1/"+path,{method:o.method||"GET",headers:{...hdr(t),...(o.prefer?{Prefer:o.prefer}:{})},body:o.body!==undefined?JSON.stringify(o.body):undefined});
 const tok=await token();
 try{return await run(tok)}catch(e){
  if(e.status===401&&SESS){try{await refresh()}catch(x){if(!x.net)authLost();throw x}return run(SESS.access_token)}
  throw e}}
const errTxt=e=>{const m=e&&e.message||"";
 if(e&&e.net)return "Sem conexão com a internet. Conecte para entrar.";
 if(/Invalid login/i.test(m))return "E-mail ou senha incorretos.";
 if(/already (been )?registered|already exists/i.test(m))return "Este e-mail já tem cadastro (pode ser do app de coleta). Use \"Entrar\" com a mesma senha.";
 if(/Password should|at least 6/i.test(m))return "A senha precisa ter pelo menos 6 caracteres.";
 if(/rate limit|too many/i.test(m))return "Muitas tentativas. Aguarde um pouco e tente de novo.";
 if(/not confirmed/i.test(m))return "Confirme seu e-mail antes de entrar.";
 if(/valid email|invalid.*email/i.test(m))return "E-mail inválido.";
 return m||"Erro inesperado."};

// ---------- telas de acesso ----------
const amsg=t=>{const e=$("auMsg");e.hidden=!t;e.textContent=t||""};
function authView(v){
 document.body.classList.add("lock");$("auth").hidden=false;
 const m={login:"auLogin",cad:"auCad",wait:"auWait",block:"auBlock",cfg:"auCfg"};
 Object.values(m).forEach(id=>$(id).hidden=id!==m[v]);amsg("");
 clearInterval(waitT);if(v==="wait"||v==="block")waitT=setInterval(()=>afterAuth(true),20000)}
async function loadProf(){const r=await rest("profiles?id=eq."+SESS.uid+"&select=*");PROF=(r&&r[0])||null;LS.set("ap_prof",PROF);return PROF}
async function afterAuth(silent){
 try{await loadProf();if(!PROF){await rest("rpc/cot_entrar",{method:"POST",body:{}});await loadProf()}}catch(e){
  if(e.net&&PROF&&PROF.id===SESS.uid){gate();return}
  if(!silent)amsg(errTxt(e));return}
 gate()}
function gate(){
 if(!PROF){authView("login");amsg("Perfil não encontrado. Fale com o administrador.");return}
 if(PROF.status==="ativo"){clearInterval(waitT);enter();return}
 if(PROF.status==="bloqueado")wipeLocal();
 ENTERED=false;authView(PROF.status==="bloqueado"?"block":"wait")}
function wipeLocal(){["cot_hist","cot_draft","ap_dirty","ap_pull","ap_tab","ap_owner","ap_promo","ap_ban","ap_avi","ap_avi_lido","ap_visto"].forEach(LS.del)}
function authLost(){LS.del("ap_sess");LS.del("ap_prof");SESS=null;PROF=null;ENTERED=false;authView("login");amsg("Sessão expirada. Entre de novo.")}
async function logout(){
 if(dirty().length){try{await run(true)}catch(e){}
  if(dirty().length&&!await ask("Há cotações que ainda não foram enviadas (sem internet). Se sair agora, elas serão perdidas deste aparelho. Sair mesmo assim?"))return}
 ["ap_sess","ap_prof","ap_prof_dirty"].forEach(LS.del);wipeLocal();location.reload()}
function bindAuth(){
 const busyA=b=>["auEntrar","auCriar"].forEach(id=>$(id).disabled=b);
 $("auEntrar").onclick=async()=>{const e=$("auEmail").value.trim(),s=$("auSenha").value;if(!e||!s)return amsg("Informe e-mail e senha.");
  busyA(1);amsg("");
  try{const j=await http(CFG.url+"/auth/v1/token?grant_type=password",{method:"POST",headers:hdr(),body:JSON.stringify({email:e,password:s})});saveSess(j);await afterAuth()}catch(x){amsg(errTxt(x))}busyA(0)};
 $("auSenha").onkeydown=e=>{if(e.key==="Enter")$("auEntrar").click()};
 $("auVaiCad").onclick=()=>authView("cad");$("auVolta").onclick=()=>authView("login");
 $("auCriar").onclick=async()=>{const d={nome:$("cdNome").value.trim(),cargo:$("cdCargo").value.trim()||"Vendedor Externo",tel:$("cdTel").value.trim(),email:$("cdEmail").value.trim(),senha:$("cdSenha").value};
  if(!d.nome)return amsg("Informe seu nome.");if(!d.email)return amsg("Informe o e-mail.");if(d.senha.length<6)return amsg("A senha precisa ter pelo menos 6 caracteres.");
  busyA(1);amsg("");
  try{const j=await http(CFG.url+"/auth/v1/signup",{method:"POST",headers:hdr(),body:JSON.stringify({email:d.email,password:d.senha,data:{app:"cotacao",nome:d.nome,cargo:d.cargo,tel:d.tel}})});
   if(j&&j.access_token){saveSess(j);await afterAuth()}else{authView("login");amsg("Conta criada. Confirme o e-mail que você recebeu e depois entre.")}}
  catch(x){amsg(errTxt(x))}busyA(0)};
 $("auVer").onclick=()=>afterAuth();$("auVer2").onclick=()=>afterAuth();
 $("auSair").onclick=logout;$("auSair2").onclick=logout;$("bSair").onclick=logout}

// ---------- tabelas de preço (centrais, com cópia no aparelho) ----------
const SRVITEM={ik:"SRV",c:"Serviços",g:"Serviço livre",k:"SRV",n:"Serviço",p:[0],l:["Valor"]};
function applyTabs(T){
 const ord=A.FONTES.map(f=>f.id);T=[...T].sort((a,b)=>ord.indexOf(a.fonte)-ord.indexOf(b.fonte));
 const out=[];T.forEach(t=>(t.itens||[]).forEach(p=>out.push(p)));out.push(SRVITEM);
 CAT=out;IDX=CAT.map(p=>norm(p.n+" "+p.k+" "+p.g));SRV0=CAT.length-1;IKMAP={};CAT.forEach((p,i)=>{IKMAP[p.ik]=i});TABS=T;
 paintTop();if(window.UIREADY){chips();busca();sums();nav()}}
async function tabRefresh(){
 const meta=await rest("price_tables?ativa=eq.true&select=id,fonte,ref,vigencia,publicada_em,arquivo");
 if(!Array.isArray(meta)||!meta.length)return;
 const old=LS.get("ap_tab")||[],have=new Map(old.map(t=>[t.id,t])),out=[];
 for(const m of meta){let t=have.get(m.id);
  if(!t){const r=await rest("price_tables?id=eq."+m.id+"&select=itens");t={...m,itens:r[0].itens}}else t={...t,...m};out.push(t)}
 const key=L=>JSON.stringify(L.map(t=>t.id).sort()),changed=key(out)!==key(TABS.length?TABS:old);
 LS.set("ap_tab",out);if(changed||!TABS.length)applyTabs(out)}
function paintTop(){const e=$("tbl");if(!e)return;
 const P=TABS.filter(t=>t.fonte!=="recapagem"&&t.fonte!=="servicos");
 if(!TABS.length){e.textContent="Sem tabela de preços";return}
 const refs=[...new Set(P.map(t=>t.ref))],dt=TABS.map(t=>String(t.vigencia).slice(0,10)).sort().pop();
 e.textContent="Tabela "+refs.join(" / ")+" · de "+dmy(dt)}
function tabHint(){if(!TABS.length)return "Sem tabela de preços neste aparelho. Conecte à internet para baixar.";
 return "Tabelas: "+TABS.map(t=>{const F=A.FONTES.find(f=>f.id===t.fonte);return (F?F.curto:t.fonte)+" "+t.ref}).join(" · ")}
const tabsRef=()=>Object.fromEntries(TABS.map(t=>[t.fonte,t.ref]));

// ---------- cotações antigas (guardavam o item pela posição na tabela) ----------
function legacyQ(q){(q.opts||[]).forEach(L=>L.forEach(it=>{if(it.ik!==undefined)return;
 const ik=typeof it.k==="number"?OLDK[it.k]:null,i=ik!=null?IKMAP[ik]:undefined,p=i!==undefined?CAT[i]:null;
 if(p&&p.k!=="SRV"&&limpa(p)===it.name){it.ik=ik;const v=p.c==="Serviços"?p.p[q.cls]:p.p[Math.min(it.tier,p.p.length-1)];it.ptab=v==null?null:v}
 else{it.ik="SRV";it.man=1;it.ptab=null}
 delete it.k}))}
const lackIk=q=>(q.opts||[]).some(L=>L.some(it=>it.ik===undefined));
function legacyAll(){const h=LS.get("cot_hist")||[];let c=0;h.forEach(q=>{if(lackIk(q)){legacyQ(q);c++}});if(c)LS.set("cot_hist",h);
 const d=LS.get("cot_draft");if(d&&d.opts&&lackIk(d)){legacyQ(d);LS.set("cot_draft",d)}}

// ---------- sincronização das cotações ----------
const totQ=q=>((q.opts&&q.opts[0])||[]).reduce((a,o)=>a+(+o.qty||0)*(+o.price||0),0);
function clean(q){const c=JSON.parse(JSON.stringify(q));(c.opts||[]).forEach(L=>L.forEach(it=>{delete it.k}));return c}
function mark(id,quiet){const d=dirty();if(!d.includes(id)){d.push(id);LS.set("ap_dirty",d)}if(quiet)paint();else run()}
async function push(){
 const d=dirty();if(!d.length)return;
 const h=LS.get("cot_hist")||[],sent={};
 const rows=d.map(id=>{const q=h.find(x=>x.id===id);
  if(q){sent[id]=q.saved||0;return{vendedor_id:SESS.uid,qid:id,dados:clean(q),cliente:q.cli||"",tp:q.tp||"pneus",dt:q.dt||null,total:totQ(q),saved:q.saved||0,apagada:false}}
  sent[id]=-1;return{vendedor_id:SESS.uid,qid:id,dados:{},cliente:"",tp:"pneus",dt:null,total:0,saved:Date.now(),apagada:true}});
 for(let i=0;i<rows.length;i+=100)await rest("cotacoes?on_conflict=vendedor_id,qid",{method:"POST",body:rows.slice(i,i+100),prefer:"resolution=merge-duplicates,return=minimal"});
 const h2=LS.get("cot_hist")||[];
 LS.set("ap_dirty",dirty().filter(id=>{const q=h2.find(x=>x.id===id);return q?(q.saved||0)!==sent[id]:false}))}
async function pull(){
 let since=LS.get("ap_pull")||"1970-01-01T00:00:00+00:00",n=0;
 for(let g=0;g<50;g++){
  const rows=await rest("cotacoes?atualizado_em=gte."+encodeURIComponent(since)+"&select=qid,dados,saved,apagada,atualizado_em&order=atualizado_em.asc&limit=1000");
  if(!rows||!rows.length)break;
  const h=LS.get("cot_hist")||[],dr=dirty();let last=since;
  for(const r of rows){last=r.atualizado_em;
   const i=h.findIndex(x=>x.id===r.qid),loc=i>=0?h[i]:null;
   if(loc&&dr.includes(r.qid)&&(loc.saved||0)>=r.saved)continue;
   if(r.apagada){if(i>=0){h.splice(i,1);n++}continue}
   if(loc&&(loc.saved||0)>=r.saved)continue;
   const q=fix(r.dados);q.id=r.qid;q.saved=r.saved;q.cur=0;if(i>=0)h[i]=q;else h.push(q);n++}
  h.sort((a,b)=>(b.saved||0)-(a.saved||0));LS.set("cot_hist",h);
  const same=last===since;since=last;LS.set("ap_pull",since);
  if(rows.length<1000||same)break}
 if(n){badge();selCli();if(!$("pHist").hidden)hist()}
 return n}
async function pushProf(){if(!LS.get("ap_prof_dirty"))return;
 await rest("profiles?id=eq."+SESS.uid,{method:"PATCH",body:{nome:SELLER.nome,cargo:SELLER.cargo,tel:SELLER.tel},prefer:"return=minimal"});LS.del("ap_prof_dirty")}
async function saveProf(){
 if(!PROF)return;Object.assign(PROF,{nome:SELLER.nome,cargo:SELLER.cargo,tel:SELLER.tel});LS.set("ap_prof",PROF);LS.set("ap_prof_dirty",1);
 try{await pushProf()}catch(e){if(!e.net)say("Não consegui salvar no servidor: "+e.message)}}
async function run(force){
 if(!SESS||!PROF||PROF.status!=="ativo"||!ENTERED)return;
 if(busy){again=true;return}busy=true;paint();
 try{
  await pushProf();
  const st=PROF.status;await loadProf();if(!PROF||PROF.status!==st){handleStatus();return}
  roleUI();seen();
  Object.assign(SELLER,{nome:PROF.nome||SELLER.nome,cargo:PROF.cargo||SELLER.cargo,tel:PROF.tel||SELLER.tel});
  await tabRefresh();
  await promoRefresh();
  await aviRefresh();
  if(legacyPending()){if(!TABS.length)throw Object.assign(new Error("Aguardando a tabela de preços"),{net:true});legacyAll()}
  await push();await pull();
  state="ok";lastErr="";if(PROF.role==="admin")admUsers(true)}
 catch(e){state=e.net?"off":"err";lastErr=e.message}
 finally{busy=false;paint();if(again){again=false;setTimeout(run,300)}}}
const legacyPending=()=>(LS.get("cot_hist")||[]).some(lackIk);
function handleStatus(){busy=false;if(!PROF||PROF.status==="ativo")return;gate()}
function paint(){const e=$("sync");if(!e)return;const n=dirty().length,off=!navigator.onLine||state==="off";
 e.textContent=off?"○ Sem internet"+(n?" · "+n+" p/ enviar":""):state==="err"?"! Erro ao sincronizar":(busy||n)?"● Enviando"+(n?" "+n:"")+"…":"● Sincronizado";e.title=lastErr}

// ---------- entrada no app ----------
function claimLocal(){
 const o=LS.get("ap_owner");
 if(o&&o!==SESS.uid)["cot_hist","cot_draft","ap_dirty","ap_pull"].forEach(LS.del);
 LS.set("ap_owner",SESS.uid);
 if(!o){const h=LS.get("cot_hist")||[];h.forEach(q=>{q.saved=q.saved||Date.now()});LS.set("cot_hist",h);LS.set("ap_dirty",h.map(q=>q.id))}}
async function enter(){
 if(ENTERED)return;ENTERED=true;$("auth").hidden=true;document.body.classList.remove("lock");
 Object.assign(SELLER,{nome:PROF.nome||"",cargo:PROF.cargo||"Vendedor Externo",tel:PROF.tel||""});
 claimLocal();
 const c=LS.get("ap_tab");if(c&&c.length)applyTabs(c);else applyTabs([]);
 if(!TABS.length){try{await tabRefresh()}catch(e){}}
 if(TABS.length)legacyAll();
 roleUI();
 startUI();paintTop();paint();paintPromo();run()}
function roleUI(){const adm=PROF&&PROF.role==="admin";$("bAdm").hidden=!adm;
 if(!adm&&!$("pAdm").hidden){$("pAdm").hidden=true;nav()}
 $("cfgConta").textContent=(SESS.email||"")+(PROF&&PROF.dono?" · dono":adm?" · administrador":"")}

// ---------- administração ----------
async function pdfLines(buf){
 const lib=await loadPdfJs();const doc=await lib.getDocument({data:new Uint8Array(buf)}).promise,lines=[];lines.pages=[];
 for(let n=1;n<=doc.numPages;n++){
  const pgo=await doc.getPage(n),tc=await pgo.getTextContent();
  lines.pages.push({w:pgo.getViewport({scale:1}).width,items:tc.items.filter(i=>i.str&&i.str.trim()).map(i=>({s:i.str.trim(),x:i.transform[4],y:i.transform[5]}))});
  const its=tc.items.filter(i=>i.str&&i.str.trim()).map(i=>({s:i.str.trim(),x:i.transform[4],y:i.transform[5]})).sort((a,b)=>b.y-a.y);
  const rows=[];let cur=null;
  for(const it of its){if(cur&&Math.abs(cur.y-it.y)<=3)cur.a.push(it);else{cur={y:it.y,a:[it]};rows.push(cur)}}
  for(const r of rows){r.a.sort((a,b)=>a.x-b.x);lines.push(r.a.map(i=>i.s).join(" ").replace(/\s+/g," "))}}
 return lines}
function loadPdfJs(){
 if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
 return new Promise((ok,no)=>{const s=document.createElement("script");
  s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  s.onload=()=>{pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";ok(pdfjsLib)};
  s.onerror=()=>no(new Error("não consegui carregar o leitor de PDF (precisa de internet)"));document.head.appendChild(s)})}
function admTabs(){
 $("admTabs").innerHTML=A.FONTES.map(F=>{const t=TABS.find(x=>x.fonte===F.id);
  return `<div class="hl"><div class="hh"><b>${esc(F.nome)}</b><span class="pl">${t?esc(t.ref):"—"}</span></div><small>${t?t.itens.length+" itens · tabela de "+dmy(t.vigencia)+" · publicada em "+dmy(t.publicada_em):"sem tabela"}${F.pdf?"":" · ainda sem leitura de PDF"}</small></div>`}).join("")}
function upCalc(){const F=UP.F,prev=(TABS.find(t=>t.fonte===F.id)||{}).itens||[],r=A.parseLines(UP.lines,F,prev);
 UP.r=r;UP.prev=prev;UP.d=A.diffTabs(prev,r.items);UP.v=A.validar(r.items,prev,r.warn);if(UP.ref===undefined||UP.refAuto)UP.ref=r.ref||"";UP.refAuto=!UP.refTouched}
const pc=(a,b)=>a?((b-a)/a*100):0;
function chgTxt(o,n){
 for(let i=0;i<n.p.length;i++)if(o.p[i]!==n.p[i]){const x=pc(o.p[i],n.p[i]);return `${esc(n.l[i]||"")}: ${brl(o.p[i])} → <b>${brl(n.p[i])}</b> (${x>=0?"+":""}${x.toFixed(1).replace(".",",")}%)`}
 if((o.sc||0)!==(n.sc||0))return `Sucata: ${brl(o.sc||0)} → <b>${brl(n.sc||0)}</b>`;
 return "mudou descrição ou colunas"}
function upRender(){
 upCalc();const {F,r,d,v}=UP,L=(arr,f)=>arr.slice(0,150).map(f).join("")+(arr.length>150?`<div class="hint">…e mais ${arr.length-150}</div>`:"");
 const fontes=A.FONTES.filter(f=>f.pdf);
 $("admUp").innerHTML=`<div class="card"><h2>${esc(UP.name)}</h2>
 <label>Tabela</label><select id="upF">${fontes.map(f=>`<option value="${f.id}" ${f.id===F.id?"selected":""}>${esc(f.nome)}</option>`).join("")}</select>
 <div class="row"><div><label>Referência (texto da tabela)</label><input id="upRef" value="${esc(UP.ref||"")}"></div><div><label>Data da tabela</label><input id="upDt" type="date" value="${UP.dt}"></div></div>
 <div class="hint">Lidos <b>${r.items.length}</b> itens · iguais ${d.igu} · <b>alterados ${d.alt.length}</b> · <b>novos ${d.nov.length}</b> · <b>removidos ${d.rem.length}</b></div>
 ${v.errs.map(x=>`<div class="warn" style="max-width:none;background:#f8d7da;color:#58151c">✕ ${esc(x)}</div>`).join("")}
 ${v.warn.slice(0,10).map(x=>`<div class="warn" style="max-width:none">⚠ ${esc(x)}</div>`).join("")}${v.warn.length>10?`<div class="hint">…e mais ${v.warn.length-10} avisos</div>`:""}
 ${d.alt.length?`<details open><summary>Preços alterados (${d.alt.length})</summary>${L(d.alt,x=>`<div class="df"><span>${esc(limpa(x.n))}</span><small>${chgTxt(x.o,x.n)}</small></div>`)}</details>`:""}
 ${d.nov.length?`<details><summary>Itens novos (${d.nov.length})</summary>${L(d.nov,x=>`<div class="df"><span>${esc(limpa(x))}</span><small>${brl(x.p[0])} · ${esc(x.g)}</small></div>`)}</details>`:""}
 ${d.rem.length?`<details><summary>Itens que saem (${d.rem.length})</summary>${L(d.rem,x=>`<div class="df"><span>${esc(limpa(x))}</span><small>${brl(x.p[0])} · ${esc(x.g)}</small></div>`)}</details>`:""}
 <details><summary>Linhas lidas do PDF (conferência)</summary><div class="df"><small style="white-space:pre-wrap">${esc(UP.lines.join("\n"))}</small></div></details>
 <div class="row" style="margin-top:10px"><button id="upCan">Cancelar</button><button class="p" id="upPub" ${v.errs.length||!UP.ref?"disabled":""}>Publicar tabela</button></div></div>`}
async function onPdf(e){const f=e.target.files[0];e.target.value="";if(!f)return;
 $("admUp").innerHTML='<div class="hint">Lendo o PDF…</div>';
 try{const lines=await pdfLines(await f.arrayBuffer());UP={name:f.name,lines,F:A.detect(lines)||A.FONTES.find(x=>x.pdf),dt:today(),refTouched:false};
  if(!A.detect(lines))say("Não reconheci o tipo da tabela pelo título. Escolha a tabela certa na lista.");upRender()}
 catch(x){$("admUp").innerHTML=`<div class="warn" style="max-width:none">Não consegui ler o PDF: ${esc(x.message)}</div>`}}
async function publish(){
 const {F,r,v}=UP;if(v.errs.length||!UP.ref)return;
 const atual=TABS.find(t=>t.fonte===F.id);
 if(!await ask(`Publicar "${F.nome}" — ${UP.ref}?\n\n${atual?`A tabela atual (${atual.ref}) fica arquivada e `:""}todos os vendedores passam a usar esta.${v.warn.length?"\n\nATENÇÃO: há "+v.warn.length+" aviso(s) nesta leitura.":""}`))return;
 $("upPub").disabled=true;
 try{await rest("rpc/publicar_tabela",{method:"POST",body:{p_fonte:F.id,p_ref:UP.ref,p_vigencia:UP.dt||today(),p_itens:r.items,p_arquivo:UP.name}});
  await tabRefresh();UP=null;$("admUp").innerHTML='<div class="hint" style="color:var(--ok)">✓ Tabela publicada. Os vendedores recebem na próxima conexão.</div>';admTabs();say("Tabela publicada")}
 catch(x){$("upPub").disabled=false;say(x.net?"Sem internet para publicar":"Erro ao publicar: "+x.message)}}
async function admUsers(quiet){
 try{let r;try{r=await rest("profiles?select=id,email,nome,cargo,tel,role,status,dono,criado_em,visto_em&order=criado_em.desc")}catch(e){if(e.net)throw e;r=await rest("profiles?select=id,email,nome,cargo,tel,role,status,dono,criado_em&order=criado_em.desc")}
  const pend=r.filter(x=>x.status==="pendente").length;$("nAdm").textContent=pend||"";
  if(quiet&&$("pAdm").hidden)return;
  const rot={pendente:"aguardando",ativo:"ativo",bloqueado:"bloqueado"},souDono=!!(PROF&&PROF.dono);
  $("admUsers").innerHTML=r.map(u=>{
   const papel=u.dono?" · dono":u.role==="admin"?" · administrador":"";
   let b="",nota="";
   if(u.id!==SESS.uid&&!u.dono){
    const alvoAdm=u.role==="admin";
    if(!alvoAdm||souDono){
     if(u.status!=="ativo")b+=`<button class="p" data-u="${u.id}" data-s="ativo">${u.status==="bloqueado"?"Reativar":"Aprovar"}</button>`;
     if(u.status!=="bloqueado")b+=`<button class="rm" data-u="${u.id}" data-s="bloqueado">${u.status==="pendente"?"Recusar":"Bloquear"}</button>`}
    if(souDono){
     if(alvoAdm)b+=`<button data-u="${u.id}" data-r="vendedor">Remover administrador</button>`;
     else if(u.status==="ativo")b+=`<button data-u="${u.id}" data-r="admin">Tornar administrador</button>`}
    else if(alvoAdm)nota="Só o dono altera administradores."}
   return `<div class="hl"><div class="hh"><b>${esc(u.nome||u.email)}</b><span class="pl">${rot[u.status]}${papel}</span></div><small>${esc(u.email)}${u.tel?" · "+esc(u.tel):""} · cadastro em ${dmy(u.criado_em)}${u.status==="ativo"&&u.id!==SESS.uid?" · "+ago(u.visto_em):""}</small>${nota?`<small>${nota}</small>`:""}${b?`<div class="row" style="margin-top:8px">${b}</div>`:""}</div>`}).join("")||'<div class="hint">Nenhum vendedor cadastrado.</div>'}
 catch(e){if(!quiet)$("admUsers").innerHTML=`<div class="hint">${e.net?"Sem internet para listar os vendedores.":esc(e.message)}</div>`}}
function bindAdm(){
 $("bAdm").onclick=()=>{const p=$("pAdm");p.hidden=!p.hidden;if(!p.hidden){$("pAvi").hidden=true;$("pHist").hidden=true;$("pCfg").hidden=true;$("pPromo").hidden=true;admTabs();admPromoList();admAviList();admUsers()}nav()};
 $("fPdf").onchange=onPdf;
 $("admUp").onclick=e=>{const id=e.target.id;if(id==="upCan"){UP=null;$("admUp").innerHTML=""}else if(id==="upPub")publish()};
 $("admUp").onchange=e=>{if(!UP)return;if(e.target.id==="upF"){UP.F=A.FONTES.find(f=>f.id===e.target.value);UP.refTouched=false;UP.ref=undefined;upRender()}else if(e.target.id==="upDt")UP.dt=e.target.value};
 $("admUp").oninput=e=>{if(!UP)return;if(e.target.id==="upRef"){UP.ref=e.target.value.trim();UP.refTouched=true;$("upPub").disabled=!!UP.v.errs.length||!UP.ref}};
 $("admUsers").onclick=async e=>{const u=e.target.dataset.u,s=e.target.dataset.s,rl=e.target.dataset.r;if(!u)return;
  if(rl){if(!await ask(rl==="admin"?"Tornar esta pessoa administradora? Ela poderá subir tabelas e promoções e aprovar ou bloquear vendedores.":"Remover o acesso de administrador desta pessoa? Ela volta a ser vendedora."))return;
   try{await rest("profiles?id=eq."+u,{method:"PATCH",body:{role:rl},prefer:"return=minimal"});say(rl==="admin"?"Agora é administrador":"Voltou a ser vendedor");admUsers()}catch(x){say(x.net?"Sem internet":"Erro: "+x.message)}return}
  if(s==="bloqueado"&&!await ask("Bloquear esta pessoa? Ela perde o acesso na próxima vez que o app dela se conectar."))return;
  try{await rest("profiles?id=eq."+u,{method:"PATCH",body:{status:s},prefer:"return=minimal"});say(s==="ativo"?"Pessoa liberada":"Pessoa bloqueada");admUsers()}catch(x){say(x.net?"Sem internet":"Erro: "+x.message)}}
 bindPromoAdm()}

// ---------- promoções ----------
let PROMOS=LS.get("ap_promo")||[],BAN=LS.get("ap_ban")||{},PF="curso",PM=null;
const d10=s=>s?String(s).slice(0,10):"";
const money=v=>{const n=+v;return n>0?n:0};
const fin=v=>money(v)?(+v).toFixed(2).replace(".",","):"";
const pOk=(p,d)=>p.ativa&&d10(p.inicio)<=d&&(!d10(p.fim)||d10(p.fim)>=d);
const pAtivas=()=>{const d=today();return PROMOS.filter(p=>pOk(p,d))};
// preço promocional de um item para a coluna (parcelas) escolhida. Vale de à vista até 6x; 7x a 10x volta à tabela.
function promo(ik,label,ptab){
 if(!ik||ik==="SRV"||!label)return null;
 const r=rng(label);if(r[1]>6)return null;
 for(const p of pAtivas()){const it=(p.itens||[]).find(x=>x.ik===ik);if(!it)continue;
  const v=money(it.vista),s=money(it.ate6),price=r[1]===0?(v||s):(s||v);
  if(!price||(ptab!=null&&price>=ptab))continue;
  return{v:price,id:p.id,fim:d10(p.fim)}}
 return null}
async function promoRefresh(){
 let r;
 try{r=await rest("promocoes?select=id,titulo,obs,inicio,fim,ativa,itens,criada_em,atualizada_em&order=criada_em.desc&limit=300")}
 catch(e){if(e.net)throw e;return}
 if(!Array.isArray(r))return;
 PROMOS=r;LS.set("ap_promo",r);paintPromo()}
function paintPromo(){const n=pAtivas().length,e=$("nPromo");if(e)e.textContent=n||"";if($("pPromo")&&!$("pPromo").hidden)promoView()}
const saveBan=()=>{const k=Object.keys(BAN);if(k.length>10)k.slice(0,k.length-10).forEach(x=>delete BAN[x]);LS.set("ap_ban",BAN)};
const banSrc=p=>{const c=BAN[p.id];return c&&c.u===p.atualizada_em?c.b:""};
function setBan(id,b){document.querySelectorAll('img[data-b="'+id+'"]').forEach(i=>{i.src=b;i.hidden=false})}
async function loadBans(L){
 for(const p of L){if(banSrc(p)||!navigator.onLine)continue;
  try{const r=await rest("promocoes?id=eq."+p.id+"&select=banner"),b=r&&r[0]&&r[0].banner;
   if(b){BAN[p.id]={u:p.atualizada_em,b};delete BAN[p.id].x;saveBan();setBan(p.id,b)}}catch(e){break}}}
function pmCard(p,d){
 const ok=pOk(p,d),fim=d10(p.fim),ini=d10(p.inicio);
 const st=!p.ativa?"desativada":ini>d?"começa em "+dmy(ini):fim&&fim<d?"encerrada":fim?"até "+dmy(fim):"enquanto durar o estoque";
 const src=banSrc(p);
 const its=(p.itens||[]).map(it=>{const i=IKMAP[it.ik],t=i!==undefined?CAT[i]:null,v=money(it.vista),s=money(it.ate6);
  const pr=v&&s?"à vista "+brl(v)+" · 1x a 6x "+brl(s):"à vista a 6x: "+brl(v||s);
  return `<div class="df"><div class="hf" style="margin:0"><span>${esc(it.nome)}<small>${pr}${t&&t.p[0]?" · tabela "+brl(t.p[0]):""}</small></span>${ok&&t?`<button class="p" data-add="${esc(it.ik)}" style="flex:none">+ Cotar</button>`:""}</div></div>`}).join("");
 return `<div class="hl pm"><div class="hh"><b>${esc(p.titulo)}</b><span class="pl">${st}</span></div>
 <img class="bn" data-b="${p.id}" ${src?`src="${src}"`:"hidden"} alt="Banner da promoção">${p.obs?`<small>${esc(p.obs)}</small>`:""}
 ${its?its+`<small>Cartão de 7x a 10x: preço da tabela.</small>`:""}</div>`}
function promoView(){
 const d=today(),ym=d.slice(0,7);
 const mes=p=>d10(p.inicio).slice(0,7)<=ym&&(!d10(p.fim)||d10(p.fim).slice(0,7)>=ym);
 const L=PF==="curso"?pAtivas():PF==="hoje"?pAtivas().filter(p=>d10(p.inicio)===d||d10(p.fim)===d):PROMOS.filter(p=>p.ativa&&mes(p));
 $("pmChips").innerHTML=[["curso","Em curso"],["hoje","Hoje"],["mes","Do mês"]].map(([k,n])=>`<button class="${k===PF?"on":""}" data-f="${k}">${n}</button>`).join("");
 $("pmList").innerHTML=L.length?L.map(p=>pmCard(p,d)).join(""):`<div class="hint">${PF==="hoje"?"Nenhuma promoção começa ou termina hoje.":PF==="mes"?"Nenhuma promoção neste mês.":"Nenhuma promoção em curso."}</div>`;
 loadBans(L)}
function bindPromo(){
 $("bPromo").onclick=()=>{const p=$("pPromo");p.hidden=!p.hidden;if(!p.hidden){["pHist","pCfg","pAdm","pAvi"].forEach(id=>$(id).hidden=true);PF="curso";promoView()}nav()};
 $("pPromo").onclick=e=>{const f=e.target.dataset.f;if(f&&e.target.closest("#pmChips")){PF=f;promoView();return}
  const a=e.target.dataset.add;if(a){promoAdd(a);return}
  const b=e.target.closest("img.bn");if(b&&b.src){$("bnImg").src=b.src;$("bnView").hidden=false}};
 $("bnView").onclick=()=>{$("bnView").hidden=true}}

// ---------- promoções: cadastro (administradores) ----------
const jpg=cv=>{let q=.82,u=cv.toDataURL("image/jpeg",q);while(u.length>450000&&q>.4){q-=.1;u=cv.toDataURL("image/jpeg",q)}return u};
async function bannerFrom(f){
 const MAXW=1100,cv=document.createElement("canvas"),g=cv.getContext("2d");
 if(/pdf/i.test(f.type)||/\.pdf$/i.test(f.name)){
  const lib=await loadPdfJs(),doc=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise,pg=await doc.getPage(1),v0=pg.getViewport({scale:1}),vp=pg.getViewport({scale:Math.min(2.5,MAXW/v0.width)});
  cv.width=Math.round(vp.width);cv.height=Math.round(vp.height);g.fillStyle="#fff";g.fillRect(0,0,cv.width,cv.height);
  await pg.render({canvasContext:g,viewport:vp}).promise;return jpg(cv)}
 const url=URL.createObjectURL(f);
 try{const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error("imagem inválida"));i.src=url});
  const k=Math.min(1,MAXW/im.naturalWidth);cv.width=Math.round(im.naturalWidth*k);cv.height=Math.round(im.naturalHeight*k);
  g.fillStyle="#fff";g.fillRect(0,0,cv.width,cv.height);g.drawImage(im,0,0,cv.width,cv.height);return jpg(cv)}
 finally{URL.revokeObjectURL(url)}}
function admPromoList(){
 const d=today();
 $("admPromoList").innerHTML=PROMOS.length?PROMOS.map(p=>{const ok=pOk(p,d),st=!p.ativa?"desativada":ok?"em curso":d10(p.inicio)>d?"agendada":"encerrada";
  return `<div class="hl"><div class="hh"><b>${esc(p.titulo)}</b><span class="pl">${st}</span></div><small>${dmy(p.inicio)} → ${p.fim?dmy(p.fim):"até acabar o estoque"} · ${(p.itens||[]).length} item(ns) com preço</small>
  <div class="row" style="margin-top:8px"><button data-pe="${p.id}">Editar</button><button data-pt="${p.id}">${p.ativa?"Desativar":"Ativar"}</button><button class="rm" data-pd="${p.id}">Excluir</button></div></div>`}).join(""):'<div class="hint">Nenhuma promoção cadastrada.</div>'}
function pmRender(){
 if(!PM){$("pmForm").innerHTML="";return}
 const rows=PM.itens.map((it,n)=>{const i=IKMAP[it.ik],t=i!==undefined?CAT[i]:null;
  return `<div class="df" data-n="${n}"><span>${esc(it.nome)}<small>${t?"tabela à vista "+brl(t.p[0]):"fora da tabela atual"}</small></span><div class="row" style="margin-top:6px"><input data-k="vista" inputmode="decimal" placeholder="À vista (R$)" value="${fin(it.vista)}"><input data-k="ate6" inputmode="decimal" placeholder="1x a 6x (se diferente)" value="${fin(it.ate6)}"><button class="rm" data-rm="${n}" style="flex:none">✕</button></div></div>`}).join("");
 $("pmForm").innerHTML=`<div class="card"><h2>${PM.id?"Editar promoção":"Nova promoção"}</h2>
 <label>Título</label><input id="pmT" value="${esc(PM.titulo)}" placeholder="Ex.: FS440Z — novembro">
 <label>Banner (imagem ou PDF)</label><input type="file" id="pmF" accept="image/*,application/pdf">
 ${PM.banner?`<img class="bn" src="${PM.banner}" alt="Banner" style="max-height:240px;object-fit:contain">`:""}
 <div class="row"><div><label>Começa em</label><input type="date" id="pmI" value="${PM.inicio}"></div><div><label>Válido até</label><input type="date" id="pmFim" value="${PM.fim||""}" ${PM.semFim?"disabled":""}></div></div>
 <label class="ck"><input type="checkbox" id="pmSF" ${PM.semFim?"checked":""}> Até acabar o estoque (sem data final; eu desativo à mão)</label>
 <label>Observação (opcional)</label><input id="pmO" value="${esc(PM.obs)}">
 <label>Itens com preço promocional (opcional)</label><input id="pmQ" placeholder="Buscar item da tabela (ex.: 275 FS440)" autocomplete="off"><div id="pmRes"></div>
 <div id="pmItens">${rows||'<div class="hint">Sem itens: a promoção aparece só como banner e não muda preço.</div>'}</div>
 <div class="hint">O preço vale à vista e de 1x a 6x. Se o banner tem um valor diferente para 1x a 6x, preencha o segundo campo. De 7x a 10x o preço volta ao da tabela.</div>
 <div class="row"><button id="pmCan">Cancelar</button><button class="p" id="pmSave">Salvar promoção</button></div></div>`}
function pmBusca(){
 const q=$("pmQ").value.trim().toLowerCase().split(/\s+/).filter(Boolean).map(norm),out=[];
 if(q.length)for(let i=0;i<CAT.length&&out.length<12;i++){const p=CAT[i];if(p.k==="SRV"||p.c==="Serviços")continue;if(q.every(x=>IDX[i].includes(x)))out.push(i)}
 $("pmRes").innerHTML=out.map(i=>{const p=CAT[i];return `<div class="df" data-i="${i}" style="cursor:pointer"><span>${esc(limpa(p))}<small>${esc(p.g)} · tabela à vista ${brl(p.p[0])}</small></span></div>`}).join("")}
async function pmSave(){
 const m=PM,vi=m.itens.map(it=>({ik:it.ik,nome:it.nome,vista:money(it.vista),ate6:money(it.ate6)}));
 if(!m.titulo.trim())return say("Informe o título da promoção");
 if(!m.inicio)return say("Informe quando começa");
 if(!m.semFim&&!m.fim)return say("Informe até quando vale, ou marque “Até acabar o estoque”");
 if(!m.semFim&&m.fim<m.inicio)return say("A data final não pode ser antes do início");
 if(vi.some(x=>!x.vista&&!x.ate6))return say("Há item sem preço. Preencha ou remova");
 if(!vi.length&&!m.banner&&!m.obs.trim())return say("Coloque um banner, um item ou uma observação");
 const body={titulo:m.titulo.trim(),obs:m.obs.trim(),inicio:m.inicio,fim:m.semFim?null:m.fim,itens:vi};
 if(m.mudou||!m.id)body.banner=m.banner||null;
 $("pmSave").disabled=true;
 try{if(m.id)await rest("promocoes?id=eq."+m.id,{method:"PATCH",body,prefer:"return=minimal"});else await rest("promocoes",{method:"POST",body:{...body,criada_por:SESS.uid},prefer:"return=minimal"});
  PM=null;pmRender();await promoRefresh();admPromoList();say("Promoção salva")}
 catch(x){$("pmSave")&&($("pmSave").disabled=false);say(x.net?"Sem internet para salvar":x.status===404?"Falta rodar o arquivo 3_fase2.sql no Supabase":"Erro: "+x.message)}}
function bindPromoAdm(){
 $("admPromo").onclick=async e=>{const t=e.target,id=t.id,D=t.dataset;
  if(id==="pmNova"){PM={titulo:"",obs:"",inicio:today(),fim:"",semFim:false,itens:[],banner:null,mudou:false};pmRender();$("pmForm").scrollIntoView({block:"start"});return}
  if(id==="pmCan"){PM=null;pmRender();return}
  if(id==="pmSave"){pmSave();return}
  if(D.rm!==undefined){PM.itens.splice(+D.rm,1);pmRender();return}
  const r=t.closest("#pmRes [data-i]");if(r&&PM){const p=CAT[+r.dataset.i];if(!PM.itens.some(x=>x.ik===p.ik))PM.itens.push({ik:p.ik,nome:limpa(p),vista:"",ate6:""});pmRender();return}
  if(D.pe){const p=PROMOS.find(x=>x.id===D.pe);if(!p)return;
   PM={id:p.id,titulo:p.titulo,obs:p.obs||"",inicio:d10(p.inicio),fim:d10(p.fim),semFim:!p.fim,itens:(p.itens||[]).map(x=>({...x})),banner:banSrc(p)||null,mudou:false};
   if(!PM.banner){try{const b=await rest("promocoes?id=eq."+p.id+"&select=banner");PM.banner=(b&&b[0]&&b[0].banner)||null}catch(x){}}
   pmRender();$("pmForm").scrollIntoView({block:"start"});return}
  if(D.pt){const p=PROMOS.find(x=>x.id===D.pt);if(!p)return;
   try{await rest("promocoes?id=eq."+p.id,{method:"PATCH",body:{ativa:!p.ativa},prefer:"return=minimal"});await promoRefresh();admPromoList()}catch(x){say(x.net?"Sem internet":"Erro: "+x.message)}return}
  if(D.pd){const p=PROMOS.find(x=>x.id===D.pd);if(!p||!await ask("Excluir a promoção “"+p.titulo+"”? Cotações já feitas não mudam."))return;
   try{await rest("promocoes?id=eq."+p.id,{method:"DELETE",prefer:"return=minimal"});await promoRefresh();admPromoList();say("Promoção excluída")}catch(x){say(x.net?"Sem internet":"Erro: "+x.message)}}};
 $("admPromo").oninput=e=>{if(!PM)return;const t=e.target,n=t.closest("[data-n]");
  if(t.id==="pmT")PM.titulo=t.value;else if(t.id==="pmO")PM.obs=t.value;else if(t.id==="pmQ")pmBusca();
  else if(n&&t.dataset.k){PM.itens[+n.dataset.n][t.dataset.k]=num(t.value)}};
 $("admPromo").onchange=async e=>{if(!PM)return;const t=e.target;
  if(t.id==="pmI")PM.inicio=t.value;else if(t.id==="pmFim")PM.fim=t.value;
  else if(t.id==="pmSF"){PM.semFim=t.checked;if(t.checked)PM.fim="";pmRender()}
  else if(t.id==="pmF"){const f=t.files[0];t.value="";if(!f)return;say("Lendo o banner…");
   try{PM.banner=await bannerFrom(f);PM.mudou=true;pmRender();say("Banner carregado")}catch(x){say("Não consegui ler o banner: "+x.message)}}}}

// ---------- avisos, backup, última atividade, ping ----------
let AVI=LS.get("ap_avi")||[],LIDO=LS.get("ap_avi_lido")||[];
const aviOk=(a,d)=>d10(a.inicio)<=d&&(!d10(a.fim)||d10(a.fim)>=d);
async function aviRefresh(){
 let r;try{r=await rest("avisos?select=id,texto,inicio,fim,criado_em&order=criado_em.desc&limit=100")}catch(e){if(e.net)throw e;return}
 if(!Array.isArray(r))return;
 AVI=r;LS.set("ap_avi",r);LIDO=LIDO.filter(id=>r.some(a=>a.id===id));LS.set("ap_avi_lido",LIDO);
 aviPaint();
 if($("avList")&&!$("pAdm").hidden)admAviList()}
function avisosHtml(){return ""}
const aviAtivos=()=>{const d=today();return AVI.filter(a=>aviOk(a,d))};
function aviPaint(){const b=$("bAvi");if(!b)return;const L=aviAtivos(),n=L.filter(a=>!LIDO.includes(a.id)).length;b.hidden=!L.length;$("nAvi").textContent=n||"";if(!L.length&&!$("pAvi").hidden){$("pAvi").hidden=true;nav()}}
function aviView(){const L=aviAtivos();
 $("aviList").innerHTML=L.length?L.map(a=>`<div class="avl${LIDO.includes(a.id)?"":" nv1"}"><div>${esc(a.texto).replace(/\n/g,"<br>")}</div><small>${a.fim?"vale até "+dmy(a.fim):"publicado em "+dmy(a.inicio)}</small></div>`).join(""):'<div class="hint">Nenhum aviso no momento.</div>';
 L.forEach(a=>{if(!LIDO.includes(a.id))LIDO.push(a.id)});LS.set("ap_avi_lido",LIDO);$("nAvi").textContent=""}
function admAviList(){
 const d=today();
 $("avList").innerHTML=AVI.length?AVI.map(a=>`<div class="hl"><div class="hh"><b>${esc(a.texto.length>70?a.texto.slice(0,70)+"…":a.texto)}</b><span class="pl">${aviOk(a,d)?"no ar":"encerrado"}</span></div><small>${a.fim?"até "+dmy(a.fim):"sem data final"}</small><div class="row" style="margin-top:8px"><button class="rm" data-ad="${a.id}">Excluir</button></div></div>`).join(""):'<div class="hint">Nenhum aviso.</div>'}
async function backup(){
 say("Preparando o backup…");
 try{const get=(p)=>rest(p).catch(e=>{if(e.net)throw e;return []});
  const [tabs,promos,avi,pes]=await Promise.all([get("price_tables?select=*&order=publicada_em.desc"),get("promocoes?select=*"),get("avisos?select=*"),get("profiles?select=id,email,nome,cargo,tel,role,status,criado_em")]);
  const j={app:"ap-cotacao-backup",v:1,quando:new Date().toISOString(),price_tables:tabs,promocoes:promos,avisos:avi,pessoas:pes};
  save("Backup_Admin_Cotacao_"+today()+".json",new TextEncoder().encode(JSON.stringify(j)).buffer)}
 catch(e){say(e.net?"Sem internet para o backup":"Erro no backup: "+e.message)}}
const pingUrl=()=>CFG.url+"/rest/v1/avisos?select=id&limit=1&apikey="+CFG.key;
async function seen(){
 const t=LS.get("ap_visto")||0;if(Date.now()-t<30*60*1000)return;LS.set("ap_visto",Date.now());
 try{await rest("profiles?id=eq."+SESS.uid,{method:"PATCH",body:{visto_em:new Date().toISOString()},prefer:"return=minimal"})}catch(e){if(e.net)LS.del("ap_visto")}}
function ago(ts){if(!ts)return "nunca abriu";const m=Math.round((Date.now()-new Date(ts))/60000);
 return m<2?"ativo agora":m<60?"visto há "+m+" min":m<1440?"visto há "+Math.round(m/60)+" h":"visto há "+Math.round(m/1440)+" dia(s)"}
function bindF3(){
 $("bAvi").onclick=()=>{const p=$("pAvi");p.hidden=!p.hidden;if(!p.hidden){["pHist","pCfg","pAdm","pPromo"].forEach(id=>$(id).hidden=true);aviView()}nav()};aviPaint();
 $("avPub").onclick=async()=>{const t=$("avT").value.trim(),f=$("avF").value;
  if(!t)return say("Escreva o aviso");if(f&&f<today())return say("A data final já passou");
  $("avPub").disabled=true;
  try{await rest("avisos",{method:"POST",body:{texto:t,fim:f||null,criado_por:SESS.uid},prefer:"return=minimal"});$("avT").value="";$("avF").value="";await aviRefresh();admAviList();say("Aviso publicado")}
  catch(x){say(x.net?"Sem internet":x.status===404?"Falta rodar o 4_fase3.sql no Supabase":"Erro: "+x.message)}
  $("avPub").disabled=false};
 $("avList").onclick=async e=>{const id=e.target.dataset.ad;if(!id||!await ask("Excluir este aviso?"))return;
  try{await rest("avisos?id=eq."+id,{method:"DELETE",prefer:"return=minimal"});await aviRefresh();admAviList()}catch(x){say(x.net?"Sem internet":"Erro: "+x.message)}};
 $("bkp").onclick=backup;
 $("pingUrl").value=pingUrl();
 $("pingCopy").onclick=async()=>{try{await navigator.clipboard.writeText(pingUrl());say("Endereço copiado")}catch(e){$("pingUrl").select();say("Selecione e copie o endereço")}};
 $("pingTest").onclick=async()=>{try{const r=await fetch(pingUrl());say(r.ok?"Respondeu normalmente ("+r.status+")":"O Supabase respondeu "+r.status)}catch(e){say("Sem resposta (internet ou projeto pausado)")}}}

function boot(){
 bindAuth();bindAdm();bindPromo();bindF3();
 window.addEventListener("online",()=>run());window.addEventListener("offline",paint);
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)run()});
 setInterval(()=>{if(!document.hidden)run()},120000);
 if(!CFG.url||!CFG.key||/SEU-PROJETO|SUA-CHAVE/.test(CFG.url+CFG.key)){authView("cfg");return}
 if(!SESS){authView("login");return}
 if(PROF&&PROF.id===SESS.uid&&PROF.status==="ativo"){enter();return}
 afterAuth()}
return{boot,mark,run,legacyQ,saveProf,tabHint,tabsRef,promo,avisosHtml,_t:{parseTabs:()=>TABS}}})();
