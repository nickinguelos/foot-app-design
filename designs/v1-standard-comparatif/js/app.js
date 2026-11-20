const root=document.documentElement;
const pal=document.querySelectorAll('[data-pal]');
function setPal(p){root.dataset.palette=p;pal.forEach(b=>b.setAttribute('aria-pressed',b.dataset.pal===p));}
pal.forEach(b=>b.addEventListener('click',()=>setPal(b.dataset.pal)));
const n3=document.getElementById('n3');
n3.addEventListener('click',()=>{const on=root.classList.toggle('n3');n3.setAttribute('aria-pressed',on);n3.textContent=on?'Finitions N3 : activées':'Finitions N3 : désactivées';});
setPal('nuit');
