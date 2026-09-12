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
  grid.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>{cart++;count.textContent=cart;bottomCount.textContent=cart;btn.textContent='✓ به سبد اضافه شد';btn.disabled=true;setTimeout(()=>{btn.textContent='افزودن به سبد';btn.disabled=false},800)}));
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
input?.addEventListener('input',render);
clear?.addEventListener('click',()=>{input.value='';render();input.focus()});
input?.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';render();input.blur()}});

const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
document.getElementById('menuButton').addEventListener('click',()=>{drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false')});
document.getElementById('drawerClose').addEventListener('click',closeDrawer);overlay.addEventListener('click',closeDrawer);
document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',closeDrawer));
render();
