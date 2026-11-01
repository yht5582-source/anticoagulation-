// Teaching content: demo cases (run live through prescribe), 20-question exam and mind map.
// Numbers are asserted against the engine in tests/teach.cjs. Exam option order is fixed (A–D 5 each); nothing is stored.
const TS={
 hit:SOURCES.push(['ASH 2018：HIT 指引全文','https://pmc.ncbi.nlm.nih.gov/articles/PMC6258919/'])-1,
 cancer:SOURCES.push(['ASH 2021：癌症 VTE 指引全文','https://pmc.ncbi.nlm.nih.gov/articles/PMC7903232/'])-1,
 fourts:SOURCES.push(['Blood 2012：4Ts 統合分析','https://pmc.ncbi.nlm.nih.gov/articles/PMC3501714/'])-1,
 augustus:SOURCES.push(['NEJM 2019：AUGUSTUS','https://pubmed.ncbi.nlm.nih.gov/30883055/'])-1,
 eldercare:SOURCES.push(['NEJM 2020：ELDERCARE-AF','https://pubmed.ncbi.nlm.nih.gov/32865374/'])-1,
 realign:SOURCES.push(['NEJM 2013：RE-ALIGN','https://pubmed.ncbi.nlm.nih.gov/23991661/'])-1,
 proact:SOURCES.push(['NEJM Evid 2023：PROACT Xa','https://pubmed.ncbi.nlm.nih.gov/38320162/'])-1,
 invictus:SOURCES.push(['NEJM 2022：INVICTUS','https://pubmed.ncbi.nlm.nih.gov/36036525/'])-1,
 traps:SOURCES.push(['Blood 2018：TRAPS','https://pubmed.ncbi.nlm.nih.gov/30002145/'])-1,
 chance:SOURCES.push(['NEJM 2013：CHANCE','https://pubmed.ncbi.nlm.nih.gov/23803136/'])-1,
 point:SOURCES.push(['NEJM 2018：POINT','https://pubmed.ncbi.nlm.nih.gov/29766750/'])-1,
 compass:SOURCES.push(['NEJM 2017：COMPASS','https://pubmed.ncbi.nlm.nih.gov/28844192/'])-1,
 voyager:SOURCES.push(['NEJM 2020：VOYAGER PAD','https://pubmed.ncbi.nlm.nih.gov/32222135/'])-1,
 caravaggio:SOURCES.push(['NEJM 2020：Caravaggio','https://pubmed.ncbi.nlm.nih.gov/32223112/'])-1,
 renalaf:SOURCES.push(['Circulation 2022：RENAL-AF','https://pubmed.ncbi.nlm.nih.gov/36335914/'])-1,
 axadia:SOURCES.push(['Circulation 2023：AXADIA-AFNET 8','https://pubmed.ncbi.nlm.nih.gov/36335915/'])-1
};
const DEMO_BASE={bleed:'no',unstable:'no',neuro:'no',kidney:'none',aki:'no',valve:'none',valvePos:'',valveRisk:'no',preg:'no',hit:'no',aps:'no',liver:'none',ich:'no',strokeHx:'no',hf:'no',highBleed:'no',meds:[],vaHF:'no',vaHTN:'no',vaDM:'no',vaStroke:'no',vaVasc:'no',combo:'no',provoked:'',cancer:'no',surgery:'',acsPci:'',acsOac:'no',vteHx:'no',cpType:'',cpStroke:'',cpDapt:'no',cpMI:'no',cpMulti:'no',cpPoly:'no',cpRevasc:'no',cpST:'no',cpStrokeAth:'no',cpPadRevasc:'no',cpAmp:'no',cpClaud:'no',strokeAcute:'',accessType:'',accessStage:'',onWarfarin:'no',inrStatus:'',hdBleed:'',clot:''};
// c[].e must appear in the engine's headline for that variation (checked in tests).
/*CASES-START*/
const DEMOS=[
{t:'高齡低體重的 AF',tag:'AF・減量條件',story:'82 歲女性，新診斷非瓣膜性 AF，有高血壓、糖尿病。體重 52 kg，血清肌酸酐 1.1 mg/dL。無出血史，未併用交互作用藥物。',
 x:{ind:'af',age:'82',sex:'f',weight:'52',scr:'1.1',vaHTN:'yes',vaDM:'yes'},e:{level:'ok',drug:'Apixaban',dose:'2.5 mg BID',crcl:32,score:4},
 steps:['算風險：CHA₂DS₂-VA ＝ 年齡 ≥75（2）＋高血壓（1）＋糖尿病（1）＝ 4；此評分已不計性別。','算腎功能：Cockcroft–Gault 用實際年齡與體重，CrCl ≈ 32 mL/min。','逐藥核對：apixaban 符合「≥80 歲、≤60 kg」2 項 → 2.5 mg BID；edoxaban 因 CrCl ≤50、體重 ≤60 kg → 30 mg QD；dabigatran 因 ≥80 歲 → 110 mg BID。','健保：≥75 歲符合 DOAC 給付條件。'],
 pit:['Apixaban 減量要符合 2 項（或 CrCl 15–29），只符合 1 項就減量是常見的劑量不足。','各 DOAC 減量條件不同，不能把 apixaban 的規則套到其他藥。','Edoxaban 15 mg 只適用約 80 歲以上且有出血因子者：ELDERCARE-AF 是對照安慰劑、受試者為日本長者，不是與標準劑量比較。'],
 c:[{l:'體重改為 70 kg（只符合 ≥80 歲 1 項）',x:{weight:'70'},e:'5 mg BID'},{l:'年齡改為 78 歲（只符合 ≤60 kg 1 項）',x:{age:'78'},e:'5 mg BID'},{l:'肌酸酐升到 1.5 mg/dL（CrCl <30）',x:{scr:'1.5'},e:'2.5 mg BID'}],s:[0,'twEliquis','twLixiana','twPradaxa','nhi','eldercare']},
{t:'AF 剛放冠狀動脈支架',tag:'AF＋PCI・合併療法',story:'73 歲男性，長期 AF，有高血壓。因 NSTEMI 接受 PCI 置放塗藥支架。體重 78 kg，肌酸酐 1.3 mg/dL，無出血史。',
 x:{ind:'af',age:'73',sex:'m',weight:'78',scr:'1.3',vaHTN:'yes',vaVasc:'yes',combo:'yes'},e:{level:'review',drug:'Apixaban',dose:'5 mg BID',crcl:56,score:3},
 steps:['先確定兩個適應症都存在：AF 中風預防（CHA₂DS₂-VA 3）與支架後抗血小板。','口服抗凝用 AF 劑量：apixaban 只看減量條件，此例維持 5 mg BID，不因合併抗血小板自動減量。','P2Y12 選 clopidogrel 75 mg QD；aspirin 僅短期（通常 ≤1 週至 1–4 週）。','寫下停藥日：12 個月後停 clopidogrel，單用口服抗凝。'],
 pit:['AUGUSTUS：apixaban 出血少於 VKA（10.5% vs 14.7%），aspirin 組出血多於安慰劑組（16.1% vs 9.0%）。','若選 rivaroxaban，台灣仿單另有 PCI 劑量：15 mg QD（CrCl 30–49 為 10 mg QD），最長 12 個月後回標準劑量。','合併期間避免 ticagrelor、prasugrel 與長期三重療法。'],
 c:[{l:'肌酸酐 1.8 mg/dL（CrCl ≈40，只符合 1 項）',x:{scr:'1.8'},e:'5 mg BID'},{l:'改有機械瓣膜（二尖瓣）',x:{valve:'mechanical',valvePos:'mitral'},e:'INR 3.0'}],s:[0,2,'augustus','twXarelto']},
{t:'機械二尖瓣合併 AF',tag:'瓣膜・DOAC 禁區',story:'58 歲女性，機械二尖瓣置換後合併 AF、高血壓，近期開始 amiodarone。體重 60 kg，肌酸酐 0.8 mg/dL，未懷孕。詢問能否改用不必抽血的新藥。',
 x:{ind:'af',age:'58',sex:'f',weight:'60',scr:'0.8',valve:'mechanical',valvePos:'mitral',vaHTN:'yes',meds:['warfup']},e:{level:'ok',drug:'Warfarin',dose:'INR 3.0',crcl:73,score:1},
 steps:['先看瓣膜，再看 CHA₂DS₂-VA：機械瓣膜就是 warfarin 適應症，不因風險分數低而改變。','INR 目標依位置：機械二尖瓣 3.0（2.5–3.5）。','Amiodarone 可能使 INR 上升：開始或停藥後加密追蹤。','回答病人：目前 DOAC 不適用，並說明原因。'],
 pit:['RE-ALIGN（dabigatran）與 PROACT Xa（apixaban，On-X 主動脈瓣）都因 DOAC 組事件過多而提前終止。','中重度二尖瓣狹窄合併 AF 同樣走 warfarin；INVICTUS 中 VKA 的心血管事件或死亡少於 rivaroxaban。'],
 c:[{l:'改為機械主動脈瓣（AF 本身即風險因子）',x:{valvePos:'aortic'},e:'INR 3.0'},{l:'目前懷孕',x:{preg:'yes'},e:'專科團隊'}],s:['valve',9,'realign','proact','invictus']},
{t:'胃癌病人的近端 DVT',tag:'VTE・癌症',story:'62 歲男性，轉移性胃癌化療中，超音波確診近端 DVT，血行穩定。體重 68 kg，肌酸酐 0.9 mg/dL，近期無消化道出血。',
 x:{ind:'vte',age:'62',sex:'m',weight:'68',scr:'0.9',provoked:'persistent',cancer:'yes'},e:{level:'review',drug:'Apixaban',dose:'10 mg BID ×7 天 → 5 mg BID',crcl:82},
 steps:['確認是治療劑量的情境，且可口服、腎功能足夠、無強交互作用。','ASH 2021：起始可用 apixaban、rivaroxaban 或 LMWH（建議 20）；3–6 個月短期治療 DOAC 優於 LMWH（建議 23）；但胃腸癌用 DOAC 要謹慎。','Caravaggio：apixaban 對 dalteparin，再發 5.6% vs 7.9%，重大出血 3.8% vs 4.0%。','逐項評估：腫瘤是否仍在腔內、是否切除過上消化道、化療藥交互作用、血小板；共同決策。'],
 pit:['Edoxaban、dabigatran 須先注射抗凝至少 5 天，不能當作「直接口服起始」。','癌症仍活動時 ASH 建議長期（>6 個月）持續，不是 3 個月就停（建議 32）。','工具首選欄只反映仿單條件；胃腸癌出血風險高時 LMWH 是合理選擇。'],
 c:[{l:'併用 rifampin 等強效誘導劑',x:{meds:['inducer']},e:'Enoxaparin'},{l:'改為血液透析',x:{kidney:'hd'},e:'UFH'}],s:['cancer','caravaggio','twEliquis','nhi']},
{t:'手術後血小板掉了六成',tag:'HIT・先停再選',story:'67 歲男性，術後接受 UFH 第 7 天，血小板由 220 降到 85 ×10⁹/L，下肢超音波發現新的 DVT；沒有感染或其他藥物可解釋。',
 x:{ind:'vte',age:'67',sex:'m',weight:'75',scr:'1.0',hit:'acute',provoked:'persistent'},e:{level:'stop',title:'HIT'},
 steps:['算 4Ts：下降 >50% 且最低值 ≥20（2）＋第 5–10 天（2）＋新血栓（2）＋無其他原因（2）＝ 8 分，高機率（≤3 低、4–5 中、6–8 高）。','4Ts 中高機率：做免疫分析，陽性再做功能性檢驗（可行時）。低機率不檢驗、不經驗性治療。','立刻停所有 heparin，包括 flush 與 LMWH；開始治療劑量的非 heparin 抗凝。','ASH 選項：argatroban、bivalirudin、danaparoid、fondaparinux 或 DOAC，依肝腎功能、出血風險與可得性選擇。'],
 pit:['血小板恢復（通常 ≥150 ×10⁹/L）前不開始 warfarin；已在服用者停藥並給靜脈維生素 K。','平均出血風險者不常規輸血小板，也不常規放 IVC filter。','這不是 LMWH 或「預防劑量」能處理的情況，所以工具停在此處，不產生常規處方。'],
 c:[{l:'只有既往 HIT 病史',x:{hit:'past'},e:'重要限制'},{l:'排除 HIT（4Ts 低且無其他疑慮）',x:{hit:'no'},e:'Apixaban'}],s:['hit','fourts']},
{t:'全膝置換術後的預防',tag:'VTE 預防・台灣適應症',story:'70 歲女性，全膝關節置換，體重 62 kg，肌酸酐 0.8 mg/dL，從未發生 VTE。骨科詢問術後要用哪一種口服藥。',
 x:{ind:'prevent',age:'70',sex:'f',weight:'62',scr:'0.8',surgery:'ortho'},e:{level:'ok',drug:'Enoxaparin',dose:'30 mg SC QD',crcl:64},
 steps:['區分預防與治療劑量：這裡只需要預防劑量，療程全膝 10–14 天、全髖約 35 天。','台灣 rivaroxaban 骨科適應症限曾有症狀 VTE 者，dabigatran 限靜脈血栓高危險群，健保條件相同。','此例無 VTE 病史，所以工具以 enoxaparin 為首選，口服選項列替代並標註適應症限制。','工具依健保 2.1.3.2 列 30 mg QD、7–10 天；美國仿單為 30 mg q12h，兩者不同，要依院內規範確認。'],
 pit:['美國常用 apixaban 2.5 mg BID，但台灣仿單未核准此適應症，健保不給付。','預防用的 rivaroxaban 10 mg 不能當作急性 VTE 治療。'],
 c:[{l:'曾有症狀性 VTE',x:{vteHx:'yes'},e:'Rivaroxaban 10 mg QD'},{l:'血液透析',x:{kidney:'hd'},e:'UFH'}],s:['twXarelto','twPradaxa','twEliquis','surgical','nhi',8,'twClexane']},
{t:'曾 TIA 的 ACS 病人',tag:'ACS・P2Y12 選擇',story:'64 歲男性，STEMI 接受 PCI，2 年前曾 TIA，無顱內出血史，長期服用 omeprazole。體重 70 kg，肌酸酐 1.0 mg/dL。',
 x:{ind:'acs',age:'64',sex:'m',weight:'70',scr:'1.0',acsPci:'yes',strokeHx:'yes',meds:['omep']},e:{level:'ok',drug:'Aspirin + Ticagrelor',dose:'90 mg BID',crcl:74},
 steps:['排除 prasugrel：中風／TIA 病史不建議（美國仿單禁忌、台灣仿單警語）。','Ticagrelor 的病史禁忌是「顱內出血」，TIA 不在其中，此例可用。','無高出血風險：DAPT 預設 12 個月；健保 ticagrelor／clopidogrel 合併最長給付 9 個月，要事先告知。','Omeprazole：若改用 clopidogrel 就要換 PPI；出院前寫明療程與停藥要先諮詢心臟科。'],
 pit:['TIA 與顱內出血不能混為一談：一個排除 prasugrel，一個排除 ticagrelor。','台灣 prasugrel 劑量為 20 mg → 3.75 mg，不可與美國 60 mg → 10 mg 混用。'],
 c:[{l:'出血風險高',x:{highBleed:'yes'},e:'Clopidogrel'},{l:'另需長期口服抗凝',x:{acsOac:'yes'},e:'clopidogrel'}],s:[2,12,'twEfient','nhi']},
{t:'PTA 後的症狀性 PAD',tag:'CAD／PAD・血管保護',story:'68 歲男性，間歇性跛行，曾接受股動脈 PTA，目前只用 aspirin。無中風史，未服 P2Y12 或抗凝藥。體重 72 kg，肌酸酐 1.1 mg/dL。',
 x:{ind:'cadpad',age:'68',sex:'m',weight:'72',scr:'1.1',cpType:'pad',cpStroke:'none',cpPadRevasc:'yes'},e:{level:'ok',drug:'Rivaroxaban 2.5 mg ＋ aspirin',dose:'2.5 mg BID',crcl:65},
 steps:['確認目的是動脈粥狀硬化血管保護，不是 AF 或 VTE。','排除：DAPT／P2Y12／cilostazol／其他抗凝、出血性或腔隙性中風、一個月內中風、CrCl <15（15–30 避免）、Child-Pugh B／C。','健保：股動脈 PTA 符合 PAD 高風險條件，且須與 aspirin 併用。','VOYAGER PAD：主要終點 17.3% vs 19.9%（HR 0.85）；ISTH 重大出血 5.94% vs 4.06%（HR 1.42）。'],
 pit:['2.5 mg BID 不足以預防 AF 中風，也不能治療 VTE；同一個藥名，目的與劑量完全不同。','COMPASS：心血管事件 4.1% vs 5.4%，重大出血 3.1% vs 1.9%；要向病人說明兩邊的取捨。'],
 c:[{l:'目前正在服 DAPT',x:{cpDapt:'yes'},e:'Aspirin 單一療法'},{l:'血液透析',x:{kidney:'hd'},e:'Aspirin 單一療法'},{l:'未符合健保高風險條件',x:{cpPadRevasc:'no'},e:'Rivaroxaban 2.5 mg'}],s:['twXarelto25','nhi','compass','voyager']},
{t:'輕微中風的前 24 小時',tag:'中風・短期 DAPT',story:'60 歲女性，突發右手無力、NIHSS 2，發病 6 小時；腦部影像排除出血，心電圖竇性節律。體重 58 kg，肌酸酐 0.7 mg/dL。',
 x:{ind:'stroke',age:'60',sex:'f',weight:'58',scr:'0.7',strokeAcute:'yes'},e:{level:'ok',drug:'Clopidogrel + aspirin ×21 天',dose:'clopidogrel 75 mg',crcl:78},
 steps:['先確認適用範圍：NIHSS ≤3 或 ABCD² ≥4、發病 24 小時內、非心因性。','Clopidogrel 300–600 mg ＋ aspirin 起始 → 雙重抗血小板 21 天。','21 天後改單一抗血小板。','繼續找栓塞來源：若發現 AF，路徑會改成口服抗凝。'],
 pit:['POINT：缺血事件 5.0% vs 6.5%，重大出血 0.9% vs 0.4%，事件多集中在第一週；療程不宜無限延長。','CHANCE：中風 8.2% vs 11.7%，受試者來自中國 114 家中心。','健保 2.1.1.6 未列輕微中風 21 天 DAPT，要事先確認給付。'],
 c:[{l:'已過急性期（穩定期）',x:{strokeAcute:'no'},e:'Aspirin 75–100 mg'},{l:'有機械瓣膜',x:{valve:'mechanical',valvePos:'aortic'},e:'Warfarin'}],s:['stroke','chance','point','nhi']},
{t:'Warfarin 病人透析又凝管',tag:'透析・兩種抗凝',story:'70 歲男性，AF 長期 warfarin，INR 目標 2–3、今日 2.6，維持性血液透析。無出血，但近兩次透析器與靜脈壺有凝血。',
 x:{ind:'dialysis',age:'70',sex:'m',weight:'66',scr:'',kidney:'hd',onWarfarin:'yes',inrStatus:'target',hdBleed:'no',clot:'yes'},e:{level:'review',title:'INR 達個人目標'},
 steps:['分開兩件事：warfarin 管全身抗凝，透析 heparin 管體外循環。','INR 達標：不因透析日停藥、減半或補服 warfarin。','凝管先查原因：血流、通路、血液濃縮、管路與療程因素。','確有需要才用最低有效 heparin，依院內方案逐次調整並記錄。'],
 pit:['沒有通用的 INR→heparin 換算公式；INR 達標也不保證管路不凝。','透析中短暫 heparin 不能取代機械瓣膜或 VTE 所需的全身抗凝。','穿刺後止血延長也要想到流出道狹窄，不要只歸因於抗凝。'],
 c:[{l:'INR 高於目標',x:{inrStatus:'high'},e:'INR 超標'},{l:'INR 低於目標',x:{inrStatus:'low'},e:'INR 未達目標'}],s:[21,9]}
];
/*CASES-END*/
/*QUIZ-START*/
const EXAM=[
{lv:'基礎',q:'70 歲女性 AF，合併高血壓與糖尿病，無其他病史。依 2024 ESC，她的 CHA₂DS₂-VA 是幾分？',o:['2 分','3 分','4 分','5 分'],a:1,why:'65–74 歲 1 分＋高血壓 1 分＋糖尿病 1 分 ＝ 3 分。CHA₂DS₂-VA 已不計女性。',wrong:['漏算了年齡（65–74 歲 +1）。','','這是舊版 CHA₂DS₂-VASc 算入女性後的分數。','沒有足夠項目到 5 分。'],s:[0]},
{lv:'基礎',q:'82 歲男性 AF，體重 70 kg，肌酸酐 0.8 mg/dL，CrCl ≈70，無交互作用藥物。Apixaban 劑量？',o:['5 mg BID','2.5 mg BID','2.5 mg QD','10 mg BID'],a:0,why:'只符合「≥80 歲」1 項。減量要符合年齡 ≥80、體重 ≤60 kg、肌酸酐 ≥1.5 其中 2 項（或 CrCl 15–29）。',wrong:['','只符合 1 項就減量會造成劑量不足。','Apixaban 用於 AF 是每日兩次。','10 mg BID 是 VTE 起始 7 天的劑量。'],s:['twEliquis']},
{lv:'基礎',q:'機械二尖瓣合併 AF，warfarin 的 INR 目標？',o:['2.0（1.5–2.5）','2.5（2.0–3.0）','3.0（2.5–3.5）','4.0（3.5–4.5）'],a:2,why:'機械二尖瓣目標 3.0。機械主動脈瓣無額外風險因子為 2.5，合併 AF、既往栓塞、左心室功能不良或高凝狀態則為 3.0。',wrong:['低於瓣膜所需的抗凝強度。','這是無額外風險的機械主動脈瓣目標。','','過高會明顯增加出血。'],s:['valve']},
{lv:'基礎',q:'穩定的急性近端 DVT，CrCl 80。下列哪個方案可以不經注射抗凝，直接口服起始？',o:['Dabigatran 150 mg BID','Edoxaban 60 mg QD','Warfarin 依 INR 調整','Apixaban 10 mg BID ×7 天 → 5 mg BID'],a:3,why:'Apixaban、rivaroxaban 有口服起始加強療程。Dabigatran、edoxaban 須先注射至少 5 天；warfarin 須重疊注射至少 5 天且 INR 達標。',wrong:['Dabigatran 須先注射抗凝至少 5 天。','Edoxaban 須先注射抗凝至少 5 天。','Warfarin 起效慢，須與注射抗凝重疊。',''],s:['twEliquis','twPradaxa','twLixiana']},
{lv:'基礎',q:'膝關節手術後 2 週發生近端 DVT，已無其他危險因子。抗凝療程原則？',o:['3 個月後停藥','6 週後停藥','至少 12 個月','終身抗凝'],a:0,why:'由暫時性重大誘因引起的 VTE，治療 3 個月後停藥。無明顯誘因或持續性危險因子者才評估延長。',wrong:['','短於建議的最低 3 個月。','此情境沒有延長到 12 個月的理由。','暫時性誘因不是終身抗凝的適應症。'],s:[3]},
{lv:'基礎',q:'妊娠 24 週、腎功能正常的近端 DVT，無 HIT。首選？',o:['Apixaban 10 mg BID ×7 天','Warfarin，INR 2–3','Enoxaparin 1 mg/kg SC q12h','Rivaroxaban 15 mg BID ×21 天'],a:2,why:'孕期 VTE 首選 LMWH，持續至產後至少 6 週（總療程 ≥3 個月），並規劃分娩與神經軸麻醉前停藥。',wrong:['孕期不建議 DOAC。','Warfarin 孕期原則禁用（機械瓣膜為專科例外）。','','孕期不建議 DOAC。'],s:[6,8]},
{lv:'基礎',q:'78 歲 AF，CrCl 23 mL/min。依台灣仿單，下列哪一個 DOAC 禁用？',o:['Apixaban','Dabigatran','Edoxaban','Rivaroxaban'],a:1,why:'Dabigatran 高度依賴腎排除，CrCl <30 禁用。Apixaban 此時為 2.5 mg BID；edoxaban 30 mg QD；rivaroxaban 於 CrCl 15–30 須謹慎。',wrong:['CrCl 15–29 調降為 2.5 mg BID，並非禁用。','','CrCl 15–50 為 30 mg QD，並非禁用。','CrCl 15–30 須謹慎，<15 才禁用。'],s:['twPradaxa','twEliquis','twLixiana','twXarelto']},
{lv:'基礎',q:'AF（CHA₂DS₂-VA 3）病人因結核需服用 rifampin。口服抗凝怎麼選？',o:['Apixaban 5 mg BID','Apixaban 2.5 mg BID','Edoxaban 30 mg QD','Warfarin，加密追蹤 INR'],a:3,why:'強效誘導劑會降低 DOAC 濃度，應避免。Warfarin 需求量也會增加，停用 rifampin 後可能轉為過度抗凝，開始與停藥都要加密追蹤。',wrong:['Rifampin 會降低 apixaban 效果。','降低劑量只會讓抗凝更不足。','Edoxaban 也受影響，應避免併用。',''],s:[10,9]},
{lv:'基礎',q:'病人服用 clopidogrel 且需要胃保護。下列何者較適當？',o:['Omeprazole，與 clopidogrel 間隔 12 小時','Esomeprazole，早晚錯開服用','評估改用 pantoprazole 等其他 PPI','為了用 PPI 而停用 clopidogrel'],a:2,why:'Omeprazole、esomeprazole 抑制 CYP2C19，降低 clopidogrel 活化；錯開服藥不能可靠解決。不應把所有 PPI 視為相同。',wrong:['錯開服藥不能可靠解決交互作用。','同樣抑制 CYP2C19，錯開也不可靠。','','支架或 ACS 後不應因此自行停藥。'],s:['clop']},
{lv:'基礎',q:'60 歲，NIHSS 2，發病 6 小時，影像排除出血，非心因性。一般方案？',o:['Clopidogrel＋aspirin ×21 天，再改單一抗血小板','Clopidogrel＋aspirin 持續 12 個月，再改單一藥','Apixaban 5 mg BID 長期使用，不加抗血小板','Warfarin INR 2–3 持續 3 個月，再改 aspirin'],a:0,why:'NIHSS ≤3 或 ABCD² ≥4、24 小時內、非心因性，適用短期 DAPT 21 天。POINT 顯示重大出血增加，事件多集中在第一週，不宜無限延長。',wrong:['','長期 DAPT 增加出血且無足夠額外效益。','沒有抗凝適應症時不常規用 DOAC。','沒有抗凝適應症時不常規用 warfarin。'],s:['stroke','point']},
{lv:'高階',q:'AUGUSTUS 納入 AF 合併 ACS／PCI 且預定用 P2Y12 者。下列何者正確？',o:['Apixaban 與 VKA 出血相近，但加 aspirin 可減少主要出血','Apixaban 出血多於 VKA，停 aspirin 則明顯增加死亡或住院','兩因子有顯著交互作用，只有 VKA＋aspirin 組出血較少','Apixaban 出血少於 VKA，含 aspirin 組出血多於安慰劑組'],a:3,why:'2×2 設計、4614 人、6 個月。主要出血終點：apixaban 10.5% vs VKA 14.7%（HR 0.69）；aspirin 16.1% vs 安慰劑 9.0%（HR 1.89）；兩因子無顯著交互作用。死亡或住院 apixaban 較低（23.5% vs 27.4%）。',wrong:['Apixaban 出血較少，且 aspirin 增加出血。','方向相反：apixaban 出血較少，死亡或住院也較低。','兩個隨機因子沒有顯著交互作用。',''],s:['augustus']},
{lv:'高階',q:'非瓣膜性 AF，CrCl 40，支架 PCI 後選擇 rivaroxaban。依台灣仿單？',o:['20 mg QD ＋ clopidogrel，不設期限','10 mg QD ＋ P2Y12，最長 12 個月，之後回標準劑量','2.5 mg BID ＋ aspirin ＋ clopidogrel，不設期限','15 mg QD ＋ aspirin ＋ P2Y12，12 個月後全部停藥'],a:1,why:'台灣仿單：PCI 後 15 mg QD（CrCl 30–49 為 10 mg QD）加一種 P2Y12，最長 12 個月，完成抗血小板後增回 AF 標準劑量（CrCl 30–50 為 10–15 mg）。',wrong:['CrCl 40 不是 20 mg，且合併療程要有期限。','','2.5 mg BID 不足以預防 AF 中風。','AF 仍需長期抗凝，不能全部停藥；CrCl 30–49 也應用 10 mg。'],s:['twXarelto']},
{lv:'高階',q:'INVICTUS 比較風濕性心臟病 AF 的 rivaroxaban 與 VKA，結果是？',o:['VKA 的心血管事件或死亡較少，且出血未較多','Rivaroxaban 非劣於 VKA，且重大出血明顯較少','兩組主要終點相近，可依費用與方便性選擇','Rivaroxaban 死亡較少，但缺血性中風較多'],a:0,why:'4531 人；主要終點事件 560 vs 446。限制平均存活時間 1599 vs 1675 天（差 −76 天）；死亡亦以 rivaroxaban 組較高；重大出血無顯著差異。工具的規則寫的是「中重度二尖瓣狹窄」，風濕性 AF 要回到瓣膜評估。',wrong:['','未達非劣，且重大出血無顯著差異。','兩組有明確差異，VKA 較佳。','Rivaroxaban 組死亡較高。'],s:['invictus']},
{lv:'高階',q:'關於 DOAC 用於機械瓣膜的兩個試驗，下列何者正確？',o:['RE-ALIGN 顯示 dabigatran 依血中濃度調整後可取代 warfarin','PROACT Xa 顯示 apixaban 用於 On-X 主動脈瓣非劣於 warfarin','RE-ALIGN 與 PROACT Xa 都因 DOAC 組事件過多而提前終止','兩試驗結果讓 INR 監測在 On-X 瓣膜可以省略'],a:2,why:'RE-ALIGN：252 人，dabigatran 血栓與出血事件過多。PROACT Xa：863 人，apixaban 組瓣膜血栓或相關栓塞 4.2 vs warfarin 1.3 %／人年。機械瓣膜仍用 warfarin。',wrong:['即使調整至目標濃度，事件仍過多。','未達非劣，因事件過多提前終止。','','Warfarin 與 INR 監測仍是標準。'],s:['realign','proact']},
{lv:'高階',q:'血栓性 APS、三種抗體皆陽性，目前穩定服 warfarin，詢問可否改 rivaroxaban。TRAPS 告訴我們？',o:['三陽性病人 rivaroxaban 非劣於 warfarin，可優先使用','兩組血栓相同，差別只在 rivaroxaban 出血較多','任何單一抗體陽性者都應立即改用 warfarin','試驗因 rivaroxaban 組事件過多提前終止，此族群用 warfarin'],a:3,why:'120 人提前終止：主要事件 19% vs 3%；血栓事件 12%（缺血性中風 4、心肌梗塞 3）vs 0；重大出血 7% vs 3%。結論限高風險三陽性族群，不能外推到所有抗體陽性者。',wrong:['結果相反，且試驗提前終止。','血栓事件也集中在 rivaroxaban 組。','試驗族群為三陽性，單純抗體陽性不等於此情境。',''],s:['traps',7]},
{lv:'高階',q:'長期服 warfarin 的 AF 病人住院用 heparin，4Ts 7 分，血小板 70 ×10⁹/L，未出血。下一步？',o:['停 heparin，warfarin 照舊，等待血小板恢復','停 heparin 與 warfarin，給靜脈維生素 K，用治療劑量非 heparin 抗凝','改 enoxaparin，warfarin 重疊至 INR 達標','停 heparin，預防劑量 fondaparinux 並輸注血小板'],a:1,why:'ASH 2018：停 heparin 並用非 heparin 抗凝（3.1），採治療劑量（3.2）；血小板恢復（通常 ≥150）前不啟用 VKA，已在服用者停藥並給靜脈維生素 K（3.5）；平均出血風險者不常規輸血小板（3.6）。',wrong:['急性 HIT 早期 warfarin 可造成肢端壞死，血小板恢復前不用。','','LMWH 也可交叉反應，且不應在此時依賴 warfarin。','應用治療劑量，且不常規輸血小板。'],s:['hit']},
{lv:'高階',q:'維持性血液透析病人發生急性 HIT，透析管路需要抗凝。ASH 建議？',o:['UFH 減量，追蹤 aPTT','LMWH 減量，追蹤 anti-Xa','Argatroban、danaparoid 或 bivalirudin','以 warfarin INR 2–3 取代管路抗凝'],a:2,why:'ASH 建議 6.1（條件性、證據品質極低）。選擇受可得性、費用、肝功能與臨床經驗影響。區域 citrate 只建議用於亞急性或遠端 HIT；急性 HIT 需要全身抗凝，不適用（6.2 備註）。',wrong:['急性 HIT 必須停止 heparin，減量也不行。','LMWH 不是 HIT 的安全替代。','','急性期不開始 warfarin，也不能抗凝管路。'],s:['hit']},
{lv:'高階',q:'如何解讀透析 AF 的 RENAL-AF 與 AXADIA-AFNET 8？',o:['兩試驗人數過少，不足以判定 apixaban 與 VKA 的優劣','RENAL-AF 證明 apixaban 5 mg BID 出血少於 warfarin','AXADIA 證明 apixaban 2.5 mg BID 明顯減少中風與死亡','兩試驗已足以將 DOAC 列為透析 AF 首選並取得給付'],a:0,why:'RENAL-AF 154 人因收案困難提前終止，warfarin TTR 僅 44%，出血 32% vs 26%（HR 1.20，CI 0.63–2.30）。AXADIA 97 人，HR 0.93，未達非劣。台灣仿單對透析不建議 apixaban，健保排除 CrCl <15。',wrong:['','HR 1.20 且信賴區間很寬，沒有證明出血較少。','主要終點無顯著差異，也未達非劣。','證據不足，且與台灣仿單及健保不符。'],s:['renalaf','axadia','twEliquis','nhi']},
{lv:'高階',q:'CAD 病人支架後 3 個月，正在服 aspirin＋clopidogrel，CrCl 70。家屬問可否再加 rivaroxaban 2.5 mg BID？',o:['可以，COMPASS 的設計就是三種藥併用','可以，改 rivaroxaban 20 mg QD 再加 DAPT 更好','可以，只要 CrCl >15 就符合健保','目前不加：仿單與健保都排除併用 DAPT，完成後再評估'],a:3,why:'COMPASS 比較的是 rivaroxaban＋aspirin 與 aspirin 單用（4.1% vs 5.4%，重大出血 3.1% vs 1.9%）。台灣仿單指出不適合與 DAPT 併用，健保也不得合併。',wrong:['COMPASS 的方案是 rivaroxaban 2.5 mg BID＋aspirin，沒有 clopidogrel。','無適應症，出血風險也高。','腎功能只是其中一項條件。',''],s:['compass','twXarelto25','nhi']},
{lv:'高階',q:'轉移性胃癌合併近端 DVT，腫瘤仍在，近期無出血。依 ASH 2021，下列何者較正確？',o:['Warfarin 優於 LMWH，應為首選','Apixaban、rivaroxaban 或 LMWH 都可起始，胃腸癌用 DOAC 要謹慎','DOAC 在癌症病人禁用，只能用 LMWH','Edoxaban 可直接口服起始，不需先注射'],a:1,why:'建議 20：起始 apixaban、rivaroxaban 或 LMWH；建議 23：3–6 個月 DOAC 優於 LMWH；備註：胃腸癌與上消化道切除者用 DOAC 要謹慎。Caravaggio 重大出血 3.8% vs 4.0%。',wrong:['建議 25 是 LMWH 優於 VKA。','','DOAC 是 ASH 建議的選項。','Edoxaban 未核准用於起始期，須先注射至少 5 天。'],s:['cancer','caravaggio','twLixiana']}
];
/*QUIZ-END*/
/*MAP-START*/
const MIND={root:'抗栓處方決策',left:[
{t:'先排除',sub:'不進常規處方',k:'stop',leaves:['活動性重大出血 → 急救、止血、逆轉評估','休克／不穩定 PE 或 ACS → 急症團隊','新發神經症狀 → 先做腦部影像','急性 HIT → 停所有 heparin，改非 heparin','孕期＋機械瓣膜／中重度 MS → 專科團隊','Child-Pugh C／明顯凝血異常、既往 HIT → 個別審查','通路震顫消失 → 通路團隊，不是加藥']},
{t:'評估病人',sub:'每一項都會改劑量',k:'look',leaves:['CrCl（Cockcroft–Gault，實際體重）','CHA₂DS₂-VA：不計性別；65–74 歲 +1、≥75 歲 +2','瓣膜：機械瓣膜、中重度二尖瓣狹窄','肝功能 Child-Pugh、HIT、APS、孕期','出血史、顱內出血、中風／TIA、心衰竭','併用藥：P-gp／CYP3A 抑制劑與誘導劑、NSAIDs']},
{t:'藥物禁區',sub:'看到就換藥',k:'warn',leaves:['DOAC ✕ 機械瓣膜、中重度 MS、高風險 APS、孕期','所有 DOAC ✕ 強效誘導劑（rifampin 等）','Dabigatran ✕ CrCl <30','Rivaroxaban ✕ Child-Pugh B／C','Ticagrelor ✕ 曾顱內出血','Prasugrel ✕ 中風／TIA 病史（台灣為警語）','Cilostazol ✕ 心衰竭','Clopidogrel ✕ omeprazole／esomeprazole','Aspirin／DAPT ≠ AF 抗凝']},
{t:'AF 風險分層',sub:'CHA₂DS₂-VA',k:'look',go:'af',leaves:['0 分：不需常規抗凝，定期重評','1 分：可考慮抗凝，共同決策','≥2 分：建議口服抗凝','健保：≥75 歲；65–74 歲合併 DM／HTN／CAD；中風；心衰竭（NYHA ≥II 或 LVEF <40%）','Rivaroxaban 另可給付 50–74 歲合併 DM／HTN／CAD']}
],right:[
{t:'AF 劑量',sub:'每個藥的減量規則不同',k:'dose',go:'af',leaves:['<b>Apixaban 5 mg BID</b>；≥2 項（≥80 歲、≤60 kg、SCr ≥1.5）或 CrCl 15–29 → <b>2.5 mg BID</b>','<b>Edoxaban 60 mg QD</b>；CrCl 15–50、≤60 kg 或 P-gp 抑制劑 → <b>30 mg QD</b>','<b>Rivaroxaban 15–20 mg QD</b>；CrCl 15–50 → <b>10–15 mg QD</b>，隨餐','<b>Dabigatran 150 mg BID</b>；≥80 歲或出血風險 → <b>110 mg BID</b>','透析／CrCl <15：個別決定；warfarin，或仿單外 apixaban','合併 PCI：OAC＋clopidogrel，aspirin 僅短期，12 個月後單用 OAC']},
{t:'急性 VTE',sub:'起始方式要分清',k:'dose',go:'vte',leaves:['<b>Apixaban 10 mg BID ×7 天 → 5 mg BID</b>','<b>Rivaroxaban 15 mg BID ×21 天 → 20 mg QD</b>','Edoxaban、dabigatran：先注射抗凝 ≥5 天','暫時性誘因 3 個月；持續性 ≥3 個月再評估延長','癌症：DOAC 或 LMWH，胃腸癌用 DOAC 謹慎','孕期：<b>Enoxaparin 1 mg/kg q12h</b>','透析、AKI、CrCl <30：<b>UFH</b> 起始轉 warfarin']},
{t:'VTE 預防',sub:'預防劑量 ≠ 治療劑量',k:'dose',go:'prevent',leaves:['內科／外科：<b>Enoxaparin 40 mg QD</b>','透析／CrCl <30：<b>UFH 5,000 U SC q8–12h</b> 優先；enoxaparin 30 mg QD 為替代','關節置換：無 VTE 史首選 <b>Enoxaparin 30 mg QD</b>（健保）','曾有症狀性 VTE：<b>Rivaroxaban 10 mg QD</b>（髖 5 週、膝 2 週）','Apixaban 骨科預防：台灣未核准','高出血風險：先用 IPC']},
{t:'ACS／PCI',sub:'DAPT 要寫結束日',k:'dose',go:'acs',leaves:['Aspirin ＋ <b>ticagrelor 90 mg BID</b> 為預設','出血風險高或顱內出血史 → <b>clopidogrel 75 mg QD</b>','<b>Prasugrel 20 mg → 3.75 mg QD</b>（台灣）','預設 12 個月；健保 ticagrelor／clopidogrel 合併最長 9 個月','另需口服抗凝 → OAC＋clopidogrel']},
{t:'CAD／PAD 血管保護',sub:'低劑量 ≠ 抗凝劑量',k:'dose',go:'cadpad',leaves:['<b>Rivaroxaban 2.5 mg BID ＋ aspirin 100 mg QD</b>','不併 DAPT、P2Y12、cilostazol、其他抗凝','避開：出血性／腔隙性中風、1 個月內中風、CrCl <30、Child-Pugh B／C','健保須符合高風險條件']},
{t:'非心源性中風／TIA',sub:'抗血小板',k:'dose',go:'stroke',leaves:['急性輕微中風／高風險 TIA：<b>clopidogrel＋aspirin ×21 天</b>','穩定期：<b>Aspirin 75–100 mg QD</b> 或 clopidogrel 75 mg QD','發現 AF、機械瓣膜 → 改走抗凝路徑']},
{t:'機械瓣膜／APS',sub:'只有 warfarin',k:'dose',leaves:['機械二尖瓣 <b>INR 3.0</b>（2.5–3.5）','機械主動脈瓣 <b>INR 2.5</b>；合併 AF 等風險 <b>INR 3.0</b>','AF＋中重度 MS、高風險 APS：<b>INR 2.5</b>（2–3）','Warfarin 起始 2–5 mg／日，不用負荷劑量']},
{t:'透析與通路',sub:'三種目的分開看',k:'dose',go:'dialysis',leaves:['管路抗凝、通路通暢、全身抗凝是不同目的','INR 達標：考慮減少或省略透析 heparin，無換算公式','高出血風險：無 heparin 或區域抗凝','成熟 AVF／AVG：不常規加全身抗栓','新建 AVG：可考慮 dipyridamole＋低劑量 aspirin','取栓後 apixaban 2.5 mg BID：試驗證據，不外推']}
]};
/*MAP-END*/
// Resolve source keys used in the content above to SOURCES indices.
const TSRC=k=>typeof k==='number'?k:k==='clop'?IX_SOURCES.clopidogrel:k in TS?TS[k]:RX_SRC[k];
if(typeof module!=='undefined')module.exports={DEMOS,EXAM,MIND};
