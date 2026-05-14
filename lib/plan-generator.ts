export type PlanAnswers = {
  goal?: string;
  focus?: string;
  duration?: string;
  location?: string;
  startDate?: string;
  frequency?: string;
  level?: string;
  notes?: string;
};

export type GeneratedPlanDay = {
  day: number;
  date: string;
  title: string;
  focus: string;
  duration: string;
  blocks: string[];
  note: string;
};

export type GeneratedPlanOption = {
  id: string;
  title: string;
  style: string;
  summary: string;
  startDate: string;
  duration: string;
  location: string;
  frequency: string;
  goal: string;
  focus: string;
  highlights: string[];
  days: GeneratedPlanDay[];
};

export const SELECTED_PLAN_STORAGE_KEY = "fitpilot-selected-plan";
export const PLAN_OPTIONS_STORAGE_KEY = "fitpilot-plan-options";

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateIso: string, days: number) {
  const date = new Date(`${dateIso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function formatDateLabel(dateIso?: string) {
  if (!dateIso) return "未设置";
  const date = new Date(`${dateIso}T00:00:00`);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function getNextMonday() {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  date.setDate(date.getDate() + diff);
  return toIsoDate(date);
}

function parseFrequency(value?: string) {
  const match = value?.match(/\d+/);
  return Math.max(2, Math.min(6, match ? Number(match[0]) : 4));
}

function getTrainingPattern(frequency: number) {
  const patterns: Record<number, number[]> = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 5],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
  };

  return patterns[frequency] ?? patterns[4];
}

function normalizeAnswers(answers: PlanAnswers) {
  const startDate = answers.startDate || toIsoDate(new Date());
  return {
    goal: answers.goal || "塑形与体能提升",
    focus: answers.focus || "全身均衡",
    duration: answers.duration || "45 分钟",
    location: answers.location || "健身房",
    startDate,
    frequency: answers.frequency || "每周 4 天",
    level: answers.level || "有基础",
    notes: answers.notes || "无特殊限制",
  };
}

function cleanFocusLabel(focus: string) {
  return focus.replace(/优先/g, "").trim() || focus;
}

function focusPriorityLabel(focus: string) {
  return focus.includes("优先") ? focus : `${focus}优先`;
}

function getEquipmentCue(location: string) {
  if (location.includes("家")) return "哑铃、弹力带或自重动作";
  if (location.includes("户外") || location.includes("酒店")) {
    return "自重、弹力带和可用空间";
  }
  return "杠铃、哑铃、绳索或固定器械";
}

function goalCue(goal: string) {
  if (goal.includes("增肌")) {
    return {
      main: "中等次数增肌区间，主动作 3-4 组，辅助动作 2-3 组",
      finish: "收尾用泵感组或慢速离心，不追求力竭堆量",
    };
  }
  if (goal.includes("减脂")) {
    return {
      main: "复合动作为主，组间休息控制在 60-90 秒",
      finish: "收尾加入 8-12 分钟低冲击有氧或循环训练",
    };
  }
  return {
    main: "优先动作质量和稳定节奏，每组保留 1-2 次余力",
    finish: "收尾做灵活性、核心或薄弱环节控制",
  };
}

function upperBodyTemplates(planType: "balanced" | "focused" | "gentle") {
  if (planType === "focused") {
    return [
      ["上肢推力量", "胸、肩、三头主导，卧推/推举优先"],
      ["下肢与核心维护", "臀腿基础量，避免下肢拖累恢复"],
      ["上肢拉力量", "背阔肌、菱形肌、二头，改善上半身厚度"],
      ["恢复日", "步行、肩胛活动、胸椎伸展"],
      ["上肢增肌补量", "肩侧束、手臂、上胸和背部细节"],
      ["全身代谢轻量", "低冲击循环，保持消耗但不过度疲劳"],
      ["完全恢复", "睡眠、补水、轻拉伸"],
    ];
  }

  if (planType === "gentle") {
    return [
      ["上肢基础推拉", "轻中强度胸背超级组，建立动作节奏"],
      ["恢复日", "肩颈放松、胸椎活动、步行"],
      ["下肢与核心", "臀腿基础动作，保持全身平衡"],
      ["恢复日", "低压力活动和拉伸"],
      ["上肢线条", "肩、手臂、背部姿态控制"],
      ["全身轻力量", "动作复习和低疲劳容量"],
      ["完全恢复", "记录疲劳和睡眠"],
    ];
  }

  return [
    ["上肢推", "胸、肩、三头增肌与力量"],
    ["下肢 + 核心", "臀腿基础量，维持比例和代谢"],
    ["恢复日", "步行、拉伸、肩胛稳定"],
    ["上肢拉", "背部厚度、二头和体态"],
    ["恢复日", "胸椎伸展和轻有氧"],
    ["上肢增肌补量", "肩侧束、手臂、上胸、背部线条"],
    ["完全恢复", "低压力恢复"],
  ];
}

function lowerBodyTemplates(planType: "balanced" | "focused" | "gentle") {
  if (planType === "focused") {
    return [
      ["下肢力量", "深蹲/腿举模式，股四头肌主导"],
      ["上肢维护", "推拉基础量，保持肩背健康"],
      ["臀腿后链", "硬拉/髋铰链模式，臀腿线条"],
      ["恢复日", "髋踝活动、轻松步行"],
      ["下肢增肌补量", "臀中肌、腿后侧、小腿和核心"],
      ["全身代谢轻量", "低冲击循环，提高消耗"],
      ["完全恢复", "睡眠和软组织放松"],
    ];
  }

  return [
    ["下肢力量", "臀腿主动作和核心稳定"],
    ["上肢推拉", "上半身基础量，保持平衡"],
    ["恢复日", "髋屈肌、腘绳肌和踝关节活动"],
    ["臀腿塑形", "臀桥、弓步、腿弯举模式"],
    ["恢复日", "轻松步行和拉伸"],
    ["全身 + 核心", "中等强度全身循环"],
    ["完全恢复", "低压力恢复"],
  ];
}

function balancedTemplates(planType: "balanced" | "focused" | "gentle") {
  if (planType === "focused") {
    return [
      ["上肢推", "胸肩三头力量"],
      ["下肢力量", "臀腿主动作"],
      ["上肢拉", "背部和二头"],
      ["恢复日", "拉伸和步行"],
      ["全身增肌", "复合动作和辅助动作"],
      ["代谢循环", "低冲击心肺和核心"],
      ["完全恢复", "睡眠、补水和记录"],
    ];
  }

  if (planType === "gentle") {
    return [
      ["全身基础", "动作学习和低疲劳容量"],
      ["恢复日", "步行与灵活性"],
      ["上肢姿态", "背部、肩胛和核心"],
      ["恢复日", "拉伸与呼吸"],
      ["下肢基础", "臀腿和膝髋稳定"],
      ["轻循环", "可持续体能"],
      ["完全恢复", "低压力恢复"],
    ];
  }

  return [
    ["上肢推", "胸肩三头"],
    ["下肢 + 核心", "臀腿与核心稳定"],
    ["恢复日", "灵活性和步行"],
    ["上肢拉", "背部二头和体态"],
    ["恢复日", "轻活动"],
    ["全身塑形", "复合动作 + 代谢收尾"],
    ["完全恢复", "睡眠和补水"],
  ];
}

function getWeeklyTemplate(
  focus: string,
  planType: "balanced" | "focused" | "gentle",
) {
  if (focus.includes("上半身")) return upperBodyTemplates(planType);
  if (focus.includes("下半身") || focus.includes("臀腿")) {
    return lowerBodyTemplates(planType);
  }
  return balancedTemplates(planType);
}

function buildDays(
  answers: ReturnType<typeof normalizeAnswers>,
  planType: "balanced" | "focused" | "gentle",
  totalDays: number,
) {
  const frequency = parseFrequency(answers.frequency);
  const trainingPattern = getTrainingPattern(frequency);
  const weeklyTemplate = getWeeklyTemplate(answers.focus, planType);
  const equipment = getEquipmentCue(answers.location);
  const cue = goalCue(answers.goal);
  let trainingIndex = 0;

  return Array.from({ length: totalDays }, (_, index): GeneratedPlanDay => {
    const day = index + 1;
    const date = addDays(answers.startDate, index);
    const weekdayIndex = index % 7;
    const isTrainingDay = trainingPattern.includes(weekdayIndex);
    const template = weeklyTemplate[weekdayIndex];

    if (!isTrainingDay) {
      return {
        day,
        date,
        title: template?.[0] ?? "恢复日",
        focus: template?.[1] ?? "步行、拉伸、睡眠与补水",
        duration: "20-30 分钟",
        blocks: [
          "轻松步行 20-30 分钟或完全休息",
          "针对上一训练日做 2-3 个拉伸/活动度动作",
          "记录睡眠、酸痛和下一次训练准备度",
        ],
        note: "恢复日用于提高下一次训练质量，不建议临时加大强度。",
      };
    }

    const workout = template ?? weeklyTemplate[trainingIndex % weeklyTemplate.length];
    trainingIndex += 1;

    return {
      day,
      date,
      title: workout[0],
      focus: workout[1],
      duration: answers.duration,
      blocks: [
        `热身 8 分钟：动态活动 + ${equipment}准备`,
        `主训练：${cue.main}`,
        cue.finish,
      ],
      note:
        planType === "focused"
          ? "挑战版可以更累，但同一肌群至少保留 48 小时高质量恢复。"
          : "保持动作质量，训练后记录重量、次数和主观疲劳度。",
    };
  });
}

export function generatePlanOptions(answers: PlanAnswers): GeneratedPlanOption[] {
  const normalized = normalizeAnswers(answers);
  const focusBase = cleanFocusLabel(normalized.focus);

  return [
    {
      id: "balanced",
      title: "稳步进阶计划",
      style: "均衡推荐",
      summary: `适合以${normalized.goal}为主，希望在${normalized.location}稳定训练的人。`,
      startDate: normalized.startDate,
      duration: normalized.duration,
      location: normalized.location,
      frequency: normalized.frequency,
      goal: normalized.goal,
      focus: normalized.focus,
      highlights: [
        "训练日错开",
        focusPriorityLabel(normalized.focus),
        "恢复安排明确",
      ],
      days: buildDays(normalized, "balanced", 14),
    },
    {
      id: "focused",
      title: "目标冲刺计划",
      style: "更有挑战",
      summary: `在${normalized.duration}内提高训练密度，适合短期想看到变化的阶段。`,
      startDate: normalized.startDate,
      duration: normalized.duration,
      location: normalized.location,
      frequency: normalized.frequency,
      goal: normalized.goal,
      focus: normalized.focus,
      highlights: ["容量更高", `${focusBase}补量`, "避免连续同肌群"],
      days: buildDays(normalized, "focused", 10),
    },
    {
      id: "gentle",
      title: "可持续习惯计划",
      style: "低压力",
      summary: `优先建立稳定节奏，适合${normalized.level}阶段或近期压力较高时使用。`,
      startDate: normalized.startDate,
      duration: normalized.duration,
      location: normalized.location,
      frequency: normalized.frequency,
      goal: normalized.goal,
      focus: normalized.focus,
      highlights: ["动作友好", "恢复更多", "降低放弃率"],
      days: buildDays(normalized, "gentle", 21),
    },
  ];
}
