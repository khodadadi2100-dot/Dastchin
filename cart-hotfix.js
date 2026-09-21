(function(){
  'use strict';
  var OPEN='a[href="#cart"],[data-open-cart],.cart-action,.cart-icon,[data-cart-open]';
  var CLOSE='[data-cart-close],[data-cart-overlay]';

  function get(){return document.getElementById('cartModal')}
  function render(){try{if(typeof window.renderCart==='function')window.renderCart()}catch(e){console.error('[Dastchin cart]',e)}}

  function open(e){
    if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation()}
    var m=get();if(!m)return false;
    render();
    m.classList.add('show');
    m.setAttribute('aria-hidden','false');
    m.style.display='block';
    m.style.visibility='visible';
    m.style.opacity='1';
    m.style.pointerEvents='auto';
    document.body.classList.add('cart-open');
    document.body.style.overflow='hidden';
    return false;
  }

  function close(e){
    if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation()}
    var m=get();if(!m)return;
    m.classList.remove('show');
    m.setAttribute('aria-hidden','true');
    m.style.display='none';
    m.style.visibility='hidden';
    m.style.opacity='0';
    m.style.pointerEvents='none';
    document.body.classList.remove('cart-open');
    document.body.style.overflow='';
  }

  function trigger(e){
    return e.target&&e.target.closest?e.target.closest(OPEN):null;
  }

  function bind(){
    document.addEventListener('pointerdown',function(e){if(trigger(e))open(e)},true);
    document.addEventListener('click',function(e){
      if(trigger(e)){open(e);return}
      if(e.target&&e.target.closest&&e.target.closest(CLOSE))close(e);
    },true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close()},true);
    window.addEventListener('hashchange',function(){if(location.hash==='#cart')open()},true);
    window.openDastchinCart=open;
    window.closeDastchinCart=close;
    window.openCart=open;
    window.closeCart=close;
    var m=get();
    if(m){m.setAttribute('aria-hidden','true');m.style.display='none';m.style.visibility='hidden';m.style.pointerEvents='none'}
    if(location.hash==='#cart')open();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();