(()=>{
"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const CFG=window.SITE_CONFIG||{};
const REMOTE=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey);
const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl=u=>{u=String(u||"").trim();return /^(https?:\/\/|mailto:|tel:|assets\/|\.\/|\/|data:image\/(?:png|jpe?g|webp|gif);base64,)/i.test(u)?u:""};
// Brand icons (WhatsApp, Snapchat)
const P={wa:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
sn:"M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"};
const ico=k=>`<svg class="ic ${k}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${P[k]}"/></svg>`;
const strf=(v,n)=>typeof v==="string"?v.slice(0,n):"";
const blank=()=>({en:{},fr:{},shared:{},projects:[]});
const normP=a=>Array.isArray(a)?a.slice(0,12).map(p=>({url:safeUrl(strf(p&&p.url,500)),title:strf(p&&p.title,120),d_en:strf(p&&p.d_en,600),d_fr:strf(p&&p.d_fr,600),img:safeUrl(strf(p&&p.img,400000))})).filter(p=>p.url||p.title):[];
// whitelist: only known keys, string values, bounded size
const norm=o=>{const r=blank();if(o&&typeof o==="object"){for(const g of["en","fr","shared"])if(o[g]&&typeof o[g]==="object")for(const[k,v]of Object.entries(o[g]))if(typeof v==="string"&&v.length<(k==="photo"?400000:5000)&&has(g==="shared"?S:C[g],k))r[g][k]=v;r.projects=normP(o.projects)}return r};

let ov=blank(),token=null,lang;
const persist=()=>{if(!REMOTE){try{localStorage.setItem("pm_ov",JSON.stringify(ov))}catch(e){}}};
if(!REMOTE){try{ov=norm(JSON.parse(localStorage.getItem("pm_ov")||"null"))}catch(e){}}
try{lang=localStorage.getItem("pm_lang")}catch(e){}
if(lang!=="fr"&&lang!=="en")lang=(navigator.language||"en").toLowerCase().startsWith("fr")?"fr":"en";
const t=k=>ov[lang][k]??C[lang][k]??"",sh=k=>ov.shared[k]??S[k]??"";
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,"")}catch(e){return u}};
const shot=u=>"https://s0.wp.com/mshots/v1/"+encodeURIComponent(u)+"?w=800&h=500";

const root=document.documentElement,CE=(()=>{const d=document.createElement("div");try{d.contentEditable="plaintext-only"}catch(e){}return d.contentEditable==="plaintext-only"?"plaintext-only":"true"})();
let edit=false;const ORIG=$("#ph_img").getAttribute("src");
const fi=document.createElement("input");fi.type="file";fi.accept="image/*";fi.hidden=true;document.body.appendChild(fi);
function pick(max,qual,cb){fi.value="";fi.onchange=()=>{const f=fi.files[0];if(!f)return;if(!/^image\//.test(f.type))return toast("Choisissez une image.");const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",qual));toast("Image ajoutée ✔")};im.onerror=()=>toast("Image illisible.");im.src=r.result};r.readAsDataURL(f)};fi.click()}
const pickPhoto=()=>pick(720,.8,v=>{ov.shared.photo=v;persist();dirty();apply()});
const nu=v=>{v=String(v||"").trim();if(!v)return"";if(!/^https?:\/\//i.test(v))v="https://"+v;try{const u=new URL(v);return/^https?:$/.test(u.protocol)?u.href:""}catch(e){return""}};
let th=null;try{th=localStorage.getItem("pm_theme")}catch(e){}
root.dataset.theme=th||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark");
$("#tg").onclick=()=>{const v=root.dataset.theme==="light"?"dark":"light";root.dataset.theme=v;try{localStorage.setItem("pm_theme",v)}catch(e){}};
const toast=s=>{const e=$("#toast");e.textContent=s;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),2800)};
const modal=h=>{$("#bx").innerHTML=h;$("#adm").classList.add("on")};
const dirty=()=>$("#tb").classList.add("dirty");
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);setTimeout(()=>e.target.classList.add("done"),(+e.target.dataset.d||0)+950)}}),{threshold:.08});
function watch(){$$("[data-d]").forEach(e=>e.style.setProperty("--d",e.dataset.d+"ms"));$$(".rv:not(.in)").forEach(e=>io.observe(e))}
function markEditable(){$$("[data-i],[data-pi]").forEach(e=>{if(edit){e.setAttribute("contenteditable",CE);e.setAttribute("spellcheck","true")}else e.removeAttribute("contenteditable")});if(edit)$$("details").forEach(d=>d.open=true)}

function apply(){
 root.lang=lang;document.title=t("metaTitle");$('meta[name=description]').content=t("metaDesc");
 $$(".lang button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===lang));
 $$("[data-a]").forEach(e=>e.setAttribute("aria-label",t(e.dataset.a)));
 const cp=safeUrl(sh("photo"))||ORIG;if(cp&&$("#ph_img").getAttribute("src")!==cp)$("#ph_img").src=cp;$("#ph_img").alt=t("a_photo_alt");
 const T=[1,2,3,4,5,6,7].map(i=>"t"+i);
 $("#tk").innerHTML=`<div class="track"><div class="seg">${T.map(k=>`<span data-i="${k}"></span>`).join("")}</div><div class="seg tk2" aria-hidden="true">${T.map(k=>`<span>${esc(t(k))}</span>`).join("")}</div></div>`;
 $("#sv").innerHTML=[1,2,3,4,5,6].map(i=>`<div class="card rv" data-d="${i*70}"><span class="n">0${i}</span><h3 data-i="s${i}"></h3></div>`).join("");
 $("#pr").innerHTML=[1,2,3,4].map(i=>`<li class="card rv" data-d="${i*90}"><span class="n">0${i}</span><h3 data-i="pr${i}_t"></h3><p class="mu" data-i="pr${i}_d"></p></li>`).join("");
 $("#fq").innerHTML=[1,2,3,4].map(i=>`<details class="fq rv" data-d="${i*80}"><summary><span data-i="q${i}_q"></span></summary><p class="mu" data-i="q${i}_a"></p></details>`).join("");
 const real=ov.projects.length>0,other=lang==="fr"?"en":"fr";
 $("#p_intro").dataset.i=real?"p_intro2":"p_intro";
 const list=real?ov.projects.map(p=>{const u=safeUrl(p.url);return{title:p.title||host(u),desc:p["d_"+lang]||p["d_"+other],url:u,img:safeUrl(p.img)||(u?shot(u):"")}})
  :[1,2,3].map(i=>({sample:1,title:t(`p${i}_t`),desc:t(`p${i}_d`),url:safeUrl(sh(`p${i}_url`)),img:safeUrl(sh(`p${i}_img`))}));
 $("#pj").innerHTML=list.map((p,i)=>`<article class="card proj rv" data-d="${i*90}"><div class="img" role="img" aria-label="${esc(p.title)}"><span class="ph">${esc(p.sample?t("p_img"):(host(p.url)||t("p_img")))}</span>${p.img?`<img class="shot" alt="" loading="lazy" referrerpolicy="no-referrer" src="${esc(p.img)}">`:""}</div><div class="bd">${p.sample?`<span class="tag">${esc(t("p_tag"))}</span>`:""}<h3 ${p.sample?`data-i="p${i+1}_t"`:`data-pi="${i}" data-pf="title"`}>${esc(p.title)}</h3><p class="mu" ${p.sample?`data-i="p${i+1}_d"`:`data-pi="${i}" data-pf="d_${lang}" data-ph="Ajouter une description…"`}>${esc(p.desc||"")}</p>${p.url?`<a class="more" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(t("p_link"))} →</a>`:""}${p.sample&&edit?`<div class="pc"><button type="button" data-simg="${i+1}">🖼 Image</button></div>`:""}${!p.sample&&edit?`<div class="pc"><button type="button" data-up="${i}" aria-label="Monter">↑</button><button type="button" data-url="${i}" aria-label="Lien">🔗</button><button type="button" data-img="${i}">🖼 Image</button>${ov.projects[i]&&ov.projects[i].img?`<button type="button" data-rimg="${i}" aria-label="Retirer l’image">↺</button>`:""}<button type="button" data-del="${i}" aria-label="Supprimer">✕</button></div>`:""}</div></article>`).join("");
 $$("#pj .shot").forEach(im=>im.addEventListener("error",()=>im.remove()));
 let p=sh("phone"),m=sh("email");if(!/^[+\d\s().-]{6,25}$/.test(p))p=S.phone;if(!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(m))m=S.email;
 const wa="https://wa.me/"+p.replace(/\D/g,"");
 let sn=String(sh("snapchat")).replace(/^@/,"").trim();sn=/^[A-Za-z0-9._-]{3,15}$/.test(sn)?"https://www.snapchat.com/add/"+sn:"";
 $("#ph").textContent=p;$("#ph").href="tel:"+p.replace(/[^+\d]/g,"");$("#em").textContent=m;$("#em").href="mailto:"+m;
 const ext='target="_blank" rel="noopener noreferrer"';
 $("#cb").innerHTML=`<a class="btn p" href="mailto:${esc(m)}">${esc(t("c_btn"))}</a><a class="btn wa" href="${esc(wa)}" ${ext}>${ico("wa")}${esc(t("soc_whatsapp"))}</a>${sn?`<a class="btn sn" href="${esc(sn)}" ${ext}>${ico("sn")}${esc(t("soc_snapchat"))}</a>`:""}`;
 const items=[["wa",wa,"soc_whatsapp"],["sn",sn,"soc_snapchat"],["",safeUrl(sh("github")),"soc_github"],["",safeUrl(sh("linkedin")),"soc_linkedin"],["",safeUrl(sh("other")),"soc_other"]];
 $("#soc").innerHTML=items.map(([k,u,l])=>`<li><a ${u?`href="${esc(u)}" ${ext}`:`class="off" aria-disabled="true" href="#"`}>${k?ico(k):""}${esc(t(l))}</a></li>`).join("");
 $$("#soc a.off").forEach(a=>a.onclick=e=>e.preventDefault());
 $$("[data-i]").forEach(e=>e.textContent=t(e.dataset.i));
 watch();markEditable();
}
$$(".lang button").forEach(b=>b.onclick=()=>{lang=b.dataset.l;try{localStorage.setItem("pm_lang",lang)}catch(e){}apply()});
$("#bg").onclick=()=>{const o=$("#links").classList.toggle("open");$("#bg").setAttribute("aria-expanded",o)};
$$("#links a").forEach(a=>a.addEventListener("click",()=>$("#links").classList.remove("open")));
apply();

// ===== fluid effects =====
const fine=matchMedia("(pointer:fine)").matches;let mx=0,my=0,cx=0,cy=0,raf=0,tk=0,lastY=scrollY;
function tick(){raf=0;cx+=(mx-cx)*.14;cy+=(my-cy)*.14;if(fine){$("#cg").style.transform=`translate3d(${cx-200}px,${cy-200}px,0)`;$("#orbs").style.transform=`translate3d(${(mx/innerWidth-.5)*-34}px,${(my/innerHeight-.5)*-34}px,0)`}if(Math.abs(mx-cx)>.5||Math.abs(my-cy)>.5)raf=requestAnimationFrame(tick)}
addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;const c=e.target.closest&&e.target.closest(".card");if(c){const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}if(!raf)raf=requestAnimationFrame(tick)},{passive:true});
addEventListener("scroll",()=>{if(tk)return;tk=1;requestAnimationFrame(()=>{tk=0;const y=scrollY,h=root.scrollHeight-innerHeight;$("#bar").style.transform=`scaleX(${h>0?Math.min(1,y/h):0})`;$("header").classList.toggle("hide",y>lastY+4&&y>420&&!edit);lastY=y;$("#up").classList.toggle("on",y>700)})},{passive:true});
$("#up").onclick=()=>scrollTo({top:0,behavior:"smooth"});
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$("#links>a").forEach(a=>a.classList.toggle("act",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
["about","services","process","projects","faq","contact"].forEach(id=>sio.observe($("#"+id)));

// ===== easy admin: inline editing =====
function panel(){edit=true;document.body.classList.add("edit");$("#tb").hidden=false;closeAdm();$("header").classList.remove("hide");apply();toast("Mode édition : cliquez sur un texte pour le modifier. FR/EN pour chaque langue.")}
function exitEdit(){edit=false;token=null;document.body.classList.remove("edit");$("#tb").hidden=true;apply();toast("Édition terminée")}
document.addEventListener("input",e=>{if(!edit)return;const el=e.target.closest&&e.target.closest("[data-i],[data-pi]");if(!el)return;
 if(el.dataset.i){if(has(C[lang],el.dataset.i))ov[lang][el.dataset.i]=el.textContent.slice(0,2000)}
 else{const p=ov.projects[+el.dataset.pi];if(p&&["title","d_en","d_fr"].includes(el.dataset.pf))p[el.dataset.pf]=el.textContent.slice(0,600)}
 persist();dirty()});
document.addEventListener("keydown",e=>{if(edit&&e.key==="Enter"&&e.target.closest&&e.target.closest("[data-i],[data-pi]")){e.preventDefault();e.target.blur()}});
document.addEventListener("click",e=>{if(!edit)return;const q=s=>e.target.closest&&e.target.closest(s);
 if(q("#chgph")){pickPhoto();return}
 if(q("a[data-i],a[data-pi],summary"))e.preventDefault();
 const b=q("[data-del],[data-up],[data-url],[data-img],[data-rimg],[data-simg]");if(!b)return;const d=b.dataset;
 if(d.simg!==undefined){pick(720,.72,v=>{ov.shared["p"+d.simg+"_img"]=v;persist();dirty();apply()});return}
 const i=+(d.del??d.up??d.url??d.img??d.rimg),p=ov.projects[i];if(!p)return;
 if(d.img!==undefined){pick(720,.72,v=>{p.img=v;persist();dirty();apply()});return}
 if(d.rimg!==undefined){p.img="";persist();dirty();apply();return}
 if(d.del!==undefined){if(confirm("Supprimer ce projet ?")){ov.projects.splice(i,1)}else return}
 else if(d.up!==undefined){if(i>0)[ov.projects[i-1],ov.projects[i]]=[p,ov.projects[i-1]]}
 else{const v=nu(prompt("Adresse du site du projet",p.url));if(v)p.url=v;else return}
 persist();dirty();apply()});
$("#tb").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.act;
 if(a==="add")addProj();else if(a==="set")settings();else if(a==="exit")exitEdit();
 else if(a==="pub"){if(!REMOTE)return ghPublish();toast("Publication…");publish().then(s=>{if(s<300){$("#tb").classList.remove("dirty");toast("Publié ✔ visible par tout le monde")}else toast(s===401||s===403?"Session expirée : quittez puis reconnectez-vous.":"Erreur "+s)}).catch(()=>toast("Erreur réseau"))}});
$("#adm").addEventListener("click",e=>{if(e.target.id==="adm")closeAdm()});
let ghTok="";
const ghRepo=()=>{try{return localStorage.getItem("pm_gh_repo")||""}catch(e){return""}},ghSaved=()=>{try{return localStorage.getItem("pm_gh_tok")||""}catch(e){return""}};
const guessRepo=()=>{const h=location.hostname;if(!h.endsWith(".github.io"))return"";const o=h.split(".")[0],s=location.pathname.split("/")[1];return o+"/"+(s||o+".github.io")};
const b64=s=>{const b=new TextEncoder().encode(s);let r="";for(let i=0;i<b.length;i+=8192)r+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(r)};
function ghPublish(){
 if(ghRepo()&&(ghTok||ghSaved()))return ghPush(ghRepo(),ghTok||ghSaved());
 modal(`<h3 class="h0">Publier sur votre site</h3><p class="mu sm">Pour que vos modifications (images comprises) soient <b>permanentes et visibles par tout le monde</b>, elles sont enregistrées dans le fichier data.json de votre dépôt GitHub. Il faut un jeton GitHub (2 minutes, voir le README).</p><label for="ghr">Dépôt (pseudo/nom-du-dépôt)</label><input id="ghr" value="${esc(ghRepo()||guessRepo())}" placeholder="votre-pseudo/portfolio" autocapitalize="off"><label for="ght">Jeton GitHub</label><div class="pwrow"><input id="ght" type="password" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="button" id="sw2">Voir</button></div><label class="ck"><input type="checkbox" id="ghk"> Se souvenir sur cet appareil</label><div class="ab"><button type="button" class="pr" id="ghg">Publier</button><button type="button" id="ghd">Télécharger data.json</button><button type="button" id="ghx">Annuler</button></div><p id="msg"></p>`);
 $("#sw2").onclick=()=>{const i=$("#ght"),s=i.type==="password";i.type=s?"text":"password";$("#sw2").textContent=s?"Cacher":"Voir"};
 $("#ghx").onclick=closeAdm;
 $("#ghd").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(ov)],{type:"application/json"}));a.download="data.json";document.body.appendChild(a);a.click();a.remove();msg("data.json téléchargé : envoyez-le dans votre dépôt GitHub (il remplace l’ancien).")};
 $("#ghg").onclick=()=>{const r=$("#ghr").value.trim(),k=$("#ght").value.trim();if(!/^[\w.-]+\/[\w.-]+$/.test(r))return msg("Dépôt invalide (exemple : pseudo/portfolio).");if(!k)return msg("Collez votre jeton GitHub.");
  try{localStorage.setItem("pm_gh_repo",r);if($("#ghk").checked)localStorage.setItem("pm_gh_tok",k)}catch(e){}ghTok=k;ghPush(r,k)}}
async function ghPush(repo,k){
 toast("Publication…");const u=`https://api.github.com/repos/${repo}/contents/data.json`,h={Authorization:"Bearer "+k,Accept:"application/vnd.github+json"};
 try{let sha;const g=await fetch(u,{headers:h,cache:"no-store"});if(g.ok)sha=(await g.json()).sha;else if(g.status!==404)throw g.status;
  const p=await fetch(u,{method:"PUT",headers:{...h,"Content-Type":"application/json"},body:JSON.stringify({message:"Update site content",content:b64(JSON.stringify(ov)),...(sha?{sha}:{})})});
  if(!p.ok)throw p.status;
  try{localStorage.removeItem("pm_ov")}catch(e){}$("#tb").classList.remove("dirty");closeAdm();toast("Publié ✔ visible par tous dans environ 1 minute");
 }catch(s){toast(s===401||s===403?"Jeton refusé ou sans droit d’écriture.":s===404?"Dépôt introuvable : vérifiez son nom.":"Échec de la publication (réseau ou jeton).");ghTok="";try{localStorage.removeItem("pm_gh_tok")}catch(e){}}}
function addProj(){
 modal(`<h3 class="h0">Ajouter un projet</h3><p class="mu sm">Collez l’adresse du site du projet : une carte avec lien est créée (capture automatique si disponible). Pour une image à vous, choisissez-en une depuis votre appareil. Cliquez ensuite sur son titre ou sa description pour les modifier.</p><label for="npu">Adresse du site</label><input id="npu" type="url" inputmode="url" placeholder="https://mon-projet.com" autocapitalize="off"><div class="ab"><button type="button" id="npi">🖼 Choisir une image</button></div><div class="ab"><button type="button" class="pr" id="npa">Ajouter</button><button type="button" id="x2">Annuler</button></div><p id="msg"></p>`);
 let pend="";$("#npu").focus();$("#x2").onclick=closeAdm;$("#npi").onclick=()=>pick(720,.72,v=>{pend=v;msg("Image prête ✔ (cliquez sur Ajouter)")});
 const go=()=>{const v=nu($("#npu").value);if(!v)return msg("Adresse invalide.");if(ov.projects.length>=12)return msg("12 projets maximum.");
  ov.projects.push({url:v,title:host(v).split(".")[0].replace(/^./,c=>c.toUpperCase()),d_en:"",d_fr:"",img:pend});persist();dirty();closeAdm();apply();$("#projects").scrollIntoView({behavior:"smooth"});toast("Projet ajouté ✔")};
 $("#npa").onclick=go;$("#npu").onkeydown=e=>{if(e.key==="Enter")go()}}
function settings(){
 const L={phone:"Téléphone / numéro WhatsApp",email:"E-mail",snapchat:"Nom d’utilisateur Snapchat",github:"Lien GitHub",linkedin:"Lien LinkedIn",other:"Autre lien"};
 modal(`<h3 class="h0">Réglages</h3>${Object.keys(L).map(k=>`<label>${L[k]}</label><input data-sk="${k}" value="${esc(ov.shared[k]??S[k])}">`).join("")}<div class="ab"><button type="button" id="sph">🖼 Changer la photo</button><button type="button" id="rph">Photo d’origine</button></div><h3>Mot de passe admin</h3><label for="np1">Nouveau mot de passe (12 caractères minimum)</label><input id="np1" type="password" autocomplete="new-password"><label for="np2">Confirmer</label><input id="np2" type="password" autocomplete="new-password"><div class="ab"><button type="button" id="cpw">Changer le mot de passe</button></div><p id="msg"></p><div class="ab"><button type="button" class="pr" id="sd">Terminé</button><button type="button" id="rs">Tout réinitialiser</button></div>`);
 $$("[data-sk]").forEach(e=>e.oninput=()=>{if(has(S,e.dataset.sk)){ov.shared[e.dataset.sk]=e.value;persist();dirty();apply()}});
 $("#sd").onclick=closeAdm;$("#sph").onclick=pickPhoto;$("#rph").onclick=()=>{delete ov.shared.photo;persist();dirty();apply();msg("Photo d’origine rétablie")};
 $("#rs").onclick=()=>{if(confirm("Effacer toutes vos modifications ?")){ov=blank();if(!REMOTE){try{localStorage.removeItem("pm_ov")}catch(e){}}dirty();closeAdm();apply()}};
 $("#cpw").onclick=async()=>{const a=$("#np1").value,b=$("#np2").value;if(a.length<12)return msg("Trop court (12 caractères minimum).");if(a!==b)return msg("Les mots de passe ne correspondent pas.");
  try{if(REMOTE)await changePw(a);else localStorage.setItem("pm_pass",await sha(a));$("#np1").value=$("#np2").value="";msg("Mot de passe modifié ✔")}catch(e){msg("Échec. Quittez, reconnectez-vous puis réessayez.")}}}

// ===== Supabase (plain REST, no third-party script) =====
const U=CFG.supabaseUrl,K=CFG.supabaseAnonKey;
const hdr=(tok,extra)=>{const h={apikey:K,...extra};if(tok||/^eyJ/.test(K||""))h.Authorization="Bearer "+(tok||K);return h};
async function loadRemote(){try{const r=await fetch(`${U}/rest/v1/site_content?id=eq.1&select=data`,{headers:hdr()});if(!r.ok)return;const j=await r.json();if(j[0]){ov=norm(j[0].data);apply()}}catch(e){}}
async function signIn(email,pw){const r=await fetch(`${U}/auth/v1/token?grant_type=password`,{method:"POST",headers:hdr(null,{"Content-Type":"application/json"}),body:JSON.stringify({email,password:pw})});if(!r.ok)throw new Error("auth");const j=await r.json();token=j.access_token}
async function publish(){const r=await fetch(`${U}/rest/v1/site_content?id=eq.1`,{method:"PATCH",headers:hdr(token,{"Content-Type":"application/json",Prefer:"return=minimal"}),body:JSON.stringify({data:ov,updated_at:new Date().toISOString()})});return r.status}
async function changePw(pw){const r=await fetch(`${U}/auth/v1/user`,{method:"PUT",headers:hdr(token,{"Content-Type":"application/json"}),body:JSON.stringify({password:pw})});if(!r.ok)throw new Error("pw")}
if(REMOTE)loadRemote();
else{let dr=false;try{dr=!!localStorage.getItem("pm_ov")}catch(e){}if(!dr)fetch("data.json?v="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{if(j){ov=norm(j);apply()}}).catch(()=>{})}

// ===== hidden admin: #admin in URL, Ctrl+Shift+A, or 5 clicks on the © text =====
let fails=0,lockUntil=0;
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");
const msg=s=>{const e=$("#msg");if(e)e.textContent=s};
function openAdm(){$("#adm").classList.add("on");token!==null?panel():login()}
function closeAdm(){$("#adm").classList.remove("on")}
function login(){
 $("#bx").innerHTML=`<h3 class="h0">Admin</h3>${REMOTE?`<label for="em2">E-mail</label><input id="em2" type="email" autocomplete="username" value="${esc(CFG.adminEmail||"")}">`:`<p class="mu sm">Vos modifications se publient sur votre site avec le bouton « Publier » de la barre d’outils.</p>`}<label for="pw">${REMOTE?"Mot de passe":"Code d’accès"}</label><div class="pwrow"><input id="pw" type="password" autocomplete="${REMOTE?"current-password":"off"}" autocapitalize="off" spellcheck="false"><button type="button" id="sw">Voir</button></div><div class="ab"><button type="button" class="pr" id="go">Entrer</button><button type="button" id="x">Fermer</button></div><p id="er" role="alert"></p>`;
 $("#pw").focus();
 $("#sw").onclick=()=>{const i=$("#pw"),s=i.type==="password";i.type=s?"text":"password";$("#sw").textContent=s?"Cacher":"Voir"};
 const go=async()=>{
  if(Date.now()<lockUntil){$("#er").textContent="Trop d’essais. Attendez une minute.";return}
  try{
   if(REMOTE)await signIn($("#em2").value.trim(),$("#pw").value);
   else{let h=CFG.localPassSha256;try{h=localStorage.getItem("pm_pass")||h}catch(e){}if(await sha($("#pw").value)!==h)throw 0;token=""}
   fails=0;panel();
  }catch(e){if(++fails>=5){lockUntil=Date.now()+60000;fails=0}$("#er").textContent="Accès refusé."}
 };
 $("#go").onclick=go;$("#pw").onkeydown=e=>{if(e.key==="Enter")go()};$("#x").onclick=closeAdm;
}
addEventListener("keydown",e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==="a"){e.preventDefault();openAdm()}if(e.key==="Escape")closeAdm()});
let n=0,tm;$("#cp").addEventListener("click",()=>{n++;clearTimeout(tm);tm=setTimeout(()=>n=0,1500);if(n>=5){n=0;openAdm()}});
const chk=()=>{if(location.hash==="#admin")openAdm()};addEventListener("hashchange",chk);chk();
})();
