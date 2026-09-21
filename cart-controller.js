(function(){
'use strict';

var SELECTOR='[data-open-cart], a[href="#cart"], a[href="#cartModal"], .cart-action, .cart-icon';

function byId(id){return document.getElementById(id)}

function forceModalVisible(modal){
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  modal.style.setProperty('display','block','important');
  modal.style.setProperty('visibility','visible','important');
  modal.style.setProperty('opacity','1','important');
  modal.style.setProperty('pointer-events','auto','important');
  modal.style.setProperty('z-index','2147483647','important');
  document.body.classList.add('cart-open');
  document.body.style.overflow='hidden';
}

function openCart(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  var modal=byId('cartModal');
  if(!modal)return false;
  try{
    if(typeof window.renderCart==='function')window.renderCart();
  }catch(err){
    console.error('Dastchin cart render error:',err);
  }
  forceModalVisible(modal);
  return false;
}

function closeCart(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  var modal=byId('cartModal');
  if(!modal)return false;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  modal.style.removeProperty('display');
  modal.style.removeProperty('visibility');
  modal.style.removeProperty('opacity');
  modal.style.removeProperty('pointer-events');
  modal.style.removeProperty('z-index');
  document.body.classList.remove('cart-open');
  document.body.style.overflow='';
  return false;
}

function closeCheckout(){
  var modal=byId('checkoutModal');
  if(modal)modal.remove();
  document.body.style.overflow='';
}

function money(value){
  return Number(value||0).toLocaleString('fa-IR')+' تومان';
}

function checkout(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  var items=[];
  try{
    items=window.__dastchinGetCartItems?window.__dastchinGetCartItems():[];
  }catch(err){
    console.error('Dastchin cart read error:',err);
  }
  if(!items.length){
    alert('سبد خرید خالی است');
    return false;
  }

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
    button.addEventListener('click',function(e){e.preventDefault();closeCheckout()});
  });

  var form=modal.querySelector('#checkoutForm');
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();
    var data=new FormData(form);
    var order={
      id:'DC-'+Date.now(),
      createdAt:new Date().toISOString(),
      customer:Object.fromEntries(data.entries()),
      items:items.map(function(item){return{id:item.product.id,name:item.product.name,qty:item.qty,price:item.product.price}}),
      total:total,
      status:'ثبت اولیه'
    };
    localStorage.setItem('dastchin_last_order',JSON.stringify(order));
    if(typeof window.__dastchinClearCartInternal==='function')window.__dastchinClearCartInternal();
    modal.querySelector('.checkout-panel').innerHTML='<div class="order-success"><div>✓</div><h2>سفارش ثبت شد</h2><p>شماره سفارش: <strong>'+order.id+'</strong></p><p>سفارش شما برای ادامه فرایند آماده است.</p><button type="button" class="checkout-submit" id="finishOrder">بازگشت به فروشگاه</button></div>';
    modal.querySelector('#finishOrder').addEventListener('click',closeCheckout);
  });
  return false;
}

function handleClick(event){
  var target=event.target;
  if(!target||!target.closest)return;

  var openTarget=target.closest(SELECTOR);
  if(openTarget){
    openCart(event);
    return;
  }

  var closeTarget=target.closest('[data-cart-close],[data-cart-overlay]');
  if(closeTarget){
    closeCart(event);
    return;
  }

  var checkoutTarget=target.closest('.checkout-btn');
  if(checkoutTarget){
    checkout(event);
  }
}

function init(){
  document.addEventListener('click',handleClick,true);
  document.addEventListener('pointerup',handleClick,true);
  window.openDastchinCart=openCart;
  window.openCart=openCart;
  window.closeDastchinCart=closeCart;
  window.closeCart=closeCart;
  document.documentElement.setAttribute('data-dastchin-cart-controller','ready');
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();