(()=>{'use strict';
const sb=()=>window.dastchinSupabase;
const grid=document.getElementById('productsGrid'),input=document.getElementById('searchInput'),clear=document.getElementById('clearSearch');
let products=[],activeCategory='همه';

const normalize=s=>String(s??'').trim().toLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک');
const money=v=>Number(v||0).toLocaleString('fa-IR')+' تومان';
function meta(p){let m={};try{m=p.meta?JSON.parse(p.meta):{}}catch{}return m}
function view(p){const m=meta(p);return {...p,id:String(p.id),price:Number(p.price),stock:Number(p.stock),weight:m.weight||'',tag:m.tag||'',image:p.image_url||'assets/dastchin-logo.webp'}}
function matches(p,q){if(!q)return true;const h=normalize([p.name,p.category,p.weight,p.tag,p.description].join(' '));return normalize(q).split(/\s+/).filter(Boolean).every(w=>h.includes(w))}
function render(){
 const q=input?.value||'',list=products.filter(p=>(activeCategory==='همه'||p.category===activeCategory)&&matches(p,q));
 if(!grid)return;
 grid.innerHTML=list.length?list.map(p=>'<article class="product"><button class="product-image-button" type="button" data-detail="'+p.id+'"><div class="product-img">'+(p.tag?'<span class="product-tag">'+p.tag+'</span>':'')+'<img class="product-photo" src="'+p.image+'" alt="'+p.name+'" loading="lazy"><span class="product-brand-mark"><img src="assets/dastchin-logo.webp" alt="" aria-hidden="true"></span></div></button><div class="product-body"><button class="product-title-button" type="button" data-detail="'+p.id+'"><h3>'+p.name+'</h3><p>'+p.weight+'</p></button><div class="price-row"><div><div class="price">'+money(p.price)+'</div></div><span class="product-stock">'+(p.stock?'موجود':'ناموجود')+'</span></div><button class="add" data-add="'+p.id+'" '+(!p.stock?'disabled':'')+'>'+ (p.stock?'افزودن به سبد 🛒':'ناموجود')+'</button></div></article>').join(''):'<div class="empty-state"><strong>محصولی پیدا نشد</strong><span>محصول یا دسته دیگری را امتحان کن.</span></div>';
 grid.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>openProduct(products.find(x=>x.id===b.dataset.detail))));
 grid.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',async e=>{e.stopPropagation();await window.dastchinAddToCart?.(b.dataset.add,1);b.textContent='✓ به سبد اضافه شد';setTimeout(()=>b.textContent='افزودن به سبد 🛒',900)}));
}
function openProduct(p){
 const m=document.getElementById('productModal');if(!m||!p)return;
 m.querySelector('[data-modal-icon]').innerHTML='<img class="modal-product-photo" src="'+p.image+'" alt="'+p.name+'"><img class="modal-brand-mark" src="assets/dastchin-logo.webp" alt="">';
 m.querySelector('[data-modal-tag]').textContent=p.tag||'محصول دستچین';m.querySelector('[data-modal-name]').textContent=p.name;m.querySelector('[data-modal-weight]').textContent=p.weight;m.querySelector('[data-modal-description]').textContent=p.description||'';m.querySelector('[data-modal-price]').textContent=money(p.price);m.querySelector('[data-modal-old-price]').textContent='';m.querySelector('[data-modal-stock]').textContent=p.stock?'موجود · '+p.stock.toLocaleString('fa-IR')+' عدد':'ناموجود';m.querySelector('[data-qty]').value=1;m.querySelector('[data-add-detail]').dataset.productId=p.id;m.classList.add('show');m.setAttribute('aria-hidden','false')
}
function closeProduct(){const m=document.getElementById('productModal');m?.classList.remove('show');m?.setAttribute('aria-hidden','true')}
async function loadProducts(){
 const client=sb();if(!client)return;
 const {data,error}=await client.from('products').select('id,name,description,price,stock,image_url,category,meta,sort_order,active').eq('active',true).order('sort_order').order('id');
 if(error){console.error(error);if(grid)grid.innerHTML='<div class="empty-state"><strong>اتصال به فروشگاه برقرار نشد</strong><span>لطفاً صفحه را دوباره باز کن.</span></div>';return}
 products=(data||[]).map(view);
 render();
}
function categories(){
 document.querySelectorAll('.category').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCategory=b.dataset.category;render()}));
 document.querySelectorAll('[data-menu-category]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();activeCategory=a.dataset.menuCategory;document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===activeCategory));render();document.getElementById('drawer')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('show');document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}));
}
function drawer(){const d=document.getElementById('drawer'),o=document.getElementById('overlay');document.getElementById('menuButton')?.addEventListener('click',()=>{d?.classList.add('open');o?.classList.add('show');d?.setAttribute('aria-hidden','false')});const close=()=>{d?.classList.remove('open');o?.classList.remove('show');d?.setAttribute('aria-hidden','true')};document.getElementById('drawerClose')?.addEventListener('click',close);o?.addEventListener('click',close)}
function init(){
 categories();drawer();input?.addEventListener('input',render);clear?.addEventListener('click',()=>{input.value='';render();input.focus()});
 document.getElementById('productModal')?.querySelector('[data-modal-close]')?.addEventListener('click',closeProduct);
 document.getElementById('productModal')?.querySelector('[data-modal-overlay]')?.addEventListener('click',closeProduct);
 document.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{const q=document.querySelector('[data-qty]');q.value=Math.max(1,Number(q.value)-1)});
 document.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{const m=document.getElementById('productModal'),p=products.find(x=>x.id===m?.querySelector('[data-add-detail]')?.dataset.productId),q=m?.querySelector('[data-qty]');if(p&&q)q.value=Math.min(p.stock,Number(q.value)+1)});
 document.querySelector('[data-add-detail]')?.addEventListener('click',async()=>{const m=document.getElementById('productModal'),p=products.find(x=>x.id===m?.querySelector('[data-add-detail]')?.dataset.productId),q=Number(m?.querySelector('[data-qty]')?.value||1);if(p){await window.dastchinAddToCart?.(p.id,q);closeProduct()}});
 loadProducts();
 window.dastchinProducts=()=>products;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('dastchin:products-refresh',loadProducts);
})();