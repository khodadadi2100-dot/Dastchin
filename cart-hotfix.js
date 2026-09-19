(function(){
function openCartDirect(){
  const m=document.getElementById('cartModal');
  if(!m)return;
  m.classList.add('show');
  m.setAttribute('aria-hidden','false');
  document.body.classList.add('cart-open');
}
function closeCartDirect(){
  const m=document.getElementById('cartModal');
  if(!m)return;
  m.classList.remove('show');
  m.setAttribute('aria-hidden','true');
  document.body.classList.remove('cart-open');
}
document.addEventListener('click',function(e){
  const t=e.target.closest && e.target.closest('a[href="#cart"],[data-open-cart],.cart-action,.cart-icon');
  if(t){
    e.preventDefault();
    e.stopPropagation();
    openCartDirect();
    return;
  }
  if(e.target.closest && e.target.closest('[data-cart-close],[data-cart-overlay]')) closeCartDirect();
},true);
window.openDastchinCart=openCartDirect;
window.closeDastchinCart=closeCartDirect;
})();