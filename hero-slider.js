(() => {
  const hero=document.getElementById('heroSlider');
  if(!hero) return;
  const track=hero.querySelector('.hero-track');
  const slides=[...hero.querySelectorAll('.hero-slide')];
  const dots=[...hero.querySelectorAll('.slider-dots button')];
  const prev=hero.querySelector('.hero-prev');
  const next=hero.querySelector('.hero-next');
  let current=0,timer=null,startX=0,startY=0;
  function showSlide(index){
    current=(index+slides.length)%slides.length;
    track.style.transform=`translateX(${current*100}%)`;
    slides.forEach((s,i)=>s.classList.toggle('is-active',i===current));
    dots.forEach((d,i)=>{d.classList.toggle('is-active',i===current);d.setAttribute('aria-current',i===current?'true':'false')});
  }
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function start(){stop();timer=setInterval(()=>showSlide(current+1),5000)}
  prev.addEventListener('click',()=>{showSlide(current-1);start()});
  next.addEventListener('click',()=>{showSlide(current+1);start()});
  dots.forEach(d=>d.addEventListener('click',()=>{showSlide(Number(d.dataset.slide));start()}));
  hero.addEventListener('mouseenter',stop);
  hero.addEventListener('mouseleave',start);
  hero.addEventListener('touchstart',e=>{const t=e.changedTouches[0];startX=t.clientX;startY=t.clientY;stop()},{passive:true});
  hero.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showSlide(current+(dx<0?1:-1));start()},{passive:true});
  showSlide(0);start();
})();