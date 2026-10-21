// Selected, clinically important examples; not a complete interaction database.
const IX_SOURCES={
 warfarin:9,apixaban:10,ticagrelor:12,
 clopidogrel:SOURCES.push(['Clopidogrel · DailyMed 交互作用','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0d010775-1160-4b2e-a928-563a02edd191'])-1,
 rivaroxaban:SOURCES.push(['Rivaroxaban · DailyMed 交互作用','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d0e105f6-28f3-45ee-83bd-7d458835242b'])-1,
 dabigatran:SOURCES.push(['Dabigatran · DailyMed 交互作用','https://dailymed-beta.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=80637981-d5a7-48cb-b7b2-f50807a8ab20&type=display'])-1,
 edoxaban:SOURCES.push(['Edoxaban · DailyMed 交互作用','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e77d3400-56ad-11e3-949a-0800200c9a66'])-1
};
const IX=[
 ['w-up','Warfarin','Amiodarone、TMP–SMX（trimethoprim/sulfamethoxazole）、metronidazole、fluconazole','需監測','可能提高 INR、增加出血。開始、停用或調整這些藥物後，安排較密集 INR 追蹤，由醫療團隊依結果調整 warfarin；不套用固定減量百分比。',[9]],
 ['w-down','Warfarin','Rifampin（rifampicin）、carbamazepine','需監測','可能降低 INR 與抗凝效果。開始及停藥都需密切追蹤 INR；停用誘導劑後亦可能轉為過度抗凝。',[9]],
 ['a-up','Apixaban','Ketoconazole、itraconazole、ritonavir（含 Paxlovid 的 ritonavir）','處方審查','強 CYP3A4／P-gp 抑制可能增加藥物濃度。依原劑量、適應症及當地仿單決定調整或避免；已用低劑量者尤其需注意。不可自行停藥或減半。',[10]],
 ['a-down','Apixaban','Rifampin、carbamazepine、phenytoin、聖約翰草（St John’s wort）','應避免','強 CYP3A4／P-gp 誘導可能降低抗凝效果，需評估替代藥物。',[10]],
 ['r-up','Rivaroxaban','Ketoconazole、ritonavir（含 Paxlovid 的 ritonavir）','應避免','強 CYP3A4／P-gp 抑制增加曝藥量與出血風險，應評估替代組合。',[IX_SOURCES.rivaroxaban]],
 ['r-down','Rivaroxaban','Rifampin、carbamazepine、phenytoin、聖約翰草','應避免','強誘導劑可能降低抗凝效果。',[IX_SOURCES.rivaroxaban]],
 ['r-renal','Rivaroxaban','Erythromycin','腎功能相關','腎功能不全與 P-gp／中度 CYP3A 抑制可能共同提高曝藥量。美國仿單對 CrCl 15–<80 mL/min 的此類組合有使用限制，需依當地仿單及效益風險審查。',[IX_SOURCES.rivaroxaban]],
 ['d-pgp','Dabigatran','Dronedarone、全身性 ketoconazole、verapamil','腎功能相關','P-gp 抑制可能增加曝藥量；不同併用藥、腎功能與適應症的規範不同。核對個別仿單，不將其他 DOAC 的減量規則套用於 dabigatran。',[IX_SOURCES.dabigatran]],
 ['d-down','Dabigatran','Rifampin','應避免','P-gp 誘導可能降低 dabigatran 曝藥量，通常應避免。',[IX_SOURCES.dabigatran]],
 ['e-pgp','Edoxaban','Cyclosporine、dronedarone、erythromycin、ketoconazole','處方審查','P-gp 抑制劑可能增加曝藥量；AF 與 VTE 的調整規則及不同國家仿單可能不同，不可一律減半。',[IX_SOURCES.edoxaban]],
 ['e-down','Edoxaban','Rifampin','應避免','誘導作用可能降低曝藥量，應避免合併使用。',[IX_SOURCES.edoxaban]],
 ['c-ppi','Clopidogrel','Omeprazole、esomeprazole','應避免','抑制 CYP2C19、降低活化與抗血小板效果；錯開服藥不能可靠解決。需胃保護時可由醫師評估如 pantoprazole 等替代方案，不將所有 PPI 視為相同。',[IX_SOURCES.clopidogrel]],
 ['t-up','Ticagrelor','Ketoconazole、itraconazole、clarithromycin、ritonavir','應避免','強 CYP3A 抑制增加 ticagrelor 曝藥量與出血等風險。',[12]],
 ['t-down','Ticagrelor','Rifampin、carbamazepine、phenytoin、phenobarbital','應避免','強 CYP3A 誘導降低 ticagrelor 效果。',[12]],
 ['t-statin','Ticagrelor','Simvastatin、lovastatin、rosuvastatin','劑量／監測','可能增加 statin 曝藥量與肌肉毒性。2026 美國仿單避免 simvastatin／lovastatin >40 mg/日及 rosuvastatin >20 mg/日；高風險者需更謹慎。請核對台灣現行仿單與症狀。',[12]],
 ['t-dig','Ticagrelor','Digoxin','需監測','開始或調整 ticagrelor 後需監測 digoxin 濃度及毒性，腎功能不全者尤需留意。',[12]],
 ['hd','Heparin／Warfarin','Warfarin ＋ UFH／LMWH（包括透析日）','需個別規劃','出血風險加成，但特定情境可有必要。透析時依 INR、出血與管路凝血情況調整 heparin；不因透析日常規停 warfarin，也沒有通用 INR→heparin 劑量公式。請使用「透析管路抗凝」情境完成評估。',[9,21]],
 ['nsaid','所有抗栓藥','Ibuprofen、naproxen、diclofenac 等 NSAIDs','出血加成','與抗凝或抗血小板藥併用增加出血風險，包含自行購買的止痛藥。先評估替代止痛方案；即使 INR 正常仍可能出血。',[9,10,IX_SOURCES.clopidogrel]],
 ['combo','所有抗栓藥','Aspirin、clopidogrel、ticagrelor ＋ warfarin／DOAC／heparin','出血加成','多重抗栓需明確適應症與預定療程。近期 ACS／支架可能確有需要，應由團隊審查組合及療程，勿自行停用支架相關藥物。',[1,2,9]]
].map(([id,target,meds,level,detail,s])=>({id,target,meds,level,detail,s}));
function selectedInteractions(ids=[]){return IX.filter(x=>ids.includes(x.id));}
function interactionCards(items,selectable=false){return items.map(x=>`<article class="ix-card"><div class="ix-top"><strong>${x.target}</strong><span class="ix-tag ${x.level==='應避免'?'danger':''}">${x.level}</span></div>${selectable?`<label class="ix-med"><input type="checkbox" data-ix="${x.id}" ${state.ixSelected.includes(x.id)?'checked':''}> ${x.meds}</label>`:`<h3>${x.meds}</h3>`}<p>${x.detail}</p>${refs(x.s)}</article>`).join('');}
function interactionPicker(){return `<section class="disclaimer ix-panel"><h3>重要交互作用：具體藥物提示</h3><p>勾選病人實際有使用的組合，加入評估摘要。以下是重點範例，未列出不代表沒有交互作用；仍須核對完整處方、成藥與草藥。</p><div class="tools"><input id="ix-search" type="search" aria-label="搜尋交互作用藥物" placeholder="搜尋如 amiodarone、Paxlovid、止痛藥…"><select id="ix-target" aria-label="篩選抗栓藥物"><option value="all">全部抗栓藥</option>${[...new Set(IX.map(x=>x.target))].map(t=>`<option>${t}</option>`).join('')}</select></div><p id="ix-count" role="status"></p><div id="ix-list" class="ix-list"></div></section>`;}
function bindInteractions(){const search=main.querySelector('#ix-search');if(!search)return;const target=main.querySelector('#ix-target');const update=()=>{const q=search.value.trim().toLowerCase();const matches=IX.filter(x=>(target.value==='all'||x.target===target.value||x.target==='所有抗栓藥')&&[x.target,x.meds,x.detail].join(' ').toLowerCase().includes(q));main.querySelector('#ix-count').textContent=`已勾選 ${state.ixSelected.length} 組 · 顯示 ${matches.length} 組（篩選不會清除勾選）`;main.querySelector('#ix-list').innerHTML=matches.length?interactionCards(matches,true):'<p>沒有相符範例；請向藥師核對，不能視為安全。</p>';main.querySelectorAll('[data-ix]').forEach(el=>el.onchange=()=>{state.ixSelected=el.checked?[...new Set([...state.ixSelected,el.dataset.ix])]:state.ixSelected.filter(id=>id!==el.dataset.ix);if(state.ixSelected.length)state.interact='yes';else state.interact='unknown';const status=main.querySelector('#interact');if(status)status.value=state.interact;update();});};search.oninput=update;target.onchange=update;update();}
