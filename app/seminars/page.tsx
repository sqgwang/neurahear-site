export default function Seminars() {
  const seminars = [
    {
      episode: "第三期",
      title: "线上听力学研讨会第三期",
      speakers: [
        "郑慧丽：哪些因素会阻碍中国老年人验配助听器",
        "莫昌耿：从健康不平等理论模型的视角以探讨听力健康不平等的现象"
      ],
      bvid: "BV1Fu4m137LC",
      url: "https://www.bilibili.com/video/BV1Fu4m137LC/"
    },
    {
      episode: "第四期",
      title: "线上听力学研讨会第四期",
      speakers: [
        "吴梦帆：老年助听器使用者噪声言语识别个体差异研究：从丹麦BEAR项目中机器学习归类的听觉差异出发"
      ],
      bvid: "BV1VJ4m1Y7i9",
      url: "https://www.bilibili.com/video/BV1VJ4m1Y7i9/"
    },
    {
      episode: "第五期",
      title: "线上听力学研讨会第五期",
      speakers: [
        "刘国益：轻微听力损失人群的助听器验配 Fitting Hearing Aids to People With Minimal Hearing Loss"
      ],
      bvid: "BV1Lr421H7hJ",
      url: "https://www.bilibili.com/video/BV1Lr421H7hJ/"
    },
    {
      episode: "第六期",
      title: "线上听力学研讨会第六期",
      speakers: [
        "傅鑫萍：开发一种基于瞳孔测量法的快速听配能测试 Development of a rapid pupillometry-based test of listening effort"
      ],
      bvid: "BV1py421B7CN",
      url: "https://www.bilibili.com/video/BV1py421B7CN/"
    },
    {
      episode: "第七期",
      title: "线上听力学研讨会第七期",
      speakers: [
        "陈源：听觉脑干对复杂声反应在听力障碍评估和应对的潜在作用 The Potential Role of the cABR (Auditory Brainstem Responses to Complex Sounds) in Assessment and Management of Hearing Impairment"
      ],
      bvid: "BV1eK42147nG",
      url: "https://www.bilibili.com/video/BV1eK42147nG/"
    },
    {
      episode: "第八期",
      title: "线上听力学研讨会第八期",
      speakers: [
        "邢立冬生：声学至语义的中间表征解释行为及听皮层对自然声音的响应 Intermediate acoustic-tosemantic representations link behavioral and neural responses to natural sounds"
      ],
      bvid: "BV1Rj421U7o2",
      url: "https://www.bilibili.com/video/BV1Rj421U7o2/"
    },
    {
      episode: "第九期",
      title: "线上听力学研讨会第九期",
      speakers: [
        "许琛：环境噪声如何影响基于智能手机的听力测试（虚拟听力诊所app）How does the ambient noise influence the smartphone-based hearing tests for a Virtual Hearing Clinic?"
      ],
      bvid: "BV1G2421M7V9",
      url: "https://www.bilibili.com/video/BV1G2421M7V9/"
    },
    {
      episode: "第十期",
      title: "线上听力学研讨会第十期",
      speakers: [
        "张丽萍：背景噪声对于言语感知学习的影响 The Influence of the Type of Background Noise on Perceptual Learning of Speech in Noise"
      ],
      bvid: "BV1dx4y1r7nr",
      url: "https://www.bilibili.com/video/BV1dx4y1r7nr/"
    },
    {
      episode: "第十一期",
      title: "线上听力学研讨会第十一期",
      speakers: [
        "张梦超：非创伤性噪声对时域包络处理的影响 Impact of Non-Traumatic Noise Exposure on Temporal Envelope Processing"
      ],
      bvid: "BV1oH4y1L7PV",
      url: "https://www.bilibili.com/video/BV1oH4y1L7PV/"
    },
    {
      episode: "第十二期",
      title: "线上听力学研讨会第十二期",
      speakers: [
        "周雪寒：诊断听觉处理障碍（APD）的首要步骤：通过对正常发育儿童进行研究，探讨听觉处理、语音感知、语言和认知系统之间的关系 Understanding listening difficulties in children: Investigating in typically-developing children the relationship between hearing, speech, language, and cognition as a first step to diagnosing APD"
      ],
      bvid: "BV1LZ42117Ry",
      url: "https://www.bilibili.com/video/BV1LZ42117Ry/"
    },
    {
      episode: "第十三期",
      title: "线上听力学研讨会第十三期",
      speakers: [
        "王瀚：分散性注意下对劣化语音的知觉学习 Perceptual learning of degraded speech under divided attention"
      ],
      bvid: "BV19D421P7bS",
      url: "https://www.bilibili.com/video/BV19D421P7bS/"
    },
    {
      episode: "第十四期",
      title: "线上听力学研讨会第十四期",
      speakers: [
        "李家盈博士：人工耳蜗术后粤语-普通话双语儿童的辅音发音研究：解开双语和听力障碍的影响"
      ],
      bvid: "BV1efh6eCEZQ",
      url: "https://www.bilibili.com/video/BV1efh6eCEZQ/"
    },
    {
      episode: "第十五期",
      title: "线上听力学研讨会第十五期",
      speakers: [
        "汪洋博士：认识瞳孔测量：瞳孔测量在听力努力程度及听力疲劳研究中的应用 An Introduction to Pupillometry: Implementation in Listening Effort and Fatigue Research"
      ],
      bvid: "BV1QSa4eKEoH",
      url: "https://www.bilibili.com/video/BV1QSa4eKEoH/"
    },
    {
      episode: "第十六期",
      title: "线上听力学研讨会第十六期",
      speakers: [
        "袁涤博士：人脑可塑性连接失聪儿童的过去和未来 The Plasticity of Human Brain Bridges the Past and Future of Children with Hearing Loss"
      ],
      bvid: "BV1x6Y9zhEkb",
      url: "https://www.bilibili.com/video/BV1x6Y9zhEkb/"
    },
    {
      episode: "第十七期",
      title: "线上听力学研讨会第十七期",
      speakers: [
        "汤平教授：人工耳蜗植入儿童对汉语声调和语调的习得"
      ],
      bvid: "BV1pJnbzREfH",
      url: "https://www.bilibili.com/video/BV1pJnbzREfH/"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="mb-4">Seminars</h1>
      <p className="text-xl text-gray-600 mb-12">线上听力学研讨会 · Online Audiology Seminar Series</p>
      
      {/* Quick Navigation */}
      <nav className="mb-12 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          快速跳转 Quick Navigation
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {seminars.map((seminar, index) => (
            <a
              key={index}
              href={`#seminar-${index}`}
              className="block px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-blue-700 min-w-[70px] text-sm">{seminar.episode}</span>
                <div className="flex-1">
                  {seminar.speakers.map((speaker, idx) => {
                    const speakerName = speaker.split('：')[0];
                    const topic = speaker.split('：')[1] || speaker;
                    return (
                      <div key={idx} className="text-sm leading-relaxed">
                        <span className="font-semibold text-gray-900">{speakerName}</span>
                        {speaker.includes('：') && (
                          <span className="text-gray-600">：{topic.length > 60 ? topic.substring(0, 60) + '...' : topic}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </a>
          ))}
        </div>
      </nav>
      
      {seminars.map((seminar, index) => (
        <div key={index} id={`seminar-${index}`} className="mt-12 p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-mt-6">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">{seminar.title}</h2>
          {seminar.speakers.map((speaker, idx) => (
            <p key={idx} className="text-lg mb-2 text-gray-700">{speaker}</p>
          ))}
          
          {/* Bilibili 视频嵌入 */}
          <div className="relative w-full mt-4" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://player.bilibili.com/player.html?bvid=${seminar.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          
          <a 
            href={seminar.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            在Bilibili上观看 →
          </a>
        </div>
      ))}
    </div>
  );
}
