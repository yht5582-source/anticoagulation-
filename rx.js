// Prescription engine: purpose + patient assessment → recommended regimen with label-based doses.
// Doses summarise US (DailyMed) / EU (EMA SmPC) labels and the cited guidelines; the Taiwan label is the final reference.
const RX_SRC={
 valve:SOURCES.push(['2020 ACC/AHA：瓣膜性心臟病','https://www.ahajournals.org/doi/10.1161/CIR.0000000000000923'])-1,
 stroke:SOURCES.push(['2021 AHA/ASA：中風／TIA 次級預防指引','https://www.ahajournals.org/doi/10.1161/STR.0000000000000375'])-1,
 medical:SOURCES.push(['ASH：住院內科病人 VTE 預防','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/prophylaxis-for-medical-patients'])-1,
 surgical:SOURCES.push(['ASH：手術病人 VTE 預防','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/prevention-in-hospitalized-surgical-patients'])-1,
 cancer:SOURCES.push(['ASH：癌症相關 VTE','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/cancer'])-1,
 eliquis:SOURCES.push(['EMA：Eliquis（apixaban）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/eliquis'])-1,
 xarelto:SOURCES.push(['EMA：Xarelto（rivaroxaban）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/xarelto'])-1,
 pradaxa:SOURCES.push(['EMA：Pradaxa（dabigatran）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/pradaxa'])-1,
 lixiana:SOURCES.push(['EMA：Lixiana（edoxaban）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/lixiana'])-1
};
const RX_MEDS=[
 ['strong','強效 CYP3A4＋P-gp 抑制劑：ketoconazole、itraconazole、ritonavir（含 Paxlovid）'],
 ['inducer','強效誘導劑：rifampin、carbamazepine、phenytoin、聖約翰草'],
 ['dron','Dronedarone 或 cyclosporine'],
 ['vera','Verapamil'],
 ['erythro','Erythromycin 等中度 CYP3A／P-gp 抑制劑'],
 ['warfup','Amiodarone、TMP–SMX、metronidazole、fluconazole（升高 INR）'],
 ['nsaid','NSAIDs 或本次處方以外的抗血小板藥'],
 ['omep','Omeprazole／esomeprazole']];
function crcl(x){const a=+x.age,w=+x.weight,s=+x.scr;if(!(a>0&&w>0&&s>0))return null;return Math.round((140-a)*w/(72*s)*(x.sex==='f'?0.85:1));}
function vaScore(x){const a=+x.age;return (a>=75?2:a>=65?1:0)+['vaHF','vaHTN','vaDM','vaVasc'].filter(k=>x[k]==='yes').length+(x.vaStroke==='yes'?2:0);}
const WARFARIN_START='起始常用 2–5 mg/日（高齡、低體重、肝病、亞洲族群或併用升 INR 藥物取低值），不使用負荷劑量；初期每 2–3 天追 INR 至穩定。';
function warfarinRx(target,range,extra=[]){return {drug:'Warfarin',dose:`目標 INR ${target}（範圍 ${range}）`,lines:[WARFARIN_START,...extra]};}
function inrTarget(x){if(x.valve==='mechanical'){const high=x.valvePos!=='aortic'||x.valveRisk==='yes';return high?['3.0','2.5–3.5']:['2.5','2.0–3.0'];}return ['2.5','2.0–3.0'];}

// Oral anticoagulant dose selection for AF; returns candidates with exclusions explained.
function afDoac(x,c){const m=x.meds||[],has=k=>m.includes(k),age=+x.age,w=+x.weight,out=[],avoid=[];
 const abc=[age>=80,w<=60,+x.scr>=1.5].filter(Boolean).length;
 if(has('strong')&&(abc>=2||c<30))avoid.push('Apixaban：已需 2.5 mg BID 又併用強效 CYP3A4＋P-gp 抑制劑，應避免。');
 else {const low=abc>=2||c<30,why=[];if(abc>=2)why.push('符合 ≥2 項：年齡 ≥80、體重 ≤60 kg、SCr ≥1.5 mg/dL');if(c<30)why.push('CrCl 15–29（歐盟／台灣仿單 2.5 mg BID）');
  let dose=low?'2.5 mg BID':'5 mg BID';if(has('strong')){dose='2.5 mg BID';why.push('併用強效 CYP3A4＋P-gp 抑制劑：美國仿單減半；歐盟仿單不建議併用');}
  out.push({drug:'Apixaban',dose,lines:why.length?why:['未達減量條件，使用標準劑量'],s:[10,RX_SRC.eliquis]});}
 const ed=[];if(c<=50)ed.push('CrCl 15–50');if(w<=60)ed.push('體重 ≤60 kg');if(has('dron')||has('erythro')||has('strong'))ed.push('併用 P-gp 抑制劑');
 out.push({drug:'Edoxaban',dose:ed.length?'30 mg QD':'60 mg QD',lines:[ed.length?'減量原因：'+ed.join('、'):'未達減量條件',...(c>95?['CrCl >95：美國仿單指出 AF 療效降低，不建議使用']:[])],s:[IX_SOURCES.edoxaban,RX_SRC.lixiana],caution:c>95});
 if(has('strong')||has('dron'))avoid.push('Rivaroxaban：併用強效 CYP3A4＋P-gp 抑制劑或 dronedarone 時不建議。');
 else if(x.liver==='b')avoid.push('Rivaroxaban：Child-Pugh B 禁用。');
 else out.push({drug:'Rivaroxaban',dose:c<50?'15 mg QD，隨晚餐':'20 mg QD，隨晚餐',lines:[c<50?'CrCl 15–49 減量':'未達減量條件',...(has('erythro')&&c<80?['腎功能不全＋erythromycin：曝藥量增加，美國仿單限效益大於風險時使用']:[])],s:[IX_SOURCES.rivaroxaban,RX_SRC.xarelto],caution:has('erythro')&&c<80});
 if(c<30)avoid.push('Dabigatran：CrCl <30 禁用（歐盟／台灣仿單）。');
 else if(has('strong')||has('dron'))avoid.push('Dabigatran：併用 ketoconazole、itraconazole、dronedarone、cyclosporine 禁用。');
 else {const must=[age>=80&&'年齡 ≥80',has('vera')&&'併用 verapamil'].filter(Boolean),consider=[age>=75&&age<80&&'年齡 75–79',c<=50&&'CrCl 30–50',x.highBleed==='yes'&&'出血風險高'].filter(Boolean);
  out.push({drug:'Dabigatran',dose:must.length?'110 mg BID':consider.length?'150 mg BID（可考慮 110 mg BID）':'150 mg BID',lines:[must.length?'需減量：'+must.join('、'):consider.length?'可個別減量：'+consider.join('、'):'未達減量條件'],s:[IX_SOURCES.dabigatran,RX_SRC.pradaxa]});}
 return {out,avoid};}

function prescribe(x){
 const m=x.meds||[],has=k=>m.includes(k),dial=x.kidney&&x.kidney!=='none',c=dial?null:crcl(x);
 const renal=dial?'dialysis':x.aki==='yes'?'aki':c!==null&&c<30?'severe':'normal';
 const score=x.ind==='af'?vaScore(x):null;
 const base=decide({...x,renal,score:score===null?'2':String(Math.min(score,2)),liver:x.liver==='c'?'yes':'no',interact:'no',stroke:x.strokeHx,combo:x.ind==='af'?x.combo:'no'});
 const r={level:base.level,title:base.title,crcl:c,renal,score,primary:null,alts:[],avoid:[...base.avoid],monitor:[],notes:base.points.filter(p=>!p.startsWith('處方前確認')),refs:[...base.refs]};
 if(base.level==='stop'||x.ind==='access'||x.ind==='dialysis'||(x.preg==='yes'&&x.ind!=='vte'))return r;
 const review=t=>{r.level='review';if(t)r.title=t;};
 const bleedMeds=()=>{if(has('nsaid'))r.notes.push('併用 NSAIDs／其他抗血小板：出血風險加成，評估停用或替代，必要時加胃保護。');if(has('warfup')&&r.primary&&r.primary.drug==='Warfarin')r.monitor.push('併用 amiodarone／TMP–SMX／metronidazole／fluconazole：INR 可能上升，開始或停藥後加密追蹤。');};
 const doacMonitor=()=>r.monitor.push('開始前與每 6–12 個月追 CBC、肝腎功能；CrCl 30–60、≥75 歲或虛弱者每 3–6 個月重算 CrCl 並調整劑量。','INR／aPTT 不用於調整 DOAC 劑量；確認服藥順從性與手術前停藥計畫。');
 const warfMonitor=()=>r.monitor.push('INR 穩定後約每 4 週追蹤；新增／停用藥物、飲食大變、急性疾病時加密。','衛教維生素 K 飲食一致、出血警訊與避免自行服用 NSAIDs。');
 const valveOrAps=x.valve==='mechanical'||x.aps==='yes'||(x.ind==='af'&&x.valve==='ms');
 if(x.ind==='af'){
  if(valveOrAps){const [t,rg]=inrTarget(x);r.primary=warfarinRx(t,rg,[x.valve==='mechanical'?(t==='3.0'?'機械二尖瓣，或主動脈瓣合併 AF、既往栓塞、左心室功能不良、高凝狀態：INR 3.0':'機械主動脈瓣且無其他血栓危險因子：INR 2.5'):x.aps==='yes'?'高風險血栓性 APS：INR 2–3':'AF 合併中重度二尖瓣狹窄：INR 2–3']);r.avoid.push('DOAC 不適用於機械瓣膜、中重度二尖瓣狹窄或高風險 APS。');r.refs.push(RX_SRC.valve);warfMonitor();bleedMeds();return r;}
  if(score===0){r.title='CHA₂DS₂-VA 0：不需常規抗凝';r.notes.unshift('每年或臨床變化時重新評估 CHA₂DS₂-VA。');return r;}
  if(dial||c<15){review('末期腎病／透析 AF：是否抗凝需個別決定');r.notes.unshift('證據有限；先評估出血史、跌倒、預期壽命與病人偏好。');
   r.alts.push(warfarinRx('2.5','2.0–3.0',['透析病人 INR 波動大，需密切追蹤'])),r.alts.push({drug:'Apixaban',dose:+x.age>=80||+x.weight<=60?'2.5 mg BID':'5 mg BID',lines:['美國仿單用於透析（≥80 歲或 ≤60 kg 為 2.5 mg BID）；歐盟／台灣仿單不建議 CrCl <15 或透析使用，屬仿單外'],s:[10,RX_SRC.eliquis],caution:true});
   r.avoid.push('Dabigatran、edoxaban、rivaroxaban 不建議用於透析或 CrCl <15。');r.refs.push(1);bleedMeds();return r;}
  if(has('inducer')){review('併用強效誘導劑：DOAC 應避免，改用 warfarin');r.primary=warfarinRx('2.5','2.0–3.0',['誘導劑使 warfarin 需求量增加；停用誘導劑後可能轉為過度抗凝']);r.avoid.push('所有 DOAC：與強效 CYP3A4／P-gp 誘導劑併用會降低療效。');warfMonitor();bleedMeds();return r;}
  const {out,avoid}=afDoac(x,c);r.avoid.push(...avoid);const pick=out.find(d=>!d.caution)||out[0];if(has('strong')||has('dron'))r.notes.unshift('併用 P-gp／CYP3A 抑制劑：已依仿單調整或排除，處方前請藥師審查。');
  r.primary={...pick,lines:[...pick.lines,'2024 ESC 未排序個別 DOAC；此為依腎功能、交互作用與減量條件篩出的第一個適用選項，可依每日次數、費用與健保條件改選下列替代。']};
  r.alts.push(...out.filter(d=>d!==pick),warfarinRx('2.5','2.0–3.0',['DOAC 不適用、無法負擔或已長期 INR 穩定時']));
  r.title=score===1?'CHA₂DS₂-VA 1：可考慮抗凝（共同決策）':'CHA₂DS₂-VA '+score+'：建議口服抗凝';if(score===1||has('strong')||has('dron'))review();
  if(renal==='aki'){review();r.notes.unshift('AKI／腎功能波動：劑量依目前 CrCl 計算僅供參考；穩定後重算再定案，期間如需抗凝可用 UFH。');}
  if(x.liver==='b'){review();r.notes.push('Child-Pugh B：apixaban、edoxaban、dabigatran 須謹慎；rivaroxaban 禁用。');}
  if(x.combo==='yes'){r.notes.unshift('合併近期 ACS／PCI：口服抗凝用上列 AF 劑量，加 clopidogrel 75 mg QD；aspirin 通常 PCI 後 ≤1 週至 1–4 週停用；12 個月後單用口服抗凝。');r.avoid.push('合併期間避免 ticagrelor／prasugrel 與長期三重療法。');}
  r.refs.push(0);doacMonitor();bleedMeds();return r;}
 if(x.ind==='vte'){
  r.notes.unshift(x.provoked==='transient'?'療程：由暫時性重大誘因引起 → 3 個月後停藥。':'療程：無明顯誘因或持續性危險因子 → 至少 3 個月，之後若出血風險可接受多建議延長（apixaban 2.5 mg BID 或 rivaroxaban 10 mg QD，6 個月後）。');
  if(x.preg==='yes'){r.primary={drug:'Enoxaparin',dose:'1 mg/kg SC q12h',lines:['孕期全程持續，至產後至少 6 週，總療程 ≥3 個月','預計分娩／神經軸麻醉前 24 小時停用；CrCl <30 改 1 mg/kg QD 並會診'],s:[6,8]};r.monitor.push('追蹤血小板與體重變化；必要時 anti-Xa。');return r;}
  if(x.cancer==='yes'){review('癌症相關 VTE：DOAC 或 LMWH');r.notes.unshift('ASH 2021：初期與短期治療建議 apixaban、edoxaban、rivaroxaban 或 LMWH；胃腸／泌尿道腫瘤出血風險高者偏好 apixaban 或 LMWH。');r.refs.push(RX_SRC.cancer);}
  if(valveOrAps){const [t,rg]=inrTarget(x);r.primary=warfarinRx(t,rg,['先以 UFH／LMWH 重疊至少 5 天，且 INR 達標 ≥24 小時後停注射']);r.alts.push({drug:'Enoxaparin（起始重疊）',dose:'1 mg/kg SC q12h',lines:['CrCl <30：1 mg/kg QD'],s:[8]});r.avoid.push('DOAC 不適用於機械瓣膜或高風險 APS。');warfMonitor();bleedMeds();return r;}
  const ufh={drug:'UFH 靜脈輸注',dose:'80 U/kg bolus → 18 U/kg/h',lines:['依院內 aPTT 或 anti-Xa nomogram 調整；可快速停藥，適合 AKI、透析或可能需介入者'],s:[3]};
  const enox=(qd)=>({drug:'Enoxaparin → warfarin',dose:qd?'1 mg/kg SC QD（CrCl <30）':'1 mg/kg SC q12h',lines:['同日開始 warfarin，重疊至少 5 天且 INR ≥2 達 24 小時'],s:[8,9]});
  if(dial||c<15||renal==='aki'){review('腎功能嚴重受限：UFH 起始，轉 warfarin');r.primary=ufh;r.alts.push(warfarinRx('2.5','2.0–3.0',['與 UFH 重疊至少 5 天且 INR ≥2 達 24 小時']));r.avoid.push('CrCl <15／透析不建議 DOAC；LMWH 會累積。');warfMonitor();bleedMeds();return r;}
  if(c<30){review('CrCl 15–29：注射起始，個別選擇口服');r.primary=enox(true);r.alts.push(ufh,{drug:'Apixaban',dose:'10 mg BID ×7 天 → 5 mg BID',lines:['CrCl 15–29 資料有限，仿單建議謹慎'],s:[10,RX_SRC.eliquis],caution:true});r.avoid.push('Dabigatran CrCl <30 禁用；edoxaban／rivaroxaban 於 CrCl 15–29 須謹慎。');warfMonitor();bleedMeds();return r;}
  if(has('inducer')||has('strong')){review('交互作用限制 DOAC：LMWH 起始，轉 warfarin');r.primary=enox(false);r.avoid.push(has('inducer')?'所有 DOAC：強效誘導劑降低療效。':'Apixaban／rivaroxaban／dabigatran：強效 CYP3A4＋P-gp 抑制劑增加出血，請藥師審查。');warfMonitor();bleedMeds();return r;}
  const age=+x.age,w=+x.weight,ed30=c<=50||w<=60||has('dron')||has('erythro');
  const doacs=[{drug:'Apixaban',dose:'10 mg BID ×7 天 → 5 mg BID',lines:['可直接口服起始，不需先打針','治療期不依腎功能／年齡減量'],s:[10,RX_SRC.eliquis]}];
  if(x.liver==='b')r.avoid.push('Rivaroxaban：Child-Pugh B 禁用。');else doacs.push({drug:'Rivaroxaban',dose:'15 mg BID ×21 天 → 20 mg QD（隨餐）',lines:['可直接口服起始；15 mg 以上須隨餐'],s:[IX_SOURCES.rivaroxaban,RX_SRC.xarelto]});
  doacs.push({drug:'Edoxaban',dose:(ed30?'30':'60')+' mg QD',lines:['須先注射抗凝至少 5 天',ed30?'減量：CrCl 15–50、體重 ≤60 kg 或 P-gp 抑制劑':'未達減量條件'],s:[IX_SOURCES.edoxaban,RX_SRC.lixiana]});
  if(has('dron'))r.avoid.push('Dabigatran：併用 dronedarone／cyclosporine 禁用。');else doacs.push({drug:'Dabigatran',dose:(age>=80||has('vera'))?'110 mg BID':'150 mg BID',lines:['須先注射抗凝 5–10 天',(age>=80||has('vera'))?'減量：年齡 ≥80 或併用 verapamil（歐盟仿單）':'未達減量條件'],s:[IX_SOURCES.dabigatran,RX_SRC.pradaxa]});
  r.primary={...doacs[0],lines:[...doacs[0].lines,'ASH 建議 DOAC 優於 warfarin；apixaban 可直接口服起始，列為預設，rivaroxaban 亦可。']};r.alts.push(...doacs.slice(1),enox(false));
  if(x.liver==='b'){review();r.notes.push('Child-Pugh B：DOAC 須謹慎，可考慮 LMWH。');}
  doacMonitor();bleedMeds();return r;}
 if(x.ind==='prevent'){
  if(x.valve==='mechanical'||x.aps==='yes'){review('已在長期 warfarin：不另加預防劑量');r.notes.unshift('INR 達標者已有治療性抗凝，不需另加 VTE 預防劑量；手術中斷 warfarin 時的橋接由專科依瓣膜／血栓風險決定。');return r;}
  if(x.highBleed==='yes'){review('出血風險高：先用機械性預防');r.primary={drug:'間歇性氣動壓迫（IPC）',dose:'住院期間持續使用',lines:['出血風險下降後再評估藥物預防'],s:[RX_SRC.medical]};r.refs.push(RX_SRC.medical);return r;}
  const lmwh={drug:'Enoxaparin',dose:dial||c<30?'30 mg SC QD':'40 mg SC QD',lines:[dial||c<30?'CrCl <30 減量':'標準預防劑量'],s:[8]};
  const ufh={drug:'UFH 皮下',dose:'5,000 U SC q8–12h',lines:['透析、CrCl <15 或可能需快速停藥時優先'],s:[RX_SRC.medical]};
  if(x.surgery==='ortho'){r.title='髖／膝關節置換術後 VTE 預防';r.notes.unshift('療程：全髖關節置換約 35 天；全膝關節置換 10–14 天。');
   const oral=[{drug:'Apixaban',dose:'2.5 mg BID，術後 12–24 小時開始',lines:['CrCl <15 不建議'],s:[10,RX_SRC.eliquis]},{drug:'Rivaroxaban',dose:'10 mg QD，術後 6–10 小時開始',lines:['CrCl <15 不建議；Child-Pugh B 禁用'],s:[IX_SOURCES.rivaroxaban,RX_SRC.xarelto]}];
   if(dial||c<30){review();r.primary=dial||c<15?ufh:lmwh;r.alts.push(...(dial||c<15?[lmwh]:[ufh]));}else{r.primary=oral[0];r.alts.push(...[x.liver==='b'?null:oral[1],lmwh,{drug:'Aspirin',dose:'依骨科方案',lines:['ASH 2019 允許作為選項之一，常用於低風險或接續療程'],s:[RX_SRC.surgical]}].filter(Boolean));}
   r.refs.push(RX_SRC.surgical);return r;}
  r.title=x.surgery==='surgical'?'手術病人 VTE 預防':'住院內科病人 VTE 預防';r.primary=dial||c<15?ufh:lmwh;r.alts.push(dial||c<15?lmwh:ufh);
  r.notes.unshift(x.surgery==='surgical'?'術後依出血止血情況開始，持續至可活動或依手術類型；高風險腹部／骨盆癌症手術可延長至 4 週。':'僅住院期間使用；出院後不常規延長。先確認血栓風險確實增加（如 Padua／IMPROVE）。');
  r.refs.push(x.surgery==='surgical'?RX_SRC.surgical:RX_SRC.medical);r.monitor.push('使用 heparin 類 5–14 天內追蹤血小板，警覺 HIT。');return r;}
 if(x.ind==='acs'){
  const asp={drug:'Aspirin',dose:'起始 162–325 mg 嚼服 → 75–100 mg QD',lines:['長期持續（與 P2Y12 合併期間除外的情況另見下方）'],s:[2]};
  const clop={drug:'Clopidogrel',dose:'起始 300–600 mg → 75 mg QD',lines:['出血風險高、曾顱內出血或需合併口服抗凝時選用'],s:[2,IX_SOURCES.clopidogrel]};
  const tica={drug:'Ticagrelor',dose:'起始 180 mg → 90 mg BID',lines:['可能呼吸困難、心搏過慢'],s:[2,12]};
  const pras={drug:'Prasugrel',dose:'美國：起始 60 mg → 10 mg QD（<60 kg 5 mg）；台灣上市為 20 mg 起始 → 3.75 mg QD',lines:['限接受 PCI；≥75 歲通常不建議','請以台灣現行仿單劑量為準'],s:[2,11]};
  if(has('omep'))r.notes.push('Clopidogrel 避免與 omeprazole／esomeprazole 併用；需胃保護時改 pantoprazole 等。');
  if(x.acsOac==='yes'||x.valve==='mechanical'||x.aps==='yes'){review('ACS 合併需長期口服抗凝：短期三重 → 雙重');r.primary={drug:'口服抗凝 + clopidogrel',dose:'OAC 依 AF 劑量 + clopidogrel 75 mg QD',lines:['Aspirin 75–100 mg 僅於 PCI 期間至 1–4 週（多數 ≤1 週）','12 個月後停 clopidogrel，單用口服抗凝','DOAC 優於 warfarin（無機械瓣膜／中重度 MS 時）；用 warfarin 時 INR 目標下緣 2.0–2.5'],s:[2]};r.alts.push(clop,asp);r.avoid.push('合併口服抗凝時避免 ticagrelor／prasugrel 及長期三重療法。');bleedMeds();return r;}
  const noTica=x.ich==='yes'||has('strong')||has('inducer'),noPras=x.ich==='yes'||x.strokeHx==='yes'||+x.age>=75||x.acsPci!=='yes';
  if(noTica)r.avoid.push(x.ich==='yes'?'Ticagrelor：曾顱內出血禁用。':'Ticagrelor：強效 CYP3A 抑制劑／誘導劑應避免。');
  if(noPras&&x.acsPci==='yes')r.avoid.push(x.strokeHx==='yes'||x.ich==='yes'?'Prasugrel：中風／TIA 病史禁用。':'Prasugrel：≥75 歲通常不建議。');
  const p2=x.highBleed==='yes'||noTica?clop:tica;
  r.title=x.acsPci==='yes'?'ACS 接受 PCI：DAPT':'ACS 藥物治療：DAPT';
  r.primary={drug:'Aspirin + '+p2.drug,dose:'Aspirin 75–100 mg QD ＋ '+p2.drug+' '+p2.dose,lines:['Aspirin 起始 162–325 mg 嚼服；P2Y12 起始見劑量',x.highBleed==='yes'?'出血風險高：DAPT 1–3 個月後改 P2Y12 單一療法（ticagrelor 或 clopidogrel）':'DAPT 預設 12 個月；耐受者可於 ≥1 個月後改 ticagrelor 單一療法以降低出血',...p2.lines],s:p2.s};
  r.alts.push(...[tica,!noPras&&pras,clop].filter(d=>d&&d!==p2&&!(d===tica&&noTica)));
  r.monitor.push('出院前確認 DAPT 結束日期、胃腸道保護（PPI）與停藥前須諮詢心臟科。');bleedMeds();return r;}
 if(x.ind==='stroke'){
  if(x.valve==='mechanical'||x.aps==='yes'){const [t,rg]=inrTarget(x);r.primary=warfarinRx(t,rg,['機械瓣膜／APS 病人的缺血性中風屬抗凝適應症；重啟時機依梗塞大小與出血風險']);r.avoid.push('不以抗血小板或 DOAC 取代。');warfMonitor();return r;}
  const asp={drug:'Aspirin',dose:'75–100 mg QD',lines:['長期單一抗血小板'],s:[RX_SRC.stroke]},clop={drug:'Clopidogrel',dose:'75 mg QD',lines:['替代 aspirin 的長期單一抗血小板'],s:[RX_SRC.stroke,IX_SOURCES.clopidogrel]},ad={drug:'Aspirin／緩釋 dipyridamole',dose:'25/200 mg BID',lines:['頭痛常見'],s:[RX_SRC.stroke]};
  if(x.strokeAcute==='yes'&&x.ich!=='yes'){r.title='輕微中風／高風險 TIA：短期 DAPT';r.primary={drug:'Clopidogrel + aspirin ×21 天',dose:'Clopidogrel 300–600 mg + aspirin 160–325 mg 起始 → clopidogrel 75 mg + aspirin 75–100 mg QD',lines:['適用 NIHSS ≤3 或 ABCD² ≥4、發病 24 小時內、非心因性','21 天後改單一抗血小板（如 clopidogrel 75 mg QD）'],s:[RX_SRC.stroke]};r.alts.push(asp,clop);if(has('omep'))r.notes.push('Clopidogrel 避免與 omeprazole／esomeprazole 併用。');r.refs.push(RX_SRC.stroke);bleedMeds();return r;}
  r.primary=asp;r.alts.push(clop,ad);r.refs.push(RX_SRC.stroke);bleedMeds();return r;}
 return r;}
if(typeof module!=='undefined')module.exports={prescribe,crcl,vaScore};
