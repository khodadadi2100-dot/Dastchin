(function(){
function openCart(){var m=document.getElementById('cartModal');if(!m)return;try{if(typeof window.renderCart==='function')window.renderCart()}catch(e){}m.classList.add('show');m.setAttribute('aria-hidden','false');document.body.classList.add('cart-open');}
function closeCart(){var m=document.getElementById('cartModal');if(!m)return;m.classList.remove('show');m.setAttribute('aria-hidden','true');document.body.classList.remove('cart-open');}
window.openDastchinCart=openCart;window.closeDastchinCart=closeCart;
function bind(){document.querySelectorAll('.cart-action,[data-open-cart],a[href="#cart"],.cart-icon').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openCart();},false);});document.querySelectorAll('[data-cart-close],[data-cart-overlay]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();closeCart();},false);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();