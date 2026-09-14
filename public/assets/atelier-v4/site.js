/* Navigation and motion enhance the real comparison; no synthetic loading state. */
(() => {
  const start = () => {
    document.getElementById('startGuided').click();
    document.getElementById('compare-demo').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  };
  document.getElementById('heroSample').addEventListener('click',start);
  document.getElementById('heroInspect').addEventListener('click',start);
  const app=document.getElementById('uxApp');
  const observer=new MutationObserver(()=>{
    const panel=[...app.querySelectorAll('.welcome-panel,.editor-panel,.report-panel')].find(el=>!el.hidden);
    if(panel){panel.classList.remove('panel-arrive');requestAnimationFrame(()=>panel.classList.add('panel-arrive'));}
  });
  observer.observe(app,{attributes:true,attributeFilter:['data-step']});
})();
