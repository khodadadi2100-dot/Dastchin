(function(){
'use strict';
var SELECTOR='a[href="#cart"],[data-open-cart],.cart-action,.cart-icon,[data-cart-open]';
function modal(){return document.getElementById('cartModal')}
function render(){try{if(typeof window.renderCart==='function')window.renderCart()}catch(e){console.error('[Dastchin cart render]',e)}}
function openCart(e){var m=modal();if(!m)return; if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation()} render();m.classList.add('show');m.setAttribute('aria-hidden','false');m.style.setProperty('display','block','important');m.style.setProperty('visibility','visible','important');m.style.setProperty('opacity','1','important');m.style.setProperty('pointer-events','auto','important');m.style.setProperty('z-index','2147483000','important');document.body.classList.add('cart-open');document.body.style.overflow='hidden';}
function closeCart(e){var m=modal();if(!m)return;if(e){e.preventDefault();e.stopPropagation()}m.classList.remove('show');m.setAttribute('aria-hidden','true');m.style.setProperty('display','none','important');m.style.setProperty('visibility','hidden','important');m.style.setProperty('opacity','0','important');m.style.setProperty('pointer-events','none','important');document.body.classList.remove('cart-open');document.body.style.overflow='';}
function trigger(e){return e.target&&e.target.closest?e.target.closest(SELECTOR):null}
function bind(){
 document.addEventListener('click',function(e){var t=trigger(e);if(t){openCart(e);return}if(e.target&&e.target.closest&&e.target.closest('[data-cart-close],[data-cart-overlay]'))closeCart(e)},true);
 document.addEventListener('touchend',function(e){var t=trigger(e);if(t){openCart(e)}},true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCart()},true);
 window.addEventListener('hashchange',function(){if(location.hash==='#cart')openCart()},true);
 window.openDastchinCart=openCart;window.openCart=openCart;window.closeDastchinCart=closeCart;window.closeCart=closeCart;
 var m=modal();if(m){m.setAttribute('aria-hidden','true');m.style.setProperty('display','none','important');m.style.setProperty('visibility','hidden','important');m.style.setProperty('pointer-events','none','important')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
