(function(){
'use strict';

var OPEN_SELECTOR='[data-open-cart]';
var CLOSE_SELECTOR='[data-cart-close],[data-cart-overlay]';

function getCartModal(){ return document.getElementById('cartModal'); }

function setBodyLocked(locked){
  document.body.classList.toggle('cart-open',locked);
  document.body.style.overflow=locked?'hidden':'';
}

function closeDrawerIfOpen(){
  var drawer=document.getElementById('drawer');
  var overlay=document.getElementById('overlay');
  if(drawer) drawer.classList.remove('open');
  if(overlay) overlay.classList.remove('show');
  if(drawer) drawer.setAttribute('aria-hidden','true');
}

function openCart(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  var modal=getCartModal();
  if(!modal) return false;
  closeDrawerIfOpen();
  try{
    if(typeof window.renderCart==='function') window.renderCart();
  }catch(error){
    console.error('Dastchin: renderCart failed',error);
  }
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  setBodyLocked(true);
  return false;
}

function closeCart(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  var modal=getCartModal();
  if(!modal) return false;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  setBodyLocked(false);
  return false;
}

function closeCheckout(){
  var modal=document.getElementById('checkoutModal');
  if(modal) modal.remove();
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
    items=typeof window.__dastchinGetCartItems==='function'
      ? window.__dastchinGetCartItems()
      : [];
  }catch(error){
    console.error('Dastchin: cart read failed',error);
  }

  if(!items.length){
    alert('سبد خرید خالی است');
    return false;
  }

  closeCart();
  var old=document.getElementById('checkoutModal');
  if(old) old.remove();

  var total=items.reduce(function(sum,item){
    return sum+(Number(item.product.price)||0)*(Number(item.qty)||0);
  },0);

  var modal=document.createElement('div');
  modal.id='checkoutModal';
  modal.className='checkout-modal';
  modal.innerHTML=
    '<div class="checkout-overlay" data-checkout-close></div>'+
    '<div class="checkout-panel" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">'+
      '<div class="checkout-head">'+
        '<div><h2 id="checkoutTitle">نهایی کردن سفارش</h2><small>اطلاعات ارسال و پرداخت</small></div>'+
        '<button type="button" data-checkout-close aria-label="بستن">×</button>'+
      '</div>'+
      '<form id="checkoutForm">'+
        '<label>نام و نام خانوادگی<input name="name" required autocomplete="name"></label>'+
        '<label>شماره موبایل<input name="phone" required inputmode="tel" pattern="[0-9۰-۹+ -]{10,}" autocomplete="tel"></label>'+
        '<label>آدرس کامل<input name="address" required autocomplete="street-address"></label>'+
        '<div class="checkout-row">'+
          '<label>روش ارسال<select name="shipping"><option value="پیک دستچین">پیک دستچین</option><option value="ارسال عادی">ارسال عادی</option></select></label>'+
          '<label>روش پرداخت<select name="payment"><option value="پرداخت آنلاین">پرداخت آنلاین</option><option value="پرداخت هنگام تحویل">پرداخت هنگام تحویل</option></select></label>'+
        '</div>'+
        '<div class="checkout-total"><span>مبلغ قابل پرداخت</span><strong>'+money(total)+'</strong></div>'+
        '<button class="checkout-submit" type="submit">ثبت سفارش</button>'+
        '<p class="checkout-note">در این نسخه پرداخت بانکی واقعی متصل نیست و سفارش در مرورگر ثبت اولیه می‌شود.</p>'+
      '</form>'+
    '</div>';

  document.body.appendChild(modal);
  document.body.style.overflow='hidden';

  modal.querySelectorAll('[data-checkout-close]').forEach(function(button){
    button.addEventListener('click',function(event){
      event.preventDefault();
      closeCheckout();
    });
  });

  var form=modal.querySelector('#checkoutForm');
  if(form){
    form.addEventListener('submit',function(event){
      event.preventDefault();
      var data=new FormData(form);
      var order={
        id:'DC-'+Date.now(),
        createdAt:new Date().toISOString(),
        customer:Object.fromEntries(data.entries()),
        items:items.map(function(item){
          return {id:item.product.id,name:item.product.name,qty:item.qty,price:item.product.price};
        }),
        total:total,
        status:'ثبت اولیه'
      };

      localStorage.setItem('dastchin_last_order',JSON.stringify(order));
      if(typeof window.__dastchinClearCartInternal==='function'){
        window.__dastchinClearCartInternal();
      }

      modal.querySelector('.checkout-panel').innerHTML=
        '<div class="order-success">'+
          '<div>✓</div><h2>سفارش ثبت شد</h2>'+
          '<p>شماره سفارش: <strong>'+order.id+'</strong></p>'+
          '<p>سفارش شما برای ادامه فرایند آماده است.</p>'+
          '<button type="button" class="checkout-submit" id="finishOrder">بازگشت به فروشگاه</button>'+
        '</div>';

      modal.querySelector('#finishOrder').addEventListener('click',closeCheckout);
    });
  }

  return false;
}

function handleCartClick(event){
  var target=event.target;
  if(!target || !target.closest) return;

  var open=target.closest(OPEN_SELECTOR);
  if(open){
    openCart(event);
    return;
  }

  var close=target.closest(CLOSE_SELECTOR);
  if(close){
    closeCart(event);
    return;
  }

  var checkoutButton=target.closest('.checkout-btn');
  if(checkoutButton){
    checkout(event);
  }
}

function init(){
  document.addEventListener('click',handleCartClick,true);
  window.openDastchinCart=openCart;
  window.openCart=openCart;
  window.closeDastchinCart=closeCart;
  window.closeCart=closeCart;
  window.openDastchinCheckout=checkout;
  document.documentElement.setAttribute('data-dastchin-cart-controller','ready');
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init,{once:true});
}else{
  init();
}
})();