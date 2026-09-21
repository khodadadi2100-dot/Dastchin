(function(){
'use strict';
const OPEN='[data-open-cart]';
const CLOSE='[data-cart-close],[data-cart-overlay]';
const modal=()=>document.getElementById('cartModal');
const lockBody=locked=>{document.body.classList.toggle('cart-open',locked);document.body.style.overflow=locked?'hidden':''};
const closeDrawer=()=>{const d=document.getElementById('drawer'),o=document.getElementById('overlay');d?.classList.remove('open');o?.classList.remove('show');d?.setAttribute('aria-hidden','true')};
function openCart(e){e?.preventDefault();e?.stopPropagation();const m=modal();if(!m)return false;closeDrawer();try{window.renderCart?.()}catch(err){console.error('Dastchin cart render error:',err)}m.classList.add('show');m.setAttribute('aria-hidden','false');lockBody(true);return false}
function closeCart(e){e?.preventDefault();e?.stopPropagation();const m=modal();if(!m)return false;m.classList.remove('show');m.setAttribute('aria-hidden','true');lockBody(false);return false}
function closeCheckout(){document.getElementById('checkoutModal')?.remove();lockBody(false)}
const money=v=>Number(v||0).toLocaleString('fa-IR')+' تومان';
function checkout(e){
 e?.preventDefault();e?.stopPropagation();let items=[];
 try{items=window.__dastchinGetCartItems?.()||[]}catch(err){console.error('Dastchin cart read error:',err)}
 if(!items.length){alert('سبد خرید خالی است');return false}
 closeCart();document.getElementById('checkoutModal')?.remove();
 const total=items.reduce((s,x)=>s+(Number(x.product.price)||0)*(Number(x.qty)||0),0);
 const m=document.createElement('div');m.id='checkoutModal';m.className='checkout-modal';
 m.innerHTML='<div class="checkout-overlay" data-checkout-close></div><div class="checkout-panel" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle"><div class="checkout-head"><div><h2 id="checkoutTitle">نهایی کردن سفارش</h2><small>اطلاعات ارسال و پرداخت</small></div><button type="button" data-checkout-close aria-label="بستن">×</button></div><form id="checkoutForm"><label>نام و نام خانوادگی<input name="name" required autocomplete="name"></label><label>شماره موبایل<input name="phone" required inputmode="tel" pattern="[0-9۰-۹+ -]{10,}" autocomplete="tel"></label><label>آدرس کامل<input name="address" required autocomplete="street-address"></label><div class="checkout-row"><label>روش ارسال<select name="shipping"><option value="پیک دستچین">پیک دستچین</option><option value="ارسال عادی">ارسال عادی</option></select></label><label>روش پرداخت<select name="payment"><option value="پرداخت آنلاین">پرداخت آنلاین</option><option value="پرداخت هنگام تحویل">پرداخت هنگام تحویل</option></select></label></div><div class="checkout-total"><span>مبلغ قابل پرداخت</span><strong>'+money(total)+'</strong></div><button class="checkout-submit" type="submit">ثبت سفارش</button><p class="checkout-note">در این نسخه پرداخت بانکی واقعی متصل نیست و سفارش در مرورگر ثبت اولیه می‌شود.</p></form></div>';
 document.body.appendChild(m);lockBody(true);
 m.querySelectorAll('[data-checkout-close]').forEach(x=>x.addEventListener('click',closeCheckout));
 m.querySelector('#checkoutForm')?.addEventListener('submit',ev=>{
  ev.preventDefault();const data=new FormData(ev.currentTarget);
  const order={id:'DC-'+Date.now(),createdAt:new Date().toISOString(),customer:Object.fromEntries(data.entries()),items:items.map(x=>({id:x.product.id,name:x.product.name,qty:x.qty,price:x.product.price})),total:total,status:'ثبت اولیه'};
  try{localStorage.setItem('dastchin_last_order',JSON.stringify(order))}catch(err){console.warn('Dastchin: order could not be persisted',err)}
  window.__dastchinClearCartInternal?.();
  m.querySelector('.checkout-panel').innerHTML='<div class="order-success"><div>✓</div><h2>سفارش ثبت شد</h2><p>شماره سفارش: <strong>'+order.id+'</strong></p><p>سفارش شما برای ادامه فرایند آماده است.</p><button type="button" class="checkout-submit" id="finishOrder">بازگشت به فروشگاه</button></div>';
  m.querySelector('#finishOrder')?.addEventListener('click',closeCheckout);
 });
 return false;
}
function handle(e){const t=e.target;if(!t?.closest)return;const open=t.closest(OPEN);if(open){openCart(e);return}const close=t.closest(CLOSE);if(close){closeCart(e);return}if(t.closest('.checkout-btn'))checkout(e)}
function init(){document.addEventListener('click',handle,true);document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.getElementById('checkoutModal'))closeCheckout();else if(modal()?.classList.contains('show'))closeCart(e)}});window.openDastchinCart=openCart;window.openCart=openCart;window.closeDastchinCart=closeCart;window.closeCart=closeCart;window.openDastchinCheckout=checkout;document.documentElement.dataset.dastchinCartController='ready'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();