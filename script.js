document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.progress-bar').forEach(function(bar){
    const pct = Number(bar.getAttribute('data-progress') || 0);
    bar.style.transition = 'width 800ms ease-out';
    setTimeout(()=> bar.style.width = pct + '%', 80);
  });

  const toast = document.getElementById('toast');
  function showToast(text='تم', ms=1600){
    toast.textContent = text;
    toast.style.display = 'block';
    setTimeout(()=> toast.style.opacity = '1', 20);
    setTimeout(()=> { toast.style.opacity = '0'; setTimeout(()=> toast.style.display='none',300); }, ms);
  }

  document.getElementById('quickNote').addEventListener('click', ()=> showToast('ملاحظة سريعة محفوظة'));
  document.getElementById('focusMode').addEventListener('click', ()=> showToast('وضع التركيز مفعل'));
  document.getElementById('motivate').addEventListener('click', ()=> showToast('جاري تشغيل حافزك'));

  document.querySelectorAll('nav .nav-item').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('nav .nav-item').forEach(i=> i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});