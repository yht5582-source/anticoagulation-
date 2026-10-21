const SOURCES=[
['2024 ESC：心房顫動','https://academic.oup.com/eurheartj/article/45/36/3314/7738779'],
['2023 ACC/AHA：AF、瓣膜與 CKD','https://www.ahajournals.org/doi/10.1161/CIR.0000000000001193'],
['2025 ACC/AHA：急性冠心症','https://www.ahajournals.org/doi/10.1161/CIR.0000000000001309'],
['ASH：DVT / PE 治療','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/treatment'],
['ASH：HIT','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/heparin-induced-thrombocytopenia'],
['AHA/ASA：中風次級預防','https://www.stroke.org/en/professionals/stroke-resource-library/prevention/secondary-stroke-prevention-checklist'],
['ASH：孕期 VTE','https://www.hematology.org/education/clinicians/guidelines-and-quality-care/clinical-practice-guidelines/venous-thromboembolism-guidelines/pregnancy'],
['ISTH：APS 與 DOAC','https://www.islh.org/web/downloads/2020UseofDOACinAPSISTH-SSCGuidancejth_14935.pdf'],
['DailyMed：Enoxaparin 仿單','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5017a927-2a24-4f27-89f9-27c805bf7d59'],
['DailyMed：Warfarin 仿單','https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=bf21781b-d4d5-456d-a5bc-d48bd2da61ce'],
['DailyMed：Apixaban 仿單','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=33752f5d-2ca7-45c0-8292-b54742219b97'],
['DailyMed：Prasugrel 仿單','https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=41a4e332-6725-4cb7-940a-8291cf56cfe4'],
['DailyMed：Ticagrelor 仿單','https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=c4c1ca82-99bd-451a-ad77-7fe28c4ae3e8'],
['DailyMed：Cilostazol 仿單','https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aec462c8-e225-f520-cae5-80049151c0ff']];
const DRUGS=[
{n:'UFH',g:'注射抗凝',use:'急性 VTE、ACS／PCI、透析及體外循環；需要快速調整或停藥時。',no:'活動性重大出血、急性／疑似 HIT、嚴重過敏。既往 HIT 須專科評估再暴露。',care:'治療劑量依 aPTT 或 anti-Xa；追蹤 CBC、血小板。AKI／嚴重 CKD 時常較方便控制。',s:[4,8]},
{n:'LMWH / Enoxaparin',g:'注射抗凝',use:'穩定 VTE、住院／術後預防、孕期 VTE；特定 ACS。',no:'活動性重大出血、急性／疑似 HIT；不能用來替代造成 HIT 的 UFH。',care:'CrCl <30 需依仿單調整；不以 aPTT 調劑量。神經軸麻醉須安排給藥間隔。',s:[6,8]},
{n:'Warfarin',g:'口服抗凝',use:'機械瓣膜、AF 合併中重度二尖瓣狹窄、高風險 APS；其他 AF／VTE 替代選項。',no:'活動性重大出血；孕期原則禁用（機械瓣膜為專科例外）；急性 HIT 血小板未恢復前不啟用。',care:'監測 INR；一般 AF／VTE 多為 2–3，機械瓣膜個別設定。急性 VTE 啟用須注射抗凝重疊；並非所有 AF 需橋接。',s:[1,7,9]},
{n:'DOAC / NOAC',g:'口服抗凝',use:'Apixaban、rivaroxaban、edoxaban（Xa）；dabigatran（IIa）。多數需抗凝 AF、DVT／PE。',no:'活動性重大出血。機械瓣膜、AF 合併中重度二尖瓣狹窄不應使用；高風險 APS、孕期不建議。',care:'CrCl、肝功能、體重、年齡、交互作用與適應症共同決定劑量。INR 不能用來調整 DOAC。急性 VTE：dabigatran／edoxaban 需先注射抗凝 5–10 天；apixaban／rivaroxaban 有口服起始加強療程。',s:[0,1,3,7,10]},
{n:'Aspirin',g:'抗血小板',use:'冠心病、非心源性中風次級預防；ACS／PCI 的 DAPT 組成。',no:'活動性重大出血、嚴重過敏／aspirin 誘發呼吸道反應。',care:'不是 AF 抗凝替代品；沒有心血管疾病者不應常規自行用於初級預防。',s:[1,2,5]},
{n:'Clopidogrel',g:'抗血小板',use:'PCI／ACS、非心源性中風、症狀性 PAD；與口服抗凝合用時常為優先 P2Y12 選項。',no:'活動性病理性出血、嚴重過敏。',care:'注意 CYP2C19 代謝、交互作用與療效不足；合併療程須有結束日期。',s:[2,5]},
{n:'Ticagrelor',g:'抗血小板',use:'ACS／PCI；特定輕度中風或高風險 TIA 短期方案。',no:'曾有顱內出血、活動性病理性出血；嚴重肝功能不全應避免。',care:'可能呼吸困難或心搏過慢；注意強效 CYP3A 交互作用。',s:[12]},
{n:'Prasugrel',g:'抗血小板',use:'接受 PCI 的 ACS 病人。',no:'任何中風或 TIA 病史、活動性病理性出血。',care:'≥75 歲通常不建議（特定高缺血風險例外）；<60 kg 出血風險較高。',s:[11]},
{n:'Cilostazol',g:'抗血小板',use:'間歇性跛行；特定中風預防方案依當地指引。',no:'任何嚴重度的心衰竭。',care:'可能心悸、頭痛；不能作為 AF 或 VTE 抗凝替代品。',s:[13]}];
const CASES=[
{t:'01｜AF 的中風預防',tag:'基本選藥',body:'72 歲男性，已確認 AF，合併高血壓、糖尿病；CrCl 65。無瓣膜狹窄、出血、近期 PCI 或其他限制。',q:'長期預防栓塞最合適的方向？',o:['Aspirin 即可','依核准條件選 DOAC','常規 aspirin + clopidogrel','不需要抗栓'],a:1,why:'CHA₂DS₂-VA = 3（65–74 歲、高血壓、糖尿病各 1）。需抗凝；多數此類 AF 優先考慮 DOAC，並核對適應症及劑量。',wrong:['Aspirin 不能取代 AF 抗凝。','','DAPT 不是 AF 抗凝替代品，且增加出血。','此病例已有明確的栓塞風險。'],s:[0,1]},
{t:'02｜機械瓣膜與 AF',tag:'重要排除',body:'58 歲女性，機械二尖瓣置換後，合併 AF，腎功能正常、無活動性出血。',q:'長期抗凝選擇？',o:['Apixaban','低劑量 rivaroxaban + aspirin','Warfarin，依瓣膜設定 INR','Clopidogrel'],a:2,why:'機械瓣膜使用 warfarin。INR 依瓣膜種類、位置及其他風險設定，不能直接套所有 AF 的目標。',wrong:['DOAC 不適用機械瓣膜。','此組合不能取代機械瓣膜所需的 warfarin。','','抗血小板無法取代瓣膜抗凝。'],s:[1,9]},
{t:'03｜孕期 DVT',tag:'特殊族群',body:'30 歲女性，妊娠 24 週，確診近端 DVT，生命徵象穩定、腎功能正常、無 HIT。',q:'通常優先考慮哪種治療？',o:['LMWH','Warfarin','Dabigatran','Aspirin'],a:0,why:'孕期 VTE 通常優先 LMWH，並規劃產前停藥及神經軸麻醉時序。機械瓣膜孕婦是另一種需專科處理的情境。',wrong:['','Warfarin 可造成胎兒傷害，孕期原則禁用。','孕期不建議 DOAC。','Aspirin 不能治療急性 DVT。'],s:[6]},
{t:'04｜Heparin 後血小板下降',tag:'HIT',body:'使用 UFH 第 7 天，血小板由 220 降至 85 ×10⁹/L，出現新發 DVT，無重大出血，臨床高度懷疑 HIT。',q:'下一步？',o:['改用 LMWH','立刻單用 warfarin','停止所有 heparin，評估非 heparin 抗凝','停藥後只觀察'],a:2,why:'疑似高機率 HIT 應依 4Ts、檢驗與出血風險處理，停止 UFH／LMWH／flush，使用適當非 heparin 抗凝。血小板未恢復前不要開始 warfarin。',wrong:['LMWH 也可與 HIT 抗體交叉反應。','急性 HIT 早期 warfarin 可造成肢端壞死。','','HIT 是高度促血栓狀態，單純停藥通常不足。'],s:[4]},
{t:'05｜AKI 合併急性 PE',tag:'腎功能',body:'70 歲男性，確診 PE、目前穩定。CrCl 約 18 且持續惡化，無出血或 HIT；可能需要侵入性處置。',q:'住院初期較易調整的抗凝選項？',o:['標準劑量 enoxaparin 不調整','UFH，依檢驗調整','直接常規劑量 dabigatran','Aspirin'],a:1,why:'腎功能快速變化、可能需介入時，UFH 較方便滴定及停用。這不代表 UFH 沒有出血風險；仍需血球及抗凝監測。',wrong:['Enoxaparin 可能累積；CrCl <30 需調整。','','Dabigatran 腎排除依賴高，不能直接沿用常規劑量。','抗血小板不能治療 PE。'],s:[3,8]},
{t:'06｜ACS 病人曾經 TIA',tag:'個別藥物禁忌',body:'64 歲男性，ACS 接受 PCI，2 年前曾 TIA；無顱內出血，醫師規劃 DAPT。',q:'哪一種 P2Y12 抑制劑不應使用？',o:['Clopidogrel','Ticagrelor','Prasugrel'],a:2,why:'Prasugrel 禁忌包括任何中風或 TIA 病史。Ticagrelor 的特定病史禁忌是顱內出血，兩者不能混淆。',wrong:['TIA 本身不是 clopidogrel 禁忌。','既往 TIA 本身不同於顱內出血病史。',''],s:[11,12]},
{t:'07｜非心源性中風',tag:'抗血小板',body:'66 歲女性，非心源性缺血性中風後 6 個月；無 AF、機械瓣膜或其他抗凝適應症。',q:'一般長期次級預防方向？',o:['常規 warfarin','常規 DOAC','適當單一抗血小板藥','永久 DAPT'],a:2,why:'非心源性中風通常選抗血小板。短期 DAPT 只用於特定早期輕微中風／高風險 TIA 等，不等於永久合併。',wrong:['沒有抗凝適應症時不常規用 warfarin。','不能對所有缺血性中風經驗性給 DOAC。','','長期 DAPT 通常增加出血而無足夠額外效益。'],s:[5]},
{t:'08｜活動性出血優先',tag:'安全檢核',body:'78 歲 AF 病人服用 apixaban，突然大量黑便、暈厥，血壓 78/45 mmHg。',q:'最優先的處置方向？',o:['改成 aspirin 繼續預防','增加抗凝避免停藥血栓','急救、止血及逆轉評估','等待下次門診'],a:2,why:'重大出血伴休克需立即急救、暫停相關抗栓並評估逆轉及止血。穩定後再由團隊評估重啟時機，不能在此流程直接換藥。',wrong:['Aspirin 仍增加出血，也不能取代 AF 抗凝。','此時增加抗凝可能致命。','','需要緊急處置。'],s:[1]},
{t:'09｜AF 合併冠狀動脈支架',tag:'合併療法',body:'73 歲男性 AF，因 ACS 接受 PCI；同時具有長期抗凝與抗血小板適應症。',q:'哪個原則正確？',o:['終身三重抗栓','僅 DAPT 取代 AF 抗凝','短期合併，明訂 aspirin 停用與降階計畫'],a:2,why:'避免長期三重療法。多數需口服抗凝的 ACS／PCI 病人可於 1–4 週停 aspirin，續口服抗凝加 P2Y12（常選 clopidogrel）；實際時程由缺血與出血風險決定。',wrong:['長期三重治療出血風險高。','DAPT 不能取代 AF 抗凝。',''],s:[2]},
{t:'10｜透析病人的 AF',tag:'不確定性',body:'76 歲男性，血液透析合併 AF，既往反覆腸胃道出血，目前已止血。',q:'最合適的決策方式？',o:['所有透析 AF 都給 DOAC','用 aspirin 當抗凝替代品','個別權衡抗凝效益、出血及本地仿單'],a:2,why:'透析 AF 抗凝淨效益不確定。美國指引對部分病人允許考慮 warfarin 或具證據劑量 apixaban，但不可直接等同台灣核准或健保規定。',wrong:['不能對透析族群一概套用一般 DOAC 結論。','Aspirin 不是 AF 抗凝替代品。',''],s:[1]}];
function decide(x){const r=baseDecision(x);if(x.interact==='yes'&&r.level!=='stop'){if(r.level==='ok')r.level='review';r.points.unshift('已確認重要交互作用：下方方向仍適用，但處方前須依交互作用分級完成審查、監測或改選替代藥物。');}return r;}
function baseDecision(x){
const r={level:'ok',title:'',points:[],avoid:[],refs:[]};const stop=(title,points,refs)=>({level:'stop',title,points,avoid:[],refs});
if([x.bleed,x.unstable,x.neuro].includes('yes'))return stop('先處理急症，暫不進入常規選藥',['活動性重大出血：立即急救、止血與抗栓逆轉評估。','休克／不穩定 PE 或 ACS：啟動急症團隊；抗凝、再灌流需整體判斷。','新發神經症狀：啟動中風流程與腦部影像，先排除出血。'],[1,2,5]);
if([x.bleed,x.unstable,x.neuro].some(v=>v!=='no'))return stop('安全條件尚未確認',['請確認所有安全檢核；未知不能視為沒有風險。'],[1]);
if(x.ind==='access'&&x.accessStage==='blocked')return stop('疑似通路急性阻塞：儘速聯絡通路團隊',['震顫消失、無法透析或突然血流下降，需儘速評估超音波／血管攝影、取栓與狹窄處理。','不能只增加 heparin 或口服抗栓，等待其自行打通。評估高血鉀、容量負荷與替代透析通路。'],[14]);
if(x.hit==='acute')return stop('疑似／急性 HIT：改走非 heparin 路徑',['停止 UFH、LMWH 及 heparin flush；依 4Ts 及檢驗評估。','依腎肝功能、穩定度與出血風險由團隊選非 heparin 抗凝；不能直接換 LMWH。','血小板未恢復前不開始 warfarin。'],[4]);
if(x.preg==='yes'&&(x.valve==='mechanical'||x.valve==='ms'))return stop('孕期合併瓣膜高風險：專科團隊規劃',['不可套用一般孕期 VTE 或一般 AF 選藥；母胎醫學與心臟科共同安排抗凝與監測。'],[1,6,9]);
if(x.renal==='unknown'||x.valve==='unknown'||x.hit==='unknown'||x.preg==='unknown'||x.aps==='unknown'||x.liver==='unknown'||x.interact==='unknown')return stop('資料不足，先補齊個別條件',['腎功能、瓣膜、HIT、孕期、APS、肝病及交互作用均會改變選藥。請確認後再產生候選方向。'],[1,3]);
if(x.liver==='yes'||x.hit==='past')return stop('有重要限制，需個別用藥審查',['嚴重肝病／凝血異常或既往 HIT，不能套用一般推薦。','請藥師／專科核對藥物、病史、檢驗及替代方案。'],[4,9,10]);
if(x.preg==='yes')return {level:'review',title:x.ind==='vte'?'孕期 VTE：通常優先 LMWH':'孕期特殊情境：先由專科評估',points:['孕期 VTE 在腎功能許可、無 HIT 時通常選 LMWH；嚴重 CKD／AKI 需另行調整。','安排產前停藥、分娩及神經軸麻醉時序。'],avoid:['不建議 DOAC；warfarin 孕期原則禁用（機械瓣膜為專科例外）。'],refs:[6,9]};
if(x.ind==='access')return accessDecision(x);
if(x.ind==='dialysis'&&x.onWarfarin==='yes')return warfarinHD(x);
const chronic=['af','vte','stroke'].includes(x.ind);
if(chronic&&(x.valve==='mechanical'||(x.ind==='af'&&x.valve==='ms'))){r.title='長期抗凝方向：Warfarin';r.points.push('機械瓣膜需依瓣膜種類／位置訂 INR；AF 合併中重度二尖瓣狹窄通常 INR 2–3。');r.avoid.push('不以 DOAC 或抗血小板取代。');r.refs.push(1,9);}
else if(chronic&&x.aps==='yes'){r.title='高風險血栓性 APS：優先考慮 Warfarin';r.points.push('三重抗體陽性或動脈血栓病史需專科規劃；單純抗體陽性不等於此情境。');r.avoid.push('不建議以 DOAC 取代。');r.refs.push(7);}
else if(x.ind==='af'){
if(x.score==='unknown')return stop('先評估 AF 栓塞風險',['使用 2024 ESC CHA₂DS₂-VA；本工具不套用於單純裝置偵測的短暫 AHRE。'],[0]);
if(+x.score===0){r.title='CHA₂DS₂-VA 0：通常不需常規抗凝';r.points.push('定期重新評估。心律轉復／消融前後等特殊情境另依規範。');r.avoid.push('不要為 AF 常規加 aspirin。');}
else {r.title=+x.score===1?'CHA₂DS₂-VA 1：可考慮抗凝，共同決策':'CHA₂DS₂-VA ≥2：建議評估啟動抗凝';r.points.push('無機械瓣膜或中重度二尖瓣狹窄時，多數優先考慮 DOAC；核對仿單減量條件。');r.avoid.push('Aspirin／DAPT 不能取代 AF 抗凝。');}r.refs.push(0,1);
}else if(x.ind==='vte'){r.title='急性 DVT／PE：需要治療性抗凝';r.points.push('穩定且無排除條件者可考慮 DOAC；apixaban／rivaroxaban 有起始加強療程。','Dabigatran／edoxaban 需先注射抗凝 5–10 天；warfarin 需注射抗凝重疊至少 5 天且 INR 達標。','療程通常至少 3 個月，再依誘因、復發與出血風險重評。');r.avoid.push('抗血小板不能治療急性 VTE。');r.refs.push(3);}
else if(x.ind==='acs'){r.title='ACS／PCI：抗血小板為核心，急性期合併抗凝';r.points.push('通常 aspirin + P2Y12；無高出血風險 ACS 預設常為 12 個月，需個別調整。','程序期 UFH 等抗凝由心臟科依介入計畫選擇；出院後不因 PCI 自動長期口服抗凝。');r.refs.push(2);}
else if(x.ind==='stroke'){r.title='非心源性中風／TIA：抗血小板';r.points.push('穩定期通常單一抗血小板。只有特定早期輕微中風／高風險 TIA 等適用短期 DAPT。','若另有 AF／機械瓣膜，需重新確認栓塞機轉與抗凝適應症。');r.avoid.push('不對原因未明的栓塞性中風常規經驗性抗凝。');r.refs.push(5);}
else if(x.ind==='prevent'){r.title='住院／術後 VTE 預防：先評估血栓與出血風險';r.points.push('依內外科、活動度與手術類型評估；合適者可用預防劑量 UFH／LMWH。','高出血風險者考慮適當機械性預防；不能把預防劑量當成急性 VTE 治療劑量。');r.refs.push(8);}
else if(x.ind==='dialysis'){r.title='透析管路抗凝：依院內流程選擇';r.points.push('常用 UFH，部分流程用 LMWH；高出血風險考慮無 heparin／區域抗凝方案。','透析管路抗凝不等於全天候 AF 中風預防。');r.refs.push(4,8);}
else return stop('請先選擇明確臨床情境',['其他適應症、人工瓣膜早期術後、癌症相關血栓等需另外評估。'],[1,3]);
if(!chronic&&(x.valve==='mechanical'||x.aps==='yes')){r.level='review';r.points.push('另有機械瓣膜／高風險血栓性 APS：原本的長期 warfarin 需持續，不因本次目的而停用；與抗血小板合併、預防劑量或透析 heparin 均須以此為前提個別規劃。');r.avoid.push('機械瓣膜／高風險 APS 不以 DOAC 或抗血小板取代 warfarin。');r.refs.push(x.valve==='mechanical'?9:7);}
if(x.renal==='aki'||x.renal==='severe'||x.renal==='dialysis'){r.level='review';r.points.push('腎功能限制：急性需注射抗凝時常考慮 UFH；LMWH 須依 CrCl 調整，DOAC 不可直接套一般劑量。');if(x.ind==='af'&&x.score!=='0'&&x.valve==='none'&&x.aps==='no'){r.title='嚴重 CKD／透析 AF：需個別權衡抗凝';r.points.push('透析 AF 淨效益不確定。美國部分建議不能直接等同台灣仿單／健保；由團隊評估 warfarin 或符合當地規範的選項。');}r.refs.push(1,8);}
if(x.combo==='yes'){r.level='review';r.points.push('另有長期抗凝＋近期 PCI／ACS：需心臟科訂合併與降階計畫，避免長期三重治療。多數在 1–4 週內停 aspirin，續 OAC＋P2Y12，實際由風險決定。');r.refs.push(2);}
if(x.stroke==='yes'){r.avoid.push('既往中風／TIA：Prasugrel 禁用。');r.refs.push(11);}
if(x.ich==='yes'){r.level='review';r.avoid.push('顱內出血病史：Ticagrelor 禁用；是否抗凝及重啟時機須專科評估。');r.refs.push(12,1);}
if(x.hf==='yes'){r.avoid.push('心衰竭：Cilostazol 禁用。');r.refs.push(13);}
r.points.push('處方前確認 CBC／血小板、腎肝功能、出血史、藥物交互作用、手術時程與當地仿單；本頁不產生處方劑量。');return r;
}
if(typeof module!=='undefined')module.exports={decide,CASES,DRUGS};
