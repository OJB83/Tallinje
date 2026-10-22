'use strict';
const $ = id => document.getElementById(id);
let avatar='👦', position=0, task, round=0, locked=false;
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
function newTask(){locked=false;task=makeTask(position,round++);$('question').textContent=`${task.text} = ?`;$('help').textContent=task.help;$('answer').value='';$('answer-form').hidden=false;$('next').hidden=true;$('answer').focus();}
function start(){position=0;round=0;$('setup').hidden=true;$('game').hidden=false;$('again').hidden=true;$('character').textContent=avatar;$('feedback').textContent='Eventyret begynner! Løs oppgaven for å hoppe.';draw();newTask();}
document.querySelectorAll('[data-avatar]').forEach(button=>button.addEventListener('click',()=>{avatar=button.dataset.avatar;document.querySelectorAll('[data-avatar]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
$('start').addEventListener('click',start);
$('restart').addEventListener('click',()=>{$('game').hidden=true;$('setup').hidden=false;$('start').focus();});
$('again').addEventListener('click',start);
$('next').addEventListener('click',()=>{$('feedback').textContent='Klar for et nytt hopp?';newTask();});
$('answer-form').addEventListener('submit',event=>{event.preventDefault();if(locked||$('answer').value==='')return;locked=true;const correct=Number($('answer').value)===task.target;position=correct?task.target:Math.max(0,position-10);draw();$('character').classList.remove('hopping');void $('character').offsetWidth;$('character').classList.add('hopping');$('answer-form').hidden=true;
if(position===100){$('feedback').textContent='🧝 🙌 Bra! Du nådde 100! For et flott regneeventyr! 🎉';$('again').hidden=false;$('help').textContent='Du er i mål! Spill igjen for nye oppgaver.';$('again').focus();}
else{$('feedback').textContent=correct?'🧝 🙌 Bra! Alven gir deg en high five!':`🧌 Prøv igjen! ${task.text} = ${task.target}. Du går 10 felt tilbake, men aldri forbi 0.`;$('help').textContent=correct?`Du landet på ${position}. Fortsett mot 100!`:task.help;$('next').hidden=false;$('next').focus();}});
