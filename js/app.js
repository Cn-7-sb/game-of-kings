/* =========================================================
   GAMES OF KINGS — app.js
   ========================================================= */
'use strict';

/* ---------- AUDIO 8-BIT (WebAudio, sem arquivos) ---------- */
let AC = null;
function audio(){ if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function tone(freq, dur, type='square', vol=0.08, when=0){
  const ac = audio(); if(!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ac.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + when + dur);
  o.connect(g); g.connect(ac.destination);
  o.start(ac.currentTime + when); o.stop(ac.currentTime + when + dur + 0.02);
}
const sfx = {
  coin(){ tone(988,.09); tone(1319,.22,'square',.08,.08); },
  jump(){ tone(220,.12,'square',.07); tone(440,.14,'square',.07,.06); },
  add(){ tone(523,.07); tone(659,.07,'square',.08,.07); tone(784,.12,'square',.08,.14); },
  remove(){ tone(392,.09); tone(262,.12,'square',.08,.08); },
  kick(){ tone(140,.08,'sawtooth',.12); tone(90,.12,'sawtooth',.1,.05); },
  win(){ [523,659,784,1047].forEach((f,i)=>tone(f,.12,'square',.08,i*.1)); },
};

/* ---------- DADOS DO CARDAPIO ---------- */
const MENU = [
 {cat:'Burgers', items:[
  {n:'Baby-Up', d:'Pão brioche, hambúrguer angus 150g, maionese artesanal.', p:24, m:10},
  {n:'Power-Up', d:'Pão brioche, angus 150g, maionese artesanal, cheddar, pickles.', p:29, m:15},
  {n:'The 4-Cheese Quest', d:'Pão brioche, angus 150g, 4 queijos, catupiry, cebola caramelizada.', p:34, m:15},
  {n:'Star Chesse', d:'Pão brioche, angus 150g, cheddar, cebola caramelizada.', p:32, m:15},
  {n:'Bacon Kong', d:'Pão brioche, angus 150g, maionese artesanal, cheddar, bacon.', p:34, m:15},
  {n:'Super-Bacon Kong', d:'Pão brioche, angus 150g, maionese x2, cheddar x2, bacon x2.', p:42, m:15},
  {n:'Fatality Burger', d:'Angus 150g, maionese, mostarda, ketchup, cebola, pickles, tomate, alface, queijo prato, bacon.', p:39, m:15},
  {n:'Super-Star Chesse', d:'Pão brioche, angus 150g, cheddar x2, cebola caramelizada x2.', p:42, m:15},
 ]},
 {cat:'Frango', items:[
  {n:'Chicken Karts', d:'Pão brioche, peito de frango empanado, maionese artesanal, alface, tomate.', p:29, m:15},
  {n:'Chicken Of War', d:'Pão brioche, frango empanado, cheddar x2, bacon x2.', p:35, m:15},
  {n:'Donkey Crispy', d:'Pão brioche, frango empanado, cheddar x2, bacon x2, cebola crispy.', p:39, m:15},
 ]},
 {cat:'Pizzas 25cm', items:[
  {n:'Muzzarela', d:'Muzzarella, molho de tomate, orégano.', p:45, m:20},
  {n:'Caprese', d:'Muzzarella, manjericão, molho de tomate, orégano.', p:46, m:20},
  {n:'Quatro Queijos', d:'Muzzarella, molho de tomate, orégano, 4 queijos catupiry.', p:48, m:20},
  {n:'Napolitana', d:'Muzzarella, alho, molho de tomate, tomate fresco, orégano.', p:48, m:20},
  {n:'Calabresa', d:'Muzzarella, linguiça calabresa fina desfumada, orégano.', p:48, m:20},
  {n:'Bacon', d:'Muzzarella, orégano, bacon, molho de tomate.', p:50, m:20},
 ]},
 {cat:'Acompanhamentos', items:[
  {n:'Batata Frita 180g', d:'Clássica crocante, com maionese artesanal.', p:15, m:8},
  {n:'Batata Frita c/ Molho 180g', d:'Batata crocante + molho da casa.', p:17, m:10},
  {n:'Tirinhas de Frango (10un)', d:'250g de nuggets de frango empanados.', p:18, m:10},
  {n:'Tirinhas de Frango 250g', d:'Porção grande de frango empanado.', p:20, m:10},
  {n:'Batatas Fritas 500g', d:'3 molhos: maionese artesanal, ketchup picante e barbecue.', p:40, m:20},
  {n:'Batatas Bacon e Cheddar', d:'500g cobertas de cheddar e bacon + 3 molhos.', p:50, m:25},
 ]},
 {cat:'Drinks & Bar', items:[
  {n:'Caipirinha', d:'Cachaça.', p:25, m:10},
  {n:'Caipi-Gengar', d:'A poção roxa da casa.', p:27, m:10},
  {n:'Caipirinha Gold', d:'Cachaça gold version.', p:29, m:10},
  {n:'Caipi-Kachu', d:'Maracujá, cachaça ou vodka.', p:25, m:10},
  {n:'Caipiroska Skyy/Smirnoff', d:'Vodka + fruta da estação.', p:27, m:10},
  {n:'Caipiroska Absolut', d:'Vodka Absolut premium.', p:30, m:10},
  {n:'Fernet-Cola', d:'Fernet branca + cola.', p:25, m:10},
  {n:'Cynar Gok!', d:'Cynar, limão e guaraná.', p:25, m:10},
  {n:'Whis-Cola', d:'Red Label + cola.', p:25, m:10},
  {n:'Cuba Libre', d:'Rum Bacardi + cola + limão.', p:27, m:10},
  {n:'Margarita', d:'Tequila + licor de laranja + limão.', p:29, m:10},
  {n:'Tequila Sunrise', d:'Tequila + limão + grenadine.', p:29, m:10},
  {n:'Soda Italiana', d:'Frutos vermelhos, maçã verde ou maracujá.', p:20, m:10},
  {n:'Soda Italiana + Dose', d:'Com vodka Skyy/Smirnoff ou gin Bombay.', p:25, m:10},
  {n:'Gin-Tonic', d:'Bombay Sapphire + tônica + limão.', p:30, m:10},
  {n:'Campari-Tonic', d:'Campari + tônica + limão.', p:30, m:10},
  {n:'Mojito', d:'Rum Bacardi + limão + hortelã.', p:29, m:10},
  {n:'Campari Garibaldi', d:'Campari + suco de laranja.', p:30, m:10},
 ]},
 {cat:'Doses', items:[
  {n:'Absolut', d:'Dose premium.', p:20, m:0},
  {n:'Campari', d:'Dose.', p:16, m:0},
  {n:'Smirnoff', d:'Dose.', p:14, m:0},
  {n:'J. Daniels Honey', d:'Dose + Red Bull ou Monster R$10.', p:25, m:0},
  {n:'J. Daniels Black', d:'Dose + Red Bull ou Monster R$10.', p:25, m:0},
  {n:'J. Walker Red', d:'Dose.', p:20, m:0},
 ]},
 {cat:'Cervejas & Chopp', items:[
  {n:'Corona Long Neck', d:'Long neck gelada.', p:15, m:10},
  {n:'Sol Long Neck', d:'Long neck gelada.', p:13, m:10},
  {n:'Budweiser Long Neck', d:'Long neck gelada.', p:14, m:10},
  {n:'Budweiser Balde x4', d:'Balde com 4 long necks.', p:45, m:30},
  {n:'Chopp Heineken 320ml', d:'Chopp gelado.', p:17, m:10},
  {n:'Chopp IPA 320ml Artesanal', d:'Chopp artesanal da casa.', p:17, m:10},
 ]},
 {cat:'Bebidas', items:[
  {n:'Refrigerante Lata', d:'Coca, Sprite, Fanta ou Guaraná.', p:8, m:5},
  {n:'Água Mineral 500ml', d:'Com ou sem gás.', p:7, m:5},
  {n:'Red Bull 250ml', d:'Energético.', p:15, m:5},
  {n:'Suco Integral', d:'Laranja ou uva.', p:9, m:5},
  {n:'Monster Energy', d:'Todos os sabores.', p:14, m:5},
 ]},
 {cat:'Adicionais', items:[
  {n:'Extra Cheddar', d:'Queijo prato ou muzzarella.', p:6, m:3},
  {n:'Extra Carne Angus 150g', d:'Mais um smash de angus.', p:10, m:0},
  {n:'Extra Bacon', d:'Porção de bacon crocante.', p:7, m:0},
  {n:'Molho Artesanal', d:'Maionese artesanal, ketchup picante ou barbecue.', p:4, m:3},
  {n:'Ovo', d:'Ovo adicional.', p:5, m:0},
  {n:'Extra Linguiça', d:'Linguiça fatiada.', p:5, m:0},
  {n:'Extra Presunto', d:'Presunto.', p:5, m:0},
  {n:'Jalapeños Mexicanos', d:'Toque picante.', p:4, m:0},
  {n:'Cebola Caramelizada', d:'Roxa ou crispy.', p:7, m:3},
  {n:'Extra Salada', d:'Tomate + alface.', p:6, m:3},
 ]},
];

const COMBOS = {
  hadouken:{n:'Hadouken Combo', p:58, m:15},
  shoryuken:{n:'Shoryuken Combo', p:66, m:15},
  fatality:{n:'Fatality Combo', p:82, m:25},
  ultra:{n:'Ultra Combo da Casa', p:120, m:60},
};

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const BRL = v => 'R$ ' + v.toFixed(2).replace('.', ',');
let toastT = null;
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

/* ---------- PRELOADER ---------- */
(function(){
  const fill=$('#preFill'), label=$('#preLabel'), start=$('#preStart'), pre=$('#preloader');
  const steps=['CARREGANDO SPRITES...','GRELHANDO ANGUS...','CALIBRANDO FLIPERAMA...','LIBERANDO OS JOGOS...'];
  let p=0;
  const iv=setInterval(()=>{
    p=Math.min(100,p+Math.random()*16+6);
    fill.style.width=p+'%';
    label.textContent=steps[Math.min(steps.length-1,Math.floor(p/28))];
    if(p>=100){ clearInterval(iv); label.textContent='PRONTO!'; start.hidden=false; sfx.coin(); }
  },260);
  start.addEventListener('click',()=>{ pre.classList.add('done'); sfx.win(); });
  setTimeout(()=>{ if(!pre.classList.contains('done')){ pre.classList.add('done'); } }, 7000);
})();

/* ---------- CURSOR ---------- */
(function(){
  const dot=$('#cursorDot'), ring=$('#cursorRing');
  if(!window.matchMedia('(hover:hover)').matches) return;
  let rx=innerWidth/2, ry=innerHeight/2, tx=rx, ty=ry;
  addEventListener('mousemove',e=>{ tx=e.clientX; ty=e.clientY; dot.style.transform=`translate(${tx-4}px,${ty-4}px)`; });
  (function loop(){ rx+=(tx-rx)*.16; ry+=(ty-ry)*.16; ring.style.transform=`translate(${rx-18}px,${ry-18}px)`; requestAnimationFrame(loop); })();
  addEventListener('mouseover',e=>{ document.body.classList.toggle('cursor-hot', !!e.target.closest('a,button,input,select,label')); });
})();

/* ---------- NAV ---------- */
$('#navBurger').addEventListener('click',()=>{ $('.nav-links').classList.toggle('open'); sfx.jump(); });
$$('[data-nav]').forEach(a=>a.addEventListener('click',()=>$('.nav-links').classList.remove('open')));

/* ---------- HUD HERO ---------- */
(function(){
  const score=$('#hudScore'), coins=$('#hudCoins'), time=$('#hudTime');
  let s=0,c=0,t=300;
  setInterval(()=>{ t=t>0?t-1:300; time.textContent=String(t).padStart(3,'0'); },1000);
  window.hudAdd=(pts,nc)=>{ s+=pts; c+=nc; score.textContent=String(s).padStart(6,'0'); coins.textContent='x'+String(c).padStart(2,'0'); };
})();

/* ---------- CARDAPIO ---------- */
(function(){
  const tabs=$('#menuTabs'), grid=$('#menuGrid');
  MENU.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='tab'+(i===0?' active':''); b.textContent=c.cat.toUpperCase();
    b.addEventListener('click',()=>{ $$('.tab').forEach(t=>t.classList.remove('active')); b.classList.add('active'); render(i); sfx.jump(); });
    tabs.appendChild(b);
  });
  function render(idx){
    grid.innerHTML='';
    MENU[idx].items.forEach((it,i)=>{
      const card=document.createElement('article');
      card.className='item'; card.style.animationDelay=(i*0.04)+'s';
      card.innerHTML=`
        <div class="item-top"><h4>${it.n}</h4><span class="item-price">${BRL(it.p)}</span></div>
        <div class="item-desc">${it.d}</div>
        <div class="item-foot">
          ${it.m?`<span class="item-mins">+${it.m} MIN DE JOGOS</span>`:'<span class="item-mins">SÓ SABOR</span>'}
          <button class="btn-add-sm">ADD +</button>
        </div>`;
      card.querySelector('.btn-add-sm').addEventListener('click',()=>{ Cart.add({n:it.n,p:it.p,m:it.m}); });
      grid.appendChild(card);
    });
  }
  render(0);
})();

/* ---------- CARRINHO ---------- */
const Cart = (function(){
  let items = JSON.parse(localStorage.getItem('gok_cart')||'[]');
  const drawer=$('#cartDrawer'), overlay=$('#cartOverlay');
  function save(){ localStorage.setItem('gok_cart',JSON.stringify(items)); }
  function open(){ drawer.classList.add('open'); overlay.classList.add('open'); render(); }
  function close(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }
  function add(it){
    const f=items.find(x=>x.n===it.n);
    if(f) f.q++; else items.push({...it,q:1});
    save(); render(); badge();
    sfx.add(); toast('★ ITEM COLETADO: '+it.n.toUpperCase());
    if(it.m) hudAdd(100,0);
  }
  function badge(){
    const n=items.reduce((a,b)=>a+b.q,0);
    const el=$('#cartCount'); el.textContent=n;
    el.style.animation='none'; void el.offsetWidth; el.style.animation='pop .3s ease';
  }
  function render(){
    const box=$('#cartItems');
    box.innerHTML='';
    $('#cartEmpty').style.display=items.length?'none':'block';
    let sub=0, mins=0;
    items.forEach((it,i)=>{
      sub+=it.p*it.q; mins+=(it.m||0)*it.q;
      const row=document.createElement('div'); row.className='cart-slot';
      row.innerHTML=`
        <div class="slot-info"><b>${it.n}</b><span>${BRL(it.p)}${it.m?` · +${it.m}min`:''}</span></div>
        <div class="qty">
          <button data-a="-1">−</button><b>${it.q}</b><button data-a="1">+</button>
        </div>
        <button class="slot-del">✕</button>`;
      row.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{
        it.q+=+b.dataset.a; if(it.q<1) items.splice(i,1);
        save(); render(); badge(); sfx.jump();
      }));
      row.querySelector('.slot-del').addEventListener('click',()=>{ items.splice(i,1); save(); render(); badge(); sfx.remove(); });
      box.appendChild(row);
    });
    $('#cartSubtotal').textContent=BRL(sub);
    $('#cartMins').textContent='+'+mins+' min';
    return sub;
  }
  function checkout(){
    if(!items.length){ toast('INVENTÁRIO VAZIO!'); return; }
    const name=$('#fName').value.trim()||'Jogador';
    const mode=document.querySelector('input[name="mode"]:checked').value;
    const addr=$('#fAddr').value.trim();
    const pay=$('#fPay').value;
    const sub=items.reduce((a,b)=>a+b.p*b.q,0);
    const mins=items.reduce((a,b)=>a+(b.m||0)*b.q,0);
    let msg='🎮 *GAMES OF KINGS — NOVO PEDIDO*\n';
    msg+='----------------------------\n';
    items.forEach(it=>{ msg+=`▸ ${it.q}x ${it.n} — ${BRL(it.p*it.q)}\n`; });
    msg+='----------------------------\n';
    msg+=`*Total: ${BRL(sub)}*\n`;
    msg+=`*Minutos de jogos: +${mins} min*\n`;
    msg+=`👤 Nome: ${name}\n📦 Modo: ${mode}\n`;
    if(mode==='Entrega'||mode==='Mesa') msg+=`📍 Endereço/Mesa: ${addr||'-'}\n`;
    msg+=`💳 Pagamento: ${pay}\n`;
    window.open('https://wa.me/5547991380151?text='+encodeURIComponent(msg),'_blank');
    sfx.win(); toast('PEDIDO ENVIADO! PLAYER 1 VENCEU');
  }
  $('#navCart').addEventListener('click',()=>{ open(); sfx.jump(); });
  $('#cartClose').addEventListener('click',close);
  overlay.addEventListener('click',close);
  $('#cartSend').addEventListener('click',checkout);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  badge();
  return { add };
})();

/* combos */
$$('[data-add-combo]').forEach(b=>b.addEventListener('click',()=>{
  const c=COMBOS[b.dataset.addCombo];
  Cart.add({n:c.n,p:c.p,m:c.m});
}));

/* ---------- BUILDER (LEGO) ---------- */
(function(){
  const bases=[...MENU[0].items, ...MENU[1].items];
  const extras=MENU[8].items;
  const baseList=$('#baseList'), extrasList=$('#extrasList'), stack=$('#burgerStack'), totalEl=$('#builderTotal');
  let cur={base:null, ex:[]};
  bases.forEach((b,i)=>{
    const l=document.createElement('label'); l.className='base-opt';
    l.innerHTML=`<span><input type="radio" name="base" ${i===0?'checked':''}> ${b.n}</span><b>${BRL(b.p)}</b>`;
    l.querySelector('input').addEventListener('change',()=>{ cur.base=b; update(); sfx.jump(); });
    baseList.appendChild(l);
    if(i===0) cur.base=b;
  });
  const layerClass={ 'Extra Cheddar':'sl-cheese','Extra Bacon':'sl-bacon','Ovo':'sl-egg','Extra Salada':'sl-salad',
    'Cebola Caramelizada':'sl-onion','Jalapeños Mexicanos':'sl-jala','Molho Artesanal':'sl-sauce','Extra Carne Angus 150g':'sl-meat' };
  extras.forEach(x=>{
    const l=document.createElement('label'); l.className='extra-opt';
    l.innerHTML=`<span><input type="checkbox"> ${x.n}</span><b>+${BRL(x.p).replace('R$ ','')}</b>`;
    l.querySelector('input').addEventListener('change',e=>{
      if(e.target.checked){ cur.ex.push(x); l.classList.add('on'); }
      else{ cur.ex=cur.ex.filter(y=>y.n!==x.n); l.classList.remove('on'); }
      update(); sfx.add();
    });
    extrasList.appendChild(l);
  });
  function update(){
    stack.querySelectorAll('.stack-layer:not([data-layer])').forEach(n=>n.remove());
    let total=cur.base?cur.base.p:0;
    cur.ex.forEach(x=>{
      total+=x.p;
      const d=document.createElement('div');
      d.className='stack-layer '+(layerClass[x.n]||'sl-sauce');
      d.textContent=x.n.replace('Extra ','').replace('Angus 150g','Carne Angus');
      stack.appendChild(d);
    });
    totalEl.textContent=BRL(total);
  }
  update();
  $('#builderAdd').addEventListener('click',()=>{
    if(!cur.base){ toast('ESCOLHA UMA BASE!'); return; }
    Cart.add({n:'Burger Custom: '+cur.base.n,p:cur.base.p,m:cur.base.m});
    cur.ex.forEach(x=>Cart.add({n:'  + '+x.n,p:x.p,m:x.m}));
    toast('BURGER MONTADO E ADICIONADO!');
  });
})();

/* ---------- REVEAL & BARRAS ---------- */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      e.target.querySelectorAll('.bar-fill').forEach(b=>b.style.width=b.dataset.w+'%');
      io.unobserve(e.target);
    }
  }),{threshold:.2});
  $$('.reveal').forEach(el=>io.observe(el));
})();

/* parallax seções */
(function(){
  const layers=[['#charBg','#charizard'],['#switchBg','#switch']];
  addEventListener('scroll',()=>{
    layers.forEach(([sel,sec])=>{
      const el=$(sel), s=$(sec); if(!el||!s) return;
      const r=s.getBoundingClientRect();
      const p=(r.top+r.height/2-innerHeight/2)/innerHeight;
      el.style.transform=`translateY(${p*-46}px)`;
    });
  },{passive:true});
})();
