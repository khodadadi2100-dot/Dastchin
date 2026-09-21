(function(){
'use strict';
var OPEN='[data-open-cart]';
var CLOSE='[data-cart-close],[data-cart-overlay]';
function modal(){return document.getElementById('cartModal')}
function openCart(event){
  if(event){event.preventDefault();event.stopImmediatePropagation();}
  var m=modal();if(!m)return false;
  try{if(typeof window.renderCart==='function')window.renderCart();}catch(err){console.error('Dastchin cart render error:',err)}
  m.classList.add('show');m.setAttribute('aria-hidden','false');
  document.body.classList.add('cart-open');document.body.style.overflow='hidden';return false;
}
function closeCart(event){
  if(event){event.preventDefault();event.stopImmediatePropagation();}
  var m=modal();if(!m)return false;
  m.classList.remove('show');m.setAttribute('aria-hidden','true');
  document.body.classList.remove('cart-open');document.body.style.overflow='';return false;
}
function closeCheckout(){var m=document.getElementById('checkoutModal');if(m)m.remove();document.body.style.overflow=''}
function money(v){return Number(v||0).toLocaleString('fa-IR')+' تومان'}
function checkout(event){
  if(event){event.preventDefault();event.stopImmediatePropagation()}
  var items=[];try{items=window.__dastchinGetCartItems?window.__dastchinGetCartItems():[]}catch(err){console.error('Dastchin cart read error:',err)}
  if(!items.length){alert('سبد خرید خالی است');return false}
  closeCart();var old=document.getElementById('checkoutModal');if(old)old.remove();
  var total=items.reduce(function(s,x){return s+(Number(x.product.price)||0)*(Number(x.qty)||0)},0);
  var m=document.createElement('div');m.id='checkoutModal';m.className='checkout-modal';
  m.innerHTML='<div class="checkout-overlay" data-checkout-close></div><div class="checkout-panel" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle"><div class="checkout-head"><div><h2 id="checkoutTitle">نهایی کردن سفارش</h2><small>اطلاعات ارسال و پرداخت</small></div><button type="button" data-checkout-close aria-label="بستن">×</button></div><form id="checkoutForm"><label>نام و نام خانوادگی<input name="name" required autocomplete="name"></label><label>شماره موبایل<input name="phone" required inputmode="tel" pattern="[0-9۰-۹+ -]{10,}" autocomplete="tel"></label><label>آدرس کامل<input name="address" required autocomplete="street-address"></label><div class="checkout-row"><label>روش ارسال<select name="shipping"><option value="پیک دستچین">پیک دستچین</option><option value="ارسال عادی">ارسال عادی</option></select></label><label>روش پرداخت<select name="payment"><option value="پرداخت آنلاین">پرداخت آنلاین</option><option value="پرداخت هنگام تحویل">پرداخت هنگام تحویل</option></select></label></div><div class="checkout-total"><span>مبلغ قابل پرداخت</span><strong>'+money(total)+'</strong></div><button class="checkout-submit" type="submit">ثبت سفارش</button><p class="checkout-note">در این نسخه پرداخت بانکی واقعی متصل نیست و سفارش در مرورگر ثبت اولیه می‌شود.</p></form></div>';
  document.body.appendChild(m);document.body.style.overflow='hidden';
  m.querySelectorAll('[data-checkout-close]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();closeCheckout()})});
  var form=m.querySelector('#checkoutForm');if(form)form.addEventListener('submit',function(e){e.preventDefault();var data=new FormData(form);var order={id:'DC-'+Date.now(),createdAt:new Date().toISOString(),customer:Object.fromEntries(data.entries()),items:items.map(function(x){return{id:x.product.id,name:x.product.name,qty:x.qty,price:x.product.price}}),total:total,status:'ثبت اولیه'};localStorage.setItem('dastchin_last_order',JSON.stringify(order));if(typeof window.__dastchinClearCartInternal==='function')window.__dastchinClearCartInternal();m.querySelector('.checkout-panel').innerHTML='<div class="order-success"><div>✓</div><h2>سفارش ثبت شد</h2><p>شماره سفارش: <strong>'+order.id+'</strong></p><p>سفارش شما برای ادامه فرایند آماده است.</p><button type="button" class="checkout-submit" id="finishOrder">بازگشت به فروشگاه</button></div>';m.querySelector('#finishOrder').addEventListener('click',closeCheckout)});
  return false;
}
function handle(event){var t=event.target;if(!t||!t.closest)return;var open=t.closest(OPEN);if(open){openCart(event);return}var close=t.closest(CLOSE);if(close){closeCart(event);return}var checkoutButton=t.closest('.checkout-btn');if(checkoutButton)checkout(event)}
function init(){document.addEventListener('click',handle,true);document.addEventListener('pointerup',handle,true);window.openDastchinCart=openCart;window.openCart=openCart;window.closeDastchinCart=closeCart;window.closeCart=closeCart;document.documentElement.setAttribute('data-dastchin-cart-controller','ready')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();