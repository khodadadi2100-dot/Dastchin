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
function money(n){return n.toLocaleString('fa-IR')+' تومان'}
function render(){
 const q=input.value.trim();
 const list=products.filter(p=>(activeCategory==='همه'||p.category===activeCategory)&&(!q||p.name.includes(q)||p.category.includes(q)));
 grid.innerHTML=list.length?list.map((p,i)=>`<article class="product"><div class="product-img">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}${p.icon}</div><div class="product-body"><h3>${p.name}</h3><p>${p.weight}</p><div class="price-row"><div><div class="price">${money(p.price)}</div>${p.oldPrice?`<div class="old-price">${money(p.oldPrice)}</div>`:''}</div><span aria-hidden="true">♡</span></div><button class="add" data-index="${i}">افزودن به سبد</button></div></article>`).join(''):'<div class="empty-state">محصولی با این مشخصات پیدا نشد.</div>';
 grid.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>{cart++;count.textContent=cart;bottomCount.textContent=cart;btn.textContent='✓ به سبد اضافه شد';btn.disabled=true;setTimeout(()=>{btn.textContent='افزودن به سبد';btn.disabled=false},800)}));
 clear.style.display=input.value?'block':'none';
}
document.querySelectorAll('.category').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));btn.classList.add('active');activeCategory=btn.dataset.category;render()}));
input.addEventListener('input',render);
clear.addEventListener('click',()=>{input.value='';render();input.focus()});
const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
document.getElementById('menuButton').addEventListener('click',()=>{drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false')});
document.getElementById('drawerClose').addEventListener('click',closeDrawer);overlay.addEventListener('click',closeDrawer);
document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',closeDrawer));
render();
