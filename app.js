const products=[
{id:'d1',name:'ماست محلی',weight:'۱ کیلوگرم',price:18000,category:'لبنیات',image:'https://www.gettyimages.com/',tag:'تازه',stock:25,description:'ماست محلی تازه و خوش‌طعم با بافت نرم و طعم سنتی.'},
{id:'d2',name:'ماست چکیده',weight:'۱ کیلوگرم',price:32000,category:'لبنیات',image:'https://www.gettyimages.com/',tag:'ویژه',stock:18,description:'ماست چکیده غلیظ و خوش‌طعم مناسب صبحانه و غذاهای محلی.'},
{id:'d3',name:'ماست و موسیر',weight:'۵۰۰ گرم',price:21000,category:'لبنیات',image:'https://www.gettyimages.com/',tag:'پرفروش',stock:20,description:'ماست و موسیر با طعم متعادل و عطر موسیر.'},
{id:'d4',name:'پنیر فله ای',weight:'۵۰۰ گرم',price:33000,category:'لبنیات',image:'https://rimibaltic-res.cloudinary.com/image/upload/b_white%2Cc_limit%2Cdpr_auto%2Cf_auto%2Cq_auto%3Alow%2Cw_auto/d_ecommerce%3Abackend-fallback.png/MAT_4009683_KGM_LV',tag:'تازه',stock:16,description:'پنیر فله‌ای تازه با طعم اصیل و مناسب صبحانه.'},
{id:'d5',name:'کره محلی',weight:'۲۵۰ گرم',price:27000,category:'لبنیات',image:'https://www.gettyimages.com/',tag:'محلی',stock:14,description:'کره محلی خوش‌عطر و مناسب صبحانه و پخت‌وپز.'},
{id:'d6',name:'شیر',weight:'۱ لیتر',price:38000,category:'لبنیات',image:'https://www.gettyimages.com/',tag:'تازه',stock:30,description:'شیر تازه روزانه با طعم طبیعی.'},
{id:'d7',name:'دوغ',weight:'۱.۵ لیتر',price:18000,category:'لبنیات',image:'https://www.gettyimages.com/',tag:'تازه',stock:28,description:'دوغ سنتی خنک و خوش‌طعم.'},
{id:'d8',name:'کشک سنتی',weight:'۵۰۰ گرم',price:28000,category:'لبنیات',image:'https://cupofyum.com/uploads/images/000/080/098/80098-homemade-kashk-a5b3455ef9f31047ad920bd7f24ca40e.jpg',tag:'سنتی',stock:15,description:'کشک سنتی با طعم اصیل و مناسب غذاهای ایرانی.'}
];

const CART_KEY='dastchin_cart_v3';
const cartItems=new Map();
const grid=document.getElementById('productsGrid');
const count=document.getElementById('cartCount');
const bottomCount=document.getElementById('bottomCartCount');
const drawerCount=document.getElementById('drawerCartCount');
const input=document.getElementById('searchInput');
const clear=document.getElementById('clearSearch');
let activeCategory='لبنیات';

function normalize(v=''){return String(v).replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s\-_/]+/g,' ').trim().toLowerCase()}
function money(n){return Number(n).toLocaleString('fa-IR')+' تومان'}
function cartCount(){return [...cartItems.values()].reduce((s,x)=>s+x.qty,0)}
function persistCart(){localStorage.setItem(CART_KEY,JSON.stringify([...cartItems.values()].map(x=>({id:x.product.id,qty:x.qty}))))}
function loadCart(){try{const saved=JSON.parse(localStorage.getItem(CART_KEY)||'[]');saved.forEach(x=>{const p=products.find(p=>p.id===x.id);if(p&&x.qty>0)cartItems.set(p.id,{product:p,qty:Math.min(p.stock,Number(x.qty))})})}catch(e){}}
function syncCart(){const n=cartCount();if(count)count.textContent=n;if(bottomCount)bottomCount.textContent=n;if(drawerCount)drawerCount.textContent=n;persistCart();renderCart()}
function addToCart(id,qty=1){const p=products.find(x=>x.id===id);if(!p||p.stock<1)return;const item=cartItems.get(id)||{product:p,qty:0};item.qty=Math.min(p.stock,item.qty+Math.max(1,Number(qty)||1));cartItems.set(id,item);syncCart();showCartFeedback()}
function changeQty(id,delta){const item=cartItems.get(id);if(!item)return;item.qty=Math.max(0,Math.min(item.product.stock,item.qty+delta));if(!item.qty)cartItems.delete(id);syncCart()}
function showCartFeedback(){const el=document.querySelector('.cart-feedback');if(!el)return;el.classList.add('show');clearTimeout(window.__cartFeedbackTimer);window.__cartFeedbackTimer=setTimeout(()=>el.classList.remove('show'),1100)}
function matches(p,q){if(!q)return true;const h=normalize(p.name+' '+p.category+' '+p.weight+' '+(p.tag||'')+' '+p.description);return normalize(q).split(' ').filter(Boolean).every(w=>h.includes(w))}

function spriteClass(id){return 'dairy-sprite dairy-'+id}
function render(){
 const q=input?.value||'';
 const list=products.filter(p=>p.category===activeCategory&&matches(p,q));
 grid.innerHTML=list.length?list.map(p=>'<article class="product"><button class="product-image-button" type="button" data-detail="'+p.id+'"><div class="product-img '+spriteClass(p.id)+'">'+(p.tag?'<span class="product-tag">'+p.tag+'</span>':'')+'<span class="product-brand-mark"><img src="assets/dastchin-logo.webp" alt="" aria-hidden="true"></span></div></button><div class="product-body"><button class="product-title-button" type="button" data-detail="'+p.id+'"><h3>'+p.name+'</h3><p>'+p.weight+'</p></button><div class="price-row"><div><div class="price">'+money(p.price)+'</div></div><span class="product-stock">'+(p.stock?'موجود':'ناموجود')+'</span></div><button class="add" data-add="'+p.id+'" '+(!p.stock?'disabled':'')+'>'+ (p.stock?'افزودن به سبد 🛒':'ناموجود')+'</button></div></article>').join(''):'<div class="empty-state"><strong>محصولی پیدا نشد</strong><span>عبارت جستجو را تغییر بده.</span></div>';
 grid.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>openProduct(products.find(p=>p.id===b.dataset.detail))));
 grid.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();addToCart(b.dataset.add);b.textContent='✓ به سبد اضافه شد';setTimeout(()=>b.textContent='افزودن به سبد 🛒',900)}));
}

function openProduct(p){const m=document.getElementById('productModal');if(!m||!p)return;m.querySelector('[data-modal-icon]').innerHTML='<div class="modal-sprite '+spriteClass(p.id)+'"></div><img class="modal-brand-mark" src="assets/dastchin-logo.webp" alt="">';m.querySelector('[data-modal-tag]').textContent=p.tag||'محصول دستچین';m.querySelector('[data-modal-name]').textContent=p.name;m.querySelector('[data-modal-weight]').textContent=p.weight;m.querySelector('[data-modal-description]').textContent=p.description;m.querySelector('[data-modal-price]').textContent=money(p.price);m.querySelector('[data-modal-old-price]').textContent='';m.querySelector('[data-modal-stock]').textContent=p.stock?'موجود · '+p.stock.toLocaleString('fa-IR')+' عدد':'ناموجود';m.querySelector('[data-qty]').value=1;m.querySelector('[data-add-detail]').dataset.productId=p.id;m.classList.add('show');m.setAttribute('aria-hidden','false')}
function closeProduct(){const m=document.getElementById('productModal');if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true')}}

function renderCart(){const box=document.getElementById('cartItems'),totalEl=document.getElementById('cartTotal');if(!box)return;const items=[...cartItems.values()];box.innerHTML=items.length?items.map(x=>'<article class="cart-item"><div class="cart-sprite '+spriteClass(x.product.id)+'" aria-label="'+x.product.name+'"></div><div><strong>'+x.product.name+'</strong><small>'+x.product.weight+'</small><b>'+money(x.product.price*x.qty)+'</b></div><div class="cart-item-actions"><button type="button" data-cart-minus="'+x.product.id+'">−</button><span>'+x.qty.toLocaleString('fa-IR')+'</span><button type="button" data-cart-plus="'+x.product.id+'">+</button><button type="button" class="cart-remove" data-cart-remove="'+x.product.id+'">حذف</button></div></article>').join(''):'<div class="cart-empty"><strong>سبد خرید خالی است</strong><span>محصولات لبنی موردنظرت را انتخاب کن.</span></div>';const total=items.reduce((s,x)=>s+x.product.price*x.qty,0);if(totalEl)totalEl.textContent=money(total);box.querySelectorAll('[data-cart-minus]').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.cartMinus,-1)));box.querySelectorAll('[data-cart-plus]').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.cartPlus,1)));box.querySelectorAll('[data-cart-remove]').forEach(b=>b.addEventListener('click',()=>{cartItems.delete(b.dataset.cartRemove);syncCart()}))}
function openCart(){const m=document.getElementById('cartModal');if(m){renderCart();m.classList.add('show');m.setAttribute('aria-hidden','false');document.body.classList.add('cart-open')}}
function closeCart(){const m=document.getElementById('cartModal');if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true');document.body.classList.remove('cart-open')}}

function wireCartTrigger(el){el?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closeDrawer();openCart()})}
document.querySelectorAll('[data-open-cart],a[href="#cart"]').forEach(wireCartTrigger);document.addEventListener('click',e=>{const t=e.target.closest('[data-open-cart],a[href="#cart"]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();closeDrawer();openCart()},true);document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeProduct();closeDrawer()}});

const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function closeDrawer(){drawer?.classList.remove('open');overlay?.classList.remove('show');drawer?.setAttribute('aria-hidden','true')}
document.getElementById('menuButton')?.addEventListener('click',()=>{drawer?.classList.add('open');overlay?.classList.add('show');drawer?.setAttribute('aria-hidden','false')});
document.getElementById('drawerClose')?.addEventListener('click',closeDrawer);
overlay?.addEventListener('click',closeDrawer);
document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',e=>{if(a.matches('a[href="#cart"]'))return;closeDrawer()}));

document.querySelectorAll('.category').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCategory=b.dataset.category;render()}));
input?.addEventListener('input',render);
clear?.addEventListener('click',()=>{input.value='';render();input.focus()});
document.getElementById('cartModal')?.querySelector('[data-cart-close]')?.addEventListener('click',closeCart);
document.getElementById('cartModal')?.querySelector('[data-cart-overlay]')?.addEventListener('click',closeCart);
document.getElementById('productModal')?.querySelector('[data-modal-close]')?.addEventListener('click',closeProduct);
document.getElementById('productModal')?.querySelector('[data-modal-overlay]')?.addEventListener('click',closeProduct);
document.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{const q=document.querySelector('[data-qty]');q.value=Math.max(1,Number(q.value)-1)});
document.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{const m=document.getElementById('productModal'),p=products.find(x=>x.id===m.querySelector('[data-add-detail]').dataset.productId),q=m.querySelector('[data-qty]');q.value=Math.min(p.stock,Number(q.value)+1)});
document.querySelector('[data-add-detail]')?.addEventListener('click',()=>{const m=document.getElementById('productModal'),p=products.find(x=>x.id===m.querySelector('[data-add-detail]').dataset.productId);addToCart(p.id,Number(m.querySelector('[data-qty]').value));closeProduct();openCart()});
(function(){const c=document.querySelector('.cart-action>span');if(c)c.innerHTML='<svg class="cart-svg" viewBox="0 0 48 48"><path d="M7 9h5l4.2 22.5h21.6L42 16H13.2"></path><circle cx="20" cy="38" r="2.8"></circle><circle cx="35" cy="38" r="2.8"></circle></svg>';const a=document.querySelector('.round-action .account-icon');if(a)a.innerHTML='<svg class="account-svg" viewBox="0 0 48 48"><circle cx="24" cy="14.5" r="7.2"></circle><path d="M11 38.5c1.7-7.2 6.3-11 13-11s11.3 3.8 13 11"></path></svg>'})();
loadCart();render();syncCart();
