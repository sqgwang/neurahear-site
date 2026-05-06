"use client";

import { useMemo, useState } from "react";

type ResponseValue = "na" | "0" | "1" | "2" | "3" | "4";

type HfeqItem = {
  id: string;
  text: string;
  domain: string;
};

type HfeqDomain = {
  id: string;
  title: string;
  description: string;
  items: HfeqItem[];
};

const responseOptions: Array<{ value: ResponseValue; label: string; score: number | null }> = [
  { value: "na", label: "不适合我", score: null },
  { value: "0", label: "完全没有", score: 0 },
  { value: "1", label: "有一点", score: 1 },
  { value: "2", label: "一般", score: 2 },
  { value: "3", label: "挺多", score: 3 },
  { value: "4", label: "非常多", score: 4 },
];

const domains: HfeqDomain[] = [
  {
    id: "hearing",
    title: "听力方面",
    description: "声音察觉、日常环境声和声源定位。",
    items: [
      { id: "h1", domain: "听力方面", text: "听很轻的声音的时候，您觉得有多难？" },
      { id: "h2", domain: "听力方面", text: "听日常环境中的声音，如铃、脚步声或孩子们的玩耍声，您觉得有多难？" },
      { id: "h3", domain: "听力方面", text: "分辨声音是从哪里来的时候，您觉得有多难？" },
    ],
  },
  {
    id: "communication",
    title: "交流方面",
    description: "安静、噪声、多人交谈、注意力和电子通讯。",
    items: [
      { id: "c1", domain: "交流方面", text: "在安静的地方和一个人聊天时，您觉得有多难？" },
      { id: "c2", domain: "交流方面", text: "在吵闹的地方和一个人聊天时，您觉得有多难？" },
      { id: "c3", domain: "交流方面", text: "在安静的地方和几个人轮流说话时，您觉得有多难？" },
      { id: "c4", domain: "交流方面", text: "在吵闹的地方和几个人同时说话时，您觉得有多难？" },
      { id: "c5", domain: "交流方面", text: "跟上说话速度快的人，您觉得有多难？" },
      { id: "c6", domain: "交流方面", text: "听不清楚时，您觉得集中注意力有多难？" },
      { id: "c7", domain: "交流方面", text: "您和家人朋友相处时，听力问题给您带来多大的困难？" },
      { id: "c8", domain: "交流方面", text: "用电子通讯时，如手机或视频聊天时，您觉得有多难？" },
      { id: "c9", domain: "交流方面", text: "您会用看嘴型、请人重复或靠近听来帮助交流吗？" },
    ],
  },
  {
    id: "participation",
    title: "社交方面",
    description: "工作、学习、社区活动、休闲娱乐和噪声场景回避。",
    items: [
      { id: "p1", domain: "社交方面", text: "您在工作或上班（全职或兼职）时，听力问题给您带来多大的困难？" },
      { id: "p2", domain: "社交方面", text: "您在学习或参与培训时，听力问题给您带来多大的困难？" },
      { id: "p3", domain: "社交方面", text: "您参加社区活动（包括志愿工作）时，听力问题给您带来多大的困难？" },
      { id: "p4", domain: "社交方面", text: "您在做喜欢的事或和朋友玩时（休闲娱乐活动），听力问题给您带来多大的困难？" },
      { id: "p5", domain: "社交方面", text: "您会不会因为听力问题，回避一些吵闹的地方呢？" },
    ],
  },
  {
    id: "personal",
    title: "个人方面",
    description: "动机、目标、乐观态度、情绪、压力和家庭支持。",
    items: [
      { id: "i1", domain: "个人方面", text: "您有多大的渴望和动力去解决生活中的听力问题？" },
      { id: "i2", domain: "个人方面", text: "听力问题会影响您完成自己定的大部分目标吗？" },
      { id: "i3", domain: "个人方面", text: "因为听力问题，您对生活乐观的态度有多少？" },
      { id: "i4", domain: "个人方面", text: "听力问题给您带来了多大程度的负面情绪（焦虑、愤怒、沮丧、悲伤）？" },
      { id: "i5", domain: "个人方面", text: "因为听力问题，面对压力时，您觉得有多难？" },
      { id: "i6", domain: "个人方面", text: "因为听力问题，在生活中，您得到了家人多大的支持和帮助？" },
    ],
  },
  {
    id: "support",
    title: "社会支持方面",
    description: "字幕与辅助技术、不公平对待和听力健康服务。",
    items: [
      { id: "s1", domain: "社会支持方面", text: "您使用字幕、助听设备等技术帮助您参与社交和社区活动（面对面或线上）吗？" },
      { id: "s2", domain: "社会支持方面", text: "您觉得别人因为您的听力不太好而对您不公平吗？" },
      { id: "s3", domain: "社会支持方面", text: "听力健康服务（如听力检查、验配助听器、听力康复）对您的生活帮助大吗？" },
    ],
  },
  {
    id: "health",
    title: "健康方面",
    description: "整体健康、耳鸣和视力对生活的影响。",
    items: [
      { id: "g1", domain: "健康方面", text: "您的整体健康状况给您带来了多大的困难？" },
      { id: "g2", domain: "健康方面", text: "您耳朵里的嗡嗡声或者铃声（耳鸣）给您的生活带来了多大的影响？" },
      { id: "g3", domain: "健康方面", text: "眼睛看不清对您的生活有多大影响？" },
    ],
  },
];

const allItems = domains.flatMap((domain) => domain.items);

function scoreOf(value?: ResponseValue) {
  return responseOptions.find((option) => option.value === value)?.score ?? null;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function HfeqMandarinTool() {
  const [participantId, setParticipantId] = useState("");
  const [hearingLoss, setHearingLoss] = useState("");
  const [hearingLevel, setHearingLevel] = useState("");
  const [responses, setResponses] = useState<Record<string, ResponseValue>>({});

  const summary = useMemo(() => {
    return domains.map((domain) => {
      const values = domain.items.map((item) => responses[item.id]);
      const scored = values.map(scoreOf).filter((value): value is number => value !== null);
      const sum = scored.reduce((total, value) => total + value, 0);
      return {
        id: domain.id,
        title: domain.title,
        answered: values.filter(Boolean).length,
        applicable: scored.length,
        notApplicable: values.filter((value) => value === "na").length,
        missing: domain.items.length - values.filter(Boolean).length,
        sum,
        mean: scored.length ? sum / scored.length : null,
        total: domain.items.length,
      };
    });
  }, [responses]);

  const answeredCount = Object.keys(responses).length;
  const progress = Math.round((answeredCount / allItems.length) * 100);

  const exportPayload = {
    instrument: "HFEQ-Mandarin Research Preview",
    version: "V1 research preview",
    exportedAt: new Date().toISOString(),
    participantId,
    hearingLoss,
    hearingLevel,
    note:
      "Raw response profile only. The HFEQ-Mandarin is still in validation; do not use this output as a clinical diagnosis or final validated score.",
    responses: allItems.map((item) => ({
      itemId: item.id,
      domain: item.domain,
      text: item.text,
      response: responses[item.id] ? responseOptions.find((option) => option.value === responses[item.id])?.label : "",
      rawScore: scoreOf(responses[item.id]),
    })),
    domainSummary: summary,
  };

  const exportJson = () => {
    downloadFile(`hfeq-mandarin-${participantId || "response"}.json`, JSON.stringify(exportPayload, null, 2), "application/json;charset=utf-8");
  };

  const exportCsv = () => {
    const header = ["item_id", "domain", "response", "raw_score", "item_text"];
    const rows = exportPayload.responses.map((row) =>
      [row.itemId, row.domain, row.response ?? "", row.rawScore ?? "", row.text]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    );
    downloadFile(`hfeq-mandarin-${participantId || "response"}.csv`, [header.join(","), ...rows].join("\n"), "text/csv;charset=utf-8");
  };

  const reset = () => {
    setParticipantId("");
    setHearingLoss("");
    setHearingLevel("");
    setResponses({});
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="space-y-6">
        <section className="surface p-5 md:p-6">
          <h2 className="text-2xl">开始前</h2>
          <p className="mt-3 text-sm text-neutral-600">
            请根据您平常在不同环境中的听力情况作答。如果您使用助听器或其他听力设备，请根据佩戴设备时的听力状况回答。
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800">Participant ID</span>
              <input
                value={participantId}
                onChange={(event) => setParticipantId(event.target.value)}
                className="mt-2 w-full rounded-md border-stone-300 text-sm"
                placeholder="optional"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800">您觉得您有听力下降吗？</span>
              <select value={hearingLoss} onChange={(event) => setHearingLoss(event.target.value)} className="mt-2 w-full rounded-md border-stone-300 text-sm">
                <option value="">请选择</option>
                <option value="yes">有</option>
                <option value="no">没有</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800">您觉得您的听力水平如何？</span>
              <select value={hearingLevel} onChange={(event) => setHearingLevel(event.target.value)} className="mt-2 w-full rounded-md border-stone-300 text-sm">
                <option value="">请选择</option>
                <option value="very_poor">很差</option>
                <option value="poor">差</option>
                <option value="fair">一般</option>
                <option value="good">好</option>
                <option value="very_good">很好</option>
              </select>
            </label>
          </div>
        </section>

        {domains.map((domain) => (
          <section key={domain.id} className="surface scroll-mt-28 p-5 md:p-6">
            <div className="flex flex-col gap-2 border-b border-stone-200 pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="kicker">{domain.items.length} items</p>
                <h2 className="mt-2 text-2xl">{domain.title}</h2>
                <p className="mt-2 text-sm text-neutral-600">{domain.description}</p>
              </div>
              <div className="text-sm font-semibold text-neutral-500">
                {summary.find((item) => item.id === domain.id)?.answered || 0}/{domain.items.length}
              </div>
            </div>

            <div className="divide-y divide-stone-200">
              {domain.items.map((item, index) => (
                <fieldset key={item.id} className="py-5">
                  <legend className="text-base font-semibold leading-relaxed text-neutral-950">
                    {index + 1}. {item.text}
                  </legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {responseOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-2 text-center text-xs font-semibold transition-colors ${
                          responses[item.id] === option.value
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-stone-200 bg-white text-neutral-700 hover:border-stone-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name={item.id}
                          value={option.value}
                          checked={responses[item.id] === option.value}
                          onChange={() => setResponses((current) => ({ ...current, [item.id]: option.value }))}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
        ))}
      </form>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="surface p-5">
          <p className="kicker">Research preview</p>
          <h2 className="mt-2 text-2xl">Response Profile</h2>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold text-neutral-700">
              <span>Completed</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-stone-200">
              <div className="h-2 rounded-full bg-brand-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            原始均分按 0-4 计算，并排除“不适合我”。部分条目反映资源或支持，而不是困难程度；在正式验证和计分规则确定前，请按维度和条目解释。
          </p>
        </div>

        <div className="surface p-5">
          <h3 className="text-lg">Domain Summary</h3>
          <div className="mt-4 space-y-3">
            {summary.map((domain) => (
              <div key={domain.id} className="rounded-md border border-stone-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-neutral-950">{domain.title}</span>
                  <span className="text-sm font-semibold text-brand-primary">{domain.mean === null ? "-" : domain.mean.toFixed(2)}</span>
                </div>
                <div className="mt-2 text-xs text-neutral-500">
                  answered {domain.answered}/{domain.total}; applicable {domain.applicable}; N/A {domain.notApplicable}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h3 className="text-lg">Export</h3>
          <div className="mt-4 grid gap-2">
            <button type="button" onClick={exportJson} className="btn">
              Export JSON
            </button>
            <button type="button" onClick={exportCsv} className="btn-secondary">
              Export CSV
            </button>
            <button type="button" onClick={reset} className="rounded-md border border-stone-200 px-4 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:bg-stone-50">
              Reset
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
