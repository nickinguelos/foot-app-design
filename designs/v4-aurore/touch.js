/* v4 : l'écran entier est la manette. Aucun bouton de jeu.
   Touche ou glisse = déplacement (inertie ~1 s, trottinement à l'arrivée).
   Double-tap = le système choisit l'action selon l'endroit ; variante tirée au hasard parmi les valides.
   Démo de comportement : ce n'est pas le moteur de jeu. */
(function(){
var m=document.getElementById('match');if(!m)return;
var svg=m.querySelector('svg.pitch');
['.stick','.actions','.hintline'].forEach(function(s){var e=m.querySelector(s);if(e)e.remove();});
svg.lastElementChild.remove();svg.lastElementChild.remove();
var sits=document.getElementById('sits');var n1=sits.previousElementSibling,n2=m.nextElementSibling;sits.remove();
n1.textContent=`Aucun bouton à l'écran. Touche ou glisse n'importe où : le joueur se déplace. Double-tap : le système choisit l'action selon l'endroit touché. Essaie ci-dessous (doigt ou souris).`;
n2.textContent=`Maquette de comportement, pas le vrai moteur. Le déplacement a de l'inertie (~1 s) et le joueur trottine à l'arrivée. Au double-tap, une variante est tirée au hasard parmi celles qui sont valides dans la situation. Après l'action, le ballon revient au joueur (démo).`;
var h2=Array.prototype.find.call(document.querySelectorAll('h2'),function(h){return h.textContent.indexOf('3.')===0;});
if(h2)h2.textContent=`3. Match : tout l'écran est la manette`;
var st=document.createElement('style');
st.textContent='.ripple{position:absolute;width:6cqw;height:6cqw;margin:-3cqw 0 0 -3cqw;border-radius:50%;border:max(2px,.4cqw) solid var(--acc);animation:rp .6s ease-out forwards;pointer-events:none}@keyframes rp{from{transform:scale(.3);opacity:.9}to{transform:scale(1.6);opacity:0}}#readout{background:var(--s1);border-radius:12px;padding:10px 12px;min-height:3.8em;color:var(--t1);margin-top:8px}';
document.head.appendChild(st);
var ro=document.createElement('div');ro.id='readout';ro.className='note';ro.setAttribute('role','status');ro.setAttribute('aria-live','polite');
ro.textContent=`Touche ou glisse pour bouger ; double-tape pour agir.`;
m.insertAdjacentElement('afterend',ro);
var NS='http://www.w3.org/2000/svg';
var g=document.createElementNS(NS,'g');svg.appendChild(g);
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);(p||g).appendChild(e);return e;}
function dotIn(gg,p,side){var c=p.k==='gk'?'gk':side;el('circle',{r:4.2,fill:'var(--'+c+')',stroke:'var(--ring)','stroke-width':.9},gg);el('text',{y:1.6,'font-size':4.4,'font-weight':700,'text-anchor':'middle',fill:'var(--num-'+c+')'},gg).textContent=p.n;}
var TM=[{x:14,y:50,n:1,k:'gk'},{x:52,y:26,n:8},{x:52,y:74,n:6},{x:96,y:30,n:9},{x:118,y:78,n:7},{x:136,y:44,n:11}];
var OPP=[{x:186,y:50,n:1,k:'gk'},{x:150,y:30,n:4},{x:150,y:68,n:5},{x:128,y:56,n:3},{x:112,y:40,n:2}];
TM.forEach(function(p){var gg=el('g',{transform:'translate('+p.x+' '+p.y+')'});dotIn(gg,p,'home');});
OPP.forEach(function(p){var gg=el('g',{transform:'translate('+p.x+' '+p.y+')'});dotIn(gg,p,'away');});
var ring=el('circle',{r:7,fill:'none',stroke:'var(--acc)','stroke-width':.9,'stroke-dasharray':'2 1.4',visibility:'hidden'});
var path=el('path',{fill:'none',stroke:'var(--acc)','stroke-width':.9,'stroke-dasharray':'3 2',opacity:0});
var mg=el('g',{});el('circle',{r:6.2,fill:'none',stroke:'var(--sel)','stroke-width':.9,'stroke-dasharray':'2 1.4'},mg);dotIn(mg,{n:10},'home');
var ballEl=el('circle',{r:1.7,fill:'#fff',stroke:'#111','stroke-width':.5});
var me={x:92,y:52,vx:0,vy:0},tgt={x:92,y:52},ball={x:95,y:54},fly=null,down=false,last=null;
function ripple(cx,cy){var r=m.getBoundingClientRect();var d=document.createElement('div');d.className='ripple';d.style.left=(cx-r.left)+'px';d.style.top=(cy-r.top)+'px';m.appendChild(d);setTimeout(function(){d.remove();},650);}
function P(e){var r=svg.getBoundingClientRect();return{x:Math.max(6,Math.min(194,(e.clientX-r.left)/r.width*200)),y:Math.max(6,Math.min(94,(e.clientY-r.top)/r.height*100))};}
function nearestTm(p){var b=null,bd=1e9;TM.forEach(function(t){var d=Math.hypot(t.x-p.x,t.y-p.y);if(d<bd){bd=d;b=t;}});return{t:b,d:bd};}
function snap(p){var n=nearestTm(p);if(n.d<=14){ring.setAttribute('cx',n.t.x);ring.setAttribute('cy',n.t.y);ring.setAttribute('visibility','visible');}else ring.setAttribute('visibility','hidden');}
function isFree(p){return !OPP.some(function(o){return Math.hypot(o.x-p.x,o.y-p.y)<11;});}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function act(p){
 var n=nearestTm(p),toGoal=(p.x>150&&Math.abs(p.y-50)<30),kind,v,to,txt,chosen;
 if(n.d<=14&&!(toGoal&&n.d>8)){
  var t=n.t,dx=t.x-me.x,dist=Math.hypot(t.x-me.x,t.y-me.y);
  if(dx<-4)v=['passe en retrait','passe au sol appuyée'];
  else if(dist>45)v=isFree(t)?['longue passe','longue passe piquée','transversale longue']:['longue passe','longue passe piquée'];
  else{v=['passe au sol'];if(isFree(t)){v.push('passe en profondeur');v.push('passe lobée');}}
  chosen=pick(v);to={x:t.x,y:t.y};
  txt=`<b>${chosen}</b> vers le #${t.n}${isFree(t)?' (libre)':' (marqué)'} · variantes valides : ${v.join(', ')} · tirée au hasard`;
 }else if(toGoal||p.x>165){
  var dg=Math.hypot(198-me.x,50-me.y);
  v=dg>50?['tir puissant','tir enroulé']:['tir ras de terre','tir puissant','tir enroulé','tir piqué'];
  chosen=pick(v);to={x:198,y:p.y<50?42:58};
  txt=`<b>${chosen}</b> vers le côté ${p.y<50?'haut':'bas'} (gardien au centre) · variantes valides : ${v.join(', ')} · tirée au hasard`;
 }else{
  var cand=null,cd=1e9;TM.forEach(function(t){if(t.x>=me.x-5){var d=Math.hypot(t.x-p.x,t.y-p.y);if(d<cd){cd=d;cand=t;}}});
  if(cand&&cd<32&&p.x>me.x){v=['passe en profondeur dans l\'espace','passe lobée dans l\'espace'];chosen=pick(v);to={x:p.x,y:p.y};txt=`<b>${chosen}</b> devant le #${cand.n} qui appelle · variantes valides : ${v.join(', ')} · tirée au hasard`;}
  else{ro.innerHTML=`Aucune action ici (ni coéquipier, ni but, ni espace utile) : déplacement seulement.`;return;}
 }
 ro.innerHTML=txt;
 fly={ax:ball.x,ay:ball.y,bx:to.x,by:to.y,t0:performance.now(),dur:600,hold:1000};
}
m.style.touchAction='none';m.style.userSelect='none';
m.addEventListener('pointerdown',function(e){
 if(e.target.closest('button'))return;
 var p=P(e),now=performance.now();down=true;ripple(e.clientX,e.clientY);snap(p);
 if(last&&now-last.t<300&&Math.hypot(p.x-last.x,p.y-last.y)<18){act(p);last=null;}
 else{tgt=p;last={t:now,x:p.x,y:p.y};}
});
m.addEventListener('pointermove',function(e){if(!down)return;var p=P(e);tgt=p;snap(p);});
function up(){down=false;setTimeout(function(){if(!down)ring.setAttribute('visibility','hidden');},350);}
m.addEventListener('pointerup',up);m.addEventListener('pointercancel',up);
var tp=performance.now();
function loop(t){
 var dt=Math.min(.05,(t-tp)/1000);tp=t;
 var dx=tgt.x-me.x,dy=tgt.y-me.y,d=Math.hypot(dx,dy),wx,wy;
 if(d>1){var k=Math.min(1,d/10);wx=dx/d*34*k;wy=dy/d*34*k;}else{wx=Math.cos(t/450)*3;wy=Math.sin(t/380)*2.2;}
 var a=1-Math.exp(-dt/.35);me.vx+=(wx-me.vx)*a;me.vy+=(wy-me.vy)*a;
 me.x=Math.max(6,Math.min(194,me.x+me.vx*dt));me.y=Math.max(6,Math.min(94,me.y+me.vy*dt));
 mg.setAttribute('transform','translate('+me.x+' '+me.y+')');
 if(fly){
  var u=(t-fly.t0)/fly.dur;
  if(u<1){ball.x=fly.ax+(fly.bx-fly.ax)*u;ball.y=fly.ay+(fly.by-fly.ay)*u;}
  else if(t-fly.t0<fly.dur+fly.hold){ball.x=fly.bx;ball.y=fly.by;}
  else fly=null;
  if(fly){path.setAttribute('d','M'+fly.ax+' '+fly.ay+' L'+fly.bx+' '+fly.by);path.setAttribute('opacity',Math.max(0,1-(t-fly.t0)/(fly.dur+fly.hold)));}else path.setAttribute('opacity',0);
 }
 if(!fly){ball.x=me.x+3;ball.y=me.y+1.8;}
 ballEl.setAttribute('cx',ball.x);ballEl.setAttribute('cy',ball.y);
 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
