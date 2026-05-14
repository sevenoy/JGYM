import {
  addDays,
  toIsoDate,
  type GeneratedPlanOption,
} from "@/lib/plan-generator";

export const PERSONAL_PLAN_STRICT_STORAGE_KEY = "fitpilot-personal-plan-strict";
export const PERSONAL_PLAN_SETTINGS_STORAGE_KEY = "fitpilot-personal-plan-settings";
export const PERSONAL_PLAN_SETTINGS_EVENT = "fitpilot-personal-plan-settings-updated";

export type PersonalPlanSettings = {
  startDate: string;
  startPlanDay: number;
  currentPlanDay: number;
  updatedAt?: string;
};

export type PersonalPlanExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  note: string;
};

export type PersonalPlanDay = {
  weekday: "周一" | "周二" | "周三" | "周四" | "周五" | "周六" | "周日";
  title: string;
  type: "strength" | "recovery" | "rest";
  intensity: string;
  duration: string;
  goal: string;
  caloriesType: "training" | "rest";
  warmup: string[];
  exercises: PersonalPlanExercise[];
  recovery: string[];
};

export const personalPlan = {
  title: "16周摄影师体态增肌计划",
  subtitle: "肩更宽、上胸更立、背更挺、腰腹更紧，穿衣更有型。",
  profile: ["178cm", "65kg左右", "43岁", "偏瘦", "每周可练4天", "摄影师职业保护"],
  weightTarget: "16周后 67–68kg，体重慢慢涨，腰围基本不涨。",
  visualTargets: ["上胸更饱满", "肩中束更明显", "背部更展开", "侧面体态更挺", "腰腹更紧"],
  phases: [
    {
      weeks: "第1–3周",
      title: "动作标准期",
      detail: "每组保留2次余力，不力竭，不递减，动作干净比重量重要。",
    },
    {
      weeks: "第4周",
      title: "小减量周",
      detail: "组数减少30%，重量保持或降5–10%，恢复肩、肘、手腕和下背。",
    },
    {
      weeks: "第5–7周",
      title: "增肌推进期",
      detail: "主动作保留1–2次余力，孤立动作最后一组可接近力竭。",
    },
    {
      weeks: "第8周",
      title: "小减量周",
      detail: "组数减少30–40%，不冲重量，为后续强化做准备。",
    },
    {
      weeks: "第9–11周",
      title: "轮廓强化期",
      detail: "重点强化肩、背、上胸；每次训练最多1个孤立动作做递减组。",
    },
    {
      weeks: "第12周",
      title: "小减量周",
      detail: "组数减少30%，动作保持标准，让关节和神经恢复。",
    },
    {
      weeks: "第13–15周",
      title: "精修清晰期",
      detail: "保持力量，增加线条感；有氧略微增加，观察腰围。",
    },
    {
      weeks: "第16周",
      title: "测试 + 拍照周",
      detail: "不冲极限，记录体重、腰围、正侧背照片和关键动作重量。",
    },
  ],
  nutrition: {
    training: {
      calories: 2400,
      protein: "135–145g",
      fat: "55–65g",
      carbs: "280–320g",
    },
    rest: {
      calories: 2250,
      protein: "135–145g",
      fat: "60–70g",
      carbs: "220–260g",
    },
    rules: [
      "看7天平均体重，不看单日波动。",
      "连续2周体重不涨，每天加100–150 kcal。",
      "一周涨超过0.4kg，每天减100–150 kcal。",
      "腰围明显变粗，休息日减少100–150 kcal并加一次低强度有氧。",
    ],
  },
  mealTemplates: {
    training: [
      "早餐：燕麦60–80g、牛奶300ml、鸡蛋2个、香蕉1根。",
      "训练前：香蕉+无糖酸奶，或米饭150g+鸡蛋1个。",
      "训练后：米饭200–250g、鱼/虾/鸡/牛150–200g、蔬菜一大份。",
    ],
    rest: [
      "早餐：鸡蛋2个、牛奶或无糖酸奶、燕麦40–60g、水果1份。",
      "午餐：米饭200g、肉类150–200g、蔬菜一大份。",
      "晚餐：肉类150–200g、蔬菜一大份、米饭100–150g。",
    ],
  },
  dailyPosture: ["下巴内收 2×10", "墙天使 2×10", "胸小肌拉伸 每边30秒", "猫牛式 10次", "真空腹 3×20–30秒"],
  weeklyCheck: ["体重7天平均", "腰围", "正面/侧面/背面照片", "上斜卧推", "高位下拉", "坐姿划船", "侧平举", "睡眠与疼痛"],
  painRules: ["关节刺痛立刻停止", "肩痛优先减少推胸和重肩推", "腰痛把划船改胸托或器械", "手腕痛减少杠铃并使用中立握", "肘痛减少弯举和下压量"],
};

export const personalPlanDays: PersonalPlanDay[] = [
  {
    weekday: "周一",
    title: "上胸 + 肩中束 + 三头",
    type: "strength",
    intensity: "中高",
    duration: "75–85分钟",
    goal: "上胸饱满、肩膀变宽、胸型立体。",
    caloriesType: "training",
    warmup: ["全身升温5分钟", "弹力带外旋2×15/边", "弹力带拉开2×15", "轻重量上斜推胸2×12", "空手侧平举1×20"],
    exercises: [
      { name: "上斜哑铃卧推", sets: "4组", reps: "6–10次", rest: "2分钟", note: "30度凳面，肩胛夹紧下沉，下放2秒。", },
      { name: "器械推胸 / 平板哑铃卧推", sets: "3组", reps: "8–12次", rest: "90秒", note: "肩膀累选器械推胸，二选一。", },
      { name: "低位绳索夹胸 / 蝴蝶机", sets: "3组", reps: "12–15次", rest: "60–90秒", note: "顶峰夹紧1秒，胸发力。", },
      { name: "哑铃侧平举", sets: "5组", reps: "12–20次", rest: "45–60秒", note: "视觉变宽关键，轻重量慢下放，不耸肩。", },
      { name: "绳索下压", sets: "3组", reps: "10–15次", rest: "60秒", note: "手肘固定，底部伸直但不锁死。", },
      { name: "过顶绳索臂屈伸", sets: "2组", reps: "12–15次", rest: "60秒", note: "补三头长头，让手臂更完整。", },
    ],
    recovery: ["门框胸肌拉伸 每边30秒×2", "肩前束拉伸 每边30秒", "三头过头拉伸 每边30秒×2", "背阔肌拉伸 每边30秒"],
  },
  {
    weekday: "周二",
    title: "背 + 肩后束 + 二头",
    type: "strength",
    intensity: "中高",
    duration: "75–85分钟",
    goal: "背宽、背厚、肩背挺拔，改善圆肩。",
    caloriesType: "training",
    warmup: ["全身升温5分钟", "轻重量高位下拉2×12", "肩胛下沉练习2×10", "轻重量面拉2×15"],
    exercises: [
      { name: "辅助引体向上 / 高位下拉", sets: "4组", reps: "6–10次", rest: "2分钟", note: "先沉肩再拉，拉到上胸附近。", },
      { name: "坐姿划船", sets: "4组", reps: "8–12次", rest: "90–120秒", note: "挺胸，拉到肚脐附近，避免腰借力。", },
      { name: "胸托划船 / 单臂器械划船", sets: "3组", reps: "10–12次", rest: "90秒", note: "优先胸托或器械，对下背更友好。", },
      { name: "直臂下压", sets: "3组", reps: "12–15次", rest: "60–90秒", note: "手臂只是钩子，感受背阔肌收缩。", },
      { name: "反向蝴蝶机", sets: "4组", reps: "15–20次", rest: "60秒", note: "练肩后束和上背，顶峰停0.5–1秒。", },
      { name: "哑铃弯举 / 锤式弯举", sets: "3组", reps: "10–15次", rest: "60秒", note: "二选一，隔周轮换，避免肘部疲劳。", },
    ],
    recovery: ["背阔肌拉伸 每边30秒×2", "肩后侧拉伸 每边30秒×2", "二头墙面拉伸 每边30秒", "胸椎伸展1–2分钟"],
  },
  {
    weekday: "周三",
    title: "有氧 + 体态恢复",
    type: "recovery",
    intensity: "低",
    duration: "30–45分钟",
    goal: "恢复肩颈、改善体态、促进血液循环、控制体脂。",
    caloriesType: "rest",
    warmup: ["快走 / 椭圆机 / 单车 25–30分钟", "强度保持能说话、微微喘"],
    exercises: [
      { name: "胸小肌拉伸", sets: "2组", reps: "每边30秒", rest: "自然呼吸", note: "放松圆肩压力。", },
      { name: "墙天使", sets: "2组", reps: "10次", rest: "45秒", note: "改善肩胛和胸椎控制。", },
      { name: "下巴内收", sets: "2组", reps: "10次", rest: "30秒", note: "保护摄影工作中的颈部。", },
      { name: "Y-T-W", sets: "2轮", reps: "每个8–10次", rest: "45秒", note: "肩袖和上背激活。", },
      { name: "死虫式", sets: "2组", reps: "10次/边", rest: "45秒", note: "核心稳定，不增加疲劳。", },
    ],
    recovery: ["不要加力量训练", "如果很累，缩短有氧并保留拉伸", "晚上做5分钟体态任务"],
  },
  {
    weekday: "周四",
    title: "腿臀 + 核心稳定",
    type: "strength",
    intensity: "中等",
    duration: "65–75分钟",
    goal: "腿臀不拖后腿，保护腰背，增强拍摄时核心稳定。",
    caloriesType: "training",
    warmup: ["全身升温5分钟", "臀桥2×15", "徒手深蹲2×12", "腿举轻重量2×12"],
    exercises: [
      { name: "腿举 / 哈克深蹲", sets: "4组", reps: "8–12次", rest: "2分钟", note: "膝盖跟脚尖一致，不锁死。", },
      { name: "臀推 / 器械臀桥", sets: "3组", reps: "8–12次", rest: "90–120秒", note: "顶峰夹臀1秒，不用腰顶。", },
      { name: "腿弯举", sets: "3组", reps: "10–15次", rest: "90秒", note: "训练后侧链，保护膝盖和腰。", },
      { name: "腿屈伸", sets: "2–3组", reps: "12–15次", rest: "60–90秒", note: "慢速控制，不甩。", },
      { name: "臀外展机 / 保加利亚分腿蹲", sets: "2组", reps: "12–15次", rest: "90秒", note: "外拍前一天选臀外展机。", },
      { name: "死虫式", sets: "3组", reps: "10–12次/边", rest: "45–60秒", note: "腰不要离地，动作慢。", },
      { name: "Pallof Press 抗旋转", sets: "3组", reps: "10–12次/边", rest: "45–60秒", note: "摄影师举相机和背器材的核心稳定。", },
    ],
    recovery: ["股四头肌拉伸 每边30秒×2", "腘绳肌拉伸 每边30秒×2", "臀肌拉伸 每边30秒×2", "儿童式1分钟"],
  },
  {
    weekday: "周五",
    title: "完全休息 / 散步",
    type: "rest",
    intensity: "低",
    duration: "0–30分钟",
    goal: "恢复神经、关节和肌肉，让周六状态更好。",
    caloriesType: "rest",
    warmup: ["散步20–30分钟可选", "轻松拉伸5–10分钟", "泡沫轴放松5分钟"],
    exercises: [
      { name: "胸肌拉伸", sets: "1组", reps: "30秒", rest: "自然呼吸", note: "只放松，不追求强度。", },
      { name: "猫牛式", sets: "1组", reps: "10次", rest: "自然呼吸", note: "恢复胸椎和腰背。", },
      { name: "儿童式", sets: "1组", reps: "1分钟", rest: "自然呼吸", note: "降低整体紧张度。", },
    ],
    recovery: ["不要做力量训练", "如果外拍很多，优先睡眠和补水"],
  },
  {
    weekday: "周六",
    title: "肩背胸线条 + 肩袖体态",
    type: "strength",
    intensity: "中低",
    duration: "60–70分钟",
    goal: "泵感、线条、体态、肩袖保护；不冲大重量。",
    caloriesType: "training",
    warmup: ["空手侧平举1×20", "轻重量反向蝴蝶机1×20", "轻重量夹胸1×15"],
    exercises: [
      { name: "器械上斜推胸", sets: "3组", reps: "12–15次", rest: "75–90秒", note: "中等重量，不练到动作变形。", },
      { name: "绳索夹胸 / 蝴蝶机", sets: "2–3组", reps: "12–15次", rest: "60秒", note: "顶峰夹紧1秒。", },
      { name: "绳索侧平举 / 哑铃侧平举", sets: "5组", reps: "15–25次", rest: "45–60秒", note: "抬1秒、顶峰0.5秒、下放2秒。", },
      { name: "反向蝴蝶机", sets: "4组", reps: "15–20次", rest: "60秒", note: "肩后束和上背，让侧面更挺拔。", },
      { name: "直臂下压", sets: "3组", reps: "12–15次", rest: "60–90秒", note: "轻中重量找背阔肌收缩。", },
      { name: "面拉", sets: "2–3组", reps: "15–20次", rest: "60秒", note: "拉向眼睛或额头，重量不要大。", },
      { name: "真空腹 + 呼吸训练", sets: "3组", reps: "20–30秒", rest: "45秒", note: "控制腹横肌，让站姿更利落。", },
    ],
    recovery: ["胸肌拉伸 每边30秒×2", "背阔肌拉伸 每边30秒×2", "肩后侧拉伸 每边30秒×2", "胸椎伸展1–2分钟"],
  },
  {
    weekday: "周日",
    title: "低强度有氧 + 深度拉伸",
    type: "recovery",
    intensity: "低",
    duration: "25–45分钟",
    goal: "促进恢复、控制体脂、改善柔韧性和体态。",
    caloriesType: "rest",
    warmup: ["坡度走 / 椭圆机 / 单车 25–35分钟", "如果本周很累，可以取消有氧只拉伸"],
    exercises: [
      { name: "胸肌拉伸", sets: "2组", reps: "每边45秒", rest: "自然呼吸", note: "深度放松胸前紧张。", },
      { name: "背阔肌拉伸", sets: "2组", reps: "每边45秒", rest: "自然呼吸", note: "改善肩背线条。", },
      { name: "髋屈肌拉伸", sets: "2组", reps: "每边45秒", rest: "自然呼吸", note: "减少久站和拍摄后的骨盆压力。", },
      { name: "靠墙呼吸放松", sets: "1组", reps: "2分钟", rest: "自然呼吸", note: "结束一周疲劳。", },
    ],
    recovery: ["深度拉伸15–20分钟", "周日早上记录周检查表"],
  },
];

export const personalLiftBaselines = [
  { label: "上斜哑铃卧推", last: "24kg × 10", next: "24kg 争取 10/10/10/10，达成后每只加1–2kg" },
  { label: "高位下拉", last: "55kg × 10", next: "55kg 保持沉肩，4组接近10次后加一档" },
  { label: "坐姿划船", last: "45kg × 12", next: "45kg 保持挺胸，不用腰借力" },
  { label: "侧平举", last: "8kg × 15", next: "先稳定到20/20/18/18/17，再小幅加重量" },
];

const weekdayByIndex = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] as const;

export function clampPlanDay(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(112, Math.round(value)));
}

export function getDefaultPersonalPlanSettings(): PersonalPlanSettings {
  return {
    startDate: toIsoDate(new Date()),
    startPlanDay: 1,
    currentPlanDay: 1,
  };
}

export function parsePersonalPlanSettings(raw: string): PersonalPlanSettings {
  if (!raw) return getDefaultPersonalPlanSettings();

  try {
    const parsed = JSON.parse(raw) as Partial<PersonalPlanSettings>;
    return {
      startDate: parsed.startDate || toIsoDate(new Date()),
      startPlanDay: clampPlanDay(Number(parsed.startPlanDay ?? 1)),
      currentPlanDay: clampPlanDay(Number(parsed.currentPlanDay ?? parsed.startPlanDay ?? 1)),
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return getDefaultPersonalPlanSettings();
  }
}

export function getPersonalPlanForExecutionDay(planDay: number) {
  const index = (clampPlanDay(planDay) - 1) % personalPlanDays.length;
  return personalPlanDays[index];
}

export function getTodayPersonalPlan(date = new Date()) {
  const weekday = weekdayByIndex[date.getDay()];
  return personalPlanDays.find((day) => day.weekday === weekday) ?? personalPlanDays[0];
}

export function getTodayPerformanceTargets(day: PersonalPlanDay) {
  if (day.weekday === "周一") return personalLiftBaselines.filter((item) => item.label.includes("上斜") || item.label.includes("侧平举"));
  if (day.weekday === "周二") return personalLiftBaselines.filter((item) => item.label.includes("下拉") || item.label.includes("划船"));
  if (day.weekday === "周六") return personalLiftBaselines.filter((item) => item.label.includes("侧平举") || item.label.includes("上斜"));
  if (day.weekday === "周四") {
    return [
      { label: "腿举 / 哈克深蹲", last: "100kg × 10", next: "先稳定4组8–12次，不牺牲膝盖轨迹" },
      { label: "Pallof Press", last: "15kg × 12/边", next: "保持身体不旋转，慢速控制" },
    ];
  }
  return [
    { label: "低强度有氧", last: "25分钟", next: day.weekday === "周日" ? "25–35分钟 + 深度拉伸" : "25–30分钟 + 体态恢复" },
  ];
}

function getPhaseForWeek(week: number) {
  if (week <= 3) return personalPlan.phases[0];
  if (week === 4) return personalPlan.phases[1];
  if (week <= 7) return personalPlan.phases[2];
  if (week === 8) return personalPlan.phases[3];
  if (week <= 11) return personalPlan.phases[4];
  if (week === 12) return personalPlan.phases[5];
  if (week <= 15) return personalPlan.phases[6];
  return personalPlan.phases[7];
}

type StrictPlanInput =
  | string
  | {
      startDate?: string;
      startPlanDay?: number;
    };

export function buildStrictPersonalPlanOption(
  input: StrictPlanInput = toIsoDate(new Date()),
): GeneratedPlanOption {
  const startDate = typeof input === "string" ? input : input.startDate || toIsoDate(new Date());
  const startPlanDay =
    typeof input === "string" ? 1 : clampPlanDay(Number(input.startPlanDay ?? 1));
  const totalDays = Math.max(1, 113 - startPlanDay);
  const days = Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(startDate, index);
    const planDay = startPlanDay + index;
    const schedule = getPersonalPlanForExecutionDay(planDay);
    const week = Math.floor((planDay - 1) / 7) + 1;
    const phase = getPhaseForWeek(week);
    const nutrition =
      schedule.caloriesType === "training"
        ? personalPlan.nutrition.training
        : personalPlan.nutrition.rest;

    return {
      day: planDay,
      date,
      title: schedule.title,
      focus: `${schedule.weekday} · ${schedule.goal}`,
      duration: schedule.duration,
      blocks: [
        `严格保留原计划：${schedule.warmup.join("；")}`,
        schedule.exercises
          .map((exercise) => `${exercise.name} ${exercise.sets} × ${exercise.reps}`)
          .join("；"),
        `结束恢复：${schedule.recovery.slice(0, 4).join("；")}`,
        `饮食：约${nutrition.calories} kcal，蛋白质${nutrition.protein}，碳水${nutrition.carbs}`,
      ],
      note: `第${week}周 · ${phase.title}：${phase.detail} AI 只能补充执行细节，不能删减你的原计划动作。`,
    };
  });

  return {
    id: "strict-personal-16-week",
    title: personalPlan.title,
    style: "严格按我的计划",
    summary: personalPlan.subtitle,
    startDate,
    duration: "16周",
    location: "健身房",
    frequency: "每周4天力量 + 2天恢复",
    goal: "高级干净身材轮廓",
    focus: "肩宽、上胸、背挺、腰紧",
    highlights: [
      `从第${startPlanDay}天开始`,
      "严格保留原计划",
      "只能补充不能删减",
      "饮食与恢复同步",
    ],
    days,
  };
}
