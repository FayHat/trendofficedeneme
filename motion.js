(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Tabs retain their selected description through the existing language switcher.
  const tabs = Array.from(document.querySelectorAll('[data-approach]'));
  function selectApproach(index) {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(index===i));
      tab.tabIndex=index===i ? 0 : -1;
    });
    const description = $('#approachDescription');
    description.dataset.i18n = `aboutCards.${index}.1`;
    description.textContent = window.TREND_COPY[document.documentElement.lang].aboutCards[index][1];
    $('#approachPanel').setAttribute('aria-labelledby',tabs[index].id);
    $('#approachPanel').classList.remove('changing');
    if (!reduced.matches) requestAnimationFrame(() => $('#approachPanel').classList.add('changing'));
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => selectApproach(index));
    tab.addEventListener('keydown',event => {
      let next;
      if (event.key==='ArrowRight') next=(index+1)%tabs.length;
      else if (event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;
      else if (event.key==='Home') next=0;
      else if (event.key==='End') next=tabs.length-1;
      else return;
      event.preventDefault();selectApproach(next);tabs[next].focus();
    });
  });
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:.15});
    observer.observe($('#relationship'));
  }

  // Activate only after the supplied artwork loads; native cursor is the fallback.
  const cursor = $('#cursorWalker');
  const trail = $('#cursorStitchLayer');
  const artwork = cursor.querySelector('img');
  let artworkLoaded = artwork.complete && artwork.naturalWidth > 0;
  let position = null;
  let previous = null;
  let frame = 0;
  let slot = 0;
  const marks = Array.from({length:12},() => {
    const el=document.createElement('span');el.className='stitch-mark';trail.append(el);
    return {el,born:-Infinity,x:0,y:0};
  });
  function hideCursor() {
    document.body.classList.remove('custom-cursor-on');
    cursor.classList.remove('is-active');trail.classList.remove('is-active');
    position=null;previous=null;
    marks.forEach(mark => {mark.born=-Infinity;mark.el.style.opacity='0';});
    if (frame) cancelAnimationFrame(frame);
    frame=0;
  }
  function schedule() {if (!frame) frame=requestAnimationFrame(paint);}
  function paint(now) {
    frame=0;
    if (!position) return;
    const {x,y,hover,dark}=position;
    cursor.style.transform=`translate3d(${x}px,${y}px,0)`;
    cursor.classList.toggle('is-hovering',hover);
    cursor.classList.toggle('on-dark',dark);
    if (previous) {
      const dx=x-previous.x,dy=y-previous.y;
      const distance=Math.hypot(dx,dy);
      if (Math.abs(dx)>2) cursor.style.setProperty('--cursor-facing',dx>0?'-1':'1');
      if (distance>2) cursor.style.setProperty('--cursor-lean',`${Math.max(-5,Math.min(5,dy/5))}deg`);
      if (distance>7 && distance<100) {
        const mark=marks[slot];slot=(slot+1)%marks.length;
        mark.born=now;mark.x=x-dx/distance*22;mark.y=y-dy/distance*22;
        mark.el.classList.toggle('on-dark',dark);
        mark.el.style.transform=`translate3d(${mark.x}px,${mark.y}px,0) rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)`;
      }
    }
    previous={x,y};
    let fading=false;
    marks.forEach(mark => {
      const age=now-mark.born;
      const visible=age<340 && Math.hypot(mark.x-x,mark.y-y)<82;
      mark.el.style.opacity=visible ? String(.4*(1-age/340)) : '0';
      if (visible) fading=true;
    });
    if (fading) schedule();
  }
  artwork.addEventListener('load',() => {artworkLoaded=artwork.naturalWidth>0;});
  artwork.addEventListener('error',() => {artworkLoaded=false;hideCursor();});
  window.addEventListener('pointermove',event => {
    const target=event.target;
    if (!artworkLoaded || !finePointer.matches || reduced.matches || document.hidden || event.pointerType!=='mouse' ||
      !(target instanceof Element) || target.closest('input,textarea,select,dialog,[contenteditable]:not([contenteditable="false"])')) {
      hideCursor();return;
    }
    position={x:event.clientX,y:event.clientY,
      hover:!!target.closest('a,button,summary,[role="tab"]'),
      dark:!!target.closest('[data-cursor-dark],.focus-section,.site-footer,.material-button.is-active,.button-primary,.summary-heading')};
    document.body.classList.add('custom-cursor-on');
    cursor.classList.add('is-active');trail.classList.add('is-active');schedule();
  },{passive:true});
  window.addEventListener('pointerout',event => {if (!event.relatedTarget) hideCursor();});
  window.addEventListener('blur',hideCursor);
  document.addEventListener('keydown',event => {if (event.key==='Tab' || event.key==='Escape') hideCursor();});
  document.addEventListener('visibilitychange',() => {if (document.hidden) hideCursor();});
  reduced.addEventListener('change',hideCursor);
  finePointer.addEventListener('change',hideCursor);
})();
