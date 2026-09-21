(function(){
  'use strict';

  function getCart(){
    return document.getElementById('cartModal');
  }

  function openCart(e){
    if(e){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    var modal=getCart();
    if(!modal) return false;

    try{
      if(typeof window.renderCart==='function') window.renderCart();
    }catch(err){ console.error('Dastchin cart render:',err); }

    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('cart-open');
    return false;
  }

  function closeCart(e){
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }
    var modal=getCart();
    if(!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('cart-open');
  }

  window.openDastchinCart=openCart;
  window.closeDastchinCart=closeCart;

  function isCartTrigger(target){
    return target && target.closest &&
      target.closest('[data-open-cart],a[href="#cart"],.cart-action,.cart-icon,[data-cart-open]');
  }

  function bind(){
    document.addEventListener('click',function(e){
      var trigger=isCartTrigger(e.target);
      if(trigger){
        openCart(e);
        return;
      }
      if(e.target.closest && e.target.closest('[data-cart-close],[data-cart-overlay]')){
        closeCart(e);
      }
    },true);

    document.addEventListener('pointerup',function(e){
      var trigger=isCartTrigger(e.target);
      if(trigger){
        openCart(e);
      }
    },true);

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape') closeCart();
    });

    window.addEventListener('hashchange',function(){
      if(location.hash==='#cart') openCart();
    });

    if(location.hash==='#cart') openCart();

    // Keep direct handlers as a fallback for mobile browsers.
    document.querySelectorAll('[data-open-cart],a[href="#cart"],.cart-action,.cart-icon,[data-cart-open]').forEach(function(el){
      el.addEventListener('click',function(e){
        openCart(e);
      },true);
    });

    document.querySelectorAll('[data-cart-close],[data-cart-overlay]').forEach(function(el){
      el.addEventListener('click',closeCart,true);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bind);
  }else{
    bind();
  }
})();