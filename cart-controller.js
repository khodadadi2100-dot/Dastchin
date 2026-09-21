(function(){
'use strict';

var TRIGGERS='[data-open-cart], .cart-action, .bottom-nav a[href="#cart"], .drawer-main a[href="#cart"]';

function byId(id){return document.getElementById(id)}

function openCart(event){
  if(event)event.preventDefault();
  var modal=byId('cartModal');
  if(!modal)return;
  if(typeof window.renderCart==='function')window.renderCart();
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('cart-open');
  document.body.style.overflow='hidden';
}

function closeCart(event){
  if(event)event.preventDefault();
  var modal=byId('cartModal');
  if(!modal)return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('cart-open');
  document.body.style.overflow='';
}

function closeCheckout(){
  var modal=byId('checkoutModal');
  if(modal)modal.remove();
  document.body.style.overflow='';
}

function money(value){
  return Number(value).toLocaleString('fa-IR')+' تومان';
}

function checkout(){
  var items=window.__dastchinGetCartItems?window.__dastchinGetCartItems():[];
  if(!items.length){alert('سبد خرید خالی است');return;}
  closeCart();
  var old=byId('checkoutModal');
  if(old)old.remove();

  var total=items.reduce(function(sum,item){
    return sum+(Number(item.product.price)||0)*(Number(item.qty)||0);
  },0);

  var modal=document.createElement('div');
  modal.id='checkoutModal';
  modal.className='checkout-modal';
  modal.innerHTML='<div class="checkout-overlay" data-checkout-close></div>'+
    '<div class="checkout-panel" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">'+
      '<div class="checkout-head"><div><h2 id="checkoutTitle">نهایی کردن سفارش</h2><small>اطلاعات ارسال و پرداخت</small></div><button type="button" data-checkout-close aria-label="بستن">×</button></div>'+
      '<form id="checkoutForm">'+
        '<label>نام و نام خانوادگی<input name="name" required autocomplete="name"></label>'+
        '<label>شماره موبایل<input name="phone" required inputmode="tel" pattern="[0-9۰-۹+ -]{10,}" autocomplete="tel"></label>'+
        '<label>آدرس کامل<input name="address" required autocomplete="street-address"></label>'+
        '<div class="checkout-row"><label>روش ارسال<select name="shipping"><option value="پیک دستچین">پیک دستچین</option><option value="ارسال عادی">ارسال عادی</option></select></label><label>روش پرداخت<select name="payment"><option value="پرداخت آنلاین">پرداخت آنلاین</option><option value="پرداخت هنگام تحویل">پرداخت هنگام تحویل</option></select></label></div>'+
        '<div class="checkout-total"><span>مبلغ قابل پرداخت</span><strong>'+money(total)+'</strong></div>'+
        '<button class="checkout-submit" type="submit">ثبت سفارش</button>'+
        '<p class="checkout-note">در این نسخه پرداخت بانکی واقعی متصل نیست و سفارش در مرورگر ثبت اولیه می‌شود.</p>'+
      '</form></div>';

  document.body.appendChild(modal);
  document.body.style.overflow='hidden';

  modal.querySelectorAll('[data-checkout-close]').forEach(function(button){
    button.addEventListener('click',closeCheckout);
  });

  modal.querySelector('form').addEventListener('submit',function(event){
    event.preventDefault();
    var form=new FormData(event.currentTarget);
    var order={
      id:'DC-'+Date.now(),
      createdAt:new Date().toISOString(),
      customer:Object.fromEntries(form.entries()),
      items:items.map(function(item){return{id:item.product.id,name:item.product.name,qty:item.qty,price:item.product.price};}),
      total:total,
      status:'ثبت اولیه'
    };
    localStorage.setItem('dastchin_last_order',JSON.stringify(order));
    if(typeof window.__dastchinClearCartInternal==='function')window.__dastchinClearCartInternal();
    modal.querySelector('.checkout-panel').innerHTML='<div class="order-success"><div>✓</div><h2>سفارش ثبت شد</h2><p>شماره سفارش: <strong>'+order.id+'</strong></p><p>سفارش شما برای ادامه فرایند آماده است.</p><button type="button" class="checkout-submit" id="finishOrder">بازگشت به فروشگاه</button></div>';
    modal.querySelector('#finishOrder').addEventListener('click',closeCheckout);
  });
}

function bind(){
  var modal=byId('cartModal');
  if(!modal)return;

  document.querySelectorAll(TRIGGERS).forEach(function(trigger){
    trigger.addEventListener('click',openCart);
  });

  var closeButton=modal.querySelector('[data-cart-close]');
  var overlay=modal.querySelector('[data-cart-overlay]');
  var checkoutButton=modal.querySelector('.checkout-btn');

  if(closeButton)closeButton.addEventListener('click',closeCart);
  if(overlay)overlay.addEventListener('click',closeCart);
  if(checkoutButton)checkoutButton.addEventListener('click',checkout);

  window.openDastchinCart=openCart;
  window.openCart=openCart;
  window.closeDastchinCart=closeCart;
  window.closeCart=closeCart;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
else bind();
})();