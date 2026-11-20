/* Scènes communes : icône, lancement, match (situations contextuelles), pause, pack, contrôles.
   Commandes issues de Notion 01.2 / SPEC-4 (à prototyper) : joystick virtuel, passe tactile, passe en profondeur,
   double-tap = tir, inertie ~1 s. Centre et dribble : propositions non documentées. */
(function(){
const B=document.body.dataset;
const icon=window.THEME_ICON||'';
const SV={
 pause:'<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
 deep:'<svg viewBox="0 0 24 24"><path d="M5 19L19 5M9 5h10v10"/></svg>',
 cross:'<svg viewBox="0 0 24 24"><path d="M4 19Q10 3 20 8M20 8l-5-2M20 8l-1 5"/></svg>',
 drib:'<svg viewBox="0 0 24 24"><path d="M4 18L9 7l5 11 6-11"/></svg>'
};
const PL=[[40,50,'h',1],[70,30,'h',8],[70,70,'h',6],[100,50,'h',10],[118,60,'h',9,1],[60,50,'g',1],[130,40,'a',7],[145,62,'a',4],[156,40,'a',11],[165,52,'a',5]];
function players(){let h='';PL.forEach(p=>{const t=p[2];h+=(p[4]?'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6.2" fill="none" stroke="var(--sel)" stroke-width=".9" stroke-dasharray="2 1.4"/>':'')+'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.2" fill="var(--'+(t=='h'?'home':t=='a'?'away':'gk')+')" stroke="var(--ring)" stroke-width=".9"/><text x="'+p[0]+'" y="'+(p[1]+1.6)+'" font-size="4.4" font-weight="700" text-anchor="middle" fill="var(--num-'+(t=='h'?'home':t=='a'?'away':'gk')+')">'+p[3]+'</text>';});return h+'<circle cx="123" cy="58" r="1.7" fill="#fff" stroke="#111" stroke-width=".5"/>';}
function pitch(full){return '<svg class="pitch" viewBox="0 0 200 100" preserveAspectRatio="none" aria-label="terrain"><rect width="200" height="100" fill="var(--pa)"/><g fill="var(--pb)"><rect width="25" height="100"/><rect x="50" width="25" height="100"/><rect x="100" width="25" height="100"/><rect x="150" width="25" height="100"/></g><g fill="none" stroke="var(--line)" stroke-width=".6"><rect x="6" y="6" width="188" height="88"/><line x1="100" y1="6" x2="100" y2="94"/><circle cx="100" cy="50" r="13"/><rect x="6" y="28" width="22" height="44"/><rect x="172" y="28" width="22" height="44"/></g>'+(full?'<g fill="none" stroke="var(--tac)" stroke-width=".8" stroke-dasharray="3 2"><path class="lane lane-deep" d="M124 58 C134 48 146 40 162 34"/><path class="lane lane-cross" d="M124 58 C150 20 170 22 182 40"/></g><g>'+players()+'</g>':'')+'</svg>';}
const name=B.name||document.title;
const app=document.getElementById('app');
app.innerHTML=`
<div class="top"><a href="../../">← Index</a><span>${name}</span></div>
<main>
<h1>${name}</h1>
<div class="warnbox">${B.sub||''} Proposition : aucune couleur ni direction n'est validée (Notion, AICOL-4). Écrans en paysage ; le texte s'adapte à la largeur.</div>

<h2>1. Icône</h2><div class="row" id="icons"></div>

<h2>2. Lancement (hors-match)</h2>
<div class="scr launch">
 <div class="abs logo"><span class="ico" data-ico></span><span>FOOT<span class="tag">jouer · comprendre · progresser</span></span></div>
 <div class="abs cards">
  <div class="card"><span>Défi tactique du jour<small>Pressing haut · 3 min</small></span><b>+120</b></div>
  <div class="card"><span>Reprendre le match<small>2–1 · 63e minute</small></span><b>▶</b></div>
  <div class="card"><span>Mes profils<small>3 packs actifs</small></span><b>›</b></div>
 </div>
 <button class="abs btn pri cta">Jouer un match</button>
</div>

<h2>3. Match : commandes contextuelles</h2>
<p class="note">Vue de base : joystick à gauche, une seule action principale à droite. Les actions secondaires n'apparaissent que si la situation les rend utiles. Touche une situation :</p>
<div class="sits" id="sits">
 <button class="sitchip" data-sit="free">Sans ballon</button>
 <button class="sitchip" data-sit="ball">Ballon, ligne ouverte</button>
 <button class="sitchip" data-sit="wing">Sur l'aile</button>
 <button class="sitchip" data-sit="duel">1 contre 1</button>
</div>
<div class="scr match" id="match" data-sit="ball">
 ${pitch(true)}
 <div class="abs hud"><span class="tm">BLEU</span><span class="sc"><b>2</b><i></i><b>1</b></span><span class="tm">ROUGE</span><span class="clk">63'</span></div>
 <button class="abs btn round pausebtn" aria-label="Pause">${SV.pause}</button>
 <div class="abs stick" aria-label="Joystick virtuel"><i></i></div>
 <div class="abs actions">
  <button class="btn ctxb round a-deep" aria-label="Passe en profondeur">${SV.deep}<span>Profondeur</span></button>
  <button class="btn ctxb round a-cross" aria-label="Centre">${SV.cross}<span>Centre</span></button>
  <button class="btn ctxb round a-drib" aria-label="Dribble">${SV.drib}<span>Dribble</span></button>
  <button class="btn pri round a-pass" aria-label="Passe, double-tap pour tirer">Passe<small>×2 tir</small></button>
 </div>
 <div class="abs hintline"><span class="h-free">Joystick · touche un coéquipier pour le contrôler</span><span class="h-ball">Passe · double-tap = tir · profondeur disponible</span><span class="h-wing">Passe · double-tap = tir · centre disponible</span><span class="h-duel">Passe · double-tap = tir · dribble disponible</span></div>
</div>
<p class="note">Base : joystick (inertie ~1 s après relâchement), passe tactile, passe en profondeur, double-tap pour tirer (Notion 01.2, à prototyper). Centre et dribble sont des propositions : ils ne sont pas documentés.</p>

<h2>4. Pause</h2>
<div class="scr">${pitch(false)}<div class="abs dim"></div>
 <div class="abs panel"><h3>Pause</h3><button class="btn pri">Reprendre</button><button class="btn">Rembobiner</button><button class="btn">Remplacements</button><button class="btn">Réglages</button></div></div>

<h2>5. Carte de pack</h2>
<div class="pack"><span class="tg">PREMIUM</span><h3>Pack Pressing haut</h3><p>12 profils tactiques · 6 défis guidés</p><div class="buy"><span style="color:var(--tac-text,var(--tac));font-weight:700">◆ 6 défis</span><button class="pbtn">Obtenir</button></div></div>

<h2>6. États et cartons</h2>
<div class="states"><span class="st ok">✔ Succès</span><span class="st wn">⚠ Avertissement</span><span class="st er">✖ Erreur</span><button class="pbtn">Action principale</button><span class="cardsq" style="background:var(--card-yellow)"></span><span class="cardsq" style="background:var(--card-red)"></span></div>
<div class="sw" id="sw" style="margin-top:14px"></div>
</main>`;
document.querySelectorAll('[data-ico]').forEach(e=>{e.innerHTML=icon;});
const ic=document.getElementById('icons');[96,48,29].forEach(s=>{const d=document.createElement('span');d.className='ico';d.style.cssText='width:'+s+'px;height:'+s+'px';d.innerHTML=icon;ic.appendChild(d);});
const m=document.getElementById('match');
document.querySelectorAll('.sitchip').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.sit===m.dataset.sit);b.addEventListener('click',()=>{m.dataset.sit=b.dataset.sit;document.querySelectorAll('.sitchip').forEach(x=>x.setAttribute('aria-pressed',x===b));});});
const sw=document.getElementById('sw');['bg','s1','s2','bd','t1','t2','acc','acc2','tac','ok','warn','err'].forEach(n=>{const d=document.createElement('div');d.style.background='var(--'+n+')';d.style.color=['bg','s1','s2','bd'].includes(n)?'var(--t1)':'var(--acc-ink)';d.textContent=n;sw.appendChild(d);});
})();
