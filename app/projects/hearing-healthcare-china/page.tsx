"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Code {
  text: string;
  files: number;
  refs: number;
}

interface Subtheme {
  title: string;
  files: number;
  refs: number;
  codes: Code[];
}

interface Theme {
  id: number;
  title: string;
  fullTitle: string;
  icon: string;
  description: string;
  files: number;
  refs: number;
  subthemes: Subtheme[];
}

// Realistic China Map Component (3D Isometric / Pillar Map)
const ChinaGeoMap = ({ activeProvinces, lang }: { activeProvinces: string[], lang: 'zh' | 'en' }) => {
  // Approximate relative coordinates for major provinces
  // Adjusted for a slightly tilted isometric view
  const allProvinces = [
    { name: "黑龙江", nameEn: "Heilongjiang", x: 85, y: 10 },
    { name: "吉林", nameEn: "Jilin", x: 85, y: 18 },
    { name: "辽宁", nameEn: "Liaoning", x: 80, y: 25 },
    { name: "内蒙古", nameEn: "Inner Mongolia", x: 60, y: 20 },
    { name: "新疆", nameEn: "Xinjiang", x: 15, y: 25 },
    { name: "甘肃", nameEn: "Gansu", x: 40, y: 35 },
    { name: "青海", nameEn: "Qinghai", x: 30, y: 40 },
    { name: "西藏", nameEn: "Tibet", x: 20, y: 60 },
    { name: "四川", nameEn: "Sichuan", x: 48, y: 55 },
    { name: "云南", nameEn: "Yunnan", x: 42, y: 75 },
    { name: "宁夏", nameEn: "Ningxia", x: 50, y: 38 },
    { name: "陕西", nameEn: "Shaanxi", x: 56, y: 45 },
    { name: "山西", nameEn: "Shanxi", x: 62, y: 38 },
    { name: "河北", nameEn: "Hebei", x: 70, y: 32 },
    { name: "北京", nameEn: "Beijing", x: 72, y: 28 },
    { name: "天津", nameEn: "Tianjin", x: 74, y: 31 },
    { name: "山东", nameEn: "Shandong", x: 75, y: 40 },
    { name: "河南", nameEn: "Henan", x: 65, y: 48 },
    { name: "湖北", nameEn: "Hubei", x: 65, y: 58 },
    { name: "湖南", nameEn: "Hunan", x: 62, y: 68 },
    { name: "重庆", nameEn: "Chongqing", x: 55, y: 60 },
    { name: "贵州", nameEn: "Guizhou", x: 52, y: 70 },
    { name: "广西", nameEn: "Guangxi", x: 58, y: 80 },
    { name: "安徽", nameEn: "Anhui", x: 74, y: 52 },
    { name: "江苏", nameEn: "Jiangsu", x: 80, y: 48 },
    { name: "上海", nameEn: "Shanghai", x: 84, y: 52 },
    { name: "浙江", nameEn: "Zhejiang", x: 80, y: 60 },
    { name: "江西", nameEn: "Jiangxi", x: 70, y: 65 },
    { name: "福建", nameEn: "Fujian", x: 78, y: 72 },
    { name: "广东", nameEn: "Guangdong", x: 68, y: 80 },
    { name: "海南", nameEn: "Hainan", x: 65, y: 92 },
    { name: "台湾", nameEn: "Taiwan", x: 86, y: 78 },
    { name: "香港", nameEn: "Hong Kong", x: 72, y: 84 },
  ];

  // Group provinces by region for the stats panel
  const regions = [
    { name: lang === 'zh' ? "华北/东北" : "North/Northeast", count: activeProvinces.filter(p => ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江"].includes(p)).length },
    { name: lang === 'zh' ? "华东" : "East China", count: activeProvinces.filter(p => ["上海", "江苏", "浙江", "安徽", "福建", "江西", "山东"].includes(p)).length },
    { name: lang === 'zh' ? "华中/华南" : "Central/South", count: activeProvinces.filter(p => ["河南", "湖北", "湖南", "广东", "广西", "海南"].includes(p)).length },
    { name: lang === 'zh' ? "西南/西北" : "Southwest/Northwest", count: activeProvinces.filter(p => ["重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"].includes(p)).length },
  ];

  return (
    <div className="relative w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
      {/* 3D Map Visualization Area */}
      <div className="relative flex-1 h-[500px] md:h-[700px] bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden perspective-1000 flex items-center justify-center">
        
        {/* Isometric Container - Fixed Aspect Ratio Wrapper */}
        {/* This wrapper ensures the map maintains its shape regardless of the parent container's dimensions */}
        <div 
          className="relative w-[90%] max-w-[600px] aspect-[1.2/1] transition-transform duration-700 ease-out"
          style={{ 
            transform: 'rotateX(45deg) rotateZ(-5deg)', // Reduced rotation for better legibility
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Map Base Plate (The "Ground") */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(-20px)' }}>
             {/* Simplified China Map Silhouette Shadow/Base */}
             <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] opacity-20 drop-shadow-2xl overflow-visible">
               <path 
                 d="M 20 30 L 50 20 L 65 15 L 88 15 L 92 25 L 85 32 L 78 40 L 82 50 L 85 55 L 82 65 L 80 75 L 72 82 L 68 92 L 60 82 L 45 80 L 25 65 L 15 45 Z" 
                 className="fill-slate-700 stroke-slate-600 stroke-1"
               />
             </svg>
             {/* Grid Lines for "Tech" feel */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
          </div>

          {/* 3D Pillars */}
          <div className="absolute inset-0 w-full h-full">
            {allProvinces.map((prov, idx) => {
              const isActive = activeProvinces.includes(prov.name);
              // Randomize height slightly for active ones to give organic feel
              const height = isActive ? 60 + (idx % 5) * 5 : 4; 
              const zIndex = Math.floor(prov.y); // Simple z-sorting based on Y position

              return (
                <div
                  key={idx}
                  className="absolute transform-gpu transition-all duration-1000 ease-in-out group"
                  style={{ 
                    left: `${prov.x}%`, 
                    top: `${prov.y}%`,
                    zIndex: zIndex,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* The Pillar Structure */}
                  <div className="relative -translate-x-1/2 -translate-y-1/2">
                    
                    {/* Pillar Shadow */}
                    <div 
                      className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-sm transition-all duration-1000 ${isActive ? 'w-8 h-8 bg-blue-500/20' : 'w-2 h-2 bg-black/20'}`}
                      style={{ transform: 'translateZ(0px)' }}
                    ></div>

                    {/* Pillar Body (The vertical part) */}
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3 transition-all duration-1000 origin-bottom ${isActive ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400' : 'bg-slate-700'}`}
                      style={{ 
                        height: `${height}px`,
                        transform: 'rotateX(-90deg) translateY(50%) translateZ(1.5px)', // Rotate to stand up
                        transformOrigin: 'bottom center',
                        boxShadow: isActive ? 'inset 0 0 10px rgba(59,130,246,0.3)' : 'none'
                      }}
                    ></div>

                    {/* Pillar Cap (The Top Circle) */}
                    <div 
                      className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-1000 flex items-center justify-center cursor-pointer
                        ${isActive 
                          ? 'w-4 h-4 bg-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-blue-100' 
                          : 'w-2 h-2 bg-slate-600 border border-slate-500'
                        }
                      `}
                      style={{ 
                        transform: `translateZ(${height}px)`, // Move to top of pillar
                      }}
                    >
                      {/* Pulse Effect for Active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50"></div>
                      )}
                    </div>

                    {/* Floating Label (Counter-rotated to face camera) */}
                    {isActive && (
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 z-50"
                        style={{ 
                          transform: `translateZ(${height + 20}px) rotateX(-50deg) rotateZ(10deg)`, // Counter-rotate
                          bottom: '100%'
                        }}
                      >
                        <div className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 shadow-xl backdrop-blur-md whitespace-nowrap">
                          {lang === 'zh' ? prov.name : prov.nameEn}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Always visible label for major hubs (optional, to avoid clutter) */}
                    {isActive && ["Beijing", "Shanghai", "Guangdong", "Sichuan"].includes(prov.nameEn) && (
                       <div 
                       className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 opacity-80 group-hover:opacity-0"
                       style={{ 
                         transform: `translateZ(${height + 10}px) rotateX(-50deg) rotateZ(10deg)`,
                         bottom: '100%'
                       }}
                     >
                       <div className="text-blue-100/80 text-[10px] font-bold whitespace-nowrap text-shadow-sm">
                         {lang === 'zh' ? prov.name : prov.nameEn}
                       </div>
                     </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend / Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-slate-700">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            <span className="text-slate-300 text-xs font-medium">{lang === 'zh' ? "受访者覆盖省份" : "Respondent Locations"}</span>
          </div>
          <div className="text-slate-500 text-[10px] max-w-[150px] text-right">
            {lang === 'zh' ? "* 3D视图展示分布密度与广度" : "* 3D view showing distribution density"}
          </div>
        </div>
      </div>

      {/* Stats Sidebar - Dark Theme to match map */}
      <div className="md:w-80 bg-slate-900 border-l border-slate-800 p-8 flex flex-col justify-center relative z-10">
        <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-8 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          {lang === 'zh' ? "区域覆盖统计" : "Regional Coverage"}
        </h4>
        <div className="space-y-8">
          {regions.map((region, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-3">
                <span className="text-slate-300 font-medium text-base group-hover:text-white transition-colors">{region.name}</span>
                <span className="text-xl font-bold text-white">{region.count} <span className="text-xs text-slate-500 font-normal">{lang === 'zh' ? "省" : "Provs"}</span></span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                  style={{ width: `${(region.count / 11) * 100}%` }} 
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="text-slate-500 text-xs mb-2 uppercase tracking-widest">{lang === 'zh' ? "覆盖省份总数" : "Total Provinces"}</div>
          <div className="text-5xl font-bold text-white mb-4">11 <span className="text-lg font-normal text-slate-500">{lang === 'zh' ? "个" : ""}</span></div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {lang === 'zh' 
              ? "受访者广泛分布于中国主要经济与医疗中心，具有较强的全国代表性。" 
              : "Respondents are widely distributed across China's major economic and medical centers."}
          </p>
        </div>
      </div>
    </div>
  );
};

const themesEn: Theme[] = [
  {
    id: 1,
    title: "Clinical Role & Growth",
    fullTitle: "Clinical Role, Authority Limits & Professional Growth",
    icon: "🩺",
    description: "Challenges in scope of practice, decision-making authority, and professional development.",
    files: 28,
    refs: 52,
    subthemes: [
      {
        title: "Narrow Scope & Repetitive Work",
        files: 12,
        refs: 18,
        codes: [
          { text: "Narrow scope of practice", files: 5, refs: 8 },
          { text: "Repetitive daily work", files: 4, refs: 6 },
          { text: "Limited participation in hearing care", files: 3, refs: 4 }
        ]
      },
      {
        title: "Lack of Decision Authority",
        files: 8,
        refs: 12,
        codes: [
          { text: "Lack of clinical decision-making authority", files: 5, refs: 7 },
          { text: "Dependent on doctors for diagnosis", files: 3, refs: 5 }
        ]
      },
      {
        title: "Insufficient Clinical Knowledge",
        files: 6,
        refs: 10,
        codes: [
          { text: "Insufficient clinical knowledge", files: 4, refs: 6 },
          { text: "Gap in practical skills", files: 2, refs: 4 }
        ]
      },
      {
        title: "Education-Practice Disconnect",
        files: 10,
        refs: 15,
        codes: [
          { text: "Disconnect between education & practice", files: 6, refs: 9 },
          { text: "Need for research & continuous learning", files: 4, refs: 6 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Career Path & Certification",
    fullTitle: "Career Path & Certification Bottlenecks",
    icon: "🎓",
    description: "Issues with promotion, certification, and policy support.",
    files: 25,
    refs: 48,
    subthemes: [
      {
        title: "Limited Promotion Opportunities",
        files: 10,
        refs: 15,
        codes: [
          { text: "Limited promotion opportunities", files: 6, refs: 9 },
          { text: "Low career ceiling", files: 4, refs: 6 }
        ]
      },
      {
        title: "Lack of Certification",
        files: 8,
        refs: 12,
        codes: [
          { text: "Lack of regulation & industry certification", files: 5, refs: 8 },
          { text: "Unclear professional standards", files: 3, refs: 4 }
        ]
      },
      {
        title: "Need for Policy Support",
        files: 7,
        refs: 11,
        codes: [
          { text: "Need for policy support", files: 4, refs: 6 },
          { text: "Need for audiologist unity", files: 3, refs: 5 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Recognition & Status",
    fullTitle: "Insufficient Recognition from Hospital & Society",
    icon: "👀",
    description: "Struggles with internal identity, hospital status, and public perception.",
    files: 22,
    refs: 45,
    subthemes: [
      {
        title: "Internal Identity vs. Value",
        files: 8,
        refs: 14,
        codes: [
          { text: "Internal identity vs. relative low value", files: 5, refs: 8 },
          { text: "Self-perception issues", files: 3, refs: 6 }
        ]
      },
      {
        title: "Low Hospital Status",
        files: 7,
        refs: 12,
        codes: [
          { text: "Low status in hospital", files: 4, refs: 7 },
          { text: "High dependence on leadership", files: 3, refs: 5 }
        ]
      },
      {
        title: "Public Misconception",
        files: 7,
        refs: 11,
        codes: [
          { text: "Public misconception", files: 4, refs: 6 },
          { text: "Blurred professional boundaries", files: 3, refs: 5 }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Economic & Life Balance",
    fullTitle: "Balance between Economic & Life Rewards",
    icon: "⚖️",
    description: "Balancing salary, workload, and family stability.",
    files: 20,
    refs: 40,
    subthemes: [
      {
        title: "Salary vs. Workload",
        files: 10,
        refs: 18,
        codes: [
          { text: "Salary matches workload & value creation", files: 6, refs: 10 },
          { text: "Work intensity issues", files: 4, refs: 8 }
        ]
      },
      {
        title: "Family & Stability",
        files: 8,
        refs: 14,
        codes: [
          { text: "Family & stability advantages", files: 5, refs: 9 },
          { text: "Job security", files: 3, refs: 5 }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Future Prospects",
    fullTitle: "Challenges & Future Prospects",
    icon: "🚀",
    description: "Expectations for industry development, regional differences, and supply-demand.",
    files: 22,
    refs: 41,
    subthemes: [
      {
        title: "Regional Inequality",
        files: 5,
        refs: 6,
        codes: [
          { text: "Audiology development in small hospitals is weak", files: 2, refs: 2 },
          { text: "Regional differences in hearing care", files: 3, refs: 4 }
        ]
      },
      {
        title: "Supply & Demand",
        files: 6,
        refs: 8,
        codes: [
          { text: "High demand for hearing services", files: 3, refs: 4 },
          { text: "Shortage of qualified professionals", files: 3, refs: 4 }
        ]
      },
      {
        title: "Industry Development",
        files: 8,
        refs: 12,
        codes: [
          { text: "Optimism for future development", files: 5, refs: 7 },
          { text: "Technological advancements", files: 3, refs: 5 }
        ]
      }
    ]
  }
];

export default function HearingHealthcareChina() {
  const [activeTheme, setActiveTheme] = useState(1);
  const [activeSubtheme, setActiveSubtheme] = useState<number>(0);
  const [focusedColumn, setFocusedColumn] = useState<'themes' | 'subthemes' | 'codes'>('themes');
  const [lang, setLang] = useState<'zh' | 'en'>('en');

  // Static Translations
  const t = {
    zh: {
      back: "返回项目列表",
      tag: "Qualitative Research Study",
      title: "中国医院听力师职业现状研究",
      desc: "通过深度定性访谈，揭示中国听力师的职业认同、面临挑战及未来展望。",
      objLabel: "研究目的：",
      objText: "探究中国医院听力师的职业现状。",
      authors: "王尚齐郭，王静雯，牟珂奇，莫昌耿，赵铖，赵航，郗昕，赵非，左汶奇",
      totalRespondents: "受访者总数",
      respondentsDesc: "来自全国各地的听力师",
      avgDuration: "平均访谈时长",
      minutes: "分钟",
      genderDist: "性别分布",
      female: "女性",
      male: "男性",
      people: "人",
      eduDist: "学历分布",
      phd: "博士 (PhD)",
      msc: "硕士 (MSc)",
      bsc: "本科 (BSc)",
      associate: "专科 (Associate)",
      ageExpIncome: "年龄、工龄与收入",
      avgAge: "平均年龄",
      ageUnit: "岁",
      range: "范围",
      avgExp: "平均工龄",
      expUnit: "年",
      incomeDist: "月收入分布 (CNY)",
      income1: "1.5万 - 2万+",
      income2: "1万 - 1.5万",
      income3: "5千 - 1万",
      income4: "5千以下",
      income5: "未透露/兼职",
      mapTitle: "受访者省份分布",
      findingsTitle: "研究发现：5大核心主题",
      themeLabel: "Theme",
      files: "Files",
      refs: "Refs",
      selectPrompt: "请选择左侧子主题查看详细 Codes",
      codesTitle: "Codes & Evidence"
    },
    en: {
      back: "Back to Projects",
      tag: "Qualitative Research Study",
      title: "Current Status of Hospital Audiologists in China",
      desc: "Revealing professional identity, challenges, and future prospects of Chinese audiologists through in-depth qualitative interviews.",
      objLabel: "Objective:",
      objText: "To explore the professional status of hospital audiologists in China.",
      authors: "Shangqiguo Wang, Jingwen Wang, Keqi Mu, Changgeng Mo, Cheng Zhao, Hang Zhao, Xin Xi, Fei Zhao, Wenqi Zuo",
      totalRespondents: "Total Respondents",
      respondentsDesc: "Audiologists from across China",
      avgDuration: "Avg. Interview Duration",
      minutes: "Minutes",
      genderDist: "Gender Distribution",
      female: "Female",
      male: "Male",
      people: "",
      eduDist: "Education Distribution",
      phd: "PhD",
      msc: "Master (MSc)",
      bsc: "Bachelor (BSc)",
      associate: "Associate Degree",
      ageExpIncome: "Age, Experience & Income",
      avgAge: "Avg. Age",
      ageUnit: "years",
      range: "Range",
      avgExp: "Avg. Experience",
      expUnit: "years",
      incomeDist: "Monthly Income (CNY)",
      income1: "15k - 20k+",
      income2: "10k - 15k",
      income3: "5k - 10k",
      income4: "Below 5k",
      income5: "Undisclosed/Part-time",
      mapTitle: "Respondent Distribution by Province",
      findingsTitle: "Findings: 5 Core Themes",
      themeLabel: "Theme",
      files: "Files",
      refs: "Refs",
      selectPrompt: "Select a subtheme to view Codes",
      codesTitle: "Codes & Evidence"
    }
  };

  const content = t[lang];

  // Chinese Data
  const themesZh: Theme[] = [
    {
      id: 1,
      title: "临床角色，权限限制与专业成长",
      fullTitle: "临床角色，权限限制与专业成长",
      icon: "🩺",
      description: "涉及执业范围、临床决策权以及知识储备不足的挑战。",
      files: 29,
      refs: 113,
      subthemes: [
        {
          title: "职责范围狭窄，工作机械枯燥，只参与听力保健服务的很小一部分",
          files: 27,
          refs: 48,
          codes: [
            { text: "医院听力师的工作内容以只听力前庭测试为主", files: 22, refs: 26 },
            { text: "医院听力师的工作只做听力检查，工作单一，枯燥", files: 5, refs: 5 },
            { text: "医院听力师的工作更像是一个技工，而不是技师，像一个工具", files: 1, refs: 1 },
            { text: "听力师只做听力检查，技术含量有限", files: 1, refs: 1 },
            { text: "听力师只能做听力检查，只是听力保健的部分，无法做到完整的听力保健", files: 3, refs: 3 },
            { text: "国内的是听力技师，不是听力咨询师", files: 1, refs: 2 },
            { text: "希望在未来听力师能参与听力保健服务更多的步骤，而不只是做测试", files: 1, refs: 1 },
            { text: "有些耳鼻喉医生的听力学知识不如听力师", files: 5, refs: 5 },
            { text: "目前医院里不负责助听器验配，康复不能闭环", files: 4, refs: 4 }
          ]
        },
        {
          title: "临床决策权限缺失",
          files: 15,
          refs: 25,
          codes: [
            { text: "听力师在临床上没有决策权，诊断权", files: 12, refs: 19 },
            { text: "如果听力师的权限越多，那么责任也会越多", files: 2, refs: 2 },
            { text: "给听力师诊断权可以增加临床效率", files: 3, refs: 3 },
            { text: "听力师是非医学学位，非医生", files: 1, refs: 1 }
          ]
        },
        {
          title: "临床知识不足",
          files: 7,
          refs: 9,
          codes: [
            { text: "不应该有更多权限在目前的耳鼻喉诊疗体系中，如诊断权限，因为没有相应的能力和知识", files: 2, refs: 2 },
            { text: "临床上听力师知识有限，很难做独立诊断，需要更多知识和其他检查结果", files: 1, refs: 1 },
            { text: "可以把听力学放到硕士阶段，如果要提供高质量的听力保健服务", files: 2, refs: 4 },
            { text: "听力师学历不如医生", files: 1, refs: 1 },
            { text: "整体上医院的工作对学历要求高，但听力师普遍学历不高", files: 1, refs: 1 }
          ]
        },
        {
          title: "教育与临床脱节, 科研与持续学习需求",
          files: 15,
          refs: 31,
          codes: [
            { text: "医院要求科研产出要求越来越高，同时晋升时也需要科研文章", files: 11, refs: 16 },
            { text: "听力学的继续教育不好，学习机会少", files: 1, refs: 2 },
            { text: "听力师要持续学习才能发展", files: 1, refs: 1 },
            { text: "听力师需要不断学习", files: 6, refs: 7 },
            { text: "学校里的教学内容和医院临床的实际工作内容不匹配", files: 4, refs: 4 },
            { text: "想要进修 学习的机会", files: 1, refs: 1 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "职业路径与认证瓶颈",
      fullTitle: "职业路径与认证瓶颈",
      icon: "🎓",
      description: "关于晋升机制、行业认证以及职业规范的问题。",
      files: 29,
      refs: 103,
      subthemes: [
        {
          title: "晋升机会狭窄，职业上限低",
          files: 28,
          refs: 61,
          codes: [
            { text: "医院听力师晋升机会少，相比医生和其他医技人员来说晋升比例小", files: 7, refs: 10 },
            { text: "听力师职业发展上限太低", files: 10, refs: 19 },
            { text: "周围人因为待遇和晋升问题离职", files: 1, refs: 1 },
            { text: "没有听力师的专门的晋升考试，需要考康复师", files: 22, refs: 31 }
          ]
        },
        {
          title: "规范，行业认证缺失",
          files: 19,
          refs: 30,
          codes: [
            { text: "听力师行业需要规范", files: 3, refs: 4 },
            { text: "没有行业和国家的听力师资格考试，认证", files: 12, refs: 16 },
            { text: "目前医院里也有护士或其他非听力专业的人承担听力测试的工作", files: 9, refs: 9 },
            { text: "因为助听器不在医保内，所以不愿意把助听器验配加入日常工作，涉及利益", files: 1, refs: 1 }
          ]
        },
        {
          title: "政策推动需求，听力师需团结",
          files: 7,
          refs: 12,
          codes: [
            { text: "听力师之间要团结以推动行业发展，推动听力师的认证", files: 1, refs: 1 },
            { text: "需要有听力师的协会 而不是耳鼻喉医生主导的协会", files: 1, refs: 1 },
            { text: "需要行业内的领袖去推动政策的改变和去推动听力师的职业发展", files: 7, refs: 10 }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "医院与社会认可不足",
      fullTitle: "医院与社会认可不足",
      icon: "👀",
      description: "在医疗体系内部的地位以及公众对听力师职业的认知偏差。",
      files: 26,
      refs: 71,
      subthemes: [
        {
          title: "内在认同 vs. 相对低价值",
          files: 15,
          refs: 25,
          codes: [
            { text: "临床上会感到被患者尊重，认同", files: 2, refs: 3 },
            { text: "听力师不如医生更有成就感", files: 2, refs: 2 },
            { text: "听力师的临床任务和作用在耳鼻喉科室不重要", files: 1, refs: 4 },
            { text: "听力师的职业价值比不上医生", files: 1, refs: 1 },
            { text: "成为听力师有价值感和认同感", files: 11, refs: 14 },
            { text: "觉得没有价值", files: 1, refs: 1 }
          ]
        },
        {
          title: "医院内地位低，对领导依赖性强",
          files: 19,
          refs: 33,
          codes: [
            { text: "听力师不被医生和医院重视", files: 15, refs: 21 },
            { text: "听力师在耳鼻喉科室地位较低", files: 6, refs: 7 },
            { text: "耳鼻喉科室主任重视与否决定听力师重视与否", files: 4, refs: 5 }
          ]
        },
        {
          title: "公众认知偏差，专业边界模糊",
          files: 8,
          refs: 13,
          codes: [
            { text: "公众，甚至医疗系统对听力师的不了解和误解", files: 5, refs: 9 },
            { text: "家人朋友也不太了解听力师的工作", files: 1, refs: 1 },
            { text: "社会公众对保护听力的宣传不够，相比保护视力", files: 3, refs: 3 }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "经济与生活回报的现实平衡",
      fullTitle: "经济与生活回报的现实平衡",
      icon: "⚖️",
      description: "薪资待遇、工作强度与职业稳定性之间的权衡。",
      files: 29,
      refs: 112,
      subthemes: [
        {
          title: "薪资水平和工作强度，创造价值基本匹配",
          files: 29,
          refs: 63,
          codes: [
            { text: "医院听力师收入一般", files: 22, refs: 24 },
            { text: "听力师在大医院工作 收入比在在公司工作的同学高", files: 1, refs: 1 },
            { text: "听力师工作强度整体不高", files: 3, refs: 3 },
            { text: "听力师整体上工作压力较小", files: 8, refs: 8 },
            { text: "临床患者投诉有，但可以解决，不是大问题", files: 4, refs: 4 },
            { text: "听力检查收费低，但是有些检查花时间很长，绩效就低", files: 2, refs: 2 },
            { text: "Low fees mean less departmental revenue contribution compared to doctors", files: 2, refs: 2 },
            { text: "大型医院的工作量大，一般医院的工作量不大", files: 11, refs: 12 },
            { text: "听力师的薪资和工作量，能力，对科室的贡献是相匹配的", files: 2, refs: 2 },
            { text: "在医院里，听力师的工作比医生轻松", files: 4, refs: 5 }
          ]
        },
        {
          title: "家庭与稳定优势",
          files: 22,
          refs: 49,
          codes: [
            { text: "听力师工作强度不大，有时间照顾家庭", files: 4, refs: 4 },
            { text: "听力师的工作没有夜班", files: 8, refs: 10 },
            { text: "在医院工作 社会地位高，工作体面", files: 3, refs: 3 },
            { text: "当年龄增长，有家庭压力时，听力师的收入是偏低的", files: 3, refs: 3 },
            { text: "有编制的听力师岗位稳定，医院工作稳定", files: 6, refs: 8 },
            { text: "觉得听力师的工作更适合女性，或对职业期望值不高的人", files: 9, refs: 16 },
            { text: "听力师适合没有职业野心的人，想躺平的人", files: 5, refs: 5 }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Future Prospects",
      fullTitle: "Challenges & Future Prospects",
      icon: "🚀",
      description: "Expectations for industry development, regional differences, and supply-demand.",
      files: 22,
      refs: 41,
      subthemes: [
        {
          title: "Regional Inequality",
          files: 5,
          refs: 6,
          codes: [
            { text: "Audiology development in small hospitals is weak", files: 2, refs: 2 },
            { text: "Small city hospitals lack equipment, knowledge, and attention", files: 2, refs: 2 },
            { text: "Good hospitals currently require a Master's degree", files: 2, refs: 2 }
          ]
        },
        {
          title: "Supply & Demand Imbalance",
          files: 8,
          refs: 11,
          codes: [
            { text: "More schools opening audiology programs, more graduates, but hospital positions trending to saturation", files: 8, refs: 11 }
          ]
        },
        {
          title: "Uncertain Future",
          files: 13,
          refs: 24,
          codes: [
            { text: "Aging population will increase demand for audiologists", files: 3, refs: 3 },
            { text: "Number of practitioners increasing, but volume still not large enough", files: 2, refs: 3 },
            { text: "Optimistic about future development", files: 3, refs: 3 },
            { text: "Pessimistic about future in hospitals", files: 1, refs: 1 },
            { text: "More valued than a few years ago", files: 1, refs: 1 },
            { text: "Clinical and research audiology growing in recent years", files: 7, refs: 10 },
            { text: "Considered changing careers", files: 1, refs: 3 }
          ]
        }
      ]
    }
  ];

  const themes = lang === 'zh' ? themesZh : themesEn;

  // Active provinces for map
  const activeProvinces = ["北京", "上海", "重庆", "浙江", "山东", "河南", "陕西", "广东", "山西", "安徽", "江苏"];

  const currentTheme = themes.find(t => t.id === activeTheme) || themes[0];
  const currentSubtheme = currentTheme.subthemes[activeSubtheme];

  return (
    <div className="w-full max-w-[95%] mx-auto pb-20 px-4 font-sans">
      {/* Navigation & Language Toggle */}
      <div className="mb-8 pt-6 flex justify-between items-center">
        <Link href="/projects" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-bold text-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {content.back}
        </Link>

        <button 
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all"
        >
          <span className={`font-bold ${lang === 'en' ? 'text-blue-600' : 'text-slate-400'}`}>EN</span>
          <div className="w-8 h-4 bg-slate-200 rounded-full relative">
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${lang === 'en' ? 'left-0.5' : 'left-4.5'}`}></div>
          </div>
          <span className={`font-bold ${lang === 'zh' ? 'text-blue-600' : 'text-slate-400'}`}>中</span>
        </button>
      </div>

      {/* Hero Section - Presentation Mode */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-[2rem] p-6 md:p-16 border border-blue-100 shadow-sm mb-16 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 md:px-6 rounded-full bg-blue-100 text-blue-800 text-sm md:text-base font-bold tracking-wide mb-6 md:mb-8 uppercase">
            {content.tag}
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 md:mb-8 text-slate-900 leading-tight">
            {content.title}
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-5xl mx-auto font-light mb-8 md:mb-10 leading-relaxed">
            {content.desc}
          </p>
          
          {/* Research Objective */}
          <div className="bg-white/60 backdrop-blur-sm inline-block rounded-2xl p-4 md:p-6 border border-blue-100 max-w-4xl mx-auto">
            <span className="font-bold text-blue-800 text-lg md:text-2xl block md:inline mb-2 md:mb-0">{content.objLabel} </span>
            <span className="text-slate-700 text-lg md:text-2xl">{content.objText}</span>
          </div>

          {/* Authors */}
          <div className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-blue-100/50">
            <div className="flex flex-col items-center gap-4">
              <div className="text-slate-700 text-base md:text-2xl max-w-6xl leading-relaxed font-medium">
                {content.authors}
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold text-lg md:text-2xl mt-4">
                <span>The University of Hong Kong</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics Dashboard - Presentation Mode */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-20">
        {/* Key Stat Card */}
        <div className="md:col-span-3 bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-4">{content.totalRespondents}</h3>
            <div className="text-6xl md:text-8xl font-bold text-blue-400">33</div>
            <div className="text-slate-300 mt-4 text-xl md:text-2xl">{content.respondentsDesc}</div>
          </div>
          <div className="mt-8 md:mt-10 relative z-10">
            <div className="flex flex-col gap-2 text-slate-400">
              <span className="text-sm md:text-base uppercase font-bold">{content.avgDuration}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-bold text-white">40</span>
                <span className="text-xl md:text-2xl">{content.minutes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Split - Simple Bar Chart */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-3xl p-8 shadow-md flex flex-col">
          <h3 className="text-slate-500 text-xl font-bold uppercase tracking-wider mb-8">{content.genderDist}</h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {/* Female Bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-700">{content.female}</span>
                  <span className="text-slate-400 font-medium text-lg">(Female)</span>
                </div>
                <div className="text-3xl font-bold text-blue-500">25 <span className="text-sm text-slate-400 font-normal">{content.people}</span></div>
              </div>
              <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full flex items-center justify-end px-3" style={{ width: '76%' }}>
                  <span className="text-white font-bold text-sm">76%</span>
                </div>
              </div>
            </div>

            {/* Male Bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-700">{content.male}</span>
                  <span className="text-slate-400 font-medium text-lg">(Male)</span>
                </div>
                <div className="text-3xl font-bold text-cyan-500">8 <span className="text-sm text-slate-400 font-normal">{content.people}</span></div>
              </div>
              <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-cyan-500 rounded-full flex items-center justify-end px-3" style={{ width: '24%' }}>
                  <span className="text-white font-bold text-sm">24%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Visualization */}
        <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-8 shadow-md">
          <h3 className="text-slate-500 text-xl font-bold uppercase tracking-wider mb-8">{content.eduDist}</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">{content.phd}</span>
                <span className="font-bold text-indigo-600 text-2xl">3 (9%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-indigo-500 h-5 rounded-full" style={{width: '9%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">{content.msc}</span>
                <span className="font-bold text-blue-600 text-2xl">18 (55%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-blue-500 h-5 rounded-full" style={{width: '55%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">{content.bsc}</span>
                <span className="font-bold text-teal-600 text-2xl">10 (30%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-teal-500 h-5 rounded-full" style={{width: '30%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">{content.associate}</span>
                <span className="font-bold text-cyan-500 text-2xl">2 (6%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-cyan-400 h-5 rounded-full" style={{width: '6%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Row - Presentation Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20">
        {/* Age & Experience & Income */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md">
          <h3 className="text-slate-500 text-lg md:text-xl font-bold uppercase tracking-wider mb-6 md:mb-8">{content.ageExpIncome}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10">
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <div className="text-base md:text-lg text-slate-500 mb-2">{content.avgAge}</div>
              <div className="text-4xl md:text-5xl font-bold text-slate-800">35.4 <span className="text-xl md:text-2xl font-normal text-slate-400">{content.ageUnit}</span></div>
              <div className="text-sm md:text-base text-slate-400 mt-3">{content.range}: 24 - 57</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <div className="text-base md:text-lg text-slate-500 mb-2">{content.avgExp}</div>
              <div className="text-4xl md:text-5xl font-bold text-slate-800">11.2 <span className="text-xl md:text-2xl font-normal text-slate-400">{content.expUnit}</span></div>
              <div className="text-sm md:text-base text-slate-400 mt-3">{content.range}: 1 - 34</div>
            </div>
          </div>
          
          <h4 className="text-sm md:text-base font-bold text-slate-400 uppercase mb-6">{content.incomeDist}</h4>
          <div className="space-y-6 overflow-x-auto">
            <div className="flex items-center text-base md:text-xl min-w-[300px]">
              <span className="w-28 md:w-36 text-slate-600 text-sm md:text-base">{content.income1}</span>
              <div className="flex-1 h-4 md:h-6 bg-slate-100 rounded-full overflow-hidden mx-2 md:mx-4">
                <div className="h-full bg-blue-500" style={{width: '30%'}}></div>
              </div>
              <span className="w-8 md:w-12 text-right font-bold text-slate-700 text-lg md:text-2xl">10</span>
            </div>
            <div className="flex items-center text-base md:text-xl min-w-[300px]">
              <span className="w-28 md:w-36 text-slate-600 text-sm md:text-base">{content.income2}</span>
              <div className="flex-1 h-4 md:h-6 bg-slate-100 rounded-full overflow-hidden mx-2 md:mx-4">
                <div className="h-full bg-blue-600" style={{width: '27%'}}></div>
              </div>
              <span className="w-8 md:w-12 text-right font-bold text-slate-700 text-lg md:text-2xl">9</span>
            </div>
            <div className="flex items-center text-base md:text-xl min-w-[300px]">
              <span className="w-28 md:w-36 text-slate-600 text-sm md:text-base">{content.income3}</span>
              <div className="flex-1 h-4 md:h-6 bg-slate-100 rounded-full overflow-hidden mx-2 md:mx-4">
                <div className="h-full bg-blue-700" style={{width: '30%'}}></div>
              </div>
              <span className="w-8 md:w-12 text-right font-bold text-slate-700 text-lg md:text-2xl">10</span>
            </div>
            <div className="flex items-center text-base md:text-xl min-w-[300px]">
              <span className="w-28 md:w-36 text-slate-600 text-sm md:text-base">{content.income4}</span>
              <div className="flex-1 h-4 md:h-6 bg-slate-100 rounded-full overflow-hidden mx-2 md:mx-4">
                <div className="h-full bg-blue-800" style={{width: '3%'}}></div>
              </div>
              <span className="w-8 md:w-12 text-right font-bold text-slate-700 text-lg md:text-2xl">1</span>
            </div>
            <div className="flex items-center text-base md:text-xl min-w-[300px]">
              <span className="w-28 md:w-36 text-slate-400 text-sm md:text-base">{content.income5}</span>
              <div className="flex-1 h-4 md:h-6 bg-slate-100 rounded-full overflow-hidden mx-2 md:mx-4">
                <div className="h-full bg-slate-300" style={{width: '9%'}}></div>
              </div>
              <span className="w-8 md:w-12 text-right font-bold text-slate-400 text-lg md:text-2xl">3</span>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="bg-white border border-slate-100 rounded-3xl p-0 shadow-md relative overflow-hidden">
          <div className="p-6 md:p-8 pb-0">
            <h3 className="text-slate-500 text-lg md:text-2xl font-bold uppercase tracking-wider">{content.mapTitle}</h3>
          </div>
          <ChinaGeoMap activeProvinces={activeProvinces} lang={lang} />
        </div>
      </div>

      {/* Interactive Findings Section - 3-Column Layout */}
      <div className="mb-32">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-slate-900 text-center">{content.findingsTitle}</h2>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[1000px] md:h-[800px]">
          {/* Column 1: Themes (Level 1) */}
          <div 
            className={`flex flex-col gap-4 overflow-y-auto pr-2 transition-all duration-500 ease-in-out ${
              focusedColumn === 'themes' ? 'flex-[4] md:flex-[4]' : 'flex-1 md:flex-1'
            }`}
            onClick={() => setFocusedColumn('themes')}
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTheme === theme.id) {
                    setFocusedColumn('themes');
                  } else {
                    setActiveTheme(theme.id);
                    setActiveSubtheme(0);
                    setFocusedColumn('subthemes');
                  }
                }}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 border-2 ${
                  activeTheme === theme.id 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-transparent bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    activeTheme === theme.id ? 'bg-blue-200' : 'bg-slate-100'
                  }`}>
                    {theme.icon}
                  </span>
                  <span className={`text-sm font-bold text-slate-400 whitespace-nowrap transition-opacity duration-300 ${
                    focusedColumn === 'themes' ? 'opacity-100' : 'opacity-0 md:opacity-100'
                  }`}>{content.themeLabel} {theme.id}</span>
                </div>
                <div>
                  <span className={`font-bold text-xl block mb-2 leading-tight ${activeTheme === theme.id ? 'text-blue-900' : 'text-slate-600'}`}>
                    {theme.title}
                  </span>
                  {focusedColumn === 'themes' && (
                    <div className="flex gap-2 text-xs font-bold opacity-70 animate-fade-in">
                      <span className="bg-slate-200 px-2 py-1 rounded text-slate-700">{content.files}: {theme.files}</span>
                      <span className="bg-slate-200 px-2 py-1 rounded text-slate-700">{content.refs}: {theme.refs}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Column 2: Subthemes (Level 2) */}
          <div 
            className={`bg-white rounded-[2rem] border border-slate-100 shadow-xl p-4 md:p-6 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
              focusedColumn === 'subthemes' ? 'flex-[4] md:flex-[4]' : 'flex-1 md:flex-1'
            }`}
            onClick={() => setFocusedColumn('subthemes')}
          >
            <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 truncate">{currentTheme.fullTitle}</h3>
              {focusedColumn === 'subthemes' && (
                <p className="text-slate-500 text-base md:text-lg leading-relaxed animate-fade-in">{currentTheme.description}</p>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {currentTheme.subthemes.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSubtheme(idx);
                    setFocusedColumn('codes');
                  }}
                  className={`w-full text-left p-4 md:p-5 rounded-xl transition-all duration-200 border-2 ${
                    activeSubtheme === idx
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-slate-100 bg-slate-50 hover:border-blue-200'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      activeSubtheme === idx ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-bold text-base md:text-lg block mb-2 leading-snug truncate ${
                        activeSubtheme === idx ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {sub.title}
                      </span>
                      {focusedColumn === 'subthemes' && (
                        <div className="flex gap-3 text-xs font-bold text-slate-400 animate-fade-in">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{content.files}: {sub.files}</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{content.refs}: {sub.refs}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Codes (Level 3) */}
          <div 
            className={`bg-slate-800 rounded-[2rem] shadow-2xl p-4 md:p-8 flex flex-col overflow-hidden text-white transition-all duration-500 ease-in-out ${
              focusedColumn === 'codes' ? 'flex-[4] md:flex-[4]' : 'flex-1 md:flex-1'
            }`}
            onClick={() => setFocusedColumn('codes')}
          >
            <div className="mb-4 md:mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h4 className="text-lg md:text-xl font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">{content.codesTitle}</h4>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {currentSubtheme ? (
                currentSubtheme.codes.map((code, cIdx) => (
                  <div key={cIdx} className="bg-slate-700/50 p-4 md:p-5 rounded-xl border border-slate-600 hover:border-blue-500/50 transition-colors">
                    <p className={`leading-relaxed font-medium text-slate-100 mb-3 ${focusedColumn === 'codes' ? 'text-base md:text-xl' : 'text-sm line-clamp-3'}`}>
                      &quot;{code.text}&quot;
                    </p>
                    {focusedColumn === 'codes' && (
                      <div className="flex gap-3 text-sm font-bold text-slate-400 animate-fade-in">
                        <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">{content.files}: {code.files}</span>
                        <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">{content.refs}: {code.refs}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-center mt-20 text-lg md:text-xl">{content.selectPrompt}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
