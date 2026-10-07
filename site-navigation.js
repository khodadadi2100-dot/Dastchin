(()=>{'use strict';
const $=s=>document.querySelector(s);
const drawer=$('#drawer'),overlay=$('#overlay');
function closeDrawer(){drawer?.classList.remove('open');drawer?.setAttribute('aria-hidden','true');overlay?.classList.remove('show')}
function openDrawer(){drawer?.classList.add('open');drawer?.setAttribute('aria-hidden','false');overlay?.classList.add('show')}
function tracking(){
 closeDrawer();
 const old=document.getElementById('dastchinTrackingModal');old?.remove();
 const m=document.createElement('div');m.id='dastchinTrackingModal';m.className='checkout-modal';
 m.innerHTML='<div class="checkout-overlay" data-track-close></div><div class="checkout-panel" role="dialog" aria-modal="true"><div class="checkout-head"><h2>پیگیری سفارش</h2><button type="button" data-track-close>×</button></div><p style="line-height:2;color:#667">برای پیگیری، ابتدا وارد حساب کاربری شوید تا سفارش‌های ثبت‌شده و وضعیت آن‌ها نمایش داده شود.</p><button type="button" class="checkout-submit" id="trackingAccount">ورود به حساب کاربری</button></div>';
 document.body.appendChild(m);
 m.querySelectorAll('[data-track-close]').forEach(x=>x.onclick=()=>m.remove());
 $('#trackingAccount')?.addEventListener('click',()=>{m.remove();window.dastchinOpenAccount?.()});
}
function account(){closeDrawer();if(window.dastchinOpenAccount)window.dastchinOpenAccount();else location.hash='account'}
function route(hash){
 const h=(hash||'#home').replace(/^#/,'');
 if(h==='account'){account();return true}
 if(h==='tracking'){tracking();return true}
 if(h==='cart'){window.openDastchinCart?.();return true}
 if(h==='home'||h==='products'){document.getElementById(h)?.scrollIntoView({behavior:'smooth',block:'start'});closeDrawer();return true}
 return false;
}
document.addEventListener('click',e=>{
 const cart=e.target.closest('[data-open-cart]');
 if(cart){e.preventDefault();e.stopPropagation();window.openDastchinCart?.(e);return}
 const menu=e.target.closest('#menuButton');if(menu){e.preventDefault();openDrawer();return}
 const dc=e.target.closest('#drawerClose');if(dc){e.preventDefault();closeDrawer();return}
 if(e.target.closest('#overlay')){closeDrawer();return}
 const nav=e.target.closest('.bottom-nav a,.drawer-main a,.drawer-section a,.footer a,.tracking-banner a,.round-action,.brand,.section-head a');
 if(nav){const href=nav.getAttribute('href')||'';if(href.startsWith('#')&&route(href)){e.preventDefault();return}}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();document.getElementById('dastchinTrackingModal')?.remove()}});
window.addEventListener('hashchange',()=>route(location.hash));
route(location.hash);
})();