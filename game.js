'use strict';
const $ = id => document.getElementById(id);
let avatar='👦', skinTone='dark', position=0, task, round=0, locked=false;
const random = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
function makeTask(pos,index){
  const target=Math.min(100,pos+random(5,12));
  const operation=index%4;
  let a,b,text,help;
  if(operation===0){a=random(1,target);b=target-a;text=`${a} + ${b}`;help='Legg tallene sammen.';}
  if(operation===1){b=random(1,20);a=target+b;text=`${a} − ${b}`;help='Trekk det andre tallet fra det første.';}
  if(operation===2){const factors=Array.from({length:10},(_,i)=>i+1).filter(n=>target%n===0);b=factors[random(0,factors.length-1)];a=target/b;text=`${a} × ${b}`;help='Multipliser tallene. × betyr ganger.';}
  if(operation===3){b=random(2,5);a=target*b;text=`${a} ÷ ${b}`;help='Del det første tallet på det andre. ÷ betyr delt på.';}
  return {target,text,help};
}
function draw(){ $('position').textContent=`📍 Felt ${position} av 100`;$('character').style.left=`calc(30px + (100% - 60px) * ${position/100})`;$('fill').style.width=`${position}%`; }
function newTask(){showEncounter('ready');locked=false;task=makeTask(position,round++);$('question').textContent=`${task.text} = ?`;$('help').textContent=task.help;$('answer').value='';$('answer-form').hidden=false;$('next').hidden=true;$('answer').focus();}
function start(){position=0;round=0;$('setup').hidden=true;$('game').hidden=false;$('again').hidden=true;$('character').textContent=avatar+(skinTone==='dark'?'🏿':skinTone==='medium'?'🏽':'🏻');$('feedback').textContent='Eventyret begynner! Løs oppgaven for å hoppe.';draw();newTask();}
document.querySelectorAll('[data-avatar]').forEach(button=>button.addEventListener('click',()=>{avatar=button.dataset.avatar;document.querySelectorAll('[data-avatar]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
$('start').addEventListener('click',start);
$('restart').addEventListener('click',()=>{$('game').hidden=true;$('setup').hidden=false;$('start').focus();});
$('again').addEventListener('click',start);
$('next').addEventListener('click',()=>{$('feedback').textContent='Klar for et nytt hopp?';newTask();});
$('answer-form').addEventListener('submit',event=>{event.preventDefault();if(locked||$('answer').value==='')return;locked=true;const correct=Number($('answer').value)===task.target;position=correct?task.target:Math.max(0,position-10);draw();showEncounter(correct?'success':'retry');$('character').classList.remove('hopping');void $('character').offsetWidth;$('character').classList.add('hopping');$('answer-form').hidden=true;
if(position===100){$('feedback').textContent='🧝 🙌 Bra! Du nådde 100! For et flott regneeventyr! 🎉';$('again').hidden=false;$('help').textContent='Du er i mål! Spill igjen for nye oppgaver.';$('again').focus();}
else{$('feedback').textContent=correct?'🧝 🙌 Bra! Alven gir deg en high five!':`🧌 Prøv igjen! ${task.text} = ${task.target}. Du går 10 felt tilbake, men aldri forbi 0.`;$('help').textContent=correct?`Du landet på ${position}. Fortsett mot 100!`:task.help;$('next').hidden=false;$('next').focus();}});

function person(kind){
 const girl=avatar==='👧';
 const troll=kind==='troll', elf=kind==='elf';
 const skin=troll?'#93b66b':elf?'#f3c497':({dark:'#75452f',medium:'#bd8055',light:'#f3c497'}[skinTone]);
 const shirt=troll?'#9b744e':elf?'#44854b':girl?'#ab63a8':'#5288c4';
 const hair=elf?'#e8ba5b':skinTone==='light'?'#69432f':'#241b1a';
 return `<svg viewBox="0 0 180 250" role="img" aria-label="${troll?'Vennlig troll':elf?'Alven':girl?'Jente':'Gutt'}">
 <ellipse cx="90" cy="238" rx="55" ry="8" fill="#263d3520"/>
 <g class="legs" fill="${troll?'#735a45':'#3e526e'}"><rect x="58" y="170" width="26" height="57" rx="12"/><rect x="97" y="170" width="26" height="57" rx="12"/></g>
 <g fill="#493b35"><ellipse cx="67" cy="226" rx="22" ry="11"/><ellipse cx="113" cy="226" rx="22" ry="11"/></g>
 <path d="M58 114 Q90 101 122 114 L133 179 Q90 194 47 179Z" fill="${shirt}"/>
 <g class="arm left-arm"><path d="M57 124 Q35 144 29 164" fill="none" stroke="${shirt}" stroke-width="21" stroke-linecap="round"/><circle cx="28" cy="165" r="12" fill="${skin}"/></g>
 <g class="arm right-arm"><path d="M122 124 Q146 145 151 164" fill="none" stroke="${shirt}" stroke-width="21" stroke-linecap="round"/><circle cx="152" cy="165" r="13" fill="${skin}"/><path d="M145 162 l-5 -12 m10 9 l-1 -16 m7 18 l5 -14" stroke="${skin}" stroke-width="6" stroke-linecap="round"/></g>
 ${elf?'<path d="M51 63 L21 44 L48 88 M129 63 L159 44 L132 88" fill="'+skin+'"/>':''}
 ${troll?'<path d="M56 42 L42 15 L74 34 M110 34 L138 15 L124 49" fill="#f0dec0"/>':''}
 ${girl&&!elf&&!troll?'<ellipse cx="53" cy="87" rx="22" ry="48" fill="'+hair+'"/><ellipse cx="127" cy="87" rx="22" ry="48" fill="'+hair+'"/>':''}
 <ellipse cx="90" cy="73" rx="43" ry="46" fill="${skin}"/>
 ${!troll?'<path d="M48 66 Q40 14 90 21 Q139 16 133 64 Q114 43 101 43 Q80 66 48 66" fill="'+hair+'"/>':''}
 ${elf?'<path d="M44 39 L93 0 L133 40Z" fill="#346848"/><circle cx="93" cy="6" r="7" fill="#f4d275"/>':''}
 <g fill="#293b32"><circle cx="75" cy="73" r="4"/><circle cx="106" cy="73" r="4"/></g>
 <ellipse cx="90" cy="86" rx="${troll?12:5}" ry="7" fill="${troll?'#7c9c57':'#e7a17e'}"/>
 <path d="M74 96 Q90 110 107 96" fill="white" stroke="#674c37" stroke-width="3" stroke-linecap="round"/>
 <g fill="#e7a17e" opacity=".55"><ellipse cx="63" cy="88" rx="8" ry="4"/><ellipse cx="118" cy="88" rx="8" ry="4"/></g>
 </svg>`;
}
function showEncounter(state){
 const scene=$('encounter');scene.className='encounter';
 $('hero').innerHTML=person('hero');
 $('visitor').hidden=state==='ready';
 $('visitor').innerHTML=state==='retry'?person('troll'):person('elf');
 $('speech').textContent=state==='success'?(position===100?'Hurra! Du klarte det! High five!':'Bra! Gi meg en high five!'):state==='retry'?'Vi prøver igjen sammen! Du klarer det!':'Jeg er klar! La oss hoppe mot 100!';
 void scene.offsetWidth;scene.classList.add(state);
}

document.querySelectorAll('[data-skin]').forEach(button=>button.addEventListener('click',()=>{skinTone=button.dataset.skin;document.querySelectorAll('[data-skin]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
