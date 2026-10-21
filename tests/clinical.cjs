const fs=require('fs'),vm=require('vm'),assert=require('assert');const ctx=vm.createContext({});for(const f of ['clinical.js','access.js','interactions.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);const decide=x=>vm.runInContext('decide('+JSON.stringify(x)+')',ctx);const b={bleed:'no',unstable:'no',neuro:'no',ind:'af',score:'2',valve:'none',renal:'normal',preg:'no',hit:'no',aps:'no',liver:'no',interact:'no',stroke:'no',ich:'no',hf:'no',combo:'no'};let count=0;function test(name,patch,check){const r=decide({...b,...patch});assert(check(r),name+': '+JSON.stringify(r));count++;}
test('AF standard',{},r=>r.points.some(x=>x.includes('DOAC')));
for(const k of ['bleed','unstable','neuro'])test('Emergency '+k,{[k]:'yes'},r=>r.level==='stop'&&r.title.includes('急症'));
for(const k of ['valve','renal','preg','hit','aps','liver','interact'])test('Unknown '+k,{[k]:'unknown'},r=>r.level==='stop');
test('Mechanical valve',{valve:'mechanical'},r=>r.title.includes('Warfarin'));
test('Mechanical dialysis retains warfarin',{valve:'mechanical',renal:'dialysis'},r=>r.title.includes('Warfarin'));
test('Mitral stenosis',{valve:'ms'},r=>r.title.includes('Warfarin'));
test('Pregnant valve',{preg:'yes',valve:'mechanical'},r=>r.level==='stop');
test('HIT over VTE',{hit:'acute',ind:'vte'},r=>r.level==='stop'&&r.title.includes('HIT'));
test('Pregnancy VTE',{preg:'yes',ind:'vte'},r=>r.title.includes('LMWH'));
test('Dialysis AF',{renal:'dialysis'},r=>r.level==='review'&&r.title.includes('個別'));
test('No AF risk',{score:'0'},r=>r.title.includes('不需'));
test('Prasugrel restriction',{ind:'acs',stroke:'yes'},r=>r.avoid.some(x=>x.includes('Prasugrel')));
test('ICH restriction',{ich:'yes'},r=>r.avoid.some(x=>x.includes('Ticagrelor')));
test('HF restriction',{hf:'yes'},r=>r.avoid.some(x=>x.includes('Cilostazol')));
for(const type of ['avf','avg'])for(const stage of ['new','mature','post','blocked'])test('access '+type+stage,{ind:'access',accessType:type,accessStage:stage,renal:'dialysis'},r=>stage==='blocked'?r.level==='stop':r.level==='review');
for(const inrStatus of ['low','target','high','unknown'])test('warfarin '+inrStatus,{ind:'dialysis',onWarfarin:'yes',inrStatus,hdBleed:'no',clot:'no',renal:'dialysis'},r=>r.level==='review');
test('warfarin missing',{ind:'dialysis',onWarfarin:'yes'},r=>r.level==='stop');
test('Interaction keeps dialysis warfarin path',{ind:'dialysis',onWarfarin:'yes',inrStatus:'target',hdBleed:'no',clot:'no',renal:'dialysis',interact:'yes'},r=>r.level==='review'&&r.title.includes('INR 達個人目標')&&r.points[0].includes('交互作用'));
test('Interaction keeps AF guidance',{interact:'yes'},r=>r.level==='review'&&r.points.some(x=>x.includes('DOAC')));
test('Liver still stops',{liver:'yes'},r=>r.level==='stop');
test('ACS with mechanical valve keeps ACS guidance',{ind:'acs',valve:'mechanical'},r=>r.title.includes('ACS')&&r.level==='review'&&r.avoid.some(x=>x.includes('warfarin')));
test('Stroke with APS uses warfarin',{ind:'stroke',aps:'yes'},r=>r.title.includes('Warfarin'));
test('VTE with mechanical valve uses warfarin',{ind:'vte',valve:'mechanical'},r=>r.title.includes('Warfarin'));
vm.runInContext('CASES.forEach(c=>{if(!c.o[c.a]||!c.why||c.s.some(i=>!SOURCES[i]))throw Error(c.t)});DRUGS.forEach(d=>{if(d.s.some(i=>!SOURCES[i]))throw Error(d.n)})',ctx);console.log(count+' clinical branch tests passed; '+vm.runInContext('CASES.length',ctx)+' cases and source mappings valid.');

vm.runInContext(`if(new Set(IX.map(x=>x.id)).size!==IX.length)throw Error('duplicate interaction');IX.forEach(x=>{if(x.s.some(i=>!SOURCES[i]))throw Error(x.id)});if(selectedInteractions(['w-up']).length!==1||selectedInteractions([]).length!==0)throw Error('selection');`,ctx);console.log(vm.runInContext('IX.length',ctx)+' interaction groups: sources, unique identifiers and selection checks passed.');
