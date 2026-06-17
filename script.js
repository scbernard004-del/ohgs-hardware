(function(){
  const d=document, body=d.body, html=d.documentElement;
  const $=(s,c=d)=>c.querySelector(s), $$=(s,c=d)=>Array.from(c.querySelectorAll(s));
  let lang=localStorage.getItem('ohgsLang')||'en';
  function applyLang(v){lang=v==='sw'?'sw':'en';html.lang=lang;$$('[data-en]').forEach(el=>{el.textContent=lang==='sw'?(el.dataset.sw||el.dataset.en):el.dataset.en});localStorage.setItem('ohgsLang',lang)}
  window.toggleLang=()=>applyLang(lang==='en'?'sw':'en');
  function applyTheme(t){const light=t==='light';body.classList.toggle('light',light);html.classList.toggle('light',light);localStorage.setItem('ohgsTheme',light?'light':'dark')}
  window.toggleTheme=()=>applyTheme(body.classList.contains('light')?'dark':'light');
  applyTheme(localStorage.getItem('ohgsTheme')||'dark'); applyLang(lang);
  const btn=$('#menuBtn'), menu=$('#mainMenu');
  function close(){body.classList.remove('menu-open');btn?.classList.remove('is-open');btn?.setAttribute('aria-expanded','false')}
  btn?.addEventListener('click',e=>{e.preventDefault();body.classList.toggle('menu-open');btn.classList.toggle('is-open');btn.setAttribute('aria-expanded',body.classList.contains('menu-open')?'true':'false')});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=980)close()}));
  d.addEventListener('click',e=>{if(innerWidth<=980 && !$('.site-header')?.contains(e.target))close()});
  function header(){ $('.site-header')?.classList.toggle('scrolled',scrollY>8) }
  addEventListener('scroll',header,{passive:true}); header();
  addEventListener('resize',()=>{if(innerWidth>980)close()},{passive:true});
  $$('img').forEach(img=>{img.loading='lazy'; img.decoding='async'});
  setTimeout(()=>$('#loader')?.classList.add('hide'),650);
  addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('hide'),300),{once:true});
})();
