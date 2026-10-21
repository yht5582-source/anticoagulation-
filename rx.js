// Prescription engine: purpose + patient assessment → recommended regimen with label-based doses.
// Doses follow the Taiwan labels for apixaban, edoxaban, dabigatran, prasugrel and rivaroxaban (2023-05-24 version) (checked 2026-10-21);
// NHI lines follow 藥品給付規定第二節 2.1 (115.9.22 版).
const RX_SRC={
 valve:SOURCES.push(['2020 ACC/AHA：瓣膜性心臟病','https://www.ahajournals.org/doi/10.1161/CIR.0000000000000923'])-1,
 stroke:SOURCES.push(['2021 AHA/ASA：中風／TIA 次級預防指引','https://www.ahajournals.org/doi/10.1161/STR.0000000000000375'])-1,
 medical:SOURCES.push(['ASH：住院內科病人 VTE 預防','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/prophylaxis-for-medical-patients'])-1,
 surgical:SOURCES.push(['ASH：手術病人 VTE 預防','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/prevention-in-hospitalized-surgical-patients'])-1,
 cancer:SOURCES.push(['ASH：癌症相關 VTE','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/cancer'])-1,
 eliquis:SOURCES.push(['EMA：Eliquis（apixaban）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/eliquis'])-1,
 xarelto:SOURCES.push(['EMA：Xarelto（rivaroxaban）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/xarelto'])-1,
 pradaxa:SOURCES.push(['EMA：Pradaxa（dabigatran）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/pradaxa'])-1,
 lixiana:SOURCES.push(['EMA：Lixiana（edoxaban）SmPC','https://www.ema.europa.eu/en/medicines/human/EPAR/lixiana'])-1,
 twEliquis:SOURCES.push(['台灣仿單：Eliquis 艾必克凝（114.10 版）','https://www.hosp.nycu.edu.tw/en/departments/dep-support/pharmacy/drog-use-search/6277-apixaban.html'])-1,
 twLixiana:SOURCES.push(['台灣仿單：Lixiana 里先安（114.11 版）','https://www.hosp.nycu.edu.tw/departments/dep-support/pharmacy/drog-use-search/5568-edoxaban.html'])-1,
 twPradaxa:SOURCES.push(['台灣仿單：Pradaxa 普栓達（114.7 版）','https://www.hosp.nycu.edu.tw/en/departments/dep-support/pharmacy/drog-use-search/2984-2984.html'])-1,
 twEfient:SOURCES.push(['台灣仿單：Efient 抑凝安（115.8 版）','https://www.hosp.nycu.edu.tw/en/departments/dep-support/pharmacy/drog-use-search/7074-prasugrel.html'])-1,
 twXarelto:SOURCES.push(['台灣仿單：Xarelto 拜瑞妥（2023-05-24 版）','https://reg.802.mnd.gov.tw/PhC/images/drug/OXAR/Guide1.pdf'])-1,
 twXarelto25:SOURCES.push(['台灣仿單：Xarelto 拜瑞妥 2.5 mg（2026-09-02 版，衛部藥輸字第 027750 號）',''])-1,
 nhi:SOURCES.push(['健保藥品給付規定 第二節 2.1（115.9.22 版）','https://www.nhi.gov.tw/ch/cp-7593-ad2a9-3397-1.html'])-1
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

// NHI 2.1.4.2–2.1.5 AF criteria; rivaroxaban alone also covers age 50–74 with DM/HTN/CAD.
function nhiAF(x){const age=+x.age,risk=x.vaDM==='yes'||x.vaHTN==='yes'||x.vaVasc==='yes';
 const crit=[x.vaStroke==='yes'&&'曾中風／全身性栓塞（規定未明列 TIA）',x.vaHF==='yes'&&'心衰竭（須 NYHA ≥II 或 LVEF <40%）',age>=75&&'≥75 歲',age>=65&&age<75&&risk&&'65–74 歲合併糖尿病／高血壓／冠心病'].filter(Boolean);
 const riva=!crit.length&&age>=50&&age<65&&risk,ex=[x.highBleed==='yes'&&'出血風險增加',x.liver==='b'&&'肝病（活動性肝病為排除條件）'].filter(Boolean);
 const lines=[crit.length?'符合 DOAC 給付條件：'+crit.join('、'):riva?'僅 rivaroxaban 符合（50–74 歲合併糖尿病／高血壓／冠心病）；其他 DOAC 不符合':'不符合 DOAC 給付條件，需自費或改用 warfarin'];
 if(ex.length)lines.push('可能觸及排除標準：'+ex.join('、'));
 lines.push('排除：嚴重瓣膜疾病、14 天內中風、6 個月內嚴重中風、出血風險增加、CrCl <15（dabigatran <30；edoxaban 另排除 >95）、活動性肝病、懷孕。');
 return {ok:crit.length?true:riva?'riva':false,lines};}

// Oral anticoagulant dose selection for AF; returns candidates with exclusions explained.
function afDoac(x,c){const m=x.meds||[],has=k=>m.includes(k),age=+x.age,w=+x.weight,out=[],avoid=[];
 const abc=[age>=80,w<=60,+x.scr>=1.5].filter(Boolean).length;
 if(has('strong')&&(abc>=2||c<30))avoid.push('Apixaban：已需 2.5 mg BID 又併用強效 CYP3A4＋P-gp 抑制劑，應避免。');
 else {const low=abc>=2||c<30,why=[];if(abc>=2)why.push('符合 ≥2 項：年齡 ≥80、體重 ≤60 kg、SCr ≥1.5 mg/dL');if(c<30)why.push('CrCl 15–29：台灣仿單 AF 調降為 2.5 mg BID');
  let dose=low?'2.5 mg BID':'5 mg BID';if(has('strong')){dose='2.5 mg BID';why.push('併用強效 CYP3A4＋P-gp 抑制劑：台灣仿單 5 mg BID 者減量 50%（clarithromycin 不需調整）');}
  out.push({drug:'Apixaban',dose,lines:why.length?why:['未達減量條件，使用標準劑量'],s:[RX_SRC.twEliquis,10]});}
 const ed=[];if(c<=50)ed.push('CrCl 15–50');if(w<=60)ed.push('體重 ≤60 kg');if(has('dron')||has('erythro')||has('strong'))ed.push('併用 P-gp 抑制劑');
 const ed15=age>=80&&(x.highBleed==='yes'||w<=45||c<30||has('nsaid'));
 out.push({drug:'Edoxaban',dose:ed.length?'30 mg QD':'60 mg QD',lines:[ed.length?'減量原因：'+ed.join('、'):'未達減量條件',...(ed15?['台灣仿單：約 80 歲以上且有出血因子（重要器官出血史、≤45 kg、CrCl 15–29、常用 NSAIDs／抗血小板）可考慮 15 mg QD']:[]),...(c>95?['CrCl >95：台灣仿單無建議劑量（缺血性中風增加），健保亦排除']:[])],s:[RX_SRC.twLixiana,IX_SOURCES.edoxaban],caution:c>95});
 if(has('strong'))avoid.push('Rivaroxaban：全身性 azole 抗黴菌劑或 HIV 蛋白酶抑制劑（ritonavir）不建議併用（台灣仿單）。');
 else if(has('dron'))avoid.push('Rivaroxaban：dronedarone 歐盟仿單不建議併用（台灣 2023 仿單未列，請藥師審查）。');
 else if(x.liver==='b')avoid.push('Rivaroxaban：Child-Pugh B／C 不建議（台灣仿單）。');
 else out.push({drug:'Rivaroxaban',dose:c>50?'15–20 mg QD，隨餐':'10–15 mg QD，隨餐',lines:[c>50?'台灣仿單：CrCl >50 每日 15–20 mg（ROCKET-AF 用 20 mg；日本 J-ROCKET 用 15 mg）':'台灣仿單：CrCl 15–50 每日 10–15 mg（ROCKET-AF 用 15 mg；J-ROCKET 用 10 mg）'+(c<30?'；CrCl 15–30 須謹慎':''),...(has('erythro')&&c<80?['腎功能不全＋erythromycin：曝藥量約增 2 倍，出血風險高者須謹慎']:[])],s:[RX_SRC.twXarelto,IX_SOURCES.rivaroxaban],caution:has('erythro')&&c<80});
 if(c<30)avoid.push('Dabigatran：CrCl <30 禁用（歐盟／台灣仿單）。');
 else if(has('strong')||has('dron'))avoid.push('Dabigatran：全身性 ketoconazole、itraconazole、cyclosporine 禁用；dronedarone、ritonavir 不建議（台灣仿單）。');
 else {const bleed=[age>=75&&age<80&&'年齡 75–79',c<=50&&'CrCl 30–50',w<50&&'體重 <50 kg',x.highBleed==='yes'&&'出血風險高／胃腸出血史'].filter(Boolean);
  out.push({drug:'Dabigatran',dose:age>=80||bleed.length?'110 mg BID':'150 mg BID',lines:[age>=80?'台灣仿單：≥80 歲 110 mg BID':bleed.length?'台灣仿單：具出血風險者宜 110 mg BID（'+bleed.join('、')+'）':'未達減量條件',...(has('vera')?['併用 verapamil：台灣仿單 AF 不需減量（歐盟仿單為 110 mg BID）']:[])],s:[RX_SRC.twPradaxa,IX_SOURCES.dabigatran]});}
 return {out,avoid};}

function prescribe(x){
 const m=x.meds||[],has=k=>m.includes(k),dial=x.kidney&&x.kidney!=='none',c=dial?null:crcl(x);
 const renal=dial?'dialysis':x.aki==='yes'?'aki':c!==null&&c<30?'severe':'normal';
 const score=x.ind==='af'?vaScore(x):null;
 const base=decide({...x,renal,score:score===null?'2':String(Math.min(score,2)),liver:x.liver==='c'?'yes':'no',interact:'no',stroke:x.strokeHx,combo:x.ind==='af'?x.combo:'no'});
 const r={level:base.level,title:base.title,crcl:c,renal,score,primary:null,alts:[],avoid:[...base.avoid],monitor:[],nhi:[],notes:base.points.filter(p=>!p.startsWith('處方前確認')),refs:[...base.refs]};
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
   r.alts.push(warfarinRx('2.5','2.0–3.0',['透析病人 INR 波動大，需密切追蹤'])),r.alts.push({drug:'Apixaban',dose:+x.age>=80||+x.weight<=60?'2.5 mg BID':'5 mg BID',lines:['台灣仿單：CrCl <15 或透析無臨床經驗，不建議使用；美國仿單允許（≥80 歲或 ≤60 kg 為 2.5 mg BID），屬仿單外','健保排除 CrCl <15'],s:[RX_SRC.twEliquis,10],caution:true});
   r.avoid.push('Dabigatran、edoxaban、rivaroxaban 不建議用於透析或 CrCl <15。');r.refs.push(1);bleedMeds();return r;}
  if(has('inducer')){review('併用強效誘導劑：DOAC 應避免，改用 warfarin');r.primary=warfarinRx('2.5','2.0–3.0',['誘導劑使 warfarin 需求量增加；停用誘導劑後可能轉為過度抗凝']);r.avoid.push('所有 DOAC：與強效 CYP3A4／P-gp 誘導劑併用會降低療效。');warfMonitor();bleedMeds();return r;}
  const {out,avoid}=afDoac(x,c),nhi=nhiAF(x);r.avoid.push(...avoid);r.nhi=nhi.lines;r.refs.push(RX_SRC.nhi);
  const pick=(nhi.ok==='riva'&&out.find(d=>d.drug==='Rivaroxaban'))||out.find(d=>!d.caution)||out[0];if(nhi.ok!==true)review();if(has('strong')||has('dron'))r.notes.unshift('併用 P-gp／CYP3A 抑制劑：已依仿單調整或排除，處方前請藥師審查。');
  r.primary={...pick,lines:[...pick.lines,'2024 ESC 未排序個別 DOAC；此為依腎功能、交互作用與減量條件篩出的第一個適用選項，可依每日次數、費用與健保條件改選下列替代。']};
  r.alts.push(...out.filter(d=>d!==pick),warfarinRx('2.5','2.0–3.0',['DOAC 不適用、無法負擔或已長期 INR 穩定時']));
  r.title=score===1?'CHA₂DS₂-VA 1：可考慮抗凝（共同決策）':'CHA₂DS₂-VA '+score+'：建議口服抗凝';if(score===1||has('strong')||has('dron'))review();
  if(renal==='aki'){review();r.notes.unshift('AKI／腎功能波動：劑量依目前 CrCl 計算僅供參考；穩定後重算再定案，期間如需抗凝可用 UFH。');}
  if(x.liver==='b'){review();r.notes.push('Child-Pugh B：rivaroxaban 不建議（台灣仿單）；dabigatran 不建議用於活動性肝病；apixaban、edoxaban 謹慎使用、不需調劑量。');}
  if(x.combo==='yes'){r.notes.unshift('合併近期 ACS／PCI：口服抗凝用上列 AF 劑量（rivaroxaban 依台灣仿單改 15 mg QD，CrCl 30–49 為 10 mg QD，最長 12 個月後回標準劑量），加 clopidogrel 75 mg QD；aspirin 通常 PCI 後 ≤1 週至 1–4 週停用；12 個月後單用口服抗凝。');r.avoid.push('合併期間避免 ticagrelor／prasugrel 與長期三重療法。');}
  r.refs.push(0);doacMonitor();bleedMeds();return r;}
 if(x.ind==='vte'){
  r.notes.unshift(x.provoked==='transient'?'療程：由暫時性重大誘因引起 → 3 個月後停藥。':'療程：無明顯誘因或持續性危險因子 → 至少 3 個月，之後若出血風險可接受多建議延長（6 個月後 apixaban 2.5 mg BID，或 rivaroxaban 10／20 mg QD）。');
  if(x.preg==='yes'){r.primary={drug:'Enoxaparin',dose:'1 mg/kg SC q12h',lines:['孕期全程持續，至產後至少 6 週，總療程 ≥3 個月','預計分娩／神經軸麻醉前 24 小時停用；CrCl <30 改 1 mg/kg QD 並會診'],s:[6,8]};r.monitor.push('追蹤血小板與體重變化；必要時 anti-Xa。');return r;}
  if(x.cancer==='yes'){review('癌症相關 VTE：DOAC 或 LMWH');r.notes.unshift('ASH 2021：初期與短期治療建議 apixaban、edoxaban、rivaroxaban 或 LMWH；胃腸／泌尿道腫瘤出血風險高者偏好 apixaban 或 LMWH。');r.refs.push(RX_SRC.cancer);}
  if(valveOrAps){const [t,rg]=inrTarget(x);r.primary=warfarinRx(t,rg,['先以 UFH／LMWH 重疊至少 5 天，且 INR 達標 ≥24 小時後停注射']);r.alts.push({drug:'Enoxaparin（起始重疊）',dose:'1 mg/kg SC q12h',lines:['CrCl <30：1 mg/kg QD'],s:[8]});r.avoid.push('DOAC 不適用於機械瓣膜或高風險 APS。');warfMonitor();bleedMeds();return r;}
  const ufh={drug:'UFH 靜脈輸注',dose:'80 U/kg bolus → 18 U/kg/h',lines:['依院內 aPTT 或 anti-Xa nomogram 調整；可快速停藥，適合 AKI、透析或可能需介入者'],s:[3]};
  const enox=(qd)=>({drug:'Enoxaparin → warfarin',dose:qd?'1 mg/kg SC QD（CrCl <30）':'1 mg/kg SC q12h',lines:['同日開始 warfarin，重疊至少 5 天且 INR ≥2 達 24 小時','健保：治療 DVT 每療程 <10 天'],s:[8,9]});
  r.nhi=['DOAC 須經影像或超音波確診，每 6 個月評估一次。','Apixaban、rivaroxaban 可直接口服起始；edoxaban、dabigatran 須先注射抗凝 ≥5 天，dabigatran 給付 6 個月。','Enoxaparin 治療 DVT 每療程 <10 天；UFH、warfarin 無特別限制。'];r.refs.push(RX_SRC.nhi);
  if(dial||c<15||renal==='aki'){review('腎功能嚴重受限：UFH 起始，轉 warfarin');r.primary=ufh;r.alts.push(warfarinRx('2.5','2.0–3.0',['與 UFH 重疊至少 5 天且 INR ≥2 達 24 小時']));r.avoid.push('CrCl <15／透析不建議 DOAC；LMWH 會累積。');warfMonitor();bleedMeds();return r;}
  if(c<30){review('CrCl 15–29：注射起始，個別選擇口服');r.primary=enox(true);r.alts.push(ufh,{drug:'Apixaban',dose:'10 mg BID ×7 天 → 5 mg BID',lines:['CrCl 15–29 資料有限，仿單建議謹慎'],s:[10,RX_SRC.eliquis],caution:true});r.avoid.push('Dabigatran CrCl <30 禁用；rivaroxaban 治療 VTE 於 CrCl 15–30 應避免（台灣仿單）；edoxaban 須謹慎。');warfMonitor();bleedMeds();return r;}
  if(has('inducer')||has('strong')){review('交互作用限制 DOAC：LMWH 起始，轉 warfarin');r.primary=enox(false);if(has('strong')&&!has('inducer'))r.alts.push({drug:'Apixaban（減量 50%）',dose:'5 mg BID ×7 天 → 2.5 mg BID',lines:['台灣仿單：併用強效 CYP3A4＋P-gp 抑制劑時 5／10 mg BID 劑量減 50%'],s:[RX_SRC.twEliquis],caution:true});r.avoid.push(has('inducer')?'所有 DOAC：強效誘導劑降低療效。':'Rivaroxaban／dabigatran：強效 CYP3A4＋P-gp 抑制劑增加出血，請藥師審查。');warfMonitor();bleedMeds();return r;}
  const age=+x.age,w=+x.weight,ed30=c<=50||w<=60||has('dron')||has('erythro');
  const doacs=[{drug:'Apixaban',dose:'10 mg BID ×7 天 → 5 mg BID',lines:['可直接口服起始，不需先打針','治療期不依腎功能／年齡減量'],s:[10,RX_SRC.eliquis]}];
  if(x.liver==='b')r.avoid.push('Rivaroxaban：Child-Pugh B／C 不建議（台灣仿單）。');else doacs.push({drug:'Rivaroxaban',dose:'15 mg BID ×21 天 → 20 mg QD（隨餐）',lines:['可直接口服起始；15 mg 以上須隨餐',...(c<=50?['CrCl 30–50：台灣仿單仍為 20 mg QD 維持；出血風險大於復發風險時可考慮 15 mg QD']:[]),'治療 ≥6 個月後延長預防：10 或 20 mg QD'],s:[RX_SRC.twXarelto,IX_SOURCES.rivaroxaban]});
  doacs.push({drug:'Edoxaban',dose:(ed30?'30':'60')+' mg QD',lines:['須先非經腸道抗凝至少 5 天，兩者不同時使用',ed30?'減量：CrCl 15–50、體重 ≤60 kg 或 P-gp 抑制劑':'未達減量條件'],s:[RX_SRC.twLixiana,IX_SOURCES.edoxaban]});
  if(has('dron'))r.avoid.push('Dabigatran：cyclosporine 禁用、dronedarone 不建議（台灣仿單）。');else doacs.push({drug:'Dabigatran',dose:'150 mg BID',lines:['須先注射抗凝至少 5 天','台灣仿單 VTE 治療不依年齡或 verapamil 減量'],s:[RX_SRC.twPradaxa,IX_SOURCES.dabigatran]});
  r.primary={...doacs[0],lines:[...doacs[0].lines,'ASH 建議 DOAC 優於 warfarin；apixaban 可直接口服起始，列為預設，rivaroxaban 亦可。']};r.alts.push(...doacs.slice(1),enox(false));
  if(x.liver==='b'){review();r.notes.push('Child-Pugh B：DOAC 須謹慎，可考慮 LMWH。');}
  doacMonitor();bleedMeds();return r;}
 if(x.ind==='prevent'){
  if(x.valve==='mechanical'||x.aps==='yes'){review('已在長期 warfarin：不另加預防劑量');r.notes.unshift('INR 達標者已有治療性抗凝，不需另加 VTE 預防劑量；手術中斷 warfarin 時的橋接由專科依瓣膜／血栓風險決定。');return r;}
  if(x.highBleed==='yes'){review('出血風險高：先用機械性預防');r.primary={drug:'間歇性氣動壓迫（IPC）',dose:'住院期間持續使用',lines:['出血風險下降後再評估藥物預防'],s:[RX_SRC.medical]};r.refs.push(RX_SRC.medical);return r;}
  const lmwh={drug:'Enoxaparin',dose:dial||c<30?'30 mg SC QD':'40 mg SC QD',lines:[dial||c<30?'CrCl <30 減量':'標準預防劑量',x.surgery==='ortho'?'健保：膝／髖關節手術給付 30 mg QD、7–10 天':x.surgery==='surgical'?'健保：腹部手術給付 40 mg QD、7–10 天':'健保 2.1.3.2 未列內科住院預防用途'],s:[8,RX_SRC.nhi]};
  const ufh={drug:'UFH 皮下',dose:'5,000 U SC q8–12h',lines:['透析、CrCl <15 或可能需快速停藥時優先'],s:[RX_SRC.medical]};
  if(x.surgery==='ortho'){r.title='髖／膝關節置換術後 VTE 預防';r.notes.unshift('療程：全髖關節置換約 35 天；全膝關節置換 10–14 天。');
   const age=+x.age,d150=c<=50||age>=75||has('vera');
   const hx=x.vteHx==='yes',riva={drug:'Rivaroxaban',dose:'10 mg QD，止血後術後 6–10 小時開始',lines:['髖 5 週、膝 2 週','台灣適應症限曾發生有症狀 VTE 的高危險群','CrCl 15–30 應避免、<15 禁用；Child-Pugh B／C 禁用'],s:[RX_SRC.twXarelto,IX_SOURCES.rivaroxaban],caution:!hx};
   const dabi={drug:'Dabigatran',caution:!hx,dose:d150?'150 mg QD（75 mg ×2）':'220 mg QD（110 mg ×2）',lines:['台灣適應症限靜脈血栓高危險群','術後 1–4 小時先服 1 顆，之後每日一次 2 顆',d150?'台灣仿單：CrCl 30–50、≥75 歲或併用 verapamil／amiodarone／quinidine 用 150 mg QD':'未達減量條件','健保限 75 mg 每日至多 2 粒（150 mg/日）'],s:[RX_SRC.twPradaxa]};
   const apix={drug:'Apixaban',dose:'2.5 mg BID',lines:['台灣仿單未核准此適應症（仿單外），健保不給付'],s:[RX_SRC.twEliquis],caution:true};
   r.nhi=['Rivaroxaban 10 mg（髖 ≤5 週、膝 ≤2 週）、dabigatran、fondaparinux 2.5 mg：限曾有症狀 VTE 或影像確診 VTE 的高危險者。','Enoxaparin：膝／髖關節手術 30 mg QD、7–10 天。','Apixaban：台灣未核准此適應症。'];r.refs.push(RX_SRC.nhi);
   if(dial||c<30){review();r.primary=dial||c<15?ufh:lmwh;r.alts.push(...(dial||c<15?[lmwh]:[ufh]));r.avoid.push('Dabigatran：CrCl <30 禁用。');}
   else if(!hx){r.primary=lmwh;r.notes.unshift('無症狀 VTE 病史：台灣 rivaroxaban／dabigatran 的骨科預防適應症與健保給付皆限高危險群，故以 enoxaparin 為首選。');r.alts.push(...[x.liver==='b'?null:riva,dabi,{drug:'Aspirin',dose:'依骨科方案',lines:['ASH 2019 允許作為選項之一，常用於低風險或接續療程'],s:[RX_SRC.surgical]},apix].filter(Boolean));}
   else{r.primary=x.liver==='b'?dabi:riva;r.alts.push(...[x.liver==='b'?null:dabi,lmwh,{drug:'Aspirin',dose:'依骨科方案',lines:['ASH 2019 允許作為選項之一，常用於低風險或接續療程'],s:[RX_SRC.surgical]},apix].filter(Boolean));}
   r.refs.push(RX_SRC.surgical);return r;}
  r.nhi=[x.surgery==='surgical'?'Enoxaparin：腹部手術 40 mg QD、7–10 天。':'Enoxaparin 給付規定未列內科住院預防；UFH 皮下注射無特別限制。'];r.refs.push(RX_SRC.nhi);
  r.title=x.surgery==='surgical'?'手術病人 VTE 預防':'住院內科病人 VTE 預防';r.primary=dial||c<15?ufh:lmwh;r.alts.push(dial||c<15?lmwh:ufh);
  r.notes.unshift(x.surgery==='surgical'?'術後依出血止血情況開始，持續至可活動或依手術類型；高風險腹部／骨盆癌症手術可延長至 4 週。':'僅住院期間使用；出院後不常規延長。先確認血栓風險確實增加（如 Padua／IMPROVE）。');
  r.refs.push(x.surgery==='surgical'?RX_SRC.surgical:RX_SRC.medical);r.monitor.push('使用 heparin 類 5–14 天內追蹤血小板，警覺 HIT。');return r;}
 if(x.ind==='acs'){
  const asp={drug:'Aspirin',dose:'起始 162–325 mg 嚼服 → 75–100 mg QD',lines:['長期持續（與 P2Y12 合併期間除外的情況另見下方）'],s:[2]};
  const clop={drug:'Clopidogrel',dose:'起始 300–600 mg → 75 mg QD',lines:['出血風險高、曾顱內出血或需合併口服抗凝時選用'],s:[2,IX_SOURCES.clopidogrel]};
  const tica={drug:'Ticagrelor',dose:'起始 180 mg → 90 mg BID',lines:['可能呼吸困難、心搏過慢'],s:[2,12]};
  const pras={drug:'Prasugrel',dose:'起始 20 mg → 3.75 mg QD（台灣仿單）',lines:['限需 PCI 的 ACS；合併 aspirin 81–100 mg；除起始劑量外於餐後服用','美國仿單劑量為 60 mg → 10 mg，不可混用','≥75 歲、≤50 kg：台灣仿單列為出血風險注意，無建議劑量資料'],s:[RX_SRC.twEfient,2]};
  r.nhi=['Ticagrelor、clopidogrel：住院 ACS 與 aspirin 合併最長 9 個月。','Prasugrel：需 PCI 的住院 ACS，與 aspirin 合併最長 12 個月。','Clopidogrel 支架：塗藥支架 6 個月、金屬支架 3 個月內可與 aspirin 合併。'];r.refs.push(RX_SRC.nhi);
  if(has('omep'))r.notes.push('Clopidogrel 避免與 omeprazole／esomeprazole 併用；需胃保護時改 pantoprazole 等。');
  if(x.acsOac==='yes'||x.valve==='mechanical'||x.aps==='yes'){review('ACS 合併需長期口服抗凝：短期三重 → 雙重');r.primary={drug:'口服抗凝 + clopidogrel',dose:'OAC 依 AF 劑量 + clopidogrel 75 mg QD',lines:['Aspirin 75–100 mg 僅於 PCI 期間至 1–4 週（多數 ≤1 週）','12 個月後停 clopidogrel，單用口服抗凝','DOAC 優於 warfarin（無機械瓣膜／中重度 MS 時）；用 warfarin 時 INR 目標下緣 2.0–2.5'],s:[2]};r.alts.push(clop,asp);r.avoid.push('合併口服抗凝時避免 ticagrelor／prasugrel 及長期三重療法。');bleedMeds();return r;}
  const noTica=x.ich==='yes'||has('strong')||has('inducer'),noPras=x.ich==='yes'||x.strokeHx==='yes'||+x.age>=75||x.acsPci!=='yes';
  if(noTica)r.avoid.push(x.ich==='yes'?'Ticagrelor：曾顱內出血禁用。':'Ticagrelor：強效 CYP3A 抑制劑／誘導劑應避免。');
  if(noPras&&x.acsPci==='yes')r.avoid.push(x.strokeHx==='yes'||x.ich==='yes'?'Prasugrel：中風／TIA 病史不建議（2025 ACC/AHA；美國仿單禁忌，台灣仿單列為出血風險警語）。':'Prasugrel：≥75 歲出血風險增加，通常不建議。');
  const p2=x.highBleed==='yes'||noTica?clop:tica;
  r.title=x.acsPci==='yes'?'ACS 接受 PCI：DAPT':'ACS 藥物治療：DAPT';
  r.primary={drug:'Aspirin + '+p2.drug,dose:'Aspirin 75–100 mg QD ＋ '+p2.drug+' '+p2.dose,lines:['Aspirin 起始 162–325 mg 嚼服；P2Y12 起始見劑量',x.highBleed==='yes'?'出血風險高：DAPT 1–3 個月後改 P2Y12 單一療法（ticagrelor 或 clopidogrel）':'DAPT 預設 12 個月（健保給付 ticagrelor／clopidogrel 合併最長 9 個月）；耐受者可於 ≥1 個月後改 ticagrelor 單一療法以降低出血',...p2.lines],s:p2.s};
  r.alts.push(...[tica,!noPras&&pras,clop].filter(d=>d&&d!==p2&&!(d===tica&&noTica)));
  r.monitor.push('出院前確認 DAPT 結束日期、胃腸道保護（PPI）與停藥前須諮詢心臟科。');bleedMeds();return r;}
 if(x.ind==='cadpad'){
  const riva={drug:'Rivaroxaban 2.5 mg ＋ aspirin',dose:'Rivaroxaban 2.5 mg BID ＋ aspirin 100 mg QD',lines:['可隨餐或空腹；漏服不補，下一次照常服用','長期使用，只要效益大於出血風險','侵入性處置或手術前至少 12 小時停用'],s:[RX_SRC.twXarelto25,RX_SRC.nhi]};
  const asp={drug:'Aspirin 單一療法',dose:'75–100 mg QD',lines:['不適合或暫緩低劑量 rivaroxaban 時的基本方案'],s:[2]};
  const cad=[['cpMI','心肌梗塞'],['cpMulti','多支血管冠狀動脈疾病'],['cpPoly','多血管床疾病'],['cpRevasc','複雜血管再通術（左主幹、分岔 ≥2 支架、CTO、最後通暢血管）'],['cpST','抗血小板治療下仍發生支架內血栓'],['cpStrokeAth','動脈硬化相關缺血性腦中風']].filter(([k])=>x[k]==='yes').map(([,t])=>t);
  const pad=[['cpPadRevasc','主動脈股動脈／下肢繞道或髂、股、膝下動脈 PTA'],['cpAmp','動脈疾病造成的截肢或壞疽'],['cpClaud','間歇性跛行且非侵入檢查狹窄 >50%']].filter(([k])=>x[k]==='yes').map(([,t])=>t);
  const t=x.cpType,okCad=t!=='pad'&&cad.length,okPad=t!=='cad'&&pad.length;
  r.nhi=[okCad||okPad?'符合高風險條件：'+[...(okCad?cad:[]),...(okPad?pad:[])].join('、'):'未勾選健保高風險條件，需自費（CAD 須 2 年內符合所列心血管事件之一；PAD 須符合所列條件之一）。','限 2.5 mg 每日 2 次、每次 1 粒，且須與 aspirin 併用。','不得合併 DAPT、P2Y12 抑制劑（clopidogrel、ticagrelor、prasugrel）、cilostazol 或其他抗凝血劑（如 warfarin）。'];r.refs.push(RX_SRC.twXarelto25,RX_SRC.nhi);
  const block=[];
  if(x.cpDapt==='yes')block.push('目前使用 DAPT、P2Y12 抑制劑、cilostazol 或其他抗凝血劑：仿單指出不適合與 DAPT 併用，健保亦不得合併；療程結束後再評估。');
  if(x.valve==='mechanical'||x.aps==='yes')block.push('機械瓣膜／高風險 APS 需治療劑量 warfarin；2.5 mg 不提供足夠抗凝，仿單不建議用於人工瓣膜。');
  if(x.cpStroke==='hemlac'||x.ich==='yes')block.push('曾有出血性或腔隙性中風、或顱內出血：仿單建議避免（COMPASS 未納入）。');
  if(x.cpStroke==='recent1m')block.push('一個月內缺血性、非腔隙性中風：中風後第一個月內應避免，滿一個月後再評估。');
  if(dial||c<15)block.push('CrCl <15 或透析：禁用。');else if(c<30)block.push('CrCl 15–30：仿單建議避免（資料有限）。');
  if(x.liver==='b')block.push('Child-Pugh B／C：應避免。');
  if(has('strong'))block.push('併用全身性 azole 抗黴菌劑或 HIV 蛋白酶抑制劑：不建議。');
  if(block.length){review('CAD／PAD：目前不宜加上低劑量 rivaroxaban');r.notes.unshift(...block);r.primary=asp;r.avoid.push('此時不加 rivaroxaban 2.5 mg BID。');return r;}
  r.title=t==='pad'?'症狀性 PAD：rivaroxaban 2.5 mg BID ＋ aspirin':t==='cad'?'CAD：rivaroxaban 2.5 mg BID ＋ aspirin':'CAD＋PAD：rivaroxaban 2.5 mg BID ＋ aspirin';
  r.primary=riva;r.alts.push(asp);
  if(!(okCad||okPad))review();
  if(x.highBleed==='yes'){review();r.notes.unshift('出血風險高：COMPASS 排除高出血風險者，需個別權衡；必要時維持 aspirin 單一療法。');}
  if(c<=50)r.notes.push('CrCl 30–50 不需調劑量，但併用其他會升高 rivaroxaban 濃度的藥物時須謹慎。');
  if(+x.weight<=50)r.notes.push('體重 ≤50 kg 或 BMI ≤18.5 出血機率較高。');
  if(x.hf==='yes')r.notes.push('COMPASS 排除 LVEF <30% 或 NYHA III–IV 心衰竭者，此族群資料有限。');
  r.monitor.push('定期追蹤 Hb、腎功能與出血徵兆；不明原因 Hb 或血壓下降時尋找出血部位。','長期 NSAIDs、SSRI／SNRI 會增加出血；避免自行服用止痛藥。');bleedMeds();return r;}
 if(x.ind==='stroke'){
  if(x.valve==='mechanical'||x.aps==='yes'){const [t,rg]=inrTarget(x);r.primary=warfarinRx(t,rg,['機械瓣膜／APS 病人的缺血性中風屬抗凝適應症；重啟時機依梗塞大小與出血風險']);r.avoid.push('不以抗血小板或 DOAC 取代。');warfMonitor();return r;}
  const asp={drug:'Aspirin',dose:'75–100 mg QD',lines:['長期單一抗血小板'],s:[RX_SRC.stroke]},clop={drug:'Clopidogrel',dose:'75 mg QD',lines:['替代 aspirin 的長期單一抗血小板','健保限 aspirin 過敏、aspirin 相關潰瘍／出血或一年內消化性潰瘍'],s:[RX_SRC.stroke,IX_SOURCES.clopidogrel,RX_SRC.nhi]},ad={drug:'Aspirin／緩釋 dipyridamole',dose:'25/200 mg BID',lines:['頭痛常見'],s:[RX_SRC.stroke]};
  r.nhi=['Clopidogrel（2.1.1.6）：限近期中風等粥狀硬化病人且 aspirin 過敏、aspirin 相關潰瘍／出血或一年內消化性潰瘍；輕微中風 21 天 DAPT 未列於給付條件。'];r.refs.push(RX_SRC.nhi);
  if(x.strokeAcute==='yes'&&x.ich!=='yes'){r.title='輕微中風／高風險 TIA：短期 DAPT';r.primary={drug:'Clopidogrel + aspirin ×21 天',dose:'Clopidogrel 300–600 mg + aspirin 160–325 mg 起始 → clopidogrel 75 mg + aspirin 75–100 mg QD',lines:['適用 NIHSS ≤3 或 ABCD² ≥4、發病 24 小時內、非心因性','21 天後改單一抗血小板（如 clopidogrel 75 mg QD）'],s:[RX_SRC.stroke]};r.alts.push(asp,clop);if(has('omep'))r.notes.push('Clopidogrel 避免與 omeprazole／esomeprazole 併用。');r.refs.push(RX_SRC.stroke);bleedMeds();return r;}
  r.primary=asp;r.alts.push(clop,ad);r.refs.push(RX_SRC.stroke);bleedMeds();return r;}
 return r;}
if(typeof module!=='undefined')module.exports={prescribe,crcl,vaScore};
