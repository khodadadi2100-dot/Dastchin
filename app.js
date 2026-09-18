const products=[
{name:'پنیر محلی',weight:'۱ کیلوگرم',price:220000,oldPrice:280000,category:'محلی',icon:'🧀',tag:'ویژه'},
{name:'دوغ تازه',weight:'۱.۵ کیلوگرم',price:96000,category:'نوشیدنی',icon:'🥛',tag:'تازه'},
{name:'ماست پرچرب',weight:'۱.۵ کیلوگرم',price:153000,category:'لبنیات',icon:'🥣',tag:'پرفروش'},
{name:'شیر محلی',weight:'۱ لیتر',price:76000,category:'لبنیات',icon:'🍼',tag:'تازه'},
{name:'خیارشور ویژه',weight:'۱ کیلوگرم',price:128000,category:'شورجات',icon:'🥒',tag:'ویژه'},
{name:'گوشت تازه',weight:'۱ کیلوگرم',price:540000,category:'پروتئین',icon:'🥩',tag:'تازه'},
{name:'کشک محلی',weight:'۵۰۰ گرم',price:89000,category:'لبنیات',icon:'🥛'},
{name:'زیتون محلی',weight:'۵۰۰ گرم',price:165000,category:'محلی',icon:'🫒'}
];
let cart=0,activeCategory='همه';
const grid=document.getElementById('productsGrid');
const count=document.getElementById('cartCount');
const bottomCount=document.getElementById('bottomCartCount');
const input=document.getElementById('searchInput');
const clear=document.getElementById('clearSearch');
const searchWrap=document.querySelector('.search-wrap');
const status=document.createElement('div');
status.className='search-status';
status.setAttribute('aria-live','polite');
searchWrap?.appendChild(status);

function normalize(value=''){
  return String(value)
    .replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/ۀ/g,'ه')
    .replace(/[أإٱ]/g,'ا').replace(/ؤ/g,'و').replace(/‌/g,' ')
    .replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[\s\-_/]+/g,' ').trim().toLowerCase();
}
function money(n){return n.toLocaleString('fa-IR')+' تومان'}
function matches(product,query){
  if(!query)return true;
  const haystack=normalize(`${product.name} ${product.category} ${product.weight} ${product.tag||''}`);
  return normalize(query).split(' ').filter(Boolean).every(word=>haystack.includes(word));
}
function render(){
  const rawQuery=input?.value||'';
  const list=products.filter(p=>(activeCategory==='همه'||p.category===activeCategory)&&matches(p,rawQuery));
  grid.innerHTML=list.length?list.map((p,i)=>`<article class="product"><div class="product-img">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}${p.icon}</div><div class="product-body"><h3>${p.name}</h3><p>${p.weight}</p><div class="price-row"><div><div class="price">${money(p.price)}</div>${p.oldPrice?`<div class="old-price">${money(p.oldPrice)}</div>`:''}</div><span aria-hidden="true">♡</span></div><button class="add" data-index="${i}">افزودن به سبد</button></div></article>`).join(''):`<div class="empty-state"><strong>محصولی پیدا نشد</strong><span>عبارت جستجو یا دسته‌بندی را تغییر بده.</span></div>`;
  grid.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>{cart++;count.textContent=cart;bottomCount.textContent=cart;syncDrawerCart();btn.textContent='✓ به سبد اضافه شد';btn.disabled=true;setTimeout(()=>{btn.textContent='افزودن به سبد';btn.disabled=false},800)}));
  if(status){
    const q=rawQuery.trim();
    status.textContent=q||activeCategory!=='همه'?`${list.length.toLocaleString('fa-IR')} محصول نمایش داده شد${activeCategory!=='همه'?` · دسته: ${activeCategory}`:''}`:`${products.length.toLocaleString('fa-IR')} محصول آماده نمایش است`;
    status.classList.toggle('has-filter',Boolean(q||activeCategory!=='همه'));
  }
  if(clear)clear.style.display=rawQuery?'block':'none';
}

document.querySelectorAll('.category').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  activeCategory=btn.dataset.category||'همه';
  render();
  document.getElementById('products')?.scrollIntoView({behavior:'smooth',block:'start'});
}));
document.querySelectorAll('[data-menu-category]').forEach(link=>link.addEventListener('click',()=>{const category=link.dataset.menuCategory;const target=document.querySelector(`.category[data-category="${category}"]`);if(target)target.click();}));
input?.addEventListener('input',render);
clear?.addEventListener('click',()=>{input.value='';render();input.focus()});
input?.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';render();input.blur()}});

const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
document.getElementById('menuButton').addEventListener('click',()=>{drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false')});
document.getElementById('drawerClose').addEventListener('click',closeDrawer);overlay.addEventListener('click',closeDrawer);
document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',closeDrawer));
render();
const drawerCartCount=document.getElementById('drawerCartCount');
function syncDrawerCart(){if(drawerCartCount)drawerCartCount.textContent=cart}
syncDrawerCart();

/* Header repair: restore both visible header icons without changing the header layout. */
(function repairHeaderIcons(){
  const cart=document.querySelector('.cart-action > span');
  if(cart){
    cart.innerHTML='<svg class="cart-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M7 9h5l4.2 22.5h21.6L42 16H13.2"></path><circle cx="20" cy="38" r="2.8"></circle><circle cx="35" cy="38" r="2.8"></circle></svg>';
  }
  const account=document.querySelector('.round-action .account-icon');
  if(account){
    account.innerHTML='<svg class="account-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="14.5" r="7.2"></circle><path d="M11 38.5c1.7-7.2 6.3-11 13-11s11.3 3.8 13 11"></path></svg>';
  }
})();


/* Product stage: details, stock indicator and quantity selection */
products.forEach((p,i)=>{p.id=p.id||('p'+(i+1));p.stock=p.stock??20;p.description=p.description||('محصول تازه دستچین؛ '+p.name+' با کیفیت مناسب مصرف روزانه و بسته‌بندی مناسب عرضه می‌شود.')});
function openProduct(product){const modal=document.getElementById('productModal');if(!modal||!product)return;modal.querySelector('[data-modal-icon]').textContent=product.icon;modal.querySelector('[data-modal-tag]').textContent=product.tag||'محصول دستچین';modal.querySelector('[data-modal-name]').textContent=product.name;modal.querySelector('[data-modal-weight]').textContent=product.weight;modal.querySelector('[data-modal-description]').textContent=product.description;modal.querySelector('[data-modal-price]').textContent=money(product.price);modal.querySelector('[data-modal-stock]').textContent=product.stock>0?'موجود · '+product.stock.toLocaleString('fa-IR')+' عدد':'ناموجود';modal.querySelector('[data-modal-old-price]').textContent=product.oldPrice?money(product.oldPrice):'';modal.querySelector('[data-qty]').value=1;modal.querySelector('[data-add-detail]').dataset.productId=product.id;modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function closeProduct(){const modal=document.getElementById('productModal');if(!modal)return;modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
const productStageRender=render;render=function(){const rawQuery=input?.value||'';const list=products.filter(p=>(activeCategory==='همه'||p.category===activeCategory)&&matches(p,rawQuery));grid.innerHTML=list.length?list.map(p=>'<article class="product" data-product-id="'+p.id+'"><button class="product-image-button" type="button" data-product-detail="'+p.id+'" aria-label="مشاهده جزئیات '+p.name+'"><div class="product-img">'+(p.tag?'<span class="product-tag">'+p.tag+'</span>':'')+p.icon+'</div></button><div class="product-body"><button class="product-title-button" type="button" data-product-detail="'+p.id+'"><h3>'+p.name+'</h3><p>'+p.weight+'</p></button><div class="price-row"><div><div class="price">'+money(p.price)+'</div>'+(p.oldPrice?'<div class="old-price">'+money(p.oldPrice)+'</div>':'')+'</div><span class="product-stock">'+(p.stock>0?'موجود':'ناموجود')+'</span></div><button class="add" data-add-product="'+p.id+'" '+(p.stock<1?'disabled':'')+'>'+(p.stock>0?'افزودن به سبد':'ناموجود')+'</button></div></article>').join(''):'<div class="empty-state"><strong>محصولی پیدا نشد</strong><span>عبارت جستجو یا دسته‌بندی را تغییر بده.</span></div>';grid.querySelectorAll('[data-product-detail]').forEach(b=>b.addEventListener('click',()=>openProduct(products.find(p=>p.id===b.dataset.productDetail))));grid.querySelectorAll('[data-add-product]').forEach(b=>b.addEventListener('click',()=>{const p=products.find(x=>x.id===b.dataset.addProduct);if(!p||p.stock<1)return;cart++;count.textContent=cart;bottomCount.textContent=cart;syncDrawerCart();b.textContent='✓ به سبد اضافه شد';b.disabled=true;setTimeout(()=>{b.textContent=p.stock>0?'افزودن به سبد':'ناموجود';b.disabled=p.stock<1},800)}));if(status){const q=rawQuery.trim();status.textContent=q||activeCategory!=='همه'?list.length.toLocaleString('fa-IR')+' محصول نمایش داده شد'+(activeCategory!=='همه'?' · دسته: '+activeCategory:''):products.length.toLocaleString('fa-IR')+' محصول آماده نمایش است';status.classList.toggle('has-filter',Boolean(q||activeCategory!=='همه'))}if(clear)clear.style.display=rawQuery?'block':'none'};
const productModal=document.getElementById('productModal');productModal?.querySelector('[data-modal-close]')?.addEventListener('click',closeProduct);productModal?.querySelector('[data-modal-overlay]')?.addEventListener('click',closeProduct);productModal?.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{const q=productModal.querySelector('[data-qty]');q.value=Math.max(1,Number(q.value||1)-1)});productModal?.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{const p=products.find(x=>x.id===productModal.querySelector('[data-add-detail]')?.dataset.productId);const q=productModal.querySelector('[data-qty]');q.value=Math.min(p?.stock||1,Number(q.value||1)+1)});productModal?.querySelector('[data-add-detail]')?.addEventListener('click',()=>{const p=products.find(x=>x.id===productModal.querySelector('[data-add-detail]').dataset.productId);const q=Math.max(1,Math.min(p?.stock||1,Number(productModal.querySelector('[data-qty]').value||1)));if(!p||p.stock<1)return;cart+=q;count.textContent=cart;bottomCount.textContent=cart;syncDrawerCart();closeProduct()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProduct()});
render();
