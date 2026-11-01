const fs=require('fs'),vm=require('vm'),assert=require('assert');const ctx=vm.createContext({});for(const f of ['clinical.js','access.js','interactions.js','rx.js','teach.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const get=s=>JSON.parse(vm.runInContext('JSON.stringify('+s+')',ctx));
const DEMOS=get('DEMOS'),EXAM=get('EXAM'),MIND=get('MIND'),BASE=get('DEMO_BASE'),N=get('SOURCES').length;
const run=x=>{ctx.__x=JSON.stringify({...BASE,...x});return JSON.parse(vm.runInContext('JSON.stringify(prescribe(JSON.parse(__x)))',ctx));};
const headline=r=>r.primary?r.primary.drug+' '+r.primary.dose:r.title;
const src=k=>vm.runInContext('TSRC('+JSON.stringify(k)+')',ctx);
let n=0;const ok=(c,m)=>{assert(c,m);n++;};

ok(DEMOS.length===10,'10 demo cases');
ok(new Set(DEMOS.map(d=>d.x.ind)).size===7,'demo cases cover 7 purposes');
for(const d of DEMOS){const r=run(d.x),e=d.e;
 ok(r.level===e.level,`${d.t}: level ${r.level}`);
 if(e.drug)ok(r.primary&&r.primary.drug===e.drug,`${d.t}: drug ${headline(r)}`);
 if(e.dose)ok(r.primary&&r.primary.dose.includes(e.dose),`${d.t}: dose ${headline(r)}`);
 if(e.title)ok(r.title.includes(e.title),`${d.t}: title ${r.title}`);
 if(e.crcl!==undefined)ok(r.crcl===e.crcl,`${d.t}: crcl ${r.crcl}`);
 if(e.score!==undefined)ok(r.score===e.score,`${d.t}: score ${r.score}`);
 ok(d.steps.length>=3&&d.pit.length>=2&&d.c.length>=2&&d.story.length>30,`${d.t}: complete`);
 for(const c of d.c)ok(headline(run({...d.x,...c.x})).includes(c.e),`${d.t} / ${c.l}: ${headline(run({...d.x,...c.x}))}`);
 for(const k of d.s){const i=src(k);ok(Number.isInteger(i)&&i>=0&&i<N,`${d.t}: source ${k}`);}
}

ok(EXAM.length===20,'20 questions');
ok(EXAM.filter(q=>q.lv==='基礎').length===10&&EXAM.filter(q=>q.lv==='高階').length===10,'10 basic + 10 advanced');
for(let a=0;a<4;a++)ok(EXAM.filter(q=>q.a===a).length===5,'answers spread A–D 5 each');
EXAM.forEach((q,i)=>{const t=`Q${i+1}`;ok(q.o.length===4&&new Set(q.o).size===4,t+' 4 distinct options');ok(q.why.length>20,t+' explanation');
 ok(q.wrong.length===4&&q.wrong.every((w,j)=>j===q.a?w==='':w.length>0),t+' wrong-option notes');
 ok(q.s.length>0&&q.s.every(k=>Number.isInteger(src(k))&&src(k)<N),t+' sources');});

// Exam answers that the engine can state must agree with it.
const E=(i,x,check)=>ok(check(run(x)),`Q${i}: ${EXAM[i-1].o[EXAM[i-1].a]} vs ${headline(run(x))}`);
const correct=i=>EXAM[i-1].o[EXAM[i-1].a];
E(1,{ind:'af',age:'70',sex:'f',weight:'60',scr:'0.8',vaHTN:'yes',vaDM:'yes'},r=>r.score===3&&correct(1)==='3 分');
E(2,{ind:'af',age:'82',sex:'m',weight:'70',scr:'0.8',vaHTN:'yes'},r=>r.crcl===70&&r.primary.dose===correct(2));
E(3,{ind:'af',age:'60',sex:'m',weight:'70',scr:'1',valve:'mechanical',valvePos:'mitral'},r=>r.primary.dose.includes('INR 3.0')&&correct(3).startsWith('3.0'));
E(4,{ind:'vte',age:'55',sex:'m',weight:'80',scr:'1.2',provoked:'transient'},r=>r.primary.drug==='Apixaban'&&correct(4).includes(r.primary.dose));
E(5,{ind:'vte',age:'60',sex:'m',weight:'70',scr:'1',provoked:'transient'},r=>r.notes.some(p=>p.includes('3 個月後停藥'))&&correct(5).startsWith('3 個月'));
E(6,{ind:'vte',age:'30',sex:'f',weight:'65',scr:'0.6',preg:'yes',provoked:'transient'},r=>r.primary.drug==='Enoxaparin'&&correct(6).includes(r.primary.dose.split(' SC')[0]));
E(7,{ind:'af',age:'78',sex:'m',weight:'60',scr:'2.2',vaHTN:'yes'},r=>r.crcl===23&&r.avoid.some(a=>a.startsWith('Dabigatran'))&&correct(7)==='Dabigatran');
E(8,{ind:'af',age:'70',sex:'m',weight:'70',scr:'1',vaHTN:'yes',vaDM:'yes',meds:['inducer']},r=>r.primary.drug==='Warfarin'&&correct(8).startsWith('Warfarin'));
E(9,{ind:'acs',age:'60',sex:'m',weight:'70',scr:'1',acsPci:'yes',meds:['omep']},r=>r.notes.some(p=>p.includes('pantoprazole'))&&correct(9).includes('pantoprazole'));
E(10,{ind:'stroke',age:'60',sex:'f',weight:'60',scr:'0.8',strokeAcute:'yes'},r=>r.primary.drug.includes('×21 天')&&correct(10).includes('×21 天'));
E(12,{ind:'af',age:'70',sex:'m',weight:'60',scr:'1.5',vaHTN:'yes',vaDM:'yes',combo:'yes'},r=>r.notes[0].includes('CrCl 30–49 為 10 mg QD')&&correct(12).startsWith('10 mg QD'));
E(14,{ind:'af',age:'60',sex:'m',weight:'70',scr:'1',valve:'mechanical',valvePos:'aortic'},r=>r.primary.drug==='Warfarin');
E(15,{ind:'af',age:'50',sex:'m',weight:'70',scr:'1',aps:'yes',vaHTN:'yes'},r=>r.primary.drug==='Warfarin'&&correct(15).includes('warfarin'));
E(16,{ind:'af',age:'70',sex:'m',weight:'70',scr:'1',hit:'acute'},r=>r.level==='stop'&&r.notes.some(p=>p.includes('不開始 warfarin')));
E(18,{ind:'af',age:'70',sex:'m',weight:'70',kidney:'hd',vaHTN:'yes',vaDM:'yes'},r=>!r.primary&&r.alts.find(a=>a.drug==='Apixaban').caution);
E(19,{ind:'cadpad',age:'68',sex:'m',weight:'75',scr:'1',cpType:'cad',cpStroke:'none',cpMulti:'yes',cpDapt:'yes'},r=>r.primary.drug==='Aspirin 單一療法'&&correct(19).startsWith('目前不加'));
E(20,{ind:'vte',age:'62',sex:'m',weight:'68',scr:'0.9',provoked:'persistent',cancer:'yes'},r=>r.level==='review'&&correct(20).includes('Apixaban'));

// Mind-map doses must match what the engine prescribes.
const mapText=JSON.stringify(MIND).replace(/<\/?b>/g,'');const inMap=(s,t)=>ok(mapText.includes(s),`map lacks ${t||s}`);
const mp=(x,part)=>{const r=run(x);inMap(part||r.primary.dose,headline(r));};
ok(MIND.left.length+MIND.right.length===12,'12 branches');
for(const s of ['Apixaban 5 mg BID','2.5 mg BID','Edoxaban 60 mg QD','30 mg QD','Dabigatran 150 mg BID','110 mg BID','Rivaroxaban 15–20 mg QD','10–15 mg QD'])inMap(s);
const af={ind:'af',age:'70',sex:'m',weight:'70',scr:'1',vaHTN:'yes',vaDM:'yes'},afAlt=d=>run(af).alts.find(a=>a.drug===d).dose;
ok(mapText.includes('Edoxaban '+afAlt('Edoxaban')),'map edoxaban = engine');ok(mapText.includes('Dabigatran '+afAlt('Dabigatran')),'map dabigatran = engine');ok(afAlt('Rivaroxaban').startsWith('15–20 mg QD'),'map rivaroxaban = engine');
mp({ind:'vte',age:'60',sex:'m',weight:'70',scr:'1',provoked:'transient'});
ok(mapText.includes(run({ind:'vte',age:'60',sex:'m',weight:'70',scr:'1',provoked:'transient'}).alts.find(a=>a.drug==='Rivaroxaban').dose.split('（')[0]),'map VTE rivaroxaban');
mp({ind:'prevent',age:'70',sex:'f',weight:'62',scr:'0.8',surgery:'surgical'},'Enoxaparin 40 mg QD');
ok(run({ind:'prevent',age:'70',sex:'f',weight:'62',scr:'0.8',surgery:'surgical'}).primary.dose==='40 mg SC QD','prevention dose');
ok(run({ind:'prevent',age:'70',sex:'f',weight:'62',kidney:'hd',surgery:'surgical'}).primary.dose==='5,000 U SC q8–12h'&&mapText.includes('UFH 5,000 U SC q8–12h'),'map UFH prophylaxis');
ok(run({ind:'cadpad',age:'68',sex:'m',weight:'72',scr:'1.1',cpType:'pad',cpStroke:'none',cpPadRevasc:'yes'}).primary.dose==='Rivaroxaban 2.5 mg BID ＋ aspirin 100 mg QD'&&mapText.includes('Rivaroxaban 2.5 mg BID ＋ aspirin 100 mg QD'),'map CAD/PAD');
ok(run({ind:'acs',age:'60',sex:'m',weight:'70',scr:'1',acsPci:'yes'}).alts.some(a=>a.dose.startsWith('起始 20 mg → 3.75 mg QD'))&&mapText.includes('Prasugrel 20 mg → 3.75 mg QD'),'map prasugrel');
console.log(n+' teaching tests passed.');
