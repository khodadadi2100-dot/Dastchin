(()=>{'use strict';
const db=window.dastchinSupabase,grid=document.getElementById('productsGrid'),input=document.getElementById('searchInput'),clear=document.getElementById('clearSearch');
let products=[],cat='لبنیات';
const money=n=>Number(n||0).toLocaleString('fa-IR')+' تومان';
const norm=v=>String(v||'').replace(/[يى]/g,'ی').replace(/ك/g,'ک').toLowerCase();
const FALLBACK_PRODUCTS=[
{id:'2',name:'ماست',description:'ماست تازه و باکیفیت دستچین',price:34000,stock:99,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'پرفروش',active:true},
{id:'3',name:'دوغ',description:'دوغ تازه دستچین',price:28000,stock:100,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'پرفروش',active:true},
{id:'4',name:'پنیر',description:'پنیر تازه و خوش‌طعم',price:48000,stock:100,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'تازه',active:true},
{id:'5',name:'خامه',description:'خامه تازه دستچین',price:48000,stock:100,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'تازه',active:true},
{id:'6',name:'ماست چکیده',description:'ماست چکیده غلیظ و تازه',price:52000,stock:100,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'ویژه',active:true},
{id:'7',name:'ماست و موسیر',description:'ماست موسیر تازه',price:48000,stock:100,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'محبوب',active:true},
{id:'8',name:'کشک',description:'کشک تازه دستچین',price:45000,stock:100,image_url:'assets/dastchin-logo.webp',category:'لبنیات',meta:'محلی',active:true},
{id:'10',name:'ماست محلی',description:'ماست محلی تازه',price:18000,stock:25,image_url:'assets/dastchin-logo.webp',category:'محلی',meta:'محلی',active:true},
{id:'11',name:'کشک سنتی',description:'کشک سنتی',price:28000,stock:15,image_url:'assets/dastchin-logo.webp',category:'محلی',meta:'سنتی',active:true},
{id:'12',name:'پنیر فله ای',description:'پنیر فله‌ای تازه',price:33000,stock:16,image_url:'assets/dastchin-logo.webp',category:'محلی',meta:'محلی',active:true},
{id:'13',name:'کره محلی',description:'کره محلی تازه',price:27000,stock:14,image_url:'assets/dastchin-logo.webp',category:'محلی',meta:'محلی',active:true}
];
window.dastchinProducts=()=>products.map(p=>({...p,id:String(p.id),image:p.image_url,weight:p.category}));
function render(){
 const q=norm(input?.value);
 const list=products.filter(p=>(cat==='همه'||p.category===cat)&&(!q||norm([p.name,p.category,p.description,p.meta].join(' ')).includes(q)));
 grid.innerHTML=list.length?list.map(p=>'<article class="product"><button class="product-image-button" data-detail="'+p.id+'"><div class="product-img">'+(p.meta?'<span class="product-tag">'+p.meta+'</span>':'')+'<img class="product-photo" src="'+(p.image_url||'assets/dastchin-logo.webp')+'" alt="'+p.name+'"></div></button><div class="product-body"><button class="product-title-button" data-detail="'+p.id+'"><h3>'+p.name+'</h3><p>'+p.category+'</p></button><div class="price-row"><div class="price">'+money(p.price)+'</div><span class="product-stock">'+(p.stock?'موجود':'ناموجود')+'</span></div><button class="add" data-add="'+p.id+'" '+(!p.stock?'disabled':'')+'>'+ (p.stock?'افزودن به سبد 🛒':'ناموجود')+'</button></div></article>').join(''):'<div class="empty-state"><strong>محصولی پیدا نشد</strong></div>';
 grid.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>window.dastchinAddToCart?.(b.dataset.add,1));
 grid.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>detail(products.find(p=>p.id==b.dataset.detail)));
}
function detail(p){
 const m=document.getElementById('productModal');if(!m||!p)return;
 m.querySelector('[data-modal-icon]').innerHTML='<img class="modal-product-photo" src="'+(p.image_url||'assets/dastchin-logo.webp')+'" alt="'+p.name+'">';
 m.querySelector('[data-modal-tag]').textContent=p.meta||'محصول دستچین';m.querySelector('[data-modal-name]').textContent=p.name;m.querySelector('[data-modal-weight]').textContent=p.category;m.querySelector('[data-modal-description]').textContent=p.description||'';m.querySelector('[data-modal-price]').textContent=money(p.price);m.querySelector('[data-modal-stock]').textContent=p.stock?'موجود':'ناموجود';m.querySelector('[data-qty]').value=1;m.querySelector('[data-add-detail]').dataset.productId=p.id;m.classList.add('show');m.setAttribute('aria-hidden','false');
}
function closeDetail(){const m=document.getElementById('productModal');m?.classList.remove('show');m?.setAttribute('aria-hidden','true')}
document.querySelectorAll('.category').forEach(b=>b.onclick=e=>{e.preventDefault();cat=b.dataset.category;document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x===b));render()});
document.querySelectorAll('[data-menu-category]').forEach(a=>a.onclick=e=>{e.preventDefault();cat=a.dataset.menuCategory;document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===cat));render();document.getElementById('drawer')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('show')});
input?.addEventListener('input',render);clear?.addEventListener('click',()=>{input.value='';render()});
document.getElementById('menuButton')?.addEventListener('click',()=>{document.getElementById('drawer')?.classList.add('open');document.getElementById('overlay')?.classList.add('show')});
document.getElementById('drawerClose')?.addEventListener('click',()=>{document.getElementById('drawer')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('show')});
document.getElementById('overlay')?.addEventListener('click',()=>{document.getElementById('drawer')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('show')});
document.querySelector('[data-modal-close]')?.addEventListener('click',closeDetail);document.querySelector('[data-modal-overlay]')?.addEventListener('click',closeDetail);
document.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{const q=document.querySelector('[data-qty]');q.value=Math.max(1,+q.value-1)});
document.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{const q=document.querySelector('[data-qty]');q.value=+q.value+1});
document.querySelector('[data-add-detail]')?.addEventListener('click',()=>{const m=document.getElementById('productModal');window.dastchinAddToCart?.(m.querySelector('[data-add-detail]').dataset.productId,+m.querySelector('[data-qty]').value);closeDetail()});
window.dastchinApp={db,money};
(async()=>{try{const r=await db.from('products').select('id,name,description,price,stock,image_url,category,meta,active').eq('active',true).order('sort_order').order('id');if(r.error)throw r.error;products=r.data||[];if(!products.length)products=FALLBACK_PRODUCTS}catch(err){console.error('[Dastchin] product catalog read failed:',err);products=FALLBACK_PRODUCTS}window.dastchinProducts=()=>products.map(p=>({...p,id:String(p.id),image:p.image_url,weight:p.category}));render();window.dispatchEvent(new CustomEvent('dastchin:products-refresh'))})()
})();