const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const mob=innerWidth<820,fmt=n=>'₹'+n.toLocaleString('en-IN');
gsap.registerPlugin(ScrollTrigger);

/* ---------- DATA ---------- */
const P=[
{id:'noir',n:'NOIR',d:'Bergamot over smoked oud. Night, distilled.',p:2499,c:0x6b3a12,t:['Bergamot','Pink Pepper','Lemon'],h:['Rose','Jasmine','Lavender'],b:['Oud','Amber','Musk']},
{id:'eclat',n:'ÉCLAT',d:'Saffron and neroli. Light that enters first.',p:2799,c:0xd9b45a,t:['Mandarin','Saffron','Neroli'],h:['Orange Blossom','Iris','Violet'],b:['Vanilla','Sandalwood','White Musk']},
{id:'oude',n:'OUDÉ',d:'Agarwood, leather and incense. Unhurried.',p:3499,c:0x3a1208,t:['Cardamom','Black Pepper','Elemi'],h:['Smoked Rose','Incense','Saffron'],b:['Agarwood','Leather','Patchouli']},
{id:'velvet',n:'VELVET',d:'Plum and rose over warm tonka. Close and soft.',p:2999,c:0x5a1030,t:['Plum','Cassis','Pink Pepper'],h:['Velvet Rose','Jasmine','Heliotrope'],b:['Tonka','Vanilla','Cedar']}];
const AU={BASE:{bg:'#050505',l:0xC8A96B,p:0xE5C98A},MYSTERIOUS:{bg:'#0b0615',l:0x6a3bd0,p:0x9b7bff},ROYAL:{bg:'#130e04',l:0xffb84a,p:0xE5C98A},BOLD:{bg:'#180304',l:0xd01a1a,p:0xff5a40},PURE:{bg:'#ece6da',l:0xffffff,p:0xC8A96B,light:1}};
const IG=[['Bergamot','Bright Calabrian citrus. The first breath.',{bg:'#0c1005',l:0xc9d86a,p:0xe5e08a}],['Rose','Damask petals, velvet and dark.',{bg:'#160508',l:0xd04060,p:0xff8aa0}],['Oud','Resinous agarwood, smoked and ancient.',{bg:'#0f0803',l:0x8a5a2a,p:0xc8a96b}],['Amber','Warm resin that glows on skin.',AU.ROYAL],['Musk','Soft, clean, impossible to place.',AU.PURE],['Vanilla','Dark pods, slow sweetness.',{bg:'#120b05',l:0xe0b070,p:0xf0d8a0}]];

/* ---------- THREE ---------- */
const R=new THREE.WebGLRenderer({canvas:$('#gl'),antialias:!mob,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,mob?1.5:2));R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=0;
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(32,1,.1,100);C.position.set(0,.3,24);
// studio environment for reflections
const es=new THREE.Scene(),panel=(w,h,x,y,z,c,rx=0,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:c,side:2}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);es.add(m)};
es.background=new THREE.Color(0x030303);
panel(3,12,-8,0,2,new THREE.Color(6,6,6),0,1.2);panel(2,12,8,0,0,new THREE.Color(5,3.8,2.2),0,-1.2);panel(14,3,0,9,0,new THREE.Color(4,4,4),1.4,0);panel(6,2,0,-6,6,new THREE.Color(1.5,1.2,.8),-1.2,0);
S.environment=new THREE.PMREMGenerator(R).fromScene(es,.02).texture;
const key=new THREE.DirectionalLight(0xfff0d8,1.4);key.position.set(4,6,8);S.add(key);
const rim=new THREE.PointLight(0xC8A96B,60,30);rim.position.set(-5,2,-4);S.add(rim);

const B=new THREE.Group();S.add(B);
const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,transmission:1,thickness:1.6,roughness:.04,ior:1.5,envMapIntensity:1.6,clearcoat:1});
const liquid=new THREE.MeshPhysicalMaterial({color:P[0].c,roughness:.15,transmission:.35,thickness:1,emissive:P[0].c,emissiveIntensity:.15,envMapIntensity:1});
const gold=new THREE.MeshStandardMaterial({color:0xC8A96B,metalness:1,roughness:.22,envMapIntensity:1.6});
const add=(g,m,y)=>{const o=new THREE.Mesh(g,m);o.position.y=y;B.add(o);return o};
add(new THREE.BoxGeometry(1.7,2.3,1,1,1,1),glass,0);
add(new THREE.BoxGeometry(1.45,1.7,.75),liquid,-.1);
add(new THREE.CylinderGeometry(.3,.3,.35,32),gold,1.3);
add(new THREE.CylinderGeometry(.42,.42,1,48),gold,1.95);
add(new THREE.CylinderGeometry(.44,.44,.06,48),new THREE.MeshStandardMaterial({color:0xE5C98A,metalness:1,roughness:.15}),1.45);
const lc=document.createElement('canvas');lc.width=lc.height=256;const lx=lc.getContext('2d');lx.fillStyle='#E5C98A';lx.textAlign='center';lx.font='300 46px "Cormorant Garamond",serif';lx.fillText('NOIRÉ',128,120);lx.font='300 14px Manrope,sans-serif';lx.fillText('E A U   D E   P A R F U M',128,150);
const lab=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(lc),transparent:true}));lab.position.set(0,-.15,.51);B.add(lab);
B.scale.setScalar(.001);

// particles
const spr=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.3,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const mk=(n,size,op,spread)=>{const g=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n*3;i+=3){a[i]=(Math.random()-.5)*spread;a[i+1]=(Math.random()-.5)*10;a[i+2]=(Math.random()-.5)*6}g.setAttribute('position',new THREE.BufferAttribute(a,3));
const m=new THREE.PointsMaterial({map:spr,size,color:0xE5C98A,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});const p=new THREE.Points(g,m);p.userData.op=op;S.add(p);return p};
const dust=mk(mob?140:420,.12,.8,16),mist=mk(mob?14:34,mob?3.5:4.5,.07,9);
const T={x:0,y:0,s:1,z:14,mx:0,my:0,dx:0,dy:0,boost:0,exp:0,intro:0,cx:0};

function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}
addEventListener('resize',size);size();

let t=0,run=true;document.addEventListener('visibilitychange',()=>run=!document.hidden);
(function loop(){requestAnimationFrame(loop);if(!run)return;t+=.01;
 const my=mob?1.6:0,sx=T.x,sy=T.y+(mob&&T.s<1?1.4:0);
 B.position.x+=(sx-B.position.x)*.05;B.position.y+=(sy+Math.sin(t*2)*.06-B.position.y)*.05;
 const sc=T.s*(mob?.7:1);B.scale.setScalar(B.scale.x+(sc*T.intro-B.scale.x)*.06);
 B.rotation.y+=.004+T.boost;T.boost*=.92;B.rotation.y+=T.dx*.0;
 B.rotation.x+=((-T.my*.15+T.dy)-B.rotation.x)*.05;
 B.rotation.z=Math.sin(t)*.015+T.mx*.03;
 C.position.z+=(T.z-C.position.z)*.04;C.position.x+=(T.cx-C.position.x)*.04;C.lookAt(0,0,0);
 R.toneMappingExposure+=(T.exp-R.toneMappingExposure)*.05;
 for(const p of [dust,mist]){const a=p.geometry.attributes.position.array,sp=p===dust?.004:.0015;for(let i=0;i<a.length;i+=3){a[i+1]+=sp+T.boost*.2;a[i]+=Math.sin(t+i)*.002;if(a[i+1]>5){a[i+1]=-5}}p.geometry.attributes.position.needsUpdate=true;p.rotation.y=t*.05}
 R.render(S,C)})();

/* ---------- AURA / ENVIRONMENT ---------- */
let cur=AU.BASE;
function env(a){const c=new THREE.Color(a.l),p=new THREE.Color(a.p);
 gsap.to(rim.color,{r:c.r,g:c.g,b:c.b,duration:1});gsap.to(dust.material.color,{r:p.r,g:p.g,b:p.b,duration:1});gsap.to(mist.material.color,{r:c.r,g:c.g,b:c.b,duration:1});
 document.body.style.background=a.bg;document.body.classList.toggle('light',!!a.light)}
let sel=null;
$$('.auras button').forEach(b=>{const a=AU[b.dataset.a];
 b.onmouseenter=()=>{env(a);gsap.fromTo(b,{y:0},{y:-6,yoyo:true,repeat:1,duration:.3})};
 b.onmouseleave=()=>env(cur);
 b.onclick=()=>{$$('.auras button').forEach(x=>x.classList.remove('on'));if(sel===b.dataset.a){sel=null;cur=AU.BASE}else{sel=b.dataset.a;cur=a;b.classList.add('on')}env(cur);T.boost=.06;gsap.fromTo(key,{intensity:3},{intensity:1.4,duration:1.2})}});

/* ---------- INPUT ---------- */
addEventListener('pointermove',e=>{T.mx=e.clientX/innerWidth*2-1;T.my=e.clientY/innerHeight*2-1;
 if(!mob)gsap.to('#cg',{x:e.clientX,y:e.clientY,duration:.5})});
document.addEventListener('mousemove',e=>$$('.mag').forEach(b=>{const r=b.getBoundingClientRect(),dx=e.clientX-(r.x+r.width/2),dy=e.clientY-(r.y+r.height/2);
 if(Math.hypot(dx,dy)<90)gsap.to(b,{x:dx*.25,y:dy*.25,duration:.4});else gsap.to(b,{x:0,y:0,duration:.6})}));
addEventListener('scroll',()=>{$('#nav').classList.toggle('sc',scrollY>40)},{passive:true});
let last=0;addEventListener('scroll',()=>{T.boost=Math.min(.05,T.boost+Math.abs(scrollY-last)*.0004);last=scrollY},{passive:true});
$('#menuBtn').onclick=()=>document.body.classList.toggle('menu');
$$('#links a,#cta,.btn[href]').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu')));

/* ---------- CONTENT ---------- */
$('#rows').innerHTML=P.map((p,i)=>`<div class="row" data-i="${i}"><span class="n">0${i+1}</span><h3 data-v="${i}">${p.n}</h3><p>${p.d}</p><span class="pr">${fmt(p.p)}</span><div class="bt"><button data-v="${i}">EXPLORE</button><button data-a="${p.id}">ADD TO BAG</button></div></div>`).join('');
$('#ings').innerHTML=IG.map((g,i)=>`<li data-g="${i}">${g[0]}</li>`).join('');
$$('#ings li').forEach(li=>{const g=IG[li.dataset.g];
 li.onmouseenter=()=>{env(g[2]);$('#idesc').textContent=g[1];T.cx=li.dataset.g%2?.8:-.8};
 li.onmouseleave=()=>{env(cur);T.cx=0}});
$('#brand').innerHTML=[...'NOIRÉ'].map(c=>`<span>${c}</span>`).join('');

/* ---------- SCROLL STORY ---------- */
$$('[data-bx]').forEach(s=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:e=>{if(!e.isActive)return;const bx=+s.dataset.bx;T.x=mob?0:bx;T.s=+(s.dataset.bs||1)*(mob&&bx?.8:1);T.y=mob&&bx?2.6:0;T.z=s.id==='sig'?11:14}}));
gsap.from('#aura h2',{scrollTrigger:{trigger:'#aura',start:'top 70%'},opacity:0,letterSpacing:'.3em',duration:1.6});
gsap.from('.auras button',{scrollTrigger:{trigger:'.auras',start:'top 85%'},opacity:0,rotateX:-40,transformOrigin:'top',stagger:.15,duration:1});
gsap.utils.toArray('.row').forEach((r,i)=>gsap.from(r,{scrollTrigger:{trigger:r,start:'top 90%'},opacity:0,x:i%2?80:-80,duration:1.1}));
gsap.to('#track',{x:()=>-(innerWidth*3),ease:'none',scrollTrigger:{trigger:'#journey',pin:true,scrub:.6,end:()=>'+='+innerWidth*3,onUpdate:s=>{T.boost=Math.max(T.boost,.012)}}});
gsap.from('.big',{scrollTrigger:{trigger:'#sig',scrub:1,start:'top bottom',end:'center center'},scale:.6,opacity:0});
gsap.to('.rays',{scrollTrigger:{trigger:'#sig',scrub:1},rotate:25});
gsap.to('.p1',{scrollTrigger:{trigger:'#story',scrub:1},y:-90});gsap.to('.p2',{scrollTrigger:{trigger:'#story',scrub:1},y:90});
gsap.from('#story .st',{scrollTrigger:{trigger:'#story',start:'top 60%'},clipPath:'inset(0 0 100% 0)',y:40,duration:1.4});
gsap.from('#ings li',{scrollTrigger:{trigger:'#ings',start:'top 80%'},opacity:0,scale:.85,stagger:.1,duration:1});
gsap.from('#exp h2',{scrollTrigger:{trigger:'#exp',start:'top 60%'},opacity:0,scale:1.25,duration:1.6});
gsap.from('blockquote',{scrollTrigger:{trigger:'.cards',start:'top 80%'},opacity:0,rotate:3,y:60,stagger:.25,duration:1.2});

/* ---------- PRODUCT VIEW ---------- */
let pi=0,drag=null,ang=0;
const show=(el,d='block')=>{el.style.display=d;gsap.to(el,{opacity:1,duration:.5})};
const hide=el=>gsap.to(el,{opacity:0,duration:.4,onComplete:()=>el.style.display='none'});
const note=(id,l,a)=>$(id).innerHTML=`<b>${l}</b>${a.join('\n')}`;
function openP(i){pi=i;const p=P[i];liquid.color.set(p.c);liquid.emissive.set(p.c);$('#pn').textContent=p.n;note('#n1','TOP NOTES',p.t);note('#n2','HEART NOTES',p.h);note('#n3','BASE NOTES',p.b);
 document.body.classList.add('lock');T.x=0;T.y=mob?.3:0;T.s=1.35;T.z=12;show($('#pv'));
 gsap.from('.nt',{opacity:0,y:30,stagger:.2,duration:1,delay:.3})}
function closeP(){hide($('#pv'));document.body.classList.remove('lock');T.dy=0;T.z=14;const s=ScrollTrigger.getAll().find(x=>x.trigger&&x.trigger.id==='collection');T.x=mob?0:3.2;T.s=.9}
$('#rows').onclick=e=>{const v=e.target.dataset.v,a=e.target.dataset.a;if(v!=null)openP(+v);if(a)addCart(a,e.target)};
$('#padd').onclick=e=>addCart(P[pi].id,e.target);
const pv=$('#pv');
pv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};pv.style.cursor='grabbing'});
addEventListener('pointerup',()=>{drag=null;pv.style.cursor='grab';T.dy=0});
pv.addEventListener('pointermove',e=>{if(!drag)return;B.rotation.y+=(e.clientX-drag.x)*.012;T.dy=Math.max(-.5,Math.min(.5,T.dy+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY}});
pv.addEventListener('wheel',e=>{e.preventDefault();T.z=Math.max(8,Math.min(18,T.z+e.deltaY*.01))},{passive:false});
$$('.x').forEach(b=>b.onclick=()=>{const id=b.dataset.x;if(id==='pv')closeP();else if(id==='drawer')gsap.to('#drawer',{x:'100%',duration:.6,ease:'power3.inOut'});else{hide($('#co'));document.body.classList.remove('lock')}});

/* ---------- CART ---------- */
let cart=[];try{cart=JSON.parse(localStorage.getItem('noire-cart'))||[]}catch(e){}
const save=()=>{try{localStorage.setItem('noire-cart',JSON.stringify(cart))}catch(e){}};
const total=()=>cart.reduce((s,i)=>s+P.find(p=>p.id===i.id).p*i.q,0);
function render(){const n=cart.reduce((s,i)=>s+i.q,0);$('#badge').textContent=n;
 $('#items').innerHTML=cart.length?cart.map(i=>{const p=P.find(x=>x.id===i.id);return `<div class="it"><h4>${p.n}</h4><b>${fmt(p.p*i.q)}</b><div class="q"><button data-m="${i.id}">−</button>${i.q}<button data-p="${i.id}">+</button></div><span>${fmt(p.p)} each</span></div>`}).join(''):'<p style="color:#999;padding:20px 0">Your bag is empty. Choose a scent from the collection.</p>';
 $('#sub').textContent=fmt(total());save()}
$('#items').onclick=e=>{const m=e.target.dataset.m,p=e.target.dataset.p,i=cart.find(x=>x.id===(m||p));if(!i)return;i.q+=p?1:-1;if(i.q<1)cart=cart.filter(x=>x!==i);render()};
function addCart(id,from){const i=cart.find(x=>x.id===id);i?i.q++:cart.push({id,q:1});render();
 const a=from.getBoundingClientRect(),b=$('#cartBtn').getBoundingClientRect(),f=document.createElement('div');f.className='fly';document.body.appendChild(f);
 gsap.fromTo(f,{x:a.x+a.width/2,y:a.y,scale:3},{x:b.x+8,y:b.y+8,scale:.6,duration:.9,ease:'power2.in',onComplete:()=>{f.remove();gsap.fromTo('#badge',{scale:2},{scale:1,duration:.5})}})}
$('#cartBtn').onclick=()=>gsap.to('#drawer',{x:0,duration:.7,ease:'power3.out'});

/* ---------- CHECKOUT ---------- */
$('#chk').onclick=()=>{if(!cart.length)return;gsap.to('#drawer',{x:'100%',duration:.5});
 $('#sum').innerHTML=cart.map(i=>{const p=P.find(x=>x.id===i.id);return `<div><span>${p.n} × ${i.q}</span><span>${fmt(p.p*i.q)}</span></div>`}).join('')+`<div style="color:var(--fg);margin-top:8px"><span>Total</span><b>${fmt(total())}</b></div>`;
 document.body.classList.add('lock');show($('#co'))};
$('#form').onsubmit=e=>{e.preventDefault();cart=[];render();hide($('#co'));
 const ok=$('#ok'),ring=$('.ring');ring.innerHTML='';for(let i=0;i<48;i++)ring.appendChild(document.createElement('i'));
 show(ok,'flex');T.x=0;T.y=mob?1.2:.3;T.s=1;T.z=14;env(AU.BASE);
 gsap.fromTo('.ring i',{x:0,y:0,opacity:0},{x:i=>Math.cos(i/48*6.283)*110,y:i=>Math.sin(i/48*6.283)*110,opacity:1,duration:1.8,stagger:.02,ease:'power3.out'});
 gsap.from('#ok h2,#ok p,#ok small,#again',{opacity:0,y:30,stagger:.5,delay:.8,duration:1.2})};
$('#again').onclick=()=>{hide($('#ok'));document.body.classList.remove('lock');$('#collection').scrollIntoView({behavior:'smooth'})};
render();

/* ---------- LOADER + INTRO ---------- */
const pr={v:0};
gsap.to('#lb',{scaleX:1,duration:2.4,ease:'power1.inOut'});
gsap.to(pr,{v:100,duration:2.4,ease:'power1.inOut',onUpdate:()=>$('#lp').textContent=Math.round(pr.v),onComplete:intro});
function intro(){
 gsap.to('#ld',{opacity:0,duration:1,onComplete:()=>$('#ld').remove()});
 T.exp=1;T.intro=1;T.z=14;
 [dust,mist].forEach(p=>{gsap.to(p.material,{opacity:p.userData.op,duration:4,delay:.6});gsap.from(p.scale,{x:3,y:3,z:3,duration:3.5,ease:'power2.out'})});
 const tl=gsap.timeline({delay:1.6});
 tl.from('#brand span',{opacity:0,y:30,filter:'blur(12px)',stagger:.12,duration:1.4,ease:'power3.out'})
   .from('.tag',{opacity:0,letterSpacing:'1em',duration:1.6},'-=.6').from('#cta,.scr,#nav',{opacity:0,duration:1.2},'-=.6')}
$('#brand').style.opacity=1;
