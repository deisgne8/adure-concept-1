document.querySelector('.menu-toggle')?.addEventListener('click',function(){const open=this.getAttribute('aria-expanded')!=='true';this.setAttribute('aria-expanded',String(open));document.querySelector('#navigation').classList.toggle('open',open)});
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#navigation').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false')}));
(() => {
if(window.adureInitialized)return;window.adureInitialized=true;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const header=$('.header');
let navFrame=false;
function updateNavigation(){const hidden=window.scrollY>80;header.classList.toggle('is-scrolled',hidden);header.inert=hidden;if(hidden){$('#navigation')?.classList.remove('open');$('.menu-toggle')?.setAttribute('aria-expanded','false')}navFrame=false}
addEventListener('scroll',()=>{if(!navFrame){navFrame=true;requestAnimationFrame(updateNavigation)}},{passive:true});
updateNavigation();
// Synchronise each caption with the photograph crossing the viewport centre.
const story=$('.services-story');
if(story){
  const pictures=$$('.stage-image'), captions=$$('.stage-copy-stack>.stage-copy');
  story.classList.add('is-enhanced');
  let current=-1,queued=false;
  function updateStage(){
    queued=false;
    const centre=innerHeight*.5;
    let active=0,distance=Infinity;
    pictures.forEach((picture,i)=>{const r=picture.getBoundingClientRect();const d=Math.abs(r.top+r.height*.5-centre);if(d<distance){distance=d;active=i}});
    if(active===current)return;
    current=active;
    captions.forEach((caption,i)=>{caption.classList.toggle('is-active',i===active);caption.classList.toggle('is-prev',i<active);caption.inert=i!==active;caption.setAttribute('aria-hidden',String(i!==active))});
    $('.stage-progress>span').style.transform=`translateY(${active*100}%)`;
  }
  function scheduleStage(){if(!queued){queued=true;requestAnimationFrame(updateStage)}}
  addEventListener('scroll',scheduleStage,{passive:true});
  addEventListener('resize',scheduleStage);
  updateStage();
}
const cards=$$('.property');let mode='Lease',savedOnly=false;let saved=[];
try{saved=JSON.parse(localStorage.getItem('adure-saved')||'[]');if(!Array.isArray(saved))saved=[]}catch{}
let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4500)}
function persist(){try{localStorage.setItem('adure-saved',JSON.stringify(saved))}catch{toast('Saved for this visit. Browser storage is unavailable.')}}
function updateSaved(){cards.forEach(c=>{const active=saved.includes(c.dataset.id);c.querySelector('.favorite').setAttribute('aria-pressed',String(active));c.querySelector('.favorite').textContent=active?'♥':'♡'});$('#saved-count').textContent=String(saved.length)}
function filter(){const location=$('#location').value,type=$('#property-type').value,beds=$('#bedrooms').value,price=$('#price').value;let count=0;cards.forEach(c=>{const d=c.dataset;const n=Number(d.price);let visible=mode==='Lease'&&(!location||location===d.location)&&(!type||type===d.type)&&(!savedOnly||saved.includes(d.id));if(beds)visible=visible&&d.beds!==''&&(beds==='1-2'?Number(d.beds)>=1&&Number(d.beds)<=2:beds==='3'?Number(d.beds)>=3:Number(d.beds)===0);if(price){const [lo,hi]=price.split('-').map(Number);visible=visible&&n>=lo&&(!hi||n<hi)}const amenities=[...document.querySelectorAll('#amenities-dropdown input:checked')].map(input=>input.value);visible=visible&&amenities.every(value=>(d.amenities||'').split(',').includes(value));c.hidden=!visible;if(visible)count++});$('#results-count').textContent=`${count} ${savedOnly?'saved ':''}preview ${count===1?'property':'properties'}`;$('#empty-state').hidden=count>0;$('#empty-enquiry').dataset.enquiry=mode}
function setMode(next){mode=next;$$('[data-tab]').forEach(b=>{const selected=b.dataset.tab===mode;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});$('#price').innerHTML=mode==='Buy'?'<option value="">Any Price</option><option value="0-1000000">Under AED 1M</option><option value="1000000-3000000">AED 1M–3M</option><option value="3000000">AED 3M+</option>':'<option value="">Any Price</option><option value="0-100000">Under AED 100K</option><option value="100000-200000">AED 100K–200K</option><option value="200000">AED 200K+</option>';filter()}
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.tab)));$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('#search-form').addEventListener('submit',e=>{e.preventDefault();filter();$('#results-count').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
function reset(){ $('#search-form').reset();savedOnly=false;$('#saved-toggle').setAttribute('aria-pressed','false');setMode('Lease') }
$('#reset-search').addEventListener('click',reset);$('#view-all').addEventListener('click',()=>{reset();$('#property-results').scrollIntoView({block:'start'})});
$('#saved-toggle').addEventListener('click',()=>{savedOnly=!savedOnly;$('#saved-toggle').setAttribute('aria-pressed',String(savedOnly));filter()});
cards.forEach(c=>{c.querySelector('.favorite').addEventListener('click',()=>{const id=c.dataset.id;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];persist();updateSaved();filter()});c.querySelector('.share')?.addEventListener('click',async()=>{const url=new URL(location.href);url.hash='property-'+c.dataset.id;const title=c.querySelector('h3').textContent;try{if(navigator.share)await navigator.share({title,url:url.href});else{await navigator.clipboard.writeText(url.href);toast('Property preview link copied.')}}catch(e){if(e.name!=='AbortError')toast('To share this preview, copy the page address and property name.')}})});
function openDialog(d){$$('dialog[open]').forEach(x=>x.close());d.showModal();document.body.style.overflow='hidden'}
$$('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('close',()=>{document.body.style.overflow=''});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
function enquiry(type,message=''){ $('#enquiry-type').value=type;$('#enquiry-form [name=message]').value=message;$('#enquiry-status').textContent='';openDialog($('#enquiry-dialog')) }
document.addEventListener('click',e=>{const b=e.target.closest('[data-enquiry]');if(b)enquiry(b.dataset.enquiry,b.dataset.message||'')});
$('#enquiry-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const subject=`ADURE ${f.get('interest')} enquiry`;const body=`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nPhone: ${f.get('phone')||'Not provided'}\nLocation: ${f.get('location')}\nInterest: ${f.get('interest')}\n\n${f.get('message')}`;location.href=`mailto:Inquiries@adu-re.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;$('#enquiry-status').textContent='Your email app has been requested. Please review and send your message there. Nothing has been submitted by this page.'});
function detail(id){const c=cards.find(c=>c.dataset.id===id);if(!c)return;const content=$('#detail-content');content.replaceChildren();const image=c.querySelector('img').cloneNode(true);image.loading='eager';content.append(image);const title=document.createElement('h2');title.id='detail-title';title.textContent=c.querySelector('h3').textContent;content.append(title);['.property-meta','.price','.specs','.assigned'].forEach(s=>content.append(c.querySelector(s).cloneNode(true)));const note=document.createElement('p');note.className='sample-note';note.textContent='Demonstration listing from the supplied wireframe. Price, specifications, availability and image association must be confirmed with ADURE.';content.append(note);const b=document.createElement('button');b.className='button blue';b.textContent='Enquire About This Property';b.dataset.enquiry='Lease';b.dataset.message=`I am interested in ${title.textContent}. Please confirm its details and availability.`;content.append(b);openDialog($('#detail-dialog'))}
$$('[data-property]').forEach(b=>b.addEventListener('click',()=>detail(b.dataset.property)));
$('#portfolio-explore').addEventListener('click',()=>$('#portfolio-gallery').scrollIntoView({block:'start'}));
function info(title,html){$('#info-title').textContent=title;$('#info-content').innerHTML=html;openDialog($('#info-dialog'))}
$$('[data-clients]').forEach(b=>b.addEventListener('click',()=>info('Our Customers','<p>ADURE works with government, semi-government and private-sector organisations across the UAE.</p><p>Our managed assets span residential communities, commercial buildings, office towers, retail shops, hotels, government buildings and mixed-use developments.</p><button class="button blue" data-enquiry="Property Management">Discuss Your Portfolio</button>')));
const infoPages={Privacy:'<p>This preview does not collect or submit enquiry forms. Enquiries are prepared in your email app and sent only when you choose to send them. Saved properties are stored locally in your browser.</p><p>ADURE’s approved privacy policy is required before a live lead-capture service is connected.</p>',Terms:'<p>This is a design preview. Property listings and portfolio associations are demonstration content, not offers. Please contact ADURE to confirm prices, availability and details.</p><p>Approved website terms will be supplied before public launch.</p>',Accessibility:'<p>This page supports keyboard navigation, visible focus indicators, labelled controls, responsive layouts and reduced-motion preferences.</p><p>For assistance, contact <a href="mailto:Inquiries@adu-re.com">Inquiries@adu-re.com</a>.</p>',Sitemap:'<ul><li><a href="#about">About ADURE</a></li><li><a href="#services">Services</a></li><li><a href="#properties">Properties</a></li><li><a href="#management">Property Management</a></li><li><a href="#portfolio">Portfolio</a></li><li><a href="#customers">Our Customers</a></li><li><a href="#contact">Contact</a></li></ul>','Media and Gallery':'<p>Explore the architectural imagery in our portfolio preview.</p><p><a href="#portfolio">View the portfolio gallery</a></p>','Careers':'<p>Contact ADURE for information about current career opportunities.</p><a href="mailto:Inquiries@adu-re.com?subject=Careers%20enquiry">Enquire About Careers</a>','Upcoming projects':'<p>Contact ADURE for confirmed information about upcoming projects.</p><button class="button blue" data-enquiry="Buy">Discuss Upcoming Projects</button>','Qaryat Al Hidd':'<p>For information about Qaryat Al Hidd on Saadiyat Island, contact the ADURE team.</p><button class="button blue" data-enquiry="Lease" data-message="Please send me information about Qaryat Al Hidd.">Enquire About Qaryat Al Hidd</button>'};
$$('[data-info]').forEach(b=>b.addEventListener('click',()=>info(b.dataset.info,infoPages[b.dataset.info])));$('#info-content').addEventListener('click',e=>{if(e.target.closest('a[href^="#"]'))$('#info-dialog').close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}});
updateSaved();filter();if(location.hash.startsWith('#property-'))detail(location.hash.slice(10));window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#property-'))detail(location.hash.slice(10))});
})();

/* Carry the inline Sell With ADURE form into the existing reviewable enquiry flow. */
(() => {
 const form=document.querySelector('#sell-form');
 const dialog=document.querySelector('#enquiry-dialog');
 if(!form||!dialog)return;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(form);
  const contact=String(data.get('contact')||'').trim();
  dialog.querySelector('#enquiry-type').value='Sell';
  dialog.querySelector('[name="name"]').value=String(data.get('name')||'');
  dialog.querySelector('[name="location"]').value=String(data.get('location')||'Abu Dhabi');
  dialog.querySelector('[name="email"]').value=contact.includes('@')?contact:'';
  dialog.querySelector('[name="phone"]').value=contact.includes('@')?'':contact;
  dialog.querySelector('[name="message"]').value=`I would like to discuss selling my ${data.get('property_type')} in ${data.get('location')}.`;
  dialog.querySelector('#enquiry-status').textContent='';
  dialog.showModal();
  document.body.style.overflow='hidden';
 });
})();

(() => {
  const section=document.querySelector('#management');
  const stage=section?.querySelector('.management-stage');
  const track=section?.querySelector('.management-image-track');
  if(!track||!stage)return;
  const rows=[...section.querySelectorAll('.management-services details')];
  const images=[...track.querySelectorAll('img')];
  const desktop=matchMedia('(min-width:851px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  let active=0,desired=0,progress=0,busy=false,enabled=false,frame=0,revision=0;
  let animations=[];
  function mark(){
    rows.forEach((row,i)=>row.style.setProperty('--line-progress',enabled?clamp(progress*images.length-i):(row.open?1:0)));
  }
  function highlight(index){
    rows.forEach((row,i)=>{row.classList.toggle('is-active',i===index);row.open=i===index});
    mark();
  }
  function settle(){
    images.forEach((img,i)=>{
      img.style.visibility=i===active?'visible':'hidden';
      img.style.zIndex=i===active?'1':'0';
    });
  }
  async function advance(){
    if(busy||!enabled||desired===active)return;
    busy=true;
    const token=revision;
    const direction=Math.sign(desired-active);
    const next=active+direction;
    const outgoing=images[active],incoming=images[next];
    incoming.style.visibility='visible';incoming.style.zIndex='2';
    const timing={duration:780,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
    animations=[
      incoming.animate([
        {clipPath:direction>0?'inset(100% 0 0 0)':'inset(0 0 100% 0)',transform:`translateY(${direction*5}%) scale(1.04)`},
        {clipPath:'inset(0 0 0 0)',transform:'translateY(0) scale(1)'}
      ],timing),
      outgoing.animate([{transform:'translateY(0)'},{transform:`translateY(${-direction*6}%)`}],timing)
    ];
    highlight(next);
    await Promise.all(animations.map(animation=>animation.finished.catch(()=>{})));
    if(token!==revision)return;
    active=next;settle();
    animations.forEach(animation=>animation.cancel());animations=[];
    busy=false;
    advance();
  }
  function measure(){
    frame=0;
    const shouldEnable=desktop.matches&&!reduced.matches;
    section.classList.toggle('has-scroll-story',shouldEnable);
    if(!shouldEnable){
      if(enabled){
        revision++;animations.forEach(animation=>animation.cancel());animations=[];busy=false;
        images.forEach(img=>{img.style.visibility='';img.style.zIndex=''});
      }
      enabled=false;track.style.transform='';mark();return;
    }
    const top=parseFloat(getComputedStyle(stage).top)||0;
    const travel=Math.max(1,section.offsetHeight-stage.offsetHeight);
    progress=clamp((top-section.getBoundingClientRect().top)/travel);
    desired=Math.min(images.length-1,Math.floor(progress*images.length));
    if(!enabled){enabled=true;active=desired;settle();highlight(active)}
    mark();advance();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(measure)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  desktop.addEventListener('change',schedule);
  rows.forEach((row,i)=>{
    row.querySelector('summary').addEventListener('click',event=>{
      if(!enabled)return;
      event.preventDefault();
      const top=parseFloat(getComputedStyle(stage).top)||0;
      const start=scrollY+section.getBoundingClientRect().top-top;
      scrollTo({top:start+(section.offsetHeight-stage.offsetHeight)*(i+.15)/images.length,behavior:'smooth'});
    });
    row.addEventListener('toggle',()=>{row.classList.toggle('is-active',row.open);mark()});
  });
  document.fonts?.ready.then(schedule);
  measure();
})();

(() => {
  const track=document.querySelector('.portfolio-track');
  if(!track)return;
  const previous=document.querySelector('#portfolio-prev'),next=document.querySelector('#portfolio-next');
  const arrow='<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  previous.innerHTML=arrow;next.innerHTML=arrow;
  const cards=[...track.querySelectorAll('.portfolio-card')];
  const filters=[...document.querySelectorAll('[data-portfolio-filter]')];
  const behavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
  const visibleCards=()=>cards.filter(card=>!card.hidden);
  function state(){previous.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2}
  function step(direction){const card=visibleCards()[0];if(!card)return;const gap=parseFloat(getComputedStyle(track).gap)||24;track.scrollBy({left:direction*(card.offsetWidth+gap),behavior:behavior()})}
  previous.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
  track.addEventListener('scroll',state,{passive:true});addEventListener('resize',state);
  const cardObserver=new ResizeObserver(state);
  cards.forEach(card=>cardObserver.observe(card));
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}});
  filters.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.portfolioFilter;
    filters.forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
    cards.forEach(card=>{card.hidden=filter!=='all'&&card.dataset.portfolioCategory!==filter});
    track.scrollLeft=0;
    state();
  }));
  state();
})();

(() => {
  const map=document.querySelector('.proof-map-art');
  if(!map)return;
  map.classList.add('is-static-map');
  const svg=map.querySelector('.abu-dhabi-graphic');
  const image=document.createElement('img');image.className='static-map-image';image.src='assets/adure-uae-footprint-no-pointers.png';image.alt='Illustrated ADURE footprint across Abu Dhabi, Saadiyat Island, Al Ain and Dubai';image.width=1671;image.height=941;image.loading='lazy';map.prepend(image);svg.hidden=true;
  svg?.removeAttribute('tabindex');svg?.removeAttribute('aria-label');
  map.querySelectorAll('[data-map-project]').forEach(pin=>{pin.removeAttribute('role');pin.removeAttribute('tabindex');pin.removeAttribute('aria-expanded');pin.removeAttribute('aria-controls')});
})();


(() => {
  const map=document.querySelector('.proof-map-art');
  if(!map||map.classList.contains('is-static-map'))return;
  const pins=[...map.querySelectorAll('[data-map-project]')];
  let active=null,timer=0;
  const preview=pin=>document.getElementById(pin.getAttribute('aria-controls'));
  function place(){
    if(!active)return;
    const panel=preview(active),bounds=map.getBoundingClientRect(),pin=active.querySelector('use').getBoundingClientRect();
    const left=Math.max(10,Math.min(bounds.width-panel.offsetWidth-10,pin.left-bounds.left+pin.width/2-panel.offsetWidth/2));
    const below=pin.bottom-bounds.top+12;
    const top=below+panel.offsetHeight<=bounds.height-10?below:Math.max(10,pin.top-bounds.top-panel.offsetHeight-12);
    panel.style.left=`${left}px`;panel.style.top=`${top}px`;
  }
  function hide(){
    clearTimeout(timer);
    if(!active)return;
    active.setAttribute('aria-expanded','false');
    const panel=preview(active);panel.classList.remove('is-visible');panel.setAttribute('aria-hidden','true');active=null;
  }
  function show(pin){
    if(map.classList.contains('is-dragging'))return;
    clearTimeout(timer);
    if(active!==pin){hide();active=pin}
    pin.setAttribute('aria-expanded','true');
    const panel=preview(pin);place();panel.setAttribute('aria-hidden','false');panel.classList.add('is-visible');
  }
  function later(){clearTimeout(timer);timer=setTimeout(hide,160)}
  pins.forEach(pin=>{
    pin.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')show(pin)});
    pin.addEventListener('pointerleave',later);
    pin.addEventListener('focus',()=>show(pin));
    pin.addEventListener('blur',later);
    pin.addEventListener('click',()=>show(pin));
    pin.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();show(pin)}
    });
    const panel=preview(pin);
    panel.addEventListener('pointerenter',()=>clearTimeout(timer));
    panel.addEventListener('pointerleave',later);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide()});
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.map-project,.map-preview'))hide()});
  addEventListener('resize',place);
  map.addEventListener('mapviewchange',place);
  map.addEventListener('mapdragstart',hide);
})();

(() => {
  const map=document.querySelector('.proof-map-art'),svg=map?.querySelector('.abu-dhabi-graphic');
  if(!svg||map.classList.contains('is-static-map'))return;
  const pins=[...map.querySelectorAll('[data-map-project]')];
  const controls=document.createElement('div');controls.className='map-explore-controls';
  controls.innerHTML='<label><select aria-label="Find a project"><option value="">All projects</option></select></label><div class="map-zoom-group" role="group" aria-label="Map zoom"><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="out" aria-label="Zoom out">−</button></div><button type="button" data-zoom="reset">Reset view</button><span>Drag to explore</span>';
  map.prepend(controls);
  const select=controls.querySelector('select');
  pins.forEach(pin=>{const option=document.createElement('option');option.value=pin.dataset.mapProject;option.textContent=pin.querySelector('.map-project-name').textContent;select.append(option)});
  svg.setAttribute('tabindex','0');svg.setAttribute('aria-label','Abu Dhabi project map. Drag to pan or use arrow keys. Use the controls to zoom or find a project.');
  let view={x:0,y:0,w:1200,h:500},animation=0,drag=null,suppressUntil=0;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function bounded(v){return {...v,x:clamp(v.x,0,1200-v.w),y:clamp(v.y,0,500-v.h)}}
  function draw(v){view=bounded(v);svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);controls.querySelector('[data-zoom="in"]').disabled=view.w<=400.1;controls.querySelector('[data-zoom="out"]').disabled=view.w>=1199.9;map.dispatchEvent(new Event('mapviewchange'))}
  function move(v,done){
    cancelAnimationFrame(animation);const goal=bounded(v),from={...view},start=performance.now();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(goal);done?.();return}
    function tick(now){const p=Math.min(1,(now-start)/420),t=1-Math.pow(1-p,3);draw(Object.fromEntries(Object.keys(goal).map(k=>[k,from[k]+(goal[k]-from[k])*t])));if(p<1)animation=requestAnimationFrame(tick);else{animation=0;done?.()}}
    animation=requestAnimationFrame(tick);
  }
  function zoom(factor){const w=clamp(view.w*factor,400,1200),h=w*5/12;move({x:view.x+(view.w-w)/2,y:view.y+(view.h-h)/2,w,h})}
  controls.addEventListener('click',event=>{const action=event.target.closest('[data-zoom]')?.dataset.zoom;if(action==='in')zoom(.8);if(action==='out')zoom(1.25);if(action==='reset'){select.value='';map.dispatchEvent(new Event('mapdragstart'));move({x:0,y:0,w:1200,h:500})}});
  select.addEventListener('change',()=>{
    const pin=pins.find(p=>p.dataset.mapProject===select.value);
    map.dispatchEvent(new Event('mapdragstart'));
    if(!pin){move({x:0,y:0,w:1200,h:500});return}
    const [x,y]=pin.getAttribute('transform').match(/[-\d.]+/g).map(Number);
    move({x:x-320,y:y-115,w:640,h:640*5/12},()=>{pin.dispatchEvent(new MouseEvent('click',{bubbles:true}))});
  });
  svg.addEventListener('pointerdown',event=>{
    if(event.button!==0||drag)return;
    cancelAnimationFrame(animation);
    if(view.w>1199){draw({x:120,y:50,w:960,h:400})}
    const matrix=svg.getScreenCTM();
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,view:{...view},scale:matrix.a,moved:false};
  });
  svg.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<5)return;
    if(!drag.moved){drag.moved=true;svg.setPointerCapture(event.pointerId);map.classList.add('is-dragging');map.dispatchEvent(new Event('mapdragstart'))}
    draw({...drag.view,x:drag.view.x-dx/drag.scale,y:drag.view.y-dy/drag.scale});
  });
  function end(event){if(!drag||drag.id!==event.pointerId)return;if(drag.moved)suppressUntil=performance.now()+350;drag=null;map.classList.remove('is-dragging');if(svg.hasPointerCapture(event.pointerId))svg.releasePointerCapture(event.pointerId)}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);svg.addEventListener('lostpointercapture',end);
  addEventListener('pointerup',end);
  svg.addEventListener('click',event=>{if(performance.now()<suppressUntil){event.preventDefault();event.stopImmediatePropagation()}},true);
  svg.addEventListener('keydown',event=>{
    if(event.target!==svg)return;
    const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(directions[event.key]){event.preventDefault();const [x,y]=directions[event.key];if(view.w===1200)draw({x:120,y:50,w:960,h:400});move({...view,x:view.x+x*view.w*.12,y:view.y+y*view.h*.12})}
  });
  draw(view);
})();

(() => {
  const section=document.querySelector('.transition-story');
  if(!section)return;
  const stage=section.querySelector('.transition-stage');
  const points=[...section.querySelectorAll('.transition-point')];
  const images=[...section.querySelectorAll('.transition-image')];
  /* Keep one composed architectural image throughout this compact section. */
  section.classList.remove('is-scroll-story');
  images.forEach((image,index)=>{
    image.classList.toggle('is-active',index===0);
    image.hidden=index!==0;
  });
  points.forEach((point,index)=>{
    point.classList.add('is-active');
    point.setAttribute('aria-pressed','true');
    point.style.setProperty('--point-progress','1');
    point.addEventListener('click',()=>point.blur());
  });
  return;
  const viewport=matchMedia('(min-width:851px) and (min-height:700px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let current=-1,desired=0,frame=0,busy=false,revision=0,animations=[];
  function highlight(index){
    points.forEach((point,i)=>{point.classList.toggle('is-active',i===index);point.setAttribute('aria-pressed',String(i===index))});
  }
  function settle(){
    images.forEach((image,i)=>{
      image.classList.toggle('is-active',i===current);
      image.style.visibility=i===current?'visible':'hidden';
      image.style.zIndex=i===current?'1':'0';
    });
  }
  async function advance(){
    if(busy||current===desired)return;
    busy=true;
    const token=revision,direction=Math.sign(desired-current),next=current+direction;
    const incoming=images[next],outgoing=images[current];
    incoming.style.visibility='visible';incoming.style.zIndex='2';
    const timing={duration:780,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
    animations=[
      incoming.animate([
        {clipPath:direction>0?'inset(100% 0 0 0)':'inset(0 0 100% 0)',transform:`translateY(${direction*5}%) scale(1.04)`},
        {clipPath:'inset(0 0 0 0)',transform:'translateY(0) scale(1)'}
      ],timing),
      outgoing.animate([{transform:'translateY(0)'},{transform:`translateY(${-direction*6}%)`}],timing)
    ];
    highlight(next);
    await Promise.all(animations.map(animation=>animation.finished.catch(()=>{})));
    if(token!==revision)return;
    current=next;settle();
    animations.forEach(animation=>animation.cancel());animations=[];busy=false;
    advance();
  }
  function select(index){
    desired=index;
    if(current<0||reduced.matches){
      revision++;animations.forEach(animation=>animation.cancel());animations=[];busy=false;
      current=index;settle();highlight(index);return;
    }
    advance();
  }
  function update(){
    frame=0;
    const enabled=viewport.matches&&!reduced.matches;
    section.classList.toggle('is-scroll-story',enabled);
    if(!enabled){if(current<0||reduced.matches)select(current<0?0:desired);points.forEach((point,i)=>point.style.setProperty('--point-progress',i<=current?1:0));return}
    const top=parseFloat(getComputedStyle(stage).top)||0;
    const progress=Math.max(0,Math.min(1,(top-section.getBoundingClientRect().top)/Math.max(1,section.offsetHeight-stage.offsetHeight)))*points.length;
    select(Math.min(points.length-1,Math.floor(progress)));
    points.forEach((point,i)=>point.style.setProperty('--point-progress',Math.max(0,Math.min(1,progress-i))));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  points.forEach((point,i)=>point.addEventListener('click',()=>{
    if(section.classList.contains('is-scroll-story')){
      const top=parseFloat(getComputedStyle(stage).top)||0;
      scrollTo({top:scrollY+section.getBoundingClientRect().top-top+(section.offsetHeight-stage.offsetHeight)*(i+.15)/points.length,behavior:'smooth'});
    }else{select(i);update()}
  }));
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  viewport.addEventListener('change',schedule);reduced.addEventListener('change',schedule);
  update();
})();

/* English / Arabic interface, preserving control values and original text. */
(() => {
const labels={"We look beyond the deal to how a property performs, how it is cared for, and the value it can create over time. Clear advice and connected expertise guide every step.":"ننظر إلى ما بعد الصفقة: أداء العقار والعناية به والقيمة التي يحققها بمرور الوقت. المشورة الواضحة والخبرات المتكاملة توجه كل خطوة.","A Longer View.":"رؤية بعيدة المدى.","Your partner in buying, selling, leasing and property management.":"شريكك في شراء العقارات وبيعها وتأجيرها وإدارتها.","A Record That Speaks For Itself.":"سجل إنجازات يتحدث عن نفسه.","Experience, scale and operational performance across a connected UAE portfolio.":"خبرة وحضور واسع وأداء تشغيلي عبر محفظة مترابطة في دولة الإمارات.","Expert support for buying, selling, leasing and management — connected at every stage.":"دعم متخصص للشراء والبيع والتأجير والإدارة، مترابط في كل مرحلة.","One team for leasing, operations, facilities, finance and legal oversight.":"فريق واحد للتأجير والتشغيل والمرافق والشؤون المالية والقانونية.","Professional advice, focused marketing and access to qualified buyers.":"استشارات احترافية وتسويق موجّه ووصول إلى مشترين مؤهلين.","One connected real-estate partner":"شريك عقاري متكامل","Scroll to explore":"مرّر للاستكشاف","About ADURE": "عن أدور", "Services": "الخدمات", "Properties": "العقارات", "Portfolio": "محفظتنا", "Our Customers": "عملاؤنا", "Contact": "تواصل معنا", "List Your Property": "أدرج عقارك", "Menu": "القائمة", "Skip to content": "انتقل إلى المحتوى", "ABU DHABI UNITED REAL ESTATE": "أبوظبي المتحدة للعقارات", "Creating Value": "نصنع القيمة", "Beyond Property.": "أبعد من العقار.", "Creating Value.": "نصنع القيمة.", "Explore ADURE": "اكتشف أدور", "Find a Property": "ابحث عن عقار", "OUR PHILOSOPHY": "فلسفتنا", "A Longer": "رؤية", "View.": "بعيدة المدى.", "For us, the transaction is one moment. What follows matters just as much.": "الصفقة بالنسبة لنا مجرد بداية، وما يأتي بعدها لا يقل أهمية.", "POSITIONING": "التموضع", "Market clarity": "وضوح السوق", "Bringing your property to market with clarity.": "نطرح عقارك في السوق برؤية واضحة.", "PERFORMANCE": "الأداء", "Everyday performance": "الأداء اليومي", "Supporting occupancy, operations, and day-to-day performance.": "ندعم الإشغال والعمليات والأداء اليومي.", "STEWARDSHIP": "الرعاية", "Long-term protection": "حماية طويلة الأمد", "Protecting the financial, legal and operational interests around the asset.": "نحمي المصالح المالية والقانونية والتشغيلية المرتبطة بالعقار.", "END-TO-END REAL ESTATE": "خدمات عقارية متكاملة", "With You Across": "معك في", "Every Stage.": "كل مرحلة.", "Whether you're buying, selling, leasing or placing an asset under management, we bring the right expertise together so every stage feels connected and considered.": "سواء كنت تشتري أو تبيع أو تستأجر أو تسند إدارة عقارك إلينا، نجمع الخبرات المناسبة لتكون كل مرحلة مترابطة ومدروسة.", "Buy": "شراء", "Sell": "بيع", "Lease": "استئجار", "Manage": "إدارة", "Buy With ADURE": "اشترِ مع أدور", "Sell With ADURE": "بع مع أدور", "Lease With ADURE": "استأجر مع أدور", "Find the right property with clear information and informed guidance.": "اعثر على العقار المناسب بمعلومات واضحة وإرشاد مدروس.", "Bring your property to market with professional advice, strong exposure and access to qualified buyers.": "اطرح عقارك في السوق باستشارات احترافية وتسويق فعّال ووصول إلى مشترين مؤهلين.", "Find a residential or commercial property that fits what you need next.": "اعثر على عقار سكني أو تجاري يلبي احتياجاتك القادمة.", "Bring your asset under one connected management approach, with leasing, operations, facilities, finance and legal oversight working together.": "إدارة متكاملة لعقارك تجمع التأجير والتشغيل والمرافق والشؤون المالية والقانونية.", "Property Management": "إدارة العقارات", "PROPERTY DISCOVERY": "اكتشف العقارات", "Find Your Next Property.": "اعثر على عقارك القادم.", "Find a place to call home or grow your business.": "اعثر على منزل لك أو مساحة لتنمية أعمالك.", "LOCATION": "الموقع", "All locations": "جميع المواقع", "Abu Dhabi": "أبوظبي", "Dubai": "دبي", "Al Ain": "العين", "PROPERTY TYPE": "نوع العقار", "All types": "جميع الأنواع", "Apartment": "شقة", "Villa": "فيلا", "Commercial": "تجاري", "BEDROOMS": "غرف النوم", "Any bedrooms": "أي عدد من الغرف", "Studio": "استوديو", "1–2 bedrooms": "غرفة إلى غرفتين", "3+ bedrooms": "٣ غرف فأكثر", "PRICE RANGE": "نطاق السعر", "Any price": "أي سعر", "Under AED 100K": "أقل من ١٠٠ ألف درهم", "AED 100K–200K": "١٠٠ إلى ٢٠٠ ألف درهم", "AED 200K+": "٢٠٠ ألف درهم فأكثر", "Search Properties": "ابحث عن العقارات", "Preview listings · details to confirm": "عقارات للمعاينة · التفاصيل قابلة للتأكيد", "3 preview properties": "٣ عقارات للمعاينة", "Saved properties": "العقارات المحفوظة", "LEASE · PREVIEW": "للإيجار · معاينة", "HIDD AL SAADIYAT": "حد السعديات", "Waterfront Apartment": "شقة على الواجهة البحرية", "Modern Residence": "مسكن عصري", "Commercial Office": "مكتب تجاري", "AL KHALIDIYAH · ABU DHABI": "الخالدية · أبوظبي", "AIRPORT STREET · ABU DHABI": "شارع المطار · أبوظبي", "/ year": "/ سنوياً", "2 beds": "غرفتا نوم", "1 bed": "غرفة نوم", "3 baths": "٣ حمامات", "2 baths": "حمامان", "Office": "مكتب", "View property": "عرض العقار", "No matching preview properties.": "لا توجد عقارات مطابقة للمعاينة.", "Tell us what you're looking for. Our team can help you explore the right options.": "أخبرنا بما تبحث عنه وسيساعدك فريقنا في استكشاف الخيارات المناسبة.", "Discuss Your Search": "ناقش متطلباتك", "Reset filters": "إعادة ضبط المرشحات", "View All Properties": "عرض جميع العقارات", "Have a Property? Talk To ADURE": "لديك عقار؟ تحدث إلى أدور", "One connected approach": "نهج متكامل", "across every part of the asset.": "يشمل جميع جوانب العقار.", "PROPERTY MANAGEMENT": "إدارة العقارات", "Your Asset,": "عقارك،", "Looked After": "رعاية", "As A Whole.": "متكاملة.", "Long-term performance depends on more than one service. We bring leasing, operations, facilities, financial management and legal coordination together under one connected approach.": "الأداء طويل الأمد يتطلب أكثر من خدمة واحدة. نجمع التأجير والتشغيل والمرافق والإدارة المالية والتنسيق القانوني ضمن نهج متكامل.", "Leasing & Operations": "التأجير والتشغيل", "From market assessment and tenant sourcing to administration, renewals and regulatory compliance.": "من تقييم السوق واستقطاب المستأجرين إلى الإدارة والتجديد والامتثال التنظيمي.", "Facility Management": "إدارة المرافق", "Technical, operational and support services that keep properties safe, efficient and reliable.": "خدمات فنية وتشغيلية وداعمة تحافظ على سلامة العقارات وكفاءتها وموثوقيتها.", "Financial & Legal Management": "الإدارة المالية والقانونية", "Structured financial oversight, reporting and legal coordination that give owners greater visibility and control.": "رقابة مالية منظمة وتقارير وتنسيق قانوني تمنح المالك رؤية أوضح وتحكماً أكبر.", "Explore Property Management": "اكتشف إدارة العقارات", "A Record That": "سجل إنجازات", "Speaks For Itself.": "يتحدث عن نفسه.", "ESTABLISHED": "سنة التأسيس", "UNITS MANAGED": "وحدات تحت الإدارة", "PROFESSIONALS": "متخصصون", "OCCUPANCY RATE": "معدل الإشغال", "weeks": "أسابيع", "AVERAGE VACANCY": "متوسط فترة الشغور", "ARABIAN GULF": "الخليج العربي", "ABU DHABI": "أبوظبي", "SAADIYAT ISLAND": "جزيرة السعديات", "AL REEM": "الريم", "MAINLAND": "البر الرئيسي", "Hili": "هيلي", "Al Khalidiya": "الخالدية", "Al Mushrif Villas": "فلل المشرف", "Al Mushrif": "المشرف", "Qaryat Al Hidd": "قرية الحد", "Saadiyat Island": "جزيرة السعديات", "Ghantoot Complex": "مجمع غنتوت", "Mohammed Bin Zayed City": "مدينة محمد بن زايد", "Residential apartments in central Abu Dhabi.": "شقق سكنية في قلب أبوظبي.", "Villa living in an established Abu Dhabi neighbourhood.": "فلل سكنية في أحد أحياء أبوظبي الراسخة.", "Coastal residences on Saadiyat Island.": "مساكن ساحلية في جزيرة السعديات.", "Residential community in Mohammed Bin Zayed City.": "مجتمع سكني في مدينة محمد بن زايد.", "All projects": "جميع المشاريع", "Reset view": "إعادة العرض", "Drag to explore": "اسحب للاستكشاف", "PORTFOLIO": "محفظتنا", "A Portfolio That": "محفظة تعكس", "Reflects Our Range.": "تنوع خبراتنا.", "Residential, commercial and mixed-use properties, united by a focus on performance and lasting value.": "عقارات سكنية وتجارية ومتعددة الاستخدامات يجمعها التركيز على الأداء والقيمة المستدامة.", "Explore Our Portfolio": "استكشف محفظتنا", "Residential Portfolio": "المحفظة السكنية", "Residential · Abu Dhabi": "سكني · أبوظبي", "Garden Residences": "مساكن الحدائق", "Villa Communities": "مجتمعات الفلل", "Residential · MBZ City, Abu Dhabi": "سكني · مدينة محمد بن زايد، أبوظبي", "Commercial Spaces": "مساحات تجارية", "Abu Dhabi-inspired concept": "تصور مستوحى من أبوظبي", "Executive Workspaces": "مساحات عمل تنفيذية", "Previous": "السابق", "Next": "التالي", "TRANSITION PLAN": "خطة الانتقال", "A Considered": "بداية", "Start.": "مدروسة.", "Our structured 30-day transition brings documentation, tenants, operations, and reporting into management step by step.": "خطة انتقال منظمة خلال ٣٠ يوماً تدمج الوثائق والمستأجرين والعمليات والتقارير في الإدارة خطوة بخطوة.", "Review": "المراجعة", "Property and document review, with a full handover audit.": "مراجعة العقار والوثائق مع تدقيق شامل للتسليم.", "Inspect": "المعاينة", "Asset inspection and tenant communication.": "معاينة العقار والتواصل مع المستأجرين.", "Takeover": "الاستلام", "Operational takeover and reporting setup.": "استلام العمليات وإعداد التقارير.", "Full management, reporting and performance monitoring.": "إدارة شاملة وإعداد التقارير ومراقبة الأداء.", "See How We Manage": "اكتشف أسلوب إدارتنا", "TRUST AND CLIENTS": "الثقة والعملاء", "Trusted": "ثقة تمتد", "Across Sectors.": "عبر القطاعات.", "We've worked with government, semi-government and private-sector organisations across the UAE.": "عملنا مع جهات حكومية وشبه حكومية ومؤسسات القطاع الخاص في أنحاء الإمارات.", "Government & Semi-Government": "الجهات الحكومية وشبه الحكومية", "Private Sector & Corporates": "القطاع الخاص والشركات", "START A CONVERSATION": "لنبدأ الحوار", "We're Here For": "نحن هنا", "What Comes Next.": "لخطوتك القادمة.", "Expert support for your next property decision. Let’s start a conversation.": "دعم متخصص لقرارك العقاري القادم. لنتحدث معاً.", "Call": "اتصل بنا", "WhatsApp": "واتساب", "Explore buying & leasing": "استكشف الشراء والإيجار", "Discuss your property": "تحدث عن عقارك", "Support for your asset": "دعم لعقارك", "Contact ADURE": "تواصل مع أدور", "Speak with our team": "تحدث إلى فريقنا", "Abu Dhabi · Dubai · Al Ain": "أبوظبي · دبي · العين", "GET IN TOUCH": "تواصل معنا", "COMPANY": "الشركة", "Media and Gallery": "الإعلام والمعرض", "Careers": "الوظائف", "PROPERTIES": "العقارات", "SERVICES": "الخدمات", "Leasing": "التأجير", "EXPLORE": "اكتشف", "Upcoming projects": "المشاريع القادمة", "Our approach": "نهجنا", "© 2026 ADURE. All rights reserved.": "© ٢٠٢٦ أدور. جميع الحقوق محفوظة.", "Privacy": "الخصوصية", "Terms": "الشروط", "Accessibility": "إمكانية الوصول", "Sitemap": "خريطة الموقع", "Back to top": "العودة للأعلى", "LET'S START A CONVERSATION": "لنبدأ الحوار", "What comes next?": "ما خطوتك القادمة؟", "Tell us a little about what you need. Prepare your enquiry and send it using your email app.": "أخبرنا باحتياجاتك. جهّز استفسارك وأرسله عبر تطبيق البريد الإلكتروني.", "I'm interested in": "أنا مهتم بـ", "General": "استفسار عام", "Your name": "اسمك", "Email address": "البريد الإلكتروني", "Phone number": "رقم الهاتف", "Preferred location": "الموقع المفضل", "Your message": "رسالتك", "This page does not submit or store your enquiry. The next step opens your email app so you can review and send it.": "هذه الصفحة لا ترسل استفسارك ولا تخزنه. الخطوة التالية تفتح تطبيق بريدك لمراجعة الرسالة وإرسالها.", "Prepare Email Enquiry": "جهّز الاستفسار بالبريد"};
const button=document.querySelector('.language-switch');
if(!button)return;
let language='en';
try{language=localStorage.getItem('adure-language')==='ar'?'ar':'en'}catch{}
const originals=new WeakMap();
const observer=new MutationObserver(()=>translate());
function translate(){
 observer.disconnect();
 document.querySelectorAll('option').forEach(option=>{if(!option.hasAttribute('value'))option.value=option.textContent});
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(node.parentElement?.closest('script,style,.language-switch'))continue;
  let record=originals.get(node);
  if(!record||node.nodeValue!==record.rendered){record={original:node.nodeValue,rendered:node.nodeValue};originals.set(node,record)}
  const key=record.original.trim();
  const value=language==='ar'&&labels[key]?record.original.replace(key,labels[key]):record.original;
  if(node.nodeValue!==value)node.nodeValue=value;
  record.rendered=value;
 }
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
function apply(){
 document.documentElement.lang=language;
 document.documentElement.dir=language==='ar'?'rtl':'ltr';
 button.textContent=language==='ar'?'English':'العربية';
 button.lang=language==='ar'?'en':'ar';
 button.setAttribute('aria-label',language==='ar'?'Switch to English':'التبديل إلى العربية');
 translate();
 dispatchEvent(new Event('resize'));
}
button.addEventListener('click',()=>{language=language==='en'?'ar':'en';try{localStorage.setItem('adure-language',language)}catch{}apply()});
apply();
})();
/* Hover, keyboard focus and touch choose the illustrated philosophy card. */
(() => {
 const group=document.querySelector('.philosophy-cards');if(!group)return;
 const cards=[...group.querySelectorAll('.philosophy-card')];
 function activate(index){group.dataset.active=String(index);cards.forEach((card,i)=>card.classList.toggle('is-featured',i===index))}
 cards.forEach((card,i)=>{
  card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')activate(i)});
  card.addEventListener('focus',()=>activate(i));
  card.addEventListener('click',()=>activate(i));
 });


 activate(0);
})();

/* One quiet entrance per content group; never change native scrolling. */
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!('IntersectionObserver' in window)||reduced.matches)return;
 const running=new Set();
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  observer.unobserve(entry.target);
  if(reduced.matches||!entry.target.animate)return;
  const animation=entry.target.animate([
   {opacity:.35,transform:'translateY(14px)'},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'});
  running.add(animation);
  animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
 }),{threshold:.08});
 document.querySelectorAll('.philosophy-heading,.philosophy-cards,.stage-heading,.section-heading,.property-grid,.metrics,.customers-copy,.customers-gallery,.contact-grid,.transition-heading').forEach(element=>observer.observe(element));
 reduced.addEventListener('change',()=>{
  if(!reduced.matches)return;
  observer.disconnect();
  running.forEach(animation=>animation.cancel());
  running.clear();
 });
})();
/* Replace the original concept photography with the supplied Hidd Al Saadiyat shoot. */
(() => {
 const base='assets/hidd-al-sadiyaat/';
 const replacements={
  'assets/hero-coast.png':'DSC00222.jpg',
  'assets/service-buy-refined.png':'DSC00404.jpg',
  'assets/villa-service.png':'../polished-unique/DSC09375.png',
  'assets/abu-dhabi/qaryat-banner-2.jpg':'DSC09804.jpg',
  'assets/service-manage-refined.png':'DSC00241.jpg',
  'assets/abu-dhabi/qaryat-banner-1.jpg':'DSC09978.jpg',
  'assets/residential-listing.png':'DSC00793.jpg',
  'assets/commercial-listing.png':'DSC09539.jpg',
  'assets/abu-dhabi/qaryat-banner-4.jpg':'DSC09894.jpg',
  'assets/abu-dhabi/qaryat-banner-5.jpg':'DSC00358.jpg',
  'assets/management-asset.png':'DSC00033.jpg',
  'assets/abu-dhabi/hili.jpg':'DSC00863.jpg',
  'assets/abu-dhabi/al-mushrif.png':'DSC09504.jpg',
  'assets/abu-dhabi/qaryat-overview.png':'DSC09392.jpg',
  'assets/abu-dhabi/ghantoot.jpeg':'DSC00250.jpg',
  'assets/portfolio-city.png':'DSC00487.jpg',
  'assets/portfolio-residence.png':'DSC09457.jpg',
  'assets/abu-dhabi/qaryat-banner-3.jpg':'DSC00428.jpg',
  'assets/portfolio-community.png':'DSC09359.jpg',
  'assets/portfolio-commercial.png':'DSC09500.jpg',
  'assets/management-finance.png':'DSC00882.jpg',
  'assets/transition-review.png':'DSC09906.jpg',
  'assets/transition-inspect.png':'DSC09375.jpg',
  'assets/transition-takeover.png':'DSC00802.jpg',
  'assets/transition-manage.png':'DSC00680.jpg',
  'assets/abu-dhabi/qaryat-lounge.jpg':'DSC00448.jpg'
 };
 document.querySelectorAll('img[src]').forEach(image=>{
  const filename=replacements[image.getAttribute('src')];
  if(!filename)return;
  image.src=base+filename;
  image.alt='Hidd Al Saadiyat architecture and waterfront community, Abu Dhabi';
 });
})();

/* Property Discovery list/map treatment, matched to the ADURE concept reference. */
(() => {
 const discovery=document.querySelector('.discovery');
 const searchGrid=discovery?.querySelector('.search-grid');
 const searchButton=searchGrid?.querySelector(':scope > .button');
 const propertyGrid=discovery?.querySelector('#property-results');
 const emptyState=discovery?.querySelector('#empty-state');
 const sectionActions=discovery?.querySelector('.section-actions');
 const resultsBar=discovery?.querySelector('.results-bar');
 if(!discovery||!searchGrid||!searchButton||!propertyGrid)return;

 const fieldUpdates=[
  ['#location','LOCATION','All Locations'],
  ['#property-type','PROPERTY TYPE','All Types'],
  ['#bedrooms','BEDROOMS','Any Bedrooms'],
  ['#price','PRICE RANGE','Any Price']
 ];
 fieldUpdates.forEach(([selector,labelText,optionText])=>{
  const select=discovery.querySelector(selector);
  if(!select)return;
  const label=select.closest('label');
  if(label&&label.firstChild)label.firstChild.textContent=labelText;
  if(select.options[0])select.options[0].textContent=optionText;
 });
 discovery.querySelector('#location').innerHTML='<option value="">All Locations</option><option>Qaryat Al Hidd, Saadiyat Island</option><option>Al Raha</option><option>Al Reem Island</option><option>Jubail Island</option><option>Al Ain</option>';
 discovery.querySelector('#property-type').innerHTML='<option value="">All Types</option><option>Apartment</option><option>Villa</option><option>Retail</option><option>Office</option>';
 discovery.querySelector('#bedrooms').innerHTML='<option value="">Any Bedrooms</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>';
 searchButton.textContent='Search Properties';

 const toolbar=document.createElement('div');
 toolbar.className='discovery-map-toolbar';
 toolbar.innerHTML='<p><strong>Available now</strong> at Qaryat Al Hidd, Saadiyat Island</p>';
 const switcher=document.createElement('div');
 switcher.className='property-view-switcher';
 switcher.setAttribute('role','group');
 switcher.setAttribute('aria-label','Show properties as a list or on a map');
 switcher.innerHTML='<button type="button" data-property-view="list" aria-pressed="true"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 6h11M5 10h11M5 14h11M2.5 6h.1M2.5 10h.1M2.5 14h.1"/></svg>List</button><button type="button" data-property-view="map" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17s5-4.8 5-9a5 5 0 1 0-10 0c0 4.2 5 9 5 9Z"/><circle cx="10" cy="8" r="1.7"/></svg>Map</button>';
 toolbar.append(switcher);

 const mapView=document.createElement('section');
 mapView.className='discovery-map-view';
 mapView.setAttribute('aria-label','ADURE communities map');
 mapView.innerHTML=`
  <div class="discovery-map-canvas">
   <iframe class="community-google-map" title="Google map of Qaryat Al Hidd, Saadiyat Island" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>  <aside class="discovery-map-sidebar">
   <p class="map-sidebar-label">ADURE COMMUNITIES</p>
   <button type="button" class="community-row is-active" data-community="qaryat"><img src="assets/polished-unique/DSC00802.png" alt="Qaryat Al Hidd"><span><strong>Qaryat Al Hidd</strong><small>Saadiyat Island · Apartments and retail</small></span></button>
   <button type="button" class="community-row" data-community="jubail"><img src="assets/polished-unique/DSC00680.png" alt="Jubail Island"><span><strong>Jubail Island</strong><small>Villas</small></span></button>
   <button type="button" class="community-row" data-community="julphar"><img src="assets/polished-unique/DSC00882.png" alt="Julphar Residence"><span><strong>Julphar Residence</strong><small>Al Reem Island · Apartments</small></span></button>
   <button type="button" class="community-row" data-community="raha"><img src="assets/polished-unique/DSC09570.png" alt="Al Raha"><span><strong>Al Raha</strong><small>Apartments and retail</small></span></button>
   <p class="map-community-note">Pins mark each community. Individual listings appear on the map once property coordinates are added in the CMS.</p>
  </aside>`;
 propertyGrid.before(toolbar,mapView);

 // Use the provider-hosted geographic map rather than requesting public OSM tiles.
 const mapFrame=mapView.querySelector('.community-google-map');
 const communities={
  qaryat:'Qaryat Al Hidd, Saadiyat Island, Abu Dhabi',
  jubail:'Jubail Island, Abu Dhabi',
  julphar:'Julphar Residence, Al Reem Island, Abu Dhabi',
  raha:'Al Raha Beach, Abu Dhabi'
 };
 let activeCommunity='qaryat';
 function activateCommunity(community){
  if(!communities[community])return;
  activeCommunity=community;
  mapView.querySelectorAll('[data-community]').forEach(control=>{
   const selected=control.dataset.community===community;
   control.classList.toggle('is-active',selected);
   control.setAttribute('aria-pressed',String(selected));
  });
  mapFrame.title='Google map of '+communities[community];
  mapFrame.src='https://maps.google.com/maps?q='+encodeURIComponent(communities[community])+'&z=14&output=embed';
 }
 mapView.querySelector('.map-community-note').textContent='Select a community to explore its location on the map';
 mapView.addEventListener('click',event=>{
  const control=event.target.closest('[data-community]');
  if(control)activateCommunity(control.dataset.community);
 }); function setView(view){
  const mapActive=view==='map';
  switcher.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.propertyView===view)));
  mapView.hidden=!mapActive;
  if(mapActive&&!mapFrame.hasAttribute('src'))activateCommunity(activeCommunity);
  propertyGrid.hidden=mapActive;
  if(resultsBar)resultsBar.hidden=mapActive;
  if(sectionActions)sectionActions.hidden=mapActive;
  if(emptyState){
   const hasVisibleProperty=[...propertyGrid.children].some(card=>!card.hidden);
   emptyState.hidden=mapActive||hasVisibleProperty;
  }
 }
 switcher.addEventListener('click',event=>{
  const button=event.target.closest('[data-property-view]');
  if(button)setView(button.dataset.propertyView);
 });
 setView('list');
})();

/* Count up proof statistics whenever the row enters the viewport. */
(() => {
 const metrics=document.querySelector('#proof .metrics');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!metrics || !('IntersectionObserver' in window))return;
 const counters=[];
 metrics.querySelectorAll('dt').forEach((term,index)=>{
  // Keep the final value available to assistive technology throughout the animation.
  term.setAttribute('aria-label',term.textContent.trim());
  const walker=document.createTreeWalker(term,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
   if(!/\d/.test(node.nodeValue))continue;
   const original=node.nodeValue;
   counters.push({node,original,delay:index*100,render:progress=>original.replace(/\d[\d,]*/g,value=>{
    const total=Number(value.replace(/,/g,''));
    const current=Math.round(total*progress);
    return value.includes(',')?current.toLocaleString('en-US'):String(current);
   })});
  }
 });
 let frame=0,visible=false;
 const finish=()=>{cancelAnimationFrame(frame);frame=0;counters.forEach(counter=>counter.node.nodeValue=counter.original)};
 const animate=()=>{
  finish();
  if(reduced.matches)return;
  counters.forEach(counter=>counter.node.nodeValue=counter.render(0));
  const start=performance.now(),duration=2000;
  const tick=now=>{
   let complete=true;
   counters.forEach(counter=>{
    const progress=Math.max(0,Math.min(1,(now-start-counter.delay)/duration));
    const eased=1-Math.pow(1-progress,3);
    counter.node.nodeValue=counter.render(eased);
    if(progress<1)complete=false;
   });
   if(complete)finish();else frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
 };
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.intersectionRatio>=.35 && !visible){visible=true;animate()}
   else if(!entry.isIntersecting){visible=false;finish()}
  });
 },{threshold:[0,.35]});
 observer.observe(metrics);
 reduced.addEventListener('change',()=>{if(reduced.matches)finish()});
})();
/* Facilities and amenities dropdown. */
(() => {
 const trigger=document.querySelector('.more-filters');
 const form=document.querySelector('#search-form');
 if(!trigger||!form)return;
 const panel=document.createElement('div');
 panel.id='amenities-dropdown';panel.className='amenities-dropdown';panel.hidden=true;
 panel.innerHTML='<fieldset><legend>Facilities &amp; Amenities</legend><div class="amenities-options">'+[['parking','Parking'],['balcony','Balcony'],['pool','Swimming Pool'],['gym','Gym'],['security','24/7 Security'],['pets','Pet Friendly']].map(([value,label])=>`<label><input type="checkbox" name="amenities" value="${value}"><span>${label}</span></label>`).join('')+'</div></fieldset><div class="amenities-actions"><button type="button" class="amenities-clear">Clear</button><button type="button" class="button blue amenities-apply">Apply Filters</button></div>';
 form.append(panel);
 trigger.setAttribute('aria-controls',panel.id);
 const close=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false')};
 const update=()=>{const count=panel.querySelectorAll('input:checked').length;trigger.querySelector('strong').textContent=count?`More Filters (${count})`:'+ More Filters'};
 trigger.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open))});
 panel.addEventListener('change',update);
 panel.querySelector('.amenities-clear').addEventListener('click',()=>{panel.querySelectorAll('input').forEach(input=>input.checked=false);update();form.requestSubmit()});
 panel.querySelector('.amenities-apply').addEventListener('click',()=>{close();form.requestSubmit();trigger.focus({preventScroll:true})});
 form.addEventListener('submit',close);
 form.addEventListener('reset',()=>{close();setTimeout(update,0)});
 document.addEventListener('click',event=>{if(!panel.contains(event.target)&&!trigger.contains(event.target))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){close();trigger.focus()}});
})();