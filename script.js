(() => {
  'use strict';
  const COPY = window.TREND_COPY;
  const LANGUAGES = ['tr','en','de','fr','es','it'];
  const FABRIC_IDS = ['knit','woven','knitwear','denim'];
  const FABRIC_WIDTHS = [177,170,159,158];
  const SUPPORT_IDS = ['full','matching','sampling','production','shipment'];
  const QUANTITIES = ['', '1-99','100-499','500-999','1000+','undecided'];
  const RECIPIENT = 'gfayat@trendoffice.com.tr';
  const SUBMIT_URL = 'https://formsubmit.co/ajax/' + RECIPIENT;
  const LOCALES = {tr:'tr-TR',en:'en-GB',de:'de-DE',fr:'fr-FR',es:'es-ES',it:'it-IT'};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const readCopy = (path, lang) => path.split('.').reduce((value,key) => value?.[key], COPY[lang]);
  let activeLang = 'tr';
  try { const saved = localStorage.getItem('trendoffice.language'); if (LANGUAGES.includes(saved)) activeLang = saved; } catch (_) {}
  // A ?lang= link (e.g. in outreach emails) wins over the saved preference.
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (LANGUAGES.includes(urlLang)) activeLang = urlLang;
  let selectedFabric = 0;
  let selectedMarket = 0;
  let formStep = 0;
  let reviewedSnapshot = null;
  let sending = false;
  let submitted = false;
  let validationKey = '';
  let mapReady = false;
  const form = $('#briefForm');
  const translate = (path) => readCopy(path, activeLang);

  function applyLanguage(lang, persist = true) {
    if (!LANGUAGES.includes(lang) || sending) return;
    activeLang = lang;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const value = translate(el.dataset.i18n);
      if (typeof value === 'string') el.textContent = value;
    });
    for (const [dataKey, attribute] of [['i18nAria','aria-label'],['i18nAlt','alt'],['i18nPlaceholder','placeholder']]) {
      const selector = '[data-' + dataKey.replace(/[A-Z]/g, c => '-' + c.toLowerCase()) + ']';
      $$(selector).forEach(el => { const value = translate(el.dataset[dataKey]); if (typeof value === 'string') el.setAttribute(attribute,value); });
    }
    document.querySelector('meta[name="description"]').content = translate('meta');
    $('#languageCode').textContent = lang.toUpperCase();
    $$('[data-lang]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.lang === lang)));
    $('#menuToggle').setAttribute('aria-label',translate($('#menuToggle').getAttribute('aria-expanded') === 'true' ? 'close' : 'menu'));
    renderFabric(false);
    renderFormStep(false);
    if (formStep === 3 && reviewedSnapshot) renderSummary();
    if (validationKey) $('#formError').textContent = translate(validationKey);
    updateMapLabels();
    updateMapMotion();
    requestScrollUpdate();
    updateClock();
    if (persist) {
      try { localStorage.setItem('trendoffice.language',lang); } catch (_) {}
      try { const url = new URL(window.location.href); url.searchParams.set('lang',lang); history.replaceState(null,'',url); } catch (_) {}
    }
  }

  function closeLanguage(returnFocus = false) {
    $('#languageMenu').hidden = true;
    $('#languageToggle').setAttribute('aria-expanded','false');
    if (returnFocus) $('#languageToggle').focus();
  }
  $('#languageToggle').addEventListener('click', () => {
    const isOpen = !$('#languageMenu').hidden;
    $('#languageMenu').hidden = isOpen;
    $('#languageToggle').setAttribute('aria-expanded',String(!isOpen));
  });
  $$('[data-lang]').forEach(button => button.addEventListener('click', () => { applyLanguage(button.dataset.lang); closeLanguage(true); }));
  function closeMenu(returnFocus = false) {
    $('#mainNav').classList.remove('is-open');
    $('#menuToggle').setAttribute('aria-expanded','false');
    $('#menuToggle').setAttribute('aria-label',translate('menu'));
    if (returnFocus) $('#menuToggle').focus();
  }
  $('#menuToggle').addEventListener('click', () => {
    const open = $('#mainNav').classList.toggle('is-open');
    $('#menuToggle').setAttribute('aria-expanded',String(open));
    $('#menuToggle').setAttribute('aria-label',translate(open ? 'close' : 'menu'));
    closeLanguage();
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!event.target.closest('.language-picker')) closeLanguage();
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!$('#languageMenu').hidden) closeLanguage(true);
    else if ($('#mainNav').classList.contains('is-open')) closeMenu(true);
  });

  function renderFabric(animate = true) {
    const fabric = translate('fabrics')[selectedFabric];
    $$('[data-fabric]').forEach((button,index) => {
      button.classList.toggle('is-active',index === selectedFabric);
      button.setAttribute('aria-pressed',String(index === selectedFabric));
    });
    const image = $('#fabricImage');
    image.src = 'assets/fabric-' + FABRIC_IDS[selectedFabric] + '.webp';
    image.width = FABRIC_WIDTHS[selectedFabric];
    image.height = 300;
    image.alt = translate('materialAlt').replace('{name}',fabric.name);
    $('#swatchNumber').textContent = String(selectedFabric + 1).padStart(2,'0') + ' / 04';
    $('#fabricName').textContent = fabric.name;
    $('#fabricDescription').textContent = fabric.description;
    $('#fabricDetails').replaceChildren(...fabric.details.map(detail => { const li = document.createElement('li'); li.textContent = detail; return li; }));
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $('#fabricDisplay').classList.remove('changing');
      requestAnimationFrame(() => $('#fabricDisplay').classList.add('changing'));
    }
  }
  function selectFabric(index) {
    if (index === selectedFabric) return;
    selectedFabric = index;
    renderFabric();
  }
  $$('[data-fabric]').forEach((button,index,buttons) => {
    button.addEventListener('pointerenter',event => { if (event.pointerType === 'mouse') selectFabric(index); });
    button.addEventListener('focus',() => selectFabric(index));
    button.addEventListener('click',() => selectFabric(index));
    button.addEventListener('keydown',event => {
      let next = index;
      if (['ArrowRight','ArrowDown'].includes(event.key)) next = (index + 1) % buttons.length;
      else if (['ArrowLeft','ArrowUp'].includes(event.key)) next = (index + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].focus();
    });
  });
  $('#fabricRequest').addEventListener('click', () => {
    if (sending || submitted) return;
    form.elements.namedItem('categories').forEach(input => { input.checked = input.value === FABRIC_IDS[selectedFabric]; });
    reviewedSnapshot = null;
    formStep = 0;
    clearValidation();
    renderFormStep(false);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MARKET_PALETTE = [
    {line:'#7b2d3e',fill:'#ead8dd'},
    {line:'#607e6d',fill:'#dce5dc'},
    {line:'#687d9a',fill:'#dee4ee'},
    {line:'#996a7c',fill:'#eedee5'},
    {line:'#98734b',fill:'#ece0cd'},
    {line:'#a8604a',fill:'#f1ddd3'}
  ];
  // Map points: market index (colour/legend) and city index (label in marketCities).
  // New York and New Jersey share one point: at this scale they are under a pixel apart.
  const MAP_POINTS = [
    {market:0,city:0,coords:[28.9784,41.0082],label:[11,4]},
    {market:1,city:1,coords:[23.7275,37.9838],label:[-12,21],bend:22},
    {market:2,city:2,coords:[-.1276,51.5072],label:[-10,-12],bend:52},
    {market:3,city:3,coords:[2.3522,48.8566],label:[-8,21],bend:34},
    {market:4,city:4,coords:[55.2708,25.2048],label:[11,4],compactLabel:[0,20],compactAnchor:'middle',bend:42},
    {market:5,city:5,coords:[-74.006,40.7128],label:[12,21],bend:70},
    {market:5,city:6,coords:[-118.2437,34.0522],label:[11,4],bend:205}
  ];
  let mapMotionPaused = false;
  let mapInView = false;

  // Use the actual centers of the first and last number, including expanded content.
  const timeline = $('#timeline');
  const timelineRail = $('.timeline-line');
  const processSteps = $$('.process-step');
  let scrollScheduled = false;
  function requestScrollUpdate() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      scrollScheduled = false;
      const box = timeline.getBoundingClientRect();
      const centers = processSteps.map(step => {
        const number = step.querySelector('.step-number').getBoundingClientRect();
        return number.top + number.height / 2 - box.top;
      });
      const start = centers[0];
      const length = Math.max(0,centers[centers.length-1] - start);
      const readingY = window.innerHeight * .58 - box.top;
      const progress = Math.max(0,Math.min(length,readingY - start));
      timelineRail.style.top = start + 'px';
      timelineRail.style.height = length + 'px';
      $('#timelineProgress').style.height = progress + 'px';
      $('#timelineHead').style.top = progress + 'px';
      timelineRail.classList.toggle('has-progress',length > 0 && progress > 0);
      let current = -1;
      centers.forEach((center,index) => {if (center <= readingY) current=index;});
      processSteps.forEach((step,index) => {
        step.classList.toggle('is-reached',length > 0 && centers[index] <= readingY);
        step.classList.toggle('is-reading',length > 0 && current === index);
      });
    });
  }
  processSteps.forEach(step => step.addEventListener('toggle', () => {
    if (step.open) processSteps.forEach(other => { if (other !== step) other.open = false; });
    requestScrollUpdate();
  }));
  if ('ResizeObserver' in window) new ResizeObserver(requestScrollUpdate).observe(timeline);
  document.fonts?.ready.then(requestScrollUpdate);
  window.addEventListener('scroll',requestScrollUpdate,{passive:true});

  function setMarketColor(element,index) {
    element.style.setProperty('--market-color',MARKET_PALETTE[index].line);
    element.style.setProperty('--market-fill',MARKET_PALETTE[index].fill);
  }
  function drawMap() {
    const d3 = window.d3;
    const topojson = window.topojson;
    if (!d3 || !topojson || !window.WORLD_TOPOJSON) { updateMapMotion(); return; }
    const svg = d3.select('#worldMap');
    const projection = d3.geoMercator().center([-30,41]).scale(305).translate([550,214]);
    const geoPath = d3.geoPath(projection);
    const countries = topojson.feature(window.WORLD_TOPOJSON,window.WORLD_TOPOJSON.objects.countries);
    const countryMarkets = {300:1,826:2,250:3,784:4,840:5};
    svg.append('g').attr('aria-hidden','true').selectAll('path').data(countries.features).join('path')
      .attr('class','country').attr('fill','#f9f2e9').attr('stroke','#d3c2ac').attr('stroke-width',.65).attr('d',geoPath).each(function(country) {
        const index = countryMarkets[Number(country.id)];
        if (!index) return;
        this.classList.add('map-country'); this.dataset.mapIndex = index; setMarketColor(this,index);
        this.setAttribute('fill',MARKET_PALETTE[index].fill);this.setAttribute('stroke',MARKET_PALETTE[index].line);
      });
    const [hubX,hubY] = projection(MAP_POINTS[0].coords);
    MAP_POINTS.slice(1).forEach((point,index) => {
      const [x,y] = projection(point.coords);
      const route = `M${hubX},${hubY}Q${(hubX+x)/2},${(hubY+y)/2-point.bend} ${x},${y}`;
      for (const className of ['map-route-base','map-route map-route-flow']) {
        svg.append('path').attr('class',className).attr('data-map-index',point.market).attr('d',route).attr('aria-hidden','true').attr('fill','none').attr('stroke',MARKET_PALETTE[point.market].line).attr('stroke-width',2.3).attr('stroke-linecap','round').attr('opacity',className==='map-route-base'?.32:.9).attr('stroke-dasharray',className==='map-route-base'?null:'7 13')
          .each(function(){setMarketColor(this,point.market);this.style.animationDelay = (-index*2.5)+'s';});
      }
    });
    MAP_POINTS.forEach((point,index) => {
      const [x,y] = projection(point.coords);
      const market = point.market;
      svg.append('circle').attr('class','map-point-halo').attr('data-map-index',market).attr('cx',x).attr('cy',y).attr('r',index===0?13:9).attr('fill',MARKET_PALETTE[market].fill).attr('stroke',MARKET_PALETTE[market].line).attr('stroke-width',.65).attr('aria-hidden','true').each(function(){setMarketColor(this,market);});
      svg.append('circle').attr('class','map-point').attr('data-map-index',market).attr('cx',x).attr('cy',y).attr('r',index===0 ? 5.5 : 4.5).attr('fill',MARKET_PALETTE[market].line).attr('stroke','#fbf7f0').attr('stroke-width',2).attr('aria-hidden','true').each(function(){setMarketColor(this,market);});
      svg.append('text').attr('class','map-label' + (index===0 ? ' map-hub' : '')).attr('data-map-index',market).attr('data-city',point.city).attr('data-dx',point.label[0]).attr('data-dy',point.label[1]).attr('data-x',x).attr('data-y',y).attr('data-anchor',point.anchor||'start').attr('data-cdx',(point.compactLabel||point.label)[0]).attr('data-cdy',(point.compactLabel||point.label)[1]).attr('data-canchor',point.compactAnchor||point.anchor||'start').attr('text-anchor',point.anchor||'start').attr('x',x+point.label[0]).attr('y',y+point.label[1]).attr('fill',index===0?'#7b2d3e':'#292225').attr('font-family','Outfit,Arial,sans-serif').attr('font-size',12);
    });
    mapReady = true;
    updateMapLabels();
    paintMap();
    resizeMap();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        mapInView = entries.some(entry => entry.isIntersecting);
        updateMapMotion();
      },{threshold:.08}).observe($('#mapShell'));
    } else mapInView = true;
    updateMapMotion();
  }
  function updateMapLabels() {
    if (!mapReady) return;
    $$('#worldMap text[data-city]').forEach(text => { text.textContent = translate('marketCities')[Number(text.dataset.city)]; });
  }
  function resizeMap() {
    const small = window.matchMedia('(max-width:700px)').matches;
    $('#worldMap').setAttribute('viewBox',small ? '40 -45 1080 540' : '0 0 1100 420');
    // On phones the map is drawn at about a third of its size, so labels scale up
    // and keep their offset from the point in proportion.
    // Keep labels near 11px on screen whatever the phone width.
    const svgWidth = $('#worldMap').getBoundingClientRect().width || 350;
    const factor = small ? Math.min(3.4,Math.max(2.6,(11/12)*(1080/svgWidth))) : Math.min(1.6,Math.max(1,(11/12)*(1100/svgWidth)));
    $$('.map-label').forEach(label => {
      label.style.fontSize = (12*factor)+'px'; label.setAttribute('font-size',String(12*factor));
      const dx = small ? label.dataset.cdx : label.dataset.dx, dy = small ? label.dataset.cdy : label.dataset.dy;
      label.setAttribute('x',Number(label.dataset.x)+Number(dx)*factor);
      label.setAttribute('y',Number(label.dataset.y)+Number(dy)*factor);
      label.setAttribute('text-anchor',small ? label.dataset.canchor : label.dataset.anchor);
    });
    $('#worldMap').classList.toggle('is-compact',small);
  }
  function paintMap(preview = selectedMarket) {
    $$('[data-market]').forEach(button => {
      const index = Number(button.dataset.market);
      button.classList.toggle('is-active',index === selectedMarket);
      button.classList.toggle('is-preview',preview!==0 && index === preview);
      button.setAttribute('aria-pressed',String(index === selectedMarket));
    });
    $$('[data-map-index]').forEach(el => {
      const index = Number(el.dataset.mapIndex);
      el.classList.toggle('map-dim',preview!==0 && index!==0 && index!==preview);
      el.classList.toggle('is-highlighted',preview!==0 && index === preview);
    });
  }
  $$('[data-market]').forEach(button => {
    const index = Number(button.dataset.market);setMarketColor(button,index);
    button.addEventListener('click', () => { selectedMarket=index;paintMap(); });
    button.addEventListener('pointerenter', event => { if (event.pointerType==='mouse') paintMap(index); });
    button.addEventListener('pointerleave', () => paintMap());
    button.addEventListener('focus', () => paintMap(index));
    button.addEventListener('blur', () => paintMap());
  });
  $('#worldMap').addEventListener('pointerover',event => {
    if (event.pointerType!=='mouse') return;
    const target = event.target.closest('[data-map-index]');
    if (target) paintMap(Number(target.dataset.mapIndex));
    else paintMap();
  });
  $('#worldMap').addEventListener('pointerleave',() => paintMap());
  $('#worldMap').addEventListener('click',event => {
    const target = event.target.closest('[data-map-index]');
    if (target) { selectedMarket=Number(target.dataset.mapIndex);paintMap(); }
  });
  function updateMapMotion() {
    const allowed = mapReady && !reducedMotion.matches && !mapMotionPaused;
    $('#mapShell').classList.toggle('is-animating',allowed && mapInView && !document.hidden);
    $('#mapMotion').setAttribute('aria-pressed',String(allowed));
    $('#mapMotion').disabled = reducedMotion.matches || !mapReady;
    const key = reducedMotion.matches ? 'mapReduced' : mapMotionPaused ? 'mapPlay' : 'mapPause';
    $('#mapMotionLabel').dataset.i18n = key;
    $('#mapMotionLabel').textContent = translate(key);
  }
  $('#mapMotion').addEventListener('click',() => {mapMotionPaused=!mapMotionPaused;updateMapMotion();});
  reducedMotion.addEventListener('change',updateMapMotion);
  document.addEventListener('visibilitychange',updateMapMotion);
  window.addEventListener('resize', () => { resizeMap(); requestScrollUpdate(); if (window.innerWidth>1020) closeMenu(); },{passive:true});

  function todayISO() {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
  }
  $('#deliveryDate').min = todayISO();
  function checked(name) { return $$('input[name="'+name+'"]:checked').map(input => input.value); }
  function readBrief() {
    return {
      categories:checked('categories'),
      productDetail:$('#productDetail').value.trim(),
      quantity:$('#quantity').value,
      date:$('#deliveryDate').value,
      supports:checked('supports'),
      notes:$('#notes').value.trim(),
      brand:$('#brand').value.trim(),
      person:$('#person').value.trim(),
      email:$('#email').value.trim(),
      phone:$('#phone').value.trim()
    };
  }
  function clearValidation() {
    validationKey = '';
    $('#formError').hidden = true;
    $$('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  }
  function invalid(key, target) {
    validationKey = key;
    $('#formError').textContent = translate(key);
    $('#formError').hidden = false;
    if (target) { target.setAttribute('aria-invalid','true'); target.focus({preventScroll:true}); }
    return false;
  }
  function validateStep(step) {
    clearValidation();
    const data = readBrief();
    if (step === 0) {
      if (!data.categories.length) return invalid('validationCategory',$('input[name="categories"]'));
      if (!QUANTITIES.slice(1).includes(data.quantity)) return invalid('validationQuantity',$('#quantity'));
      if (data.date && (data.date < todayISO() || $('#deliveryDate').validity.badInput || !/^\d{4}-\d{2}-\d{2}$/.test(data.date))) return invalid('validationDate',$('#deliveryDate'));
    }
    if (step === 1 && !data.supports.length) return invalid('validationSupport',$('input[name="supports"]'));
    if (step === 2) {
      if (!data.brand) return invalid('validationContact',$('#brand'));
      if (!data.person) return invalid('validationContact',$('#person'));
      if (!data.email || !$('#email').validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return invalid('validationContact',$('#email'));
    }
    return true;
  }
  function renderFormStep(focus = true) {
    $$('[data-form-step]').forEach(fieldset => { fieldset.hidden = Number(fieldset.dataset.formStep) !== formStep; });
    $('#reviewPanel').hidden = formStep !== 3;
    $('#formStepCount').textContent = translate('stepPrefix')+' '+String(formStep+1).padStart(2,'0')+' / 04';
    $('#formStepTitle').textContent = translate('stepTitles')[formStep];
    $('#formStepDescription').textContent = translate('stepDescriptions')[formStep];
    $$('#briefProgress li').forEach((item,index) => {
      if (index === formStep) item.setAttribute('aria-current','step'); else item.removeAttribute('aria-current');
      item.classList.toggle('is-complete',index < formStep);
    });
    $('#backButton').hidden = formStep === 0;
    $('#backButton').textContent = translate(formStep === 3 ? 'edit' : 'back');
    $('#nextButton').hidden = formStep === 3;
    $('#shareButton').hidden = formStep !== 3;
    $('#nextLabel').textContent = translate(formStep === 2 ? 'review' : 'next');
    $('#shareLabel').textContent = translate(sending ? 'sending' : 'share');
    if (focus && !submitted) {
      $('#formStepTitle').focus({preventScroll:true});
      const rect = $('#briefCard').getBoundingClientRect();
      if (rect.top < 85 || rect.top > window.innerHeight*.45) $('#briefCard').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    }
  }
  function dateLabel(value) {
    if (!value) return translate('notSet');
    return new Intl.DateTimeFormat(LOCALES[activeLang],{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00'));
  }
  function summaryRows(data) {
    return [
      [translate('productLabel'),data.categories.map(id => translate('fabrics')[FABRIC_IDS.indexOf(id)].name).join(', ')],
      [translate('productDetail'),data.productDetail || translate('notSet')],
      [translate('quantity'),translate('quantityOptions')[QUANTITIES.indexOf(data.quantity)]],
      [translate('date'),dateLabel(data.date)],
      [translate('supportLabel'),data.supports.map(id => translate('supports')[SUPPORT_IDS.indexOf(id)]).join('\n')],
      [translate('notes'),data.notes || translate('noNotes')],
      [translate('brand'),data.brand],
      [translate('person'),data.person],
      [translate('email'),data.email],
      [translate('phone'),data.phone || '—']
    ];
  }
  function renderSummary() {
    if (!reviewedSnapshot) return;
    $('#reviewList').replaceChildren(...summaryRows(reviewedSnapshot).map(([label,value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt'); const dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = value; row.append(dt,dd); return row;
    }));
    const body = summaryRows(reviewedSnapshot).map(([key,value]) => key+': '+value).join('\n\n');
    $('#emailFallback').href = 'mailto:'+RECIPIENT+'?subject='+encodeURIComponent('TrendOffice — '+reviewedSnapshot.brand)+'&body='+encodeURIComponent(body);
  }
  function nextStep() {
    if (sending || submitted || formStep >= 3 || !validateStep(formStep)) return;
    if (formStep === 2) {
      // Revalidate earlier data before producing the review snapshot.
      for (const step of [0,1]) {
        if (!validateStep(step)) { formStep = step; renderFormStep(); return; }
      }
      const data = readBrief();
      reviewedSnapshot = Object.freeze({...data,categories:Object.freeze([...data.categories]),supports:Object.freeze([...data.supports])});
    }
    formStep++;
    if (formStep === 3) renderSummary();
    renderFormStep();
  }
  $('#nextButton').addEventListener('click',nextStep);
  $('#backButton').addEventListener('click', () => {
    if (sending || submitted) return;
    clearValidation();
    reviewedSnapshot = null;
    $('#sendError').hidden = true;
    formStep = formStep === 3 ? 0 : Math.max(0,formStep-1);
    renderFormStep();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    // Enter advances through editing only. It never sends the review.
    if (formStep < 3) nextStep();
  });
  form.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'BUTTON') {
      event.preventDefault();
      if (formStep < 3) nextStep();
    }
  });
  form.addEventListener('input', () => { clearValidation(); if (formStep<3) reviewedSnapshot = null; });
  $$('input[name="supports"]').forEach(input => input.addEventListener('change', () => {
    if (input.checked && input.value === 'full') $$('input[name="supports"]').forEach(other => { if (other!==input) other.checked=false; });
    else if (input.checked) $('input[name="supports"][value="full"]').checked=false;
  }));

  // This is the only network write in the site. No autosave, no automatic send.
  async function shareReviewed() {
    if (formStep!==3 || !reviewedSnapshot || sending || submitted) return;
    if (form.elements.namedItem('_honey').value) return;
    const snapshot = reviewedSnapshot;
    const reviewText = summaryRows(snapshot).map(([key,value]) => key+': '+value).join('\n\n');
    const payload = {
      name:snapshot.person,email:snapshot.email,
      _subject:('TrendOffice — Collection request — '+snapshot.brand).replace(/[\r\n]/g,' '),
      _template:'table',
      brand:snapshot.brand,
      language:activeLang.toUpperCase(),
      collection_request:reviewText,
      _honey:''
    };
    sending = true;
    $('#shareButton').disabled = true;
    $('#backButton').disabled = true;
    $('#languageToggle').disabled = true;
    $('#shareLabel').textContent = translate('sending');
    $('#sendError').hidden = true;
    $('#briefCard').setAttribute('aria-busy','true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),20000);
    try {
      const response = await fetch(SUBMIT_URL,{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'
      });
      if (!response.ok) throw new Error('Submission HTTP status '+response.status);
      const result = await response.json();
      if (result.success!==true && result.success!=='true') throw new Error('Submission not acknowledged');
      submitted = true;
      form.hidden = true;
      $('#formIntro').hidden = true;
      $('#briefProgress').hidden = true;
      $('#successPanel').hidden = false;
      $('#newRequest').focus({preventScroll:true});
    } catch (_) {
      $('#sendError').hidden = false;
    } finally {
      clearTimeout(timeout);
      sending = false;
      $('#shareButton').disabled = false;
      $('#backButton').disabled = false;
      $('#languageToggle').disabled = false;
      $('#shareLabel').textContent = translate('share');
      $('#briefCard').removeAttribute('aria-busy');
    }
  }
  $('#shareButton').addEventListener('click',shareReviewed);
  $('#newRequest').addEventListener('click', () => {
    form.reset(); formStep=0; reviewedSnapshot=null; submitted=false;
    form.hidden=false; $('#formIntro').hidden=false; $('#briefProgress').hidden=false; $('#successPanel').hidden=true; $('#sendError').hidden=true;
    clearValidation(); renderFormStep();
  });

  // Privacy notice
  const privacyDialog = $('#privacyDialog');
  let privacyReturn = null;
  $$('[data-privacy-open]').forEach(button => button.addEventListener('click', () => {
    privacyReturn = button;
    if (typeof privacyDialog.showModal === 'function') privacyDialog.showModal(); else privacyDialog.setAttribute('open','');
  }));
  function closePrivacy() {
    if (typeof privacyDialog.close === 'function') privacyDialog.close(); else privacyDialog.removeAttribute('open');
  }
  $('#privacyClose').addEventListener('click',closePrivacy);
  privacyDialog.addEventListener('click',event => { if (event.target === privacyDialog) closePrivacy(); });
  privacyDialog.addEventListener('close',() => { if (privacyReturn) privacyReturn.focus({preventScroll:true}); });

  function updateClock() {
    $('#istanbulClock').textContent = new Intl.DateTimeFormat(LOCALES[activeLang],{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
  }
  setInterval(updateClock,60000);
  $('#copyrightYear').textContent = String(new Date().getFullYear());

  // Copy email: many visitors have no mail app linked to mailto links.
  let copyTimer = 0;
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) {}
    const area = document.createElement('textarea');
    area.value = text; area.setAttribute('readonly',''); area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.append(area); area.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
    area.remove(); return ok;
  }
  $('#copyEmail').addEventListener('click', async () => {
    const button = $('#copyEmail');
    if (!(await copyText(button.dataset.copy))) return;
    clearTimeout(copyTimer);
    button.classList.add('is-copied');
    $('#copyEmailLabel').textContent = translate('copied');
    $('#copyStatus').textContent = translate('copied');
    copyTimer = setTimeout(() => {
      button.classList.remove('is-copied');
      $('#copyEmailLabel').textContent = translate('copyEmail');
      $('#copyStatus').textContent = '';
    },2200);
  });
  applyLanguage(activeLang,false);
  drawMap();
  requestScrollUpdate();
})();
