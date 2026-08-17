"use client";
import React, { useState, useEffect } from 'react';
import liff from '@line/liff';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客戶端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NeuroVisionLiffApp() {
  const [isLiffInit, setIsLiffInit] = useState(false);
  const [lineUserId, setLineUserId] = useState<string | null>(null);
  
  const [viewState, setViewState] = useState<'macro' | 'micro' | 'rpe-zone'>('macro');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [activeMacroPart, setActiveMacroPart] = useState('');
  const [activeRPEFunc, setActiveRPEFunc] = useState('photo');
  const [selectedNutrient, setSelectedNutrient] = useState('');
  const [showReferences, setShowReferences] = useState(false);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (liffId) {
      liff.init({ liffId })
        .then(() => {
          setIsLiffInit(true);
          if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
              setLineUserId(profile.userId);
            }).catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, []);

  // 記錄使用者行為至 Supabase (nbm_eyecare_analytics)
  const logEvent = async (eventType: string, eventTarget: string) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) return;
      await supabase.from('nbm_eyecare_analytics').insert([
        {
          line_user_id: lineUserId || 'anonymous',
          event_type: eventType,
          event_target: eventTarget
        }
      ]);
    } catch (error) {
      console.error('Analytics log error:', error);
    }
  };

  const symptomData = [
    { symptom: '乾澀、刺痛、異物感、畏光', diseases: [{ name: '乾眼症', parts: ['角膜與結膜'] }, { name: '葡萄膜炎', parts: ['葡萄膜', '視網膜色素上皮細胞(RPE)'] }] },
    { symptom: '眼睛太累且視力變模糊', diseases: [{ name: '睫狀肌過勞 (視覺疲勞)', parts: ['前房與睫狀體'] }, { name: '黃斑部早期退化', parts: ['黃斑部', '視網膜色素上皮細胞(RPE)'] }] },
    { symptom: '眼前有黑影飄動、閃光感', diseases: [{ name: '飛蚊症', parts: ['玻璃體', '視網膜'] }, { name: '玻璃體後剝離', parts: ['玻璃體', '視網膜'] }, { name: '視網膜剝離', parts: ['視網膜', '視網膜色素上皮細胞(RPE)', '玻璃體'] }] },
    { symptom: '視力急遽模糊、周邊視野缺損', diseases: [{ name: '青光眼', parts: ['視神經', '前房與睫狀體'] }, { name: '糖尿病出血型視網膜病變', parts: ['視網膜微血管', '視網膜'] }, { name: '視網膜變性', parts: ['視網膜', '視網膜色素上皮細胞(RPE)'] }, { name: '缺血性視神經病變', parts: ['視神經'] }, { name: '視神經炎', parts: ['視神經'] }] },
    { symptom: '視野中央出現暗點、直線變扭曲', diseases: [{ name: '黃斑部病變 (AMD)', parts: ['黃斑部', '視網膜色素上皮細胞(RPE)'] }, { name: '黃斑部水腫', parts: ['黃斑部'] }, { name: '黃斑部皺褶', parts: ['黃斑部', '玻璃體'] }] }
  ];

  const partsData: Record<string, any> = {
    '視網膜色素上皮細胞(RPE)': {
      principle: 'RPE 係由單層細胞構成，緊密排列於視網膜感光受器與脈絡膜血管間，對於機械性及代謝性支持感光受器扮演極重要角色[cite: 1, 2]。它是視覺系統最關鍵的「物流中心與清道夫」。',
      causes: '當遭遇老化、缺血或氧化壓力時，RPE 內產生的活性氧族群(ROS)會嚴重損傷 RPE 細胞結構。RPE 一旦失去極性或脫離（如視網膜剝離），將引發上皮間質轉化(EMT)，這是引發老年性黃斑部病變(AMD)、增殖性玻璃體視網膜病變(PVR)及神經元壞死的早期致命關鍵[cite: 1, 2, 4]。',
      nutrients: ['異戊二烯類黃酮(Propolins)']
    },
    '視神經': {
      principle: '由百萬根微小的神經節細胞軸突構成，負責將視網膜的電子訊號精準傳遞至大腦視覺皮層。',
      causes: '常見四大機轉：\n1. 青光眼 (Glaucoma)：因眼壓過高或其他因素壓迫、傷害視神經，導致周邊視野逐漸狹窄，若未控制可能導致失明[cite: 1]。\n2. 缺血性視神經病變 (視神經中風)：多見於 60 歲以上且有高血壓、糖尿病等三高問題的族群，會造成無痛的突發性視力衰減或視野缺損[cite: 1, 2]。\n3. 視神經炎 (Optic Neuritis)：視神經發炎或脫髓鞘病變，常見於 20 至 50 歲女性。患者常有視力減退、視野缺損及眼球轉動時的疼痛感[cite: 1, 2, 3]。\n4. 視神經萎縮 (Optic Atrophy)：為多種視神經受損（如發炎、缺血、腫瘤壓迫、外傷或遺傳）惡化後的最終結果，會造成永久性的視力與視野障礙[cite: 1, 2]。',
      nutrients: ['異戊二烯類黃酮(Propolins)', '維生素B1、B12、葉酸']
    },
    '視網膜': {
      principle: '眼球內壁極為脆弱的多層感光神經組織。視網膜必須「緊密貼附」下方的 RPE 才能獲得養分並存活。',
      causes: '長期高血糖會破壞內層微血管（糖尿病視網膜病變）；若因外力拉扯而脫離 RPE（視網膜剝離），感光細胞將在短時間內迅速因飢餓與缺氧而壞死。',
      nutrients: ['異戊二烯類黃酮(Propolins)', 'DHA', '維生素 A / β-胡蘿蔔素', '維生素C、維生素E', '鋅']
    },
    '黃斑部': {
      principle: '位於視網膜正中央的凹陷區，是錐狀感光細胞密度最高的區域，決定我們看細節與顏色的核心視力。',
      causes: '老化、藍光傷害，或下方 RPE 屏障受損導致新生脈絡膜血管(CNV)長入，會引發嚴重的黃斑部水腫與眼底出血[cite: 1, 2]。',
      nutrients: ['葉黃素與玉米黃素', '異戊二烯類黃酮(Propolins)', '鋅']
    },
    '玻璃體': {
      principle: '充填於眼球中央的透明膠狀物質，維持眼球立體形狀，主要由水分、膠原蛋白與玻尿酸組成。',
      causes: '隨年齡增長會液化、萎縮，產生懸浮雜質（飛蚊症），嚴重時會異常拉扯視網膜，導致視網膜剝離或黃斑部皺褶。',
      nutrients: ['維生素C、維生素E']
    },
    '角膜與結膜': {
      principle: '眼球最前方的無血管透明屈光介質（角膜）與保護黏膜（結膜）。',
      causes: '淚液的脂質層或水層分泌不足，或遭受外界長期刺激，會導致表面乾燥、發炎與破皮（乾眼症）。',
      nutrients: ['Omega-3 (EPA, DHA)', '維生素 A / β-胡蘿蔔素']
    },
    '葡萄膜': {
      principle: '包含虹膜、睫狀體與脈絡膜，富含微血管，是眼球內部的超級供血網，特別是供應 RPE 與感光層大量氧氣與養分。',
      causes: '自體免疫異常或感染導致發炎(葡萄膜炎)，會嚴重影響 RPE 的屏障功能與感光細胞的血氧供應[cite: 1, 2]。',
      nutrients: ['Omega-3 (EPA, DHA)', '異戊二烯類黃酮(Propolins)']
    },
    '葡萄膜(虹膜/睫狀體/脈絡膜)': {
      principle: '包含虹膜、睫狀體與脈絡膜，富含微血管，是眼球內部的超級供血網，特別是供應 RPE 與感光層大量氧氣與養分。',
      causes: '自體免疫異常或感染導致發炎(葡萄膜炎)，會嚴重影響 RPE 的屏障功能與感光細胞的血氧供應[cite: 1, 2]。',
      nutrients: ['Omega-3 (EPA, DHA)', '異戊二烯類黃酮(Propolins)']
    },
    '視網膜微血管': {
      principle: '穿梭於視網膜內層的神經供血網絡，負責維持神經元代謝所需的氧氣。',
      causes: '糖尿病等慢性高血糖環境會破壞血管內皮，導致微血管瘤、滲漏或增殖性大出血。',
      nutrients: ['維生素C、維生素E']
    },
    '前房與睫狀體': {
      principle: '睫狀體負責分泌房水並調節水晶體焦距；水晶體負責聚焦光線；房水流經前房為無血管組織提供營養並維持眼壓。',
      causes: '長時間近距離盯螢幕會導致睫狀肌痙攣疲勞，造成視力模糊與眼睛酸澀。此外，若房水排出管道受阻會導致眼內壓異常飆高，機械性壓迫後方視神經造成青光眼[cite: 1, 2]。',
      nutrients: ['蝦紅素 (Astaxanthin)', '異戊二烯類黃酮(Propolins)']
    }
  };

  const rpeFunctions = [
    { id: 'transport', name: '雙向主動運輸與營養補給', desc: 'RPE 位於感光層與血液之間，具備極高的細胞極性。它能選擇性地將脈絡膜微血管的葡萄糖、視黃醇及維生素A 運送至感光細胞，同時將水份與代謝離子向外排出。', relation: 'RPE 是養分進入黃斑部的「唯一海關」！若 RPE 運輸功能當機或發生視網膜剝離，你「吃再多葉黃素也無法送達黃斑部」，等於完全無效吸收。' },
    { id: 'photo', name: '感光細胞外節吞噬與支持', desc: '為了維持視覺光轉導機制，RPE 必須以每天吞噬 25,000 至 30,000 個圓盤的速度，不斷清除並更新感光細胞脫落的受損外段(Outer Segments)。', relation: '一旦失去 RPE 的清道夫與養分支持，上層的神經「感光細胞將在短時間內大量凋亡壞死」[cite: 1, 2]，造成不可逆的視力喪失。' },
    { id: 'lipo', name: '脂褐質廢物代謝', desc: 'RPE 擁有強大的溶酶體系統，負責消化老化細胞的廢棄蛋白質與脂質。', relation: '當 RPE 失去極性或代謝能力下降，未能清除的廢物會變成劇毒的「脂褐質 (Lipofuscin)」與隱結 (Drusen)，在眼底大量暴增，直接毒殺周圍的感光細胞。' },
    { id: 'antiox', name: '眼底抗氧化與光吸收', desc: '細胞內的 RPE 黑色素顆粒負責吸收未被感光細胞捕獲的散射光，並分泌多種抗氧化酵素，抵抗由高能光線或代謝衍生的巨大活性氧族群(ROS)壓力[cite: 1, 2]。', relation: '當抗氧化防線崩潰，ROS 會引起一連串細胞發炎與蛋白質錯誤折疊，這是 AMD 及視網膜病變發展的「早期致命」關鍵事件[cite: 1, 2, 4]。' },
    { id: 'structure', name: '血-視網膜屏障與結構穩定', desc: 'RPE 細胞間透過緊密連接 (Tight Junctions) 構成外層血視網膜屏障，並分泌生長因子(如 PEDF) 與細胞外基質(ECM)維持微環境的穩定[cite: 4]。', relation: '若此緊密屏障破裂，會誘發上皮間質轉化(EMT)，使 RPE 細胞喪失功能並遷移，成為新生脈絡膜血管(CNV)長入視網膜下腔的入口，引發眼底大出血的濕性 AMD[cite: 1, 2, 4]。此外，當 RPE 細胞間的緊密連接與微環境調節機制被破壞時，也會顯著增加視網膜剝離的風險[cite: 4]。' }
  ];

  const nutrientsData = [
    { name: '異戊二烯類黃酮(Propolins)', targets: ['視網膜色素上皮細胞(RPE)', '視神經', '視網膜', '黃斑部', '葡萄膜', '前房與睫狀體'], desc: '醫學專利實證指出，含有式(A)的異戊二烯類黃酮化合物能有效提高遭受氧化壓力及缺氧誘導損傷的 RPE 細胞存活率，反轉 RPE 損傷，維持其屏障功能[cite: 1, 2]。同時能顯著抑制脈絡膜血管新生(CNV)[cite: 1, 2]；於低密度下顯著增加神經細胞存活率，促進神經細胞生長與分支，具備誘導神經幹細胞分化之潛力[cite: 3]。亦能增加眼部血流量，促進缺血性損傷後的視網膜神經功能恢復[cite: 1, 2]。' },
    { name: '蝦紅素 (Astaxanthin)', targets: ['前房與睫狀體', '視網膜微血管'], desc: '具備極強的抗氧化能力，能顯著增加睫狀肌的微血管血流量，提升水晶體調節力，舒緩深層視覺疲勞與視力模糊。' },
    { name: '維生素 A / β-胡蘿蔔素', targets: ['角膜與結膜', '視網膜'], desc: '參與視紫質形成並維持眼表上皮。缺乏時可能先出現夜盲，嚴重時可導致乾眼與角膜損傷。β-胡蘿蔔素是維生素A前驅物。' },
    { name: 'DHA', targets: ['視網膜'], desc: 'DHA 在視網膜含量很高，是感光細胞膜的重要結構成分，具有生理結構角色。' },
    { name: '維生素C、維生素E', targets: ['水晶體', '視網膜', '玻璃體', '視網膜微血管'], desc: '屬抗氧化營養素；與其他成分組成 AREDS2 配方時，可延緩特定程度之 AMD 惡化。維持玻璃體內膠原蛋白穩定。' },
    { name: '維生素B1、B12、葉酸', targets: ['視神經'], desc: '主要作用是避免缺乏，嚴重缺乏可能造成營養性視神經病變。' },
    { name: '鋅', targets: ['視網膜', '黃斑部'], desc: '視網膜含有較高濃度的鋅；在完整 AREDS2 配方中，可延緩特定程度 AMD 惡化。' },
    { name: '葉黃素與玉米黃素', targets: ['黃斑部'], desc: '構成黃斑色素，與中央視力、辨色及對比敏感度有關。在 AREDS2 研究中，用於特定程度 AMD 患者。前提是下方 RPE 運輸功能正常方能吸收。' },
    { name: 'Omega-3 (EPA, DHA)', targets: ['角膜與結膜', '淚膜', '葡萄膜'], desc: '可能影響發炎與淚膜油脂層，對乾眼症治療有輔助參考作用。' }
  ];

  const referencesList = [
    { type: 'paper', title: "Role of Epithelial-Mesenchymal Transition in Retinal Pigment Epithelium Dysfunction", journal: "Frontiers in Cell and Developmental Biology", year: "2020", authors: "Mi Zhou, Jasmine S. Geathers, Stephanie L. Grillo, et al." },
    { type: 'paper', title: "Directional protein secretion by the retinal pigment epithelium: roles in retinal health and the development of age-related macular degeneration", journal: "Journal of Cellular and Molecular Medicine", year: "2013", authors: "Paul Kay, Yit C. Yang, Luminita Paraoan" },
    { type: 'paper', title: "Lutein + Zeaxanthin and Omega-3 Fatty Acids for Age-Related Macular Degeneration: The Age-Related Eye Disease Study 2 (AREDS2) Randomized Clinical Trial", journal: "JAMA (美國醫學會雜誌)", year: "2013", authors: "The AREDS2 Research Group (NIH / NEI)" },
    { type: 'paper', title: "n−3 Fatty Acid Supplementation for the Treatment of Dry Eye Disease (DREAM Study)", journal: "The New England Journal of Medicine (新英格蘭醫學雜誌)", year: "2018", authors: "The DREAM Study Research Group (NIH / NEI)" },
    { type: 'paper', title: "Effects of astaxanthin on accommodation, critical flicker fusion, and pattern visual evoked potential in visual display terminal workers", journal: "Journal of Traditional Medicines", year: "2002", authors: "Iwasaki N., et al." },
    { type: 'patent', title: "中華民國發明專利第 105105744 號〈用於治療眼疾的化合物〉", desc: "揭示含有 Propolin G 等化合物對提升 RPE 存活與抗發炎之保護機轉。" },
    { type: 'patent', title: "台灣綠蜂膠萃取物眼疾專利", desc: "含 Propolin C, D, F, G 之標準化萃取物及 RPE 相關前臨床實證資料。" },
    { type: 'guideline', title: "美國國衛院 (NIH) 膳食補充品辦公室衛教指南", desc: "維生素 A、Omega-3、鋅於眼部生理之作用與建議劑量評估。" },
    { type: 'guideline', title: "默沙東診療手冊 (Merck Manuals): 營養性與毒性視神經病變", desc: "闡述維生素 B1、B12 及葉酸缺乏與視神經病變之醫學關聯性。" }
  ];

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setViewState('macro');
    setActiveMacroPart('');
    logEvent('select_symptom', symptom);
  };

  const handlePartClick = (partName: string) => {
    if (partsData[partName] || partName === '視網膜色素上皮細胞(RPE)') {
      setActiveMacroPart(partName);
      setViewState('micro');
      logEvent('click_part', partName);
    }
  };

  const Medical3DGradients = () => (
    <defs>
      <radialGradient id="eyeballRealistic" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="60%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>
      <radialGradient id="vitreousGel" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.15" />
        <stop offset="80%" stopColor="#7dd3fc" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
      </radialGradient>
      <radialGradient id="lensRealistic" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
      </radialGradient>
      <linearGradient id="retinaTissue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="rpePigment" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="choroidVessels" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7e22ce" />
        <stop offset="50%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>
      <linearGradient id="nerveBundle" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <filter id="medicalGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="medicalShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.6"/>
      </filter>
      <filter id="innerShadow">
        <feOffset dx="0" dy="0"/>
        <feGaussianBlur stdDeviation="4" result="offset-blur"/>
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
        <feFlood floodColor="black" floodOpacity="0.5" result="color"/>
        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
      </filter>
    </defs>
  );

  const RpeInteractiveGraphic = () => (
    <svg viewBox="0 0 400 280" className="w-full h-full drop-shadow-2xl">
      <Medical3DGradients />
      <defs>
        <linearGradient id="photo3D" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ca8a04"/><stop offset="50%" stopColor="#fef08a"/><stop offset="100%" stopColor="#a16207"/>
        </linearGradient>
        <radialGradient id="rpeCell3D" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fb7185"/><stop offset="100%" stopColor="#9f1239"/>
        </radialGradient>
      </defs>
      
      <path d="M 0 240 Q 200 260 400 240 L 400 280 L 0 280 Z" fill="url(#choroidVessels)" opacity="0.9" filter="url(#medicalShadow)"/>
      <text x="20" y="265" fill="#fca5a5" fontSize="14" fontWeight="bold" filter="url(#medicalGlow)">脈絡膜血管網</text>
      
      <path d="M 0 230 Q 200 250 400 230" fill="none" stroke="#fcd34d" strokeWidth="8" opacity="0.9" filter="url(#medicalShadow)"/>
      <path d="M 0 228 Q 200 248 400 228" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5"/>
      
      <path d="M 10 160 Q 200 180 390 160 L 390 230 Q 200 250 10 230 Z" fill="url(#rpeCell3D)" filter="url(#innerShadow)"/>
      <path d="M 10 160 Q 200 180 390 160" fill="none" stroke="#fca5a5" strokeWidth="2" opacity="0.6"/>
      <circle cx="90" cy="200" r="14" fill="#4c0519" filter="url(#medicalShadow)"/><circle cx="85" cy="195" r="4" fill="#fff" opacity="0.1"/>
      <circle cx="200" cy="210" r="14" fill="#4c0519" filter="url(#medicalShadow)"/><circle cx="195" cy="205" r="4" fill="#fff" opacity="0.1"/>
      <circle cx="310" cy="200" r="14" fill="#4c0519" filter="url(#medicalShadow)"/><circle cx="305" cy="195" r="4" fill="#fff" opacity="0.1"/>
      
      <circle cx="230" cy="185" r="6" fill="#fef08a" filter="url(#medicalGlow)"/>
      <circle cx="242" cy="192" r="5" fill="#fef08a" filter="url(#medicalGlow)"/>
      <circle cx="235" cy="195" r="3" fill="#fcd34d" filter="url(#medicalGlow)"/>

      <path d="M 30 162 L 40 120 L 50 163 M 175 168 L 185 125 L 195 169 M 295 164 L 305 125 L 315 165" fill="none" stroke="url(#rpeCell3D)" strokeWidth="8" strokeLinecap="round" filter="url(#medicalShadow)"/>
      <path d="M 30 162 L 40 120 L 50 163 M 175 168 L 185 125 L 195 169 M 295 164 L 305 125 L 315 165" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

      <rect x="65" y="20" width="55" height="120" rx="12" fill="url(#photo3D)" filter="url(#medicalShadow)"/>
      <rect x="67" y="22" width="20" height="116" rx="8" fill="#fff" opacity="0.3"/>
      <rect x="170" y="25" width="55" height="120" rx="12" fill="url(#photo3D)" filter="url(#medicalShadow)"/>
      <rect x="172" y="27" width="20" height="116" rx="8" fill="#fff" opacity="0.3"/>
      <rect x="275" y="20" width="55" height="120" rx="12" fill="url(#photo3D)" filter="url(#medicalShadow)"/>
      <rect x="277" y="22" width="20" height="116" rx="8" fill="#fff" opacity="0.3"/>
      <text x="20" y="40" fill="#fff" fontSize="15" fontWeight="bold" filter="url(#medicalGlow)">視網膜感光層</text>

      <g transform="translate(130, 215)" onClick={() => { setActiveRPEFunc('transport'); logEvent('rpe_func', '主動運輸'); }} className="cursor-pointer hover:scale-110 transition-transform origin-center">
        <circle cx="0" cy="0" r="24" fill="#0ea5e9" opacity={activeRPEFunc==='transport'?'1':'0.5'} filter="url(#medicalGlow)" stroke="#fff" strokeWidth={activeRPEFunc==='transport'?2:0}/>
        <path d="M -6 6 L 0 -6 L 6 6 M 0 12 L 0 -6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <rect x="-35" y="30" width="70" height="22" fill="#0f172a" rx="6" opacity="0.8"/>
        <text x="0" y="45" fill="#bae6fd" fontSize="12" fontWeight="bold" textAnchor="middle">主動運輸</text>
      </g>
      
      <g transform="translate(200, 110)" onClick={() => { setActiveRPEFunc('photo'); logEvent('rpe_func', '外節吞噬'); }} className="cursor-pointer hover:scale-110 transition-transform origin-center">
        <circle cx="0" cy="0" r="24" fill="#8b5cf6" opacity={activeRPEFunc==='photo'?'1':'0.5'} filter="url(#medicalGlow)" stroke="#fff" strokeWidth={activeRPEFunc==='photo'?2:0}/>
        <circle cx="0" cy="0" r="7" fill="#fff"/>
        <rect x="25" y="-11" width="70" height="22" fill="#0f172a" rx="6" opacity="0.8"/>
        <text x="60" y="4" fill="#ddd6fe" fontSize="12" fontWeight="bold" textAnchor="middle">外節吞噬</text>
      </g>
      
      <g transform="translate(255, 185)" onClick={() => { setActiveRPEFunc('lipo'); logEvent('rpe_func', '廢物代謝'); }} className="cursor-pointer hover:scale-110 transition-transform origin-center">
        <circle cx="0" cy="0" r="24" fill="#eab308" opacity={activeRPEFunc==='lipo'?'1':'0.5'} filter="url(#medicalGlow)" stroke="#fff" strokeWidth={activeRPEFunc==='lipo'?2:0}/>
        <circle cx="-4" cy="-4" r="3" fill="#fff"/><circle cx="5" cy="5" r="4" fill="#fff"/>
        <rect x="25" y="-11" width="70" height="22" fill="#0f172a" rx="6" opacity="0.8"/>
        <text x="60" y="4" fill="#fef08a" fontSize="12" fontWeight="bold" textAnchor="middle">廢物代謝</text>
      </g>
      
      <g transform="translate(85, 150)" onClick={() => { setActiveRPEFunc('antiox'); logEvent('rpe_func', '抗氧化'); }} className="cursor-pointer hover:scale-110 transition-transform origin-center">
        <circle cx="0" cy="0" r="24" fill="#10b981" opacity={activeRPEFunc==='antiox'?'1':'0.5'} filter="url(#medicalGlow)" stroke="#fff" strokeWidth={activeRPEFunc==='antiox'?2:0}/>
        <path d="M -9 0 L 0 -9 L 9 0 L 0 9 Z" fill="#fff"/>
        <rect x="-85" y="-11" width="60" height="22" fill="#0f172a" rx="6" opacity="0.8"/>
        <text x="-55" y="4" fill="#a7f3d0" fontSize="12" fontWeight="bold" textAnchor="middle">抗氧化</text>
      </g>
      
      <g transform="translate(280, 240)" onClick={() => { setActiveRPEFunc('structure'); logEvent('rpe_func', '結構屏障'); }} className="cursor-pointer hover:scale-110 transition-transform origin-center">
        <circle cx="0" cy="0" r="24" fill="#64748b" opacity={activeRPEFunc==='structure'?'1':'0.5'} filter="url(#medicalGlow)" stroke="#fff" strokeWidth={activeRPEFunc==='structure'?2:0}/>
        <path d="M -10 0 L 10 0 M -10 -6 L 10 -6 M -10 6 L 10 6" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
        <rect x="-35" y="-40" width="70" height="22" fill="#0f172a" rx="6" opacity="0.8"/>
        <text x="0" y="-25" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">結構屏障</text>
      </g>
    </svg>
  );

  const renderMicroSVG = (part: string) => {
    switch (part) {
      case '視網膜色素上皮細胞(RPE)':
        return <RpeInteractiveGraphic />;
      case '角膜與結膜':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-2xl">
            <Medical3DGradients />
            <path d="M 20 140 Q 150 -10 280 140" fill="none" stroke="#e0f2fe" strokeWidth="24" strokeLinecap="round" filter="url(#medicalShadow)"/>
            <path d="M 20 140 Q 150 -10 280 140" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9" filter="url(#medicalGlow)"/>
            <path d="M 40 120 Q 150 10 260 120" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.6"/>
            <text x="125" y="80" fill="#0f172a" fontSize="14" fontWeight="bold">透明基質層</text>
            <text x="130" y="55" fill="#0284c7" fontSize="12" fontWeight="bold">淚液/上皮層</text>
          </svg>
        );
      case '玻璃體':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full">
            <Medical3DGradients />
            <ellipse cx="150" cy="75" rx="130" ry="60" fill="url(#vitreousGel)" filter="url(#medicalShadow)"/>
            <path d="M 40 50 Q 100 10 150 50 T 260 70 M 60 90 Q 120 130 180 80 T 240 40 M 80 70 Q 150 90 200 60" fill="none" stroke="#e0f2fe" strokeWidth="2.5" opacity="0.7" filter="url(#medicalGlow)"/>
            <circle cx="100" cy="50" r="4" fill="#fff" opacity="0.9" filter="url(#medicalGlow)"/><circle cx="200" cy="90" r="3" fill="#fff" opacity="0.6"/>
            <text x="110" y="145" fill="#e0f2fe" fontSize="12" fontWeight="bold">立體玻尿酸與膠原纖維網</text>
          </svg>
        );
      case '視神經':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-2xl">
            <Medical3DGradients />
            <path d="M 40 20 C 120 15, 180 50, 280 50 L 280 130 C 180 130, 120 140, 40 135 Z" fill="url(#nerveBundle)" filter="url(#medicalShadow)"/>
            <path d="M 280 50 C 295 50, 295 130, 280 130 C 265 130, 265 50, 280 50 Z" fill="#fcd34d" opacity="0.8"/>
            <path d="M 40 40 C 120 35, 180 70, 280 70" fill="none" stroke="#fff" strokeWidth="3" opacity="0.9" filter="url(#medicalGlow)"/>
            <path d="M 40 60 C 120 55, 180 90, 280 90" fill="none" stroke="#fef08a" strokeWidth="2.5" opacity="0.8"/>
            <path d="M 40 80 C 120 75, 180 100, 280 100" fill="none" stroke="#fff" strokeWidth="3" opacity="0.9" filter="url(#medicalGlow)"/>
            <path d="M 40 100 C 120 95, 180 110, 280 110" fill="none" stroke="#fef08a" strokeWidth="2" opacity="0.7"/>
            <text x="60" y="75" fill="#451a03" fontSize="14" fontWeight="bold" style={{textShadow: '0px 1px 2px rgba(255,255,255,0.8)'}}>視網膜神經節細胞軸突</text>
          </svg>
        );
      case '黃斑部':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-xl">
            <Medical3DGradients />
            <path d="M 20 130 Q 150 130 280 130 L 280 150 L 20 150 Z" fill="url(#rpePigment)" filter="url(#innerShadow)"/>
            <path d="M 20 70 Q 100 70 120 110 Q 150 125 180 110 Q 200 70 280 70 L 280 130 L 20 130 Z" fill="url(#retinaTissue)" filter="url(#medicalShadow)"/>
            <circle cx="150" cy="115" r="18" fill="#fef08a" filter="url(#medicalGlow)" opacity="0.9"/>
            <path d="M 20 70 Q 100 70 120 110 Q 150 125 180 110 Q 200 70 280 70" fill="none" stroke="#fca5a5" strokeWidth="3" opacity="0.8"/>
            <text x="125" y="45" fill="#fecaca" fontSize="14" fontWeight="bold" filter="url(#medicalGlow)">黃斑中心凹 (Fovea)</text>
            <text x="85" y="145" fill="#fff" fontSize="11" fontWeight="bold">極高密度錐狀感光細胞 (發光區)</text>
          </svg>
        );
      case '視網膜':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-2xl">
            <Medical3DGradients />
            <rect x="30" y="20" width="240" height="30" fill="url(#vitreousGel)" rx="4"/>
            <rect x="30" y="50" width="240" height="45" fill="url(#retinaTissue)" filter="url(#medicalShadow)" rx="4"/>
            <path d="M 30 65 L 270 65 M 30 80 L 270 80" fill="none" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
            <rect x="30" y="95" width="240" height="25" fill="url(#rpePigment)" filter="url(#innerShadow)" rx="4"/>
            <rect x="30" y="120" width="240" height="30" fill="url(#choroidVessels)" rx="4"/>
            <text x="120" y="40" fill="#0284c7" fontSize="12" fontWeight="bold">玻璃體接觸面</text>
            <text x="105" y="78" fill="#fff" fontSize="15" fontWeight="bold" filter="url(#medicalGlow)">視網膜多層感光組織</text>
            <text x="110" y="112" fill="#fff" fontSize="11" fontWeight="bold">RPE 單層色素上皮</text>
            <text x="125" y="140" fill="#e9d5ff" fontSize="12" fontWeight="bold">脈絡膜微血管層</text>
          </svg>
        );
      case '視網膜微血管':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full">
            <Medical3DGradients />
            <rect x="20" y="20" width="260" height="110" fill="#0f172a" rx="15" filter="url(#innerShadow)"/>
            <path d="M 30 85 Q 100 10 150 85 T 270 85" fill="none" stroke="#ef4444" strokeWidth="8" filter="url(#medicalShadow)" strokeLinecap="round"/>
            <path d="M 150 85 Q 200 130 250 120" fill="none" stroke="#3b82f6" strokeWidth="6" filter="url(#medicalGlow)" strokeLinecap="round"/>
            <path d="M 80 50 Q 100 80 120 70 M 180 70 Q 210 40 230 60" fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.9" strokeLinecap="round" filter="url(#medicalShadow)"/>
            <circle cx="210" cy="50" r="5" fill="#fca5a5" filter="url(#medicalGlow)"/>
            <text x="100" y="145" fill="#cbd5e1" fontSize="13" fontWeight="bold">緊密的網狀微血管供應系統</text>
          </svg>
        );
      case '葡萄膜':
      case '葡萄膜(虹膜/睫狀體/脈絡膜)':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-xl">
            <Medical3DGradients />
            <path d="M 20 75 Q 150 10 280 75 L 280 120 Q 150 65 20 120 Z" fill="url(#choroidVessels)" filter="url(#medicalShadow)"/>
            <path d="M 20 75 Q 150 10 280 75" fill="none" stroke="#e9d5ff" strokeWidth="3" opacity="0.8" filter="url(#medicalGlow)"/>
            <path d="M 50 65 Q 60 90 70 80 M 140 40 Q 150 80 160 70 M 230 60 Q 240 100 250 80" fill="none" stroke="#fca5a5" strokeWidth="4" opacity="0.6" strokeLinecap="round"/>
            <text x="80" y="140" fill="#d8b4fe" fontSize="13" fontWeight="bold">提供眼球最高血流量的脈絡膜網</text>
          </svg>
        );
      case '前房與睫狀體':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full">
            <Medical3DGradients />
            <path d="M 120 20 Q 260 75 120 130 Q 60 75 120 20" fill="url(#vitreousGel)" stroke="#bae6fd" strokeWidth="2" filter="url(#medicalGlow)"/>
            <path d="M 140 40 C 160 20, 180 40, 160 60 Z M 140 110 C 160 130, 180 110, 160 90 Z" fill="#c084fc" filter="url(#medicalShadow)"/>
            <path d="M 160 60 Q 180 75 160 90" fill="none" stroke="#d8b4fe" strokeWidth="4" strokeDasharray="3 3"/>
            <text x="40" y="80" fill="#bae6fd" fontSize="14" fontWeight="bold" style={{textShadow: '0px 1px 2px #000'}}>房水 (前房)</text>
            <text x="180" y="35" fill="#e879f9" fontSize="12" fontWeight="bold">睫狀體/水晶體</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      <header className="sticky top-0 z-50 bg-slate-900 text-white p-4 shadow-xl border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-wider text-sky-400 flex items-center gap-2">
          <span className="text-2xl">👁️</span> 彥臣生技專屬眼部衛教保健網站
        </h1>
      </header>

      <main className="p-4 space-y-6 max-w-2xl mx-auto">
        
        {/* === 第一區：症狀與病症 === */}
        <section className="bg-white p-5 rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full opacity-50 -mr-10 -mt-10 blur-3xl"></div>
          <label className="block text-slate-800 font-extrabold mb-3 text-base">
            1. 您感受到哪種不舒服的症狀？
          </label>
          <div className="relative mb-4">
            <select 
              className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-700 font-bold appearance-none outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 shadow-inner transition-all"
              value={selectedSymptom}
              onChange={(e) => handleSymptomSelect(e.target.value)}
            >
              <option value="">-- 請點選目前發生的症狀 --</option>
              {symptomData.map((data, idx) => (
                <option key={idx} value={data.symptom}>{data.symptom}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sky-500 text-lg">▼</div>
          </div>

          {selectedSymptom && (
            <div className="pt-4 border-t-2 border-slate-100 animate-in fade-in slide-in-from-top-2">
              <span className="text-xs text-slate-400 font-extrabold block mb-3 tracking-widest uppercase">可能引發的眼疾與牽涉部位：</span>
              <div className="space-y-3">
                {symptomData.find(s => s.symptom === selectedSymptom)?.diseases.map((disease, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="font-bold text-slate-800 mb-3 text-[15px] border-l-4 border-sky-500 pl-2">{disease.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {disease.parts.map(part => (
                        <button 
                          key={part} onClick={() => handlePartClick(part)}
                          className="bg-white border border-slate-300 text-sky-700 px-4 py-2 text-xs font-bold rounded-xl shadow-sm active:scale-95 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                        >
                          🔍 {part}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* === 第二區：互動圖表 (Macro / Micro / RPE) === */}
        <section>
          {viewState === 'macro' && (
            <div className="animate-in fade-in slide-in-from-bottom-6">
              <h2 className="text-lg font-extrabold text-slate-800 mb-2">2. 醫學級 3D 眼球結構透視</h2>
              <p className="text-xs text-slate-500 mb-4 font-medium">點擊上方病症的按鈕，或直接觸控下方 3D 模型與標籤進入組織放大解析。</p>
              
              <div className="w-full aspect-square bg-[#0f172a] rounded-[2rem] p-4 shadow-2xl relative flex items-center justify-center mb-6 overflow-hidden border-4 border-slate-800">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sky-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl z-10">
                  <Medical3DGradients />
                  <circle cx="150" cy="150" r="95" fill="url(#eyeballRealistic)" filter="url(#medicalShadow)" />
                  <path d="M 80 90 A 70 70 0 0 1 200 70" fill="none" stroke="#fff" strokeWidth="6" opacity="0.4" strokeLinecap="round" filter="url(#medicalGlow)"/>
                  
                  <circle cx="150" cy="150" r="78" fill="url(#vitreousGel)" onClick={() => handlePartClick('玻璃體')} className="cursor-pointer hover:opacity-70 transition-opacity" filter="url(#innerShadow)"/>
                  
                  <path d="M 238 132 C 275 130, 285 145, 295 150 C 285 175, 275 170, 238 168 Z" fill="url(#nerveBundle)" onClick={() => handlePartClick('視神經')} className="cursor-pointer hover:brightness-125 transition-all" filter="url(#medicalShadow)"/>
                  <path d="M 238 145 C 265 145, 275 150, 290 150" fill="none" stroke="#fff" strokeWidth="2" opacity="0.6" filter="url(#medicalGlow)"/>

                  <path d="M 130 60 A 90 90 0 0 1 238 150 A 90 90 0 0 1 130 240" fill="none" stroke="url(#retinaTissue)" strokeWidth="7" strokeLinecap="round" onClick={() => handlePartClick('視網膜')} className="cursor-pointer hover:brightness-125 transition-all" filter="url(#medicalShadow)"/>
                  
                  <circle cx="238" cy="150" r="8" fill="#fef08a" onClick={() => handlePartClick('黃斑部')} className="cursor-pointer hover:scale-110 transition-transform origin-center" filter="url(#medicalGlow)"/>

                  <path d="M 140 51 A 100 100 0 0 1 248 150 A 100 100 0 0 1 140 249" fill="none" stroke="url(#rpePigment)" strokeWidth="5" strokeLinecap="round" strokeDasharray="6 3" onClick={() => handlePartClick('視網膜色素上皮細胞(RPE)')} className="cursor-pointer hover:brightness-150 transition-all"/>

                  <path d="M 85 80 Q 50 150 85 220" fill="none" stroke="url(#choroidVessels)" strokeWidth="12" strokeLinecap="round" onClick={() => handlePartClick('葡萄膜(虹膜/睫狀體/脈絡膜)')} className="cursor-pointer hover:brightness-125 transition-all" filter="url(#medicalShadow)"/>

                  <ellipse cx="75" cy="150" rx="14" ry="40" fill="url(#lensRealistic)" onClick={() => handlePartClick('前房與睫狀體')} className="cursor-pointer hover:brightness-125 transition-all" filter="url(#medicalShadow)"/>

                  <path d="M 80 75 C 25 90, 15 120, 15 150 C 15 180, 25 210, 80 225" fill="none" stroke="#bae6fd" strokeWidth="10" strokeLinecap="round" onClick={() => handlePartClick('角膜與結膜')} className="cursor-pointer hover:brightness-125 transition-all"/>
                  <path d="M 75 80 C 35 95, 20 120, 20 145" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" filter="url(#medicalGlow)"/>
                  
                  <g opacity="0.95">
                    <g className="cursor-pointer hover:brightness-125 transition-all" onClick={() => handlePartClick('角膜與結膜')}>
                      <rect x="15" y="140" width="55" height="28" fill="#0f172a" rx="6" opacity="0.75"/>
                      <text x="25" y="159" fill="#bae6fd" fontSize="14" fontWeight="bold">角膜</text>
                    </g>
                    
                    <g className="cursor-pointer hover:brightness-125 transition-all" onClick={() => handlePartClick('前房與睫狀體')}>
                      <rect x="55" y="100" width="100" height="28" fill="#0f172a" rx="6" opacity="0.75"/>
                      <text x="65" y="119" fill="#7dd3fc" fontSize="14" fontWeight="bold">水晶體/睫狀體</text>
                    </g>

                    <g className="cursor-pointer hover:brightness-125 transition-all" onClick={() => handlePartClick('視神經')}>
                      <rect x="235" y="105" width="65" height="28" fill="#0f172a" rx="6" opacity="0.75"/>
                      <text x="245" y="124" fill="#fcd34d" fontSize="14" fontWeight="bold">視神經</text>
                    </g>
                    
                    <g className="cursor-pointer hover:brightness-125 transition-all" onClick={() => handlePartClick('黃斑部')}>
                      <rect x="235" y="165" width="65" height="28" fill="#0f172a" rx="6" opacity="0.75"/>
                      <text x="245" y="184" fill="#fef08a" fontSize="14" fontWeight="bold">黃斑部</text>
                    </g>
                    
                    <g className="cursor-pointer hover:brightness-125 transition-all" onClick={() => handlePartClick('視網膜')}>
                      <rect x="120" y="25" width="65" height="28" fill="#0f172a" rx="6" opacity="0.75"/>
                      <text x="130" y="44" fill="#fca5a5" fontSize="14" fontWeight="bold">視網膜</text>
                    </g>
                    
                    <g className="cursor-pointer hover:brightness-125 transition-all" onClick={() => handlePartClick('視網膜色素上皮細胞(RPE)')}>
                      <rect x="195" y="50" width="55" height="28" fill="#0f172a" rx="6" opacity="0.75"/>
                      <text x="205" y="69" fill="#fbbf24" fontSize="14" fontWeight="bold">RPE</text>
                    </g>
                  </g>
                </svg>
              </div>

              <button 
                onClick={() => { setActiveMacroPart('視網膜色素上皮細胞(RPE)'); setViewState('rpe-zone'); logEvent('click_rpe_zone_btn', 'direct_entry'); }}
                className="w-full bg-gradient-to-br from-amber-500 to-rose-600 text-white font-extrabold py-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(244,63,94,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all border-2 border-amber-300/50"
              >
                <span className="text-lg tracking-wide">進入 RPE 核心病理專區</span>
                <span className="animate-pulse bg-white/20 px-2 py-1 rounded-lg">➜</span>
              </button>
            </div>
          )}

          {viewState === 'micro' && activeMacroPart && partsData[activeMacroPart] && (
            <div className="animate-in fade-in slide-in-from-right-6">
              <button onClick={() => setViewState('macro')} className="mb-4 text-slate-600 font-bold text-sm flex items-center px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-200 active:bg-slate-50 transition-colors">
                <span className="mr-2">◀</span> 返回 3D 眼球全視角
              </button>
              
              <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-3">
                  <span className="bg-gradient-to-br from-sky-400 to-sky-600 text-white px-2.5 py-1 rounded-lg text-sm shadow-md">3D</span> 
                  {activeMacroPart} 組織解析
                </h3>
                
                <div className={`w-full ${activeMacroPart === '視網膜色素上皮細胞(RPE)' ? 'aspect-[4/3] p-2' : 'h-40'} bg-[#0f172a] rounded-2xl mb-6 flex items-center justify-center border border-slate-800 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)] overflow-hidden relative`}>
                  {renderMicroSVG(activeMacroPart)}
                </div>

                {activeMacroPart === '視網膜色素上皮細胞(RPE)' && (
                  <div className="mb-6 bg-rose-50/80 border-2 border-rose-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500 rounded-full opacity-10 blur-xl"></div>
                    <h4 className="font-extrabold text-rose-700 flex items-center gap-2 mb-3 text-base">
                      <span className="text-xl animate-bounce">🚨</span> 殘酷真相：RPE 罷工，保養全落空！
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-rose-900 font-medium space-y-2.5 text-justify">
                      <li><strong className="text-rose-700">吃再多葉黃素也無效：</strong>RPE 是養分的唯一運輸通道，屏障受損則葉黃素無法送達黃斑部。</li>
                      <li><strong className="text-rose-700">感光細胞迅速凋亡：</strong>失去 RPE 的支持，神經元感光細胞將因缺乏養分與氧氣而壞死[cite: 1, 2]。</li>
                      <li><strong className="text-rose-700">脂褐質毒性暴增：</strong>代謝當機會導致劇毒「脂褐質」在眼底暴增，直接毒殺視網膜。</li>
                    </ul>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[15px] flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></span> 結構與運作原理
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed text-justify bg-slate-50 p-4 rounded-xl border border-slate-100">{partsData[activeMacroPart].principle}</p>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[15px] flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span> 疾病誘發機制
                    </h4>
                    <div className="text-sm text-slate-600 leading-relaxed text-justify bg-rose-50/50 p-4 rounded-xl border border-rose-100 whitespace-pre-line">
                      {partsData[activeMacroPart].causes}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
                    <h4 className="font-extrabold text-emerald-800 text-[15px] mb-3 flex items-center gap-2">
                      <span className="text-lg">🌿</span> 醫學級保養營養素
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {partsData[activeMacroPart].nutrients.map((n: string, i: number) => (
                        <span key={i} className="bg-white text-emerald-700 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm border border-emerald-200">{n}</span>
                      ))}
                    </div>
                  </div>
                  
                  {activeMacroPart === '視網膜色素上皮細胞(RPE)' && (
                    <button onClick={() => { setViewState('rpe-zone'); logEvent('click_rpe_zone_btn', 'from_micro'); }} className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl shadow-lg active:scale-95 transition-transform text-base border-2 border-amber-400">
                      深度解析 RPE 五大救盲機制 ➜
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {viewState === 'rpe-zone' && (
            <div className="animate-in fade-in slide-in-from-right-6">
              <button onClick={() => setViewState('macro')} className="mb-4 text-slate-600 font-bold text-sm flex items-center px-4 py-2.5 bg-white rounded-xl shadow-sm border border-slate-200 active:bg-slate-50 transition-colors">
                <span className="mr-2">◀</span> 返回 3D 眼球全視角
              </button>

              <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-amber-200">
                <h3 className="text-2xl font-black text-amber-800 mb-4 border-b-2 border-amber-300 pb-3 flex items-center gap-3">
                  <span className="bg-amber-100 p-2 rounded-xl text-amber-600">🔬</span>
                  RPE 3D 核心病理專區
                </h3>
                
                <div className="mb-5 bg-rose-50/80 border-2 border-rose-200 p-4 rounded-xl shadow-sm relative overflow-hidden">
                  <h4 className="font-extrabold text-rose-700 text-[15px] mb-2">🚨 RPE 罷工的三大毀滅性危機：</h4>
                  <p className="text-sm text-rose-900 font-medium leading-relaxed text-justify pl-1">
                    1. 運輸斷擺，吃再多葉黃素也無效吸收。<br/>
                    2. 失去支撐，感光細胞將迅速凋亡壞死[cite: 1, 2]。<br/>
                    3. 代謝當機，劇毒「脂褐質」暴增毒殺眼底。
                  </p>
                </div>

                <p className="text-sm text-slate-600 mb-5 bg-slate-100 p-3 rounded-xl text-center font-bold border border-slate-200">👉 點擊下方 3D 組織發光熱區，解密 5 大機轉</p>

                <div className="w-full aspect-[4/3] bg-[#020617] rounded-2xl p-2 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] relative mb-6 overflow-hidden border-2 border-slate-700">
                  <RpeInteractiveGraphic />
                </div>

                <div className="bg-amber-50/80 rounded-2xl p-6 border border-amber-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                  <h4 className="font-black text-amber-900 mb-3 text-[17px] flex items-center gap-2">
                    {rpeFunctions.find(f=>f.id===activeRPEFunc)?.name}
                  </h4>
                  <p className="text-[15px] text-slate-700 mb-4 text-justify leading-relaxed font-medium">
                    {rpeFunctions.find(f=>f.id===activeRPEFunc)?.desc}
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
                    <p className="text-[14px] text-rose-800 font-bold text-justify leading-relaxed">
                      <span className="text-rose-600 mr-2 text-lg">⚠️ 疾病危機：</span>
                      {rpeFunctions.find(f=>f.id===activeRPEFunc)?.relation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === 區塊三：營養素查詢 === */}
        <section className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 mt-8">
          <label className="block text-slate-800 font-black mb-4 text-base flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">3</span> 常見醫學級營養素查詢：
          </label>
          <div className="relative mb-5">
            <select 
              className="w-full p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-900 font-bold text-[15px] appearance-none outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 shadow-inner transition-all"
              value={selectedNutrient}
              onChange={(e) => {
                setSelectedNutrient(e.target.value);
                if (e.target.value) logEvent('query_nutrient', e.target.value);
              }}
            >
              <option value="">-- 請選擇您想了解的營養素 --</option>
              {nutrientsData.map((data, idx) => (
                <option key={idx} value={data.name}>{data.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 text-lg">▼</div>
          </div>

          {selectedNutrient && (
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="mb-5">
                <span className="text-xs font-black text-emerald-600 block mb-3 uppercase tracking-widest border-b border-emerald-200/50 pb-2">精準修復目標部位：</span>
                <div className="flex flex-wrap gap-2.5">
                  {nutrientsData.find(n => n.name === selectedNutrient)?.targets.map(target => (
                    <span key={target} className="bg-white border-2 border-emerald-200 text-emerald-800 px-3.5 py-1.5 text-[13px] font-extrabold rounded-xl shadow-sm">
                      🎯 {target}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <span className="text-xs font-black text-emerald-600 block mb-2 uppercase tracking-widest">專利與科學實證機轉：</span>
                <p className="text-[15px] text-slate-800 leading-relaxed text-justify font-medium bg-white/50 p-4 rounded-xl border border-emerald-100">
                  {nutrientsData.find(n => n.name === selectedNutrient)?.desc}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* === 區塊四：參考文獻 === */}
        <section className="mt-8 pt-4 pb-12 border-t border-slate-200">
          <button 
            onClick={() => setShowReferences(!showReferences)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-between"
          >
            <span>📚 參考文獻庫</span>
            <span>{showReferences ? '▲' : '▼'}</span>
          </button>
          
          {showReferences && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4">
              {referencesList.map((ref, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                  {ref.type === 'paper' ? (
                    <>
                      <div className="font-bold text-slate-800 mb-1">{ref.title}</div>
                      <div className="text-slate-600 italic mb-1">{ref.journal} ({ref.year})</div>
                      <div className="text-slate-500 text-xs">Authors: {ref.authors}</div>
                    </>
                  ) : ref.type === 'patent' ? (
                    <>
                      <div className="font-bold text-sky-800 mb-1">🔖 {ref.title}</div>
                      <div className="text-slate-600 text-[13px] leading-relaxed">{ref.desc}</div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-emerald-700 mb-1">📘 {ref.title}</div>
                      <div className="text-slate-600 text-[13px] leading-relaxed">{ref.desc}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
} 