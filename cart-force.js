(function(){
'use strict';
function byId(id){return document.getElementById(id)}
function showCart(e){
  if(e){e.preventDefault();e.stopPropagation();}
  var m=byId('cartModal');
  if(!m)return;
  try{if(typeof window.renderCart==='function')window.renderCart()}catch(err){}
  m.classList.add('show');
  m.setAttribute('aria-hidden','false');
  m.style.cssText += ';display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483647!important;';
  document.body.classList.add('cart-open');
  document.body.style.overflow='hidden';
}
function hideCart(e){
  if(e){e.preventDefault();e.stopPropagation();}
  var m=byId('cartModal'); if(!m)return;
  m.classList.remove('show');
  m.setAttribute('aria-hidden','true');
  m.style.cssText += ';display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;';
  document.body.classList.remove('cart-open');
  document.body.style.overflow='';
}
function bind(){
  var selectors=['.cart-action','[data-open-cart]','.bottom-nav a[href="#cart"]','.drawer-main a[href="#cart"]'];
  selectors.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){
      el.addEventListener('click',showCart,false);
    });
  });
  var close=byId('cartModal');
  if(close){
    close.querySelectorAll('[data-cart-close],[data-cart-overlay]').forEach(function(el){
      el.addEventListener('click',hideCart,false);
    });
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape')hideCart();});
  window.openDastchinCart=showCart;
  window.closeDastchinCart=hideCart;
  window.openCart=showCart;
  window.closeCart=hideCart;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();