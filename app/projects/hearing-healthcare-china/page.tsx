"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Realistic China Map Component (Dot Density / Point Map)
const ChinaGeoMap = ({ activeProvinces }: { activeProvinces: string[] }) => {
  // Approximate relative coordinates for major provinces to form a recognizable China shape
  // 0,0 is top-left. x is left-to-right, y is top-to-bottom.
  const allProvinces = [
    { name: "黑龙江", x: 88, y: 15 },
    { name: "吉林", x: 88, y: 25 },
    { name: "辽宁", x: 84, y: 32 },
    { name: "内蒙古", x: 65, y: 25 },
    { name: "新疆", x: 20, y: 30 },
    { name: "甘肃", x: 45, y: 40 },
    { name: "青海", x: 35, y: 45 },
    { name: "西藏", x: 25, y: 65 },
    { name: "四川", x: 50, y: 60 },
    { name: "云南", x: 45, y: 80 },
    { name: "宁夏", x: 52, y: 42 },
    { name: "陕西", x: 58, y: 50 },
    { name: "山西", x: 65, y: 42 },
    { name: "河北", x: 72, y: 38 },
    { name: "北京", x: 74, y: 35 },
    { name: "天津", x: 76, y: 38 },
    { name: "山东", x: 78, y: 45 },
    { name: "河南", x: 68, y: 52 },
    { name: "湖北", x: 68, y: 60 },
    { name: "湖南", x: 66, y: 70 },
    { name: "重庆", x: 58, y: 62 },
    { name: "贵州", x: 55, y: 72 },
    { name: "广西", x: 60, y: 82 },
    { name: "安徽", x: 76, y: 58 },
    { name: "江苏", x: 82, y: 52 },
    { name: "上海", x: 85, y: 55 },
    { name: "浙江", x: 82, y: 62 },
    { name: "江西", x: 74, y: 68 },
    { name: "福建", x: 80, y: 75 },
    { name: "广东", x: 72, y: 82 },
    { name: "海南", x: 68, y: 92 },
    { name: "台湾", x: 88, y: 80 },
    { name: "香港", x: 74, y: 85 },
  ];

  // Group provinces by region for the stats panel
  const regions = [
    { name: "华北/东北", count: activeProvinces.filter(p => ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江"].includes(p)).length },
    { name: "华东", count: activeProvinces.filter(p => ["上海", "江苏", "浙江", "安徽", "福建", "江西", "山东"].includes(p)).length },
    { name: "华中/华南", count: activeProvinces.filter(p => ["河南", "湖北", "湖南", "广东", "广西", "海南"].includes(p)).length },
    { name: "西南/西北", count: activeProvinces.filter(p => ["重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"].includes(p)).length },
  ];

  return (
    <div className="relative w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
      {/* Map Visualization Area */}
      <div className="relative flex-1 h-[500px] md:h-[600px] bg-slate-50 p-4">
        {/* Background Map Silhouette (Subtle) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full">
             {/* A very rough simplified path just for background texture if needed, or leave blank for clean look */}
           </svg>
        </div>

        {/* Dot Map */}
        <div className="relative w-full h-full">
          {allProvinces.map((prov, idx) => {
            const isActive = activeProvinces.includes(prov.name);
            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: `${prov.x}%`, top: `${prov.y}%` }}
              >
                <div className={`flex flex-col items-center group cursor-default ${isActive ? 'z-10' : 'z-0'}`}>
                  {/* The Dot */}
                  <div className={`
                    rounded-full transition-all duration-300 flex items-center justify-center
                    ${isActive 
                      ? 'w-6 h-6 bg-amber-500 shadow-lg shadow-amber-500/30 scale-110' 
                      : 'w-3 h-3 bg-slate-200'
                    }
                  `}>
                    {isActive && <div className="w-full h-full rounded-full bg-amber-400 animate-ping opacity-75 absolute"></div>}
                  </div>
                  
                  {/* Label */}
                  <div className={`
                    mt-2 text-xs font-bold whitespace-nowrap transition-all duration-300 px-2 py-1 rounded-md
                    ${isActive 
                      ? 'text-slate-800 bg-white/90 shadow-sm opacity-100 translate-y-0' 
                      : 'text-slate-300 opacity-0 group-hover:opacity-100 -translate-y-1'
                    }
                  `}>
                    {prov.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="absolute bottom-4 right-4 text-slate-400 text-sm font-medium bg-white/80 px-3 py-1 rounded-lg backdrop-blur-sm">
          * 点位代表受访者所在省份
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="md:w-72 bg-white border-l border-slate-100 p-8 flex flex-col justify-center">
        <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6">区域覆盖省份统计</h4>
        <div className="space-y-6">
          {regions.map((region, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-600 font-medium text-lg">{region.name}</span>
                <span className="text-2xl font-bold text-slate-800">{region.count} <span className="text-sm text-slate-400 font-normal">个省份</span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(region.count / 11) * 100}%` }} // Assuming max roughly 11 for scale
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="text-slate-500 text-sm mb-1">覆盖省份数量</div>
          <div className="text-4xl font-bold text-slate-900">11 <span className="text-lg font-normal text-slate-400">个</span></div>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            受访者广泛分布于中国主要经济与医疗中心，具有较强的全国代表性。
          </p>
        </div>
      </div>
    </div>
  );
};

export default function HearingHealthcareChina() {
  const [activeTheme, setActiveTheme] = useState(1);
  const [activeSubtheme, setActiveSubtheme] = useState<number>(0);

  // Updated Data Structure with Files and References counts
  const themes = [
    {
      id: 1,
      title: "临床角色与权限",
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
      title: "职业路径与认证",
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
      title: "认可度与身份",
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
      title: "经济与生活平衡",
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
            { text: "听力检查收费低，因此相比医生，听力师所创造的科室效益小", files: 2, refs: 2 },
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
      title: "未来前景",
      fullTitle: "挑战与未来前景",
      icon: "🚀",
      description: "对行业未来发展的预期、区域差异以及供需关系。",
      files: 22,
      refs: 41,
      subthemes: [
        {
          title: "当前区域发展不均",
          files: 5,
          refs: 6,
          codes: [
            { text: "小医院听力学发展还是薄弱", files: 2, refs: 2 },
            { text: "小城市的医院听力学的设备，知识，重视程度都不行", files: 2, refs: 2 },
            { text: "目前好的医院的听力师招聘条件是硕士", files: 2, refs: 2 }
          ]
        },
        {
          title: "供给与需求失衡",
          files: 8,
          refs: 11,
          codes: [
            { text: "开设听力学的学校越来越多，毕业生越来越多，但医院听力师岗位饱和的趋势", files: 8, refs: 11 }
          ]
        },
        {
          title: "未来不明",
          files: 13,
          refs: 24,
          codes: [
            { text: "人口老龄化会增加听力师的需求", files: 3, refs: 3 },
            { text: "听力师从业人数有提高，但体量还是不够大", files: 2, refs: 3 },
            { text: "对未来听力师的发展看好", files: 3, refs: 3 },
            { text: "对医院听力师行业未来不看好", files: 1, refs: 1 },
            { text: "相比之前（几年前），听力师被重视了一点", files: 1, refs: 1 },
            { text: "近年来听力学临床和科研都在不断壮大进步", files: 7, refs: 10 },
            { text: "想过转行", files: 1, refs: 3 }
          ]
        }
      ]
    }
  ];

  // Active provinces for map
  const activeProvinces = ["北京", "上海", "重庆", "浙江", "山东", "河南", "陕西", "广东", "山西", "安徽", "江苏"];

  // Reset subtheme when theme changes
  useEffect(() => {
    setActiveSubtheme(0);
  }, [activeTheme]);

  const currentTheme = themes.find(t => t.id === activeTheme) || themes[0];
  const currentSubtheme = currentTheme.subthemes[activeSubtheme];

  return (
    <div className="w-full max-w-[95%] mx-auto pb-20 px-4 font-sans">
      {/* Navigation */}
      <div className="mb-8 pt-6">
        <Link href="/projects" className="text-amber-600 hover:text-amber-700 flex items-center gap-2 transition-colors font-bold text-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回项目列表
        </Link>
      </div>

      {/* Hero Section - Presentation Mode */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-[2rem] p-12 md:p-16 border border-amber-100 shadow-sm mb-16 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block px-6 py-2 rounded-full bg-amber-100 text-amber-800 text-base font-bold tracking-wide mb-8 uppercase">
            Qualitative Research Study
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-slate-900 leading-tight whitespace-nowrap overflow-visible">
            中国医院听力师职业现状研究
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-5xl mx-auto font-light mb-10 leading-relaxed">
            通过深度定性访谈，揭示中国听力师的职业认同、面临挑战及未来展望。
          </p>
          
          {/* Research Objective */}
          <div className="bg-white/60 backdrop-blur-sm inline-block rounded-2xl p-6 border border-amber-100 max-w-4xl mx-auto">
            <span className="font-bold text-amber-800 text-2xl">研究目的：</span>
            <span className="text-slate-700 text-2xl">探究中国医院听力师的职业现状。</span>
          </div>

          {/* Authors */}
          <div className="mt-12 pt-10 border-t border-amber-100/50">
            <div className="flex flex-col items-center gap-4">
              <div className="text-slate-700 text-xl md:text-2xl max-w-6xl leading-relaxed font-medium">
                <span className="font-bold text-amber-700 border-b-4 border-amber-200">王尚齐郭</span>，王静雯，牟珂奇，莫昌耿，赵铖，赵航，郗昕，赵非，左汶奇
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold text-2xl mt-4">
                <span>The University of Hong Kong</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics Dashboard - Presentation Mode */}
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        {/* Key Stat Card */}
        <div className="md:col-span-3 bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 text-xl font-bold uppercase tracking-wider mb-4">受访者总数</h3>
            <div className="text-8xl font-bold text-amber-400">33</div>
            <div className="text-slate-300 mt-4 text-2xl">来自全国各地的听力师</div>
          </div>
          <div className="mt-10 relative z-10">
            <div className="flex flex-col gap-2 text-slate-400">
              <span className="text-base uppercase font-bold">平均访谈时长</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-white">40</span>
                <span className="text-2xl">分钟</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Split - Simple Bar Chart */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-3xl p-8 shadow-md flex flex-col">
          <h3 className="text-slate-500 text-xl font-bold uppercase tracking-wider mb-8">性别分布</h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {/* Female Bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-700">女性</span>
                  <span className="text-slate-400 font-medium text-lg">(Female)</span>
                </div>
                <div className="text-3xl font-bold text-amber-500">25 <span className="text-sm text-slate-400 font-normal">人</span></div>
              </div>
              <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-amber-500 rounded-full flex items-center justify-end px-3" style={{ width: '76%' }}>
                  <span className="text-white font-bold text-sm">76%</span>
                </div>
              </div>
            </div>

            {/* Male Bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-700">男性</span>
                  <span className="text-slate-400 font-medium text-lg">(Male)</span>
                </div>
                <div className="text-3xl font-bold text-blue-500">8 <span className="text-sm text-slate-400 font-normal">人</span></div>
              </div>
              <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full flex items-center justify-end px-3" style={{ width: '24%' }}>
                  <span className="text-white font-bold text-sm">24%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Visualization */}
        <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-8 shadow-md">
          <h3 className="text-slate-500 text-xl font-bold uppercase tracking-wider mb-8">学历分布</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">博士 (PhD)</span>
                <span className="font-bold text-indigo-600 text-2xl">3 (9%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-indigo-500 h-5 rounded-full" style={{width: '9%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">硕士 (MSc)</span>
                <span className="font-bold text-amber-600 text-2xl">18 (55%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-amber-500 h-5 rounded-full" style={{width: '55%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">本科 (BSc)</span>
                <span className="font-bold text-emerald-600 text-2xl">10 (30%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-emerald-500 h-5 rounded-full" style={{width: '30%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-2">
                <span className="font-medium text-slate-700">专科 (Associate)</span>
                <span className="font-bold text-blue-500 text-2xl">2 (6%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5">
                <div className="bg-blue-400 h-5 rounded-full" style={{width: '6%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Row - Presentation Mode */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Age & Experience & Income */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md">
          <h3 className="text-slate-500 text-xl font-bold uppercase tracking-wider mb-8">年龄、工龄与收入</h3>
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <div className="text-lg text-slate-500 mb-2">平均年龄</div>
              <div className="text-5xl font-bold text-slate-800">35.4 <span className="text-2xl font-normal text-slate-400">岁</span></div>
              <div className="text-base text-slate-400 mt-3">范围: 24 - 57</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl text-center">
              <div className="text-lg text-slate-500 mb-2">平均工龄</div>
              <div className="text-5xl font-bold text-slate-800">11.2 <span className="text-2xl font-normal text-slate-400">年</span></div>
              <div className="text-base text-slate-400 mt-3">范围: 1 - 34</div>
            </div>
          </div>
          
          <h4 className="text-base font-bold text-slate-400 uppercase mb-6">月收入分布 (CNY)</h4>
          <div className="space-y-6">
            <div className="flex items-center text-xl">
              <span className="w-36 text-slate-600">1.5万 - 2万+</span>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden mx-4">
                <div className="h-full bg-amber-500" style={{width: '30%'}}></div>
              </div>
              <span className="w-12 text-right font-bold text-slate-700 text-2xl">10</span>
            </div>
            <div className="flex items-center text-xl">
              <span className="w-36 text-slate-600">1万 - 1.5万</span>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden mx-4">
                <div className="h-full bg-amber-600" style={{width: '27%'}}></div>
              </div>
              <span className="w-12 text-right font-bold text-slate-700 text-2xl">9</span>
            </div>
            <div className="flex items-center text-xl">
              <span className="w-36 text-slate-600">5千 - 1万</span>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden mx-4">
                <div className="h-full bg-amber-700" style={{width: '30%'}}></div>
              </div>
              <span className="w-12 text-right font-bold text-slate-700 text-2xl">10</span>
            </div>
            <div className="flex items-center text-xl">
              <span className="w-36 text-slate-600">5千以下</span>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden mx-4">
                <div className="h-full bg-amber-800" style={{width: '3%'}}></div>
              </div>
              <span className="w-12 text-right font-bold text-slate-700 text-2xl">1</span>
            </div>
            <div className="flex items-center text-xl">
              <span className="w-36 text-slate-400">未透露/兼职</span>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden mx-4">
                <div className="h-full bg-slate-300" style={{width: '9%'}}></div>
              </div>
              <span className="w-12 text-right font-bold text-slate-400 text-2xl">3</span>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="bg-white border border-slate-100 rounded-3xl p-0 shadow-md relative overflow-hidden">
          <div className="p-8 pb-0">
            <h3 className="text-slate-500 text-xl font-bold uppercase tracking-wider">受访者省份分布</h3>
          </div>
          <ChinaGeoMap activeProvinces={activeProvinces} />
        </div>
      </div>

      {/* Interactive Findings Section - 3-Column Layout */}
      <div className="mb-32">
        <h2 className="text-5xl font-bold mb-12 text-slate-900 text-center">研究发现：5大核心主题</h2>
        
        <div className="grid grid-cols-12 gap-6 h-[800px]">
          {/* Column 1: Themes (Level 1) */}
          <div className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 border-2 ${
                  activeTheme === theme.id 
                    ? 'border-amber-500 bg-amber-50 shadow-lg' 
                    : 'border-transparent bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                    activeTheme === theme.id ? 'bg-amber-200' : 'bg-slate-100'
                  }`}>
                    {theme.icon}
                  </span>
                  <span className="text-sm font-bold text-slate-400">Theme {theme.id}</span>
                </div>
                <div>
                  <span className={`font-bold text-xl block mb-2 ${activeTheme === theme.id ? 'text-amber-900' : 'text-slate-600'}`}>
                    {theme.title}
                  </span>
                  <div className="flex gap-2 text-xs font-bold opacity-70">
                    <span className="bg-slate-200 px-2 py-1 rounded text-slate-700">Files: {theme.files}</span>
                    <span className="bg-slate-200 px-2 py-1 rounded text-slate-700">Refs: {theme.refs}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Column 2: Subthemes (Level 2) */}
          <div className="col-span-4 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 flex flex-col overflow-hidden">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentTheme.fullTitle}</h3>
              <p className="text-slate-500 text-lg leading-relaxed">{currentTheme.description}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {currentTheme.subthemes.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSubtheme(idx)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-200 border-2 ${
                    activeSubtheme === idx
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-slate-100 bg-slate-50 hover:border-amber-200'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      activeSubtheme === idx ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <span className={`font-bold text-lg block mb-2 leading-snug ${
                        activeSubtheme === idx ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {sub.title}
                      </span>
                      <div className="flex gap-3 text-xs font-bold text-slate-400">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Files: {sub.files}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Refs: {sub.refs}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Codes (Level 3) */}
          <div className="col-span-5 bg-slate-800 rounded-[2rem] shadow-2xl p-8 flex flex-col overflow-hidden text-white">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
              <h4 className="text-xl font-bold text-slate-300 uppercase tracking-wider">Codes & Evidence</h4>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {currentSubtheme ? (
                currentSubtheme.codes.map((code, cIdx) => (
                  <div key={cIdx} className="bg-slate-700/50 p-5 rounded-xl border border-slate-600 hover:border-amber-500/50 transition-colors">
                    <p className="text-xl leading-relaxed font-medium text-slate-100 mb-3">
                      "{code.text}"
                    </p>
                    <div className="flex gap-3 text-sm font-bold text-slate-400">
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">Files: {code.files}</span>
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">Refs: {code.refs}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-center mt-20 text-xl">请选择左侧子主题查看详细 Codes</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}