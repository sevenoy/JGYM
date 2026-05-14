import type { Exercise, Workout } from "./types";

export const SELECTED_BODY_PART_STORAGE_KEY = "fitpilot-selected-body-part";
export const UPLOADED_PHOTOS_STORAGE_KEY = "fitpilot-uploaded-photos";

export const bodyPartLabels = [
  "胸部",
  "背部",
  "肩部",
  "腿部",
  "臀部",
  "手臂",
  "核心",
  "有氧",
  "全身",
  "自定义",
] as const;

export type BodyPartLabel = (typeof bodyPartLabels)[number];

export const exerciseCategories = bodyPartLabels.filter(
  (part) => part !== "自定义",
);

export const exerciseCatalog: Exercise[] = [
  {
    id: "barbell-bench-press",
    name: "杠铃卧推",
    target: ["胸部", "胸大肌", "三头肌"],
    defaultSets: "4组",
    reps: "8-12次",
    rest: "90s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=900&q=80",
    description:
      "肩胛稳定后下沉，杠铃下降至胸部中下段，推起时保持手腕垂直。",
    cues: ["脚掌踩实地面", "手肘约 45 度打开", "大重量训练建议有人保护"],
  },
  {
    id: "incline-dumbbell-press",
    name: "上斜哑铃卧推",
    target: ["胸部", "上胸", "三头肌"],
    defaultSets: "4组",
    reps: "8-12次",
    rest: "90s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=80",
    description: "上斜角度强化上胸线条，推起时保持肩胛稳定和手腕中立。",
    cues: ["凳面角度 25-35 度", "下放到上胸附近", "顶端不要耸肩"],
  },
  {
    id: "push-up",
    name: "俯卧撑",
    target: ["胸部", "胸大肌", "肱三头肌"],
    defaultSets: "3组",
    reps: "力竭",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=900&q=80",
    description:
      "身体保持一条直线，肘部自然向后打开，下降时胸口接近地面。",
    cues: ["核心收紧", "肩胛稳定", "顶端不要锁死手肘"],
  },
  {
    id: "dumbbell-fly",
    name: "哑铃飞鸟",
    target: ["胸部", "胸大肌", "肩前束稳定"],
    defaultSets: "3组",
    reps: "12-15次",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=80",
    description: "用较轻重量拉伸并收缩胸大肌，适合放在卧推后制造胸部泵感。",
    cues: ["手肘微弯固定", "下放到胸部有拉伸感即可", "顶端不要让哑铃碰撞"],
  },
  {
    id: "pull-up",
    name: "引体向上",
    target: ["背部", "背阔肌"],
    defaultSets: "4组",
    reps: "力竭",
    rest: "90s",
    level: "高级",
    hasVideo: false,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    description:
      "先下沉肩胛，再用背部发力带动身体向上，避免耸肩和摆动借力。",
    cues: ["全程控制离心", "下巴越过横杆", "保持肋骨回收"],
  },
  {
    id: "single-arm-dumbbell-row",
    name: "单臂哑铃划船",
    target: ["背部", "背阔肌", "核心稳定"],
    defaultSets: "4组",
    reps: "10-12次",
    rest: "75s",
    level: "中级",
    hasVideo: false,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&w=900&q=80",
    description: "用单侧划船强化背阔肌发力，同时训练核心抗旋转能力。",
    cues: ["背部发力带动手肘", "顶部停顿一秒", "骨盆保持稳定"],
  },
  {
    id: "lat-pulldown",
    name: "高位下拉",
    target: ["背部", "背阔肌", "二头肌"],
    defaultSets: "4组",
    reps: "10-12次",
    rest: "75s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80",
    description: "适合建立背阔肌发力感，控制肩胛下沉后再拉动手肘。",
    cues: ["挺胸但不后仰过多", "手肘向身体两侧下拉", "慢速还原"],
  },
  {
    id: "overhead-press",
    name: "站姿推举",
    target: ["肩部", "三角肌", "核心"],
    defaultSets: "4组",
    reps: "6-10次",
    rest: "90s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=80",
    description: "垂直推举训练肩部力量，同时要求核心稳定和肋骨回收。",
    cues: ["臀腹夹紧", "杠铃贴近面部轨迹", "顶端手臂靠近耳朵"],
  },
  {
    id: "lateral-raise",
    name: "哑铃侧平举",
    target: ["肩部", "三角肌中束"],
    defaultSets: "4组",
    reps: "12-15次",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    description: "用中轻重量控制侧平举，强化肩宽视觉和中束泵感。",
    cues: ["手肘略弯", "不要耸肩", "顶端停顿半秒"],
  },
  {
    id: "reverse-dumbbell-fly",
    name: "俯身反向飞鸟",
    target: ["肩部", "三角肌后束", "上背稳定"],
    defaultSets: "3组",
    reps: "12-15次",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    description: "补足后束和上背稳定，让肩部训练更平衡，减少圆肩风险。",
    cues: ["胸口微收", "手肘带动向外打开", "顶部停顿一秒"],
  },
  {
    id: "cable-face-pull",
    name: "绳索面拉",
    target: ["肩部", "后束", "肩胛稳定"],
    defaultSets: "3组",
    reps: "12-15次",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    description: "训练肩胛后缩和外旋，适合推举或卧推后的肩部保护补量。",
    cues: ["绳索拉向眉心", "手肘略高于肩", "不要耸肩借力"],
  },
  {
    id: "barbell-squat",
    name: "杠铃深蹲",
    target: ["腿部", "股四头肌", "臀大肌"],
    defaultSets: "4组",
    reps: "8-12次",
    rest: "90s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1598575468023-8e65a8b1bfc9?auto=format&fit=crop&w=900&q=80",
    description:
      "保持胸腔打开，核心收紧，髋部向后坐，膝盖沿脚尖方向稳定移动。",
    cues: ["脚跟稳定发力", "下蹲到大腿接近平行", "起身时保持脊柱中立"],
  },
  {
    id: "leg-press",
    name: "腿举",
    target: ["腿部", "股四头肌", "臀大肌"],
    defaultSets: "4组",
    reps: "10-12次",
    rest: "90s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80",
    description: "稳定训练股四头肌和臀腿力量，适合放在深蹲后补量。",
    cues: ["膝盖沿脚尖方向", "不要完全锁死膝盖", "控制下放深度"],
  },
  {
    id: "romanian-deadlift",
    name: "罗马尼亚硬拉",
    target: ["臀部", "腘绳肌", "后链"],
    defaultSets: "4组",
    reps: "8-10次",
    rest: "90s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=900&q=80",
    description: "髋主导动作，强化臀腿后链和髋伸能力。",
    cues: ["髋向后推", "背部保持中立", "杠铃贴近腿部"],
  },
  {
    id: "hip-thrust",
    name: "杠铃臀推",
    target: ["臀部", "臀大肌"],
    defaultSets: "4组",
    reps: "8-12次",
    rest: "90s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=900&q=80",
    description: "顶峰收缩训练臀大肌，适合臀腿塑形计划。",
    cues: ["下巴微收", "顶端骨盆后倾", "脚跟发力"],
  },
  {
    id: "barbell-curl",
    name: "杠铃弯举",
    target: ["手臂", "二头肌"],
    defaultSets: "3组",
    reps: "10-12次",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1590507621108-433608c97823?auto=format&fit=crop&w=900&q=80",
    description: "二头肌基础动作，保持上臂稳定，避免身体摆动。",
    cues: ["肘部固定", "顶部挤压", "慢速下放"],
  },
  {
    id: "triceps-pushdown",
    name: "绳索下压",
    target: ["手臂", "三头肌"],
    defaultSets: "3组",
    reps: "12-15次",
    rest: "60s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    description: "稳定肘关节，让三头肌完成伸肘发力。",
    cues: ["肩膀放松", "手肘贴近身体", "底部完全伸直"],
  },
  {
    id: "plank",
    name: "平板支撑",
    target: ["核心", "腹横肌"],
    defaultSets: "3组",
    reps: "45-60秒",
    rest: "45s",
    level: "初级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    description: "训练核心抗伸展能力，适合作为训练末尾稳定补充。",
    cues: ["肋骨回收", "臀部不要塌", "均匀呼吸"],
  },
  {
    id: "dead-bug",
    name: "死虫",
    target: ["核心", "腹部稳定"],
    defaultSets: "3组",
    reps: "每侧10次",
    rest: "45s",
    level: "初级",
    hasVideo: false,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80",
    description: "低风险核心控制动作，帮助改善腰椎稳定。",
    cues: ["腰背贴地", "动作放慢", "保持呼吸"],
  },
  {
    id: "treadmill-interval",
    name: "跑步机间歇",
    target: ["有氧", "心肺"],
    defaultSets: "8轮",
    reps: "30秒快 + 60秒慢",
    rest: "按轮次",
    level: "中级",
    hasVideo: false,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
    description: "用短间歇提升心肺和热量消耗，强度按体感调整。",
    cues: ["先热身 5 分钟", "快跑段保持可控", "结束后慢走恢复"],
  },
  {
    id: "full-body-circuit",
    name: "全身循环训练",
    target: ["全身", "燃脂", "耐力"],
    defaultSets: "4轮",
    reps: "每站40秒",
    rest: "60s",
    level: "中级",
    hasVideo: true,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c1d3a0?auto=format&fit=crop&w=900&q=80",
    description: "推、拉、蹲、核心组合，提高整体训练密度。",
    cues: ["动作质量优先", "轮间补水", "心率过高就延长休息"],
  },
];

export function getWorkoutForBodyPart(part: string): Workout {
  const normalized = bodyPartLabels.includes(part as BodyPartLabel)
    ? part
    : "自定义";

  const workoutMap: Record<string, Workout> = {
    胸部: {
      id: "today-chest",
      title: "上半身胸部重点",
      subtitle: "AI 定制 • 胸部优先 + 肩胛稳定",
      duration: "68 分钟",
      goal: "上胸、胸中缝与肩胛稳定",
      bodyPart: "胸部 + 上半身辅助",
      score: 8.5,
      exercises: [
        {
          id: "incline-dumbbell-press",
          name: "上斜哑铃卧推",
          target: "上胸",
          recommendation: "推荐：4组 • 8-12次",
          sets: [
            { set: 1, weight: "24", reps: "12", done: false },
            { set: 2, weight: "26", reps: "10", done: false },
            { set: 3, weight: "26", reps: "10", done: false },
            { set: 4, weight: "24", reps: "12", done: false },
          ],
        },
        {
          id: "barbell-bench-press",
          name: "杠铃卧推",
          target: "胸部",
          recommendation: "推荐：4组 • 6-10次",
          sets: [
            { set: 1, weight: "60", reps: "10", done: false },
            { set: 2, weight: "65", reps: "8", done: false },
            { set: 3, weight: "65", reps: "8", done: false },
            { set: 4, weight: "60", reps: "10", done: false },
          ],
        },
        {
          id: "dumbbell-fly",
          name: "哑铃飞鸟",
          target: "胸部",
          recommendation: "推荐：3组 • 12-15次",
          sets: [
            { set: 1, weight: "12", reps: "15", done: false },
            { set: 2, weight: "12", reps: "12", done: false },
            { set: 3, weight: "10", reps: "15", done: false },
          ],
        },
        {
          id: "cable-face-pull",
          name: "绳索面拉",
          target: "肩胛稳定",
          recommendation: "推荐：3组 • 12-15次",
          sets: [
            { set: 1, weight: "20", reps: "15", done: false },
            { set: 2, weight: "20", reps: "15", done: false },
            { set: 3, weight: "20", reps: "12", done: false },
          ],
        },
      ],
    },
    背部: {
      id: "today-back",
      title: "背部拉力强化",
      subtitle: "AI 定制 • 背部优先",
      duration: "60 分钟",
      goal: "背阔肌与体态改善",
      bodyPart: "背部 + 二头",
      score: 8.7,
      exercises: [
        {
          id: "pull-up",
          name: "引体向上",
          target: "背部",
          recommendation: "推荐：4组 • 力竭",
          sets: [
            { set: 1, weight: "自重", reps: "8", done: false },
            { set: 2, weight: "自重", reps: "6", done: false },
          ],
        },
        {
          id: "single-arm-dumbbell-row",
          name: "单臂哑铃划船",
          target: "背阔肌",
          recommendation: "推荐：4组 • 10-12次",
          sets: [{ set: 1, weight: "28", reps: "12", done: false }],
        },
      ],
    },
    肩部: {
      id: "today-shoulders",
      title: "肩部立体塑形",
      subtitle: "AI 定制 • 肩部优先 + 后束平衡",
      duration: "62 分钟",
      goal: "中束宽度、后束饱满与肩胛稳定",
      bodyPart: "肩部 + 核心",
      score: 8.4,
      exercises: [
        {
          id: "overhead-press",
          name: "站姿推举",
          target: "肩部",
          recommendation: "推荐：4组 • 6-10次",
          sets: [
            { set: 1, weight: "35", reps: "8", done: false },
            { set: 2, weight: "35", reps: "8", done: false },
            { set: 3, weight: "32.5", reps: "10", done: false },
            { set: 4, weight: "30", reps: "10", done: false },
          ],
        },
        {
          id: "lateral-raise",
          name: "哑铃侧平举",
          target: "三角肌中束",
          recommendation: "推荐：4组 • 12-15次",
          sets: [
            { set: 1, weight: "8", reps: "15", done: false },
            { set: 2, weight: "8", reps: "15", done: false },
            { set: 3, weight: "7", reps: "15", done: false },
            { set: 4, weight: "7", reps: "12", done: false },
          ],
        },
        {
          id: "reverse-dumbbell-fly",
          name: "俯身反向飞鸟",
          target: "三角肌后束",
          recommendation: "推荐：3组 • 12-15次",
          sets: [
            { set: 1, weight: "6", reps: "15", done: false },
            { set: 2, weight: "6", reps: "15", done: false },
            { set: 3, weight: "5", reps: "15", done: false },
          ],
        },
        {
          id: "cable-face-pull",
          name: "绳索面拉",
          target: "肩胛稳定",
          recommendation: "推荐：3组 • 12-15次",
          sets: [
            { set: 1, weight: "20", reps: "15", done: false },
            { set: 2, weight: "20", reps: "15", done: false },
            { set: 3, weight: "20", reps: "12", done: false },
          ],
        },
      ],
    },
    腿部: {
      id: "today-legs",
      title: "下肢力量强化",
      subtitle: "AI 定制 • 腿部优先",
      duration: "65 分钟",
      goal: "腿部力量与线条",
      bodyPart: "腿部 + 核心",
      score: 8.5,
      exercises: [
        {
          id: "barbell-squat",
          name: "杠铃深蹲",
          target: "腿部",
          recommendation: "推荐：4组 • 8-10次",
          sets: [
            { set: 1, weight: "100", reps: "10", done: true },
            { set: 2, weight: "100", reps: "8", done: false },
            { set: 3, weight: "100", reps: "8", done: false },
          ],
        },
        {
          id: "leg-press",
          name: "腿举",
          target: "股四头肌",
          recommendation: "推荐：4组 • 10-12次",
          sets: [{ set: 1, weight: "160", reps: "12", done: false }],
        },
      ],
    },
    臀部: {
      id: "today-glutes",
      title: "臀腿后链塑形",
      subtitle: "AI 定制 • 臀部优先",
      duration: "60 分钟",
      goal: "臀大肌与后链激活",
      bodyPart: "臀部 + 后链",
      score: 8.6,
      exercises: [
        {
          id: "hip-thrust",
          name: "杠铃臀推",
          target: "臀部",
          recommendation: "推荐：4组 • 8-12次",
          sets: [{ set: 1, weight: "90", reps: "10", done: false }],
        },
        {
          id: "romanian-deadlift",
          name: "罗马尼亚硬拉",
          target: "后链",
          recommendation: "推荐：4组 • 8-10次",
          sets: [{ set: 1, weight: "80", reps: "10", done: false }],
        },
      ],
    },
    手臂: {
      id: "today-arms",
      title: "手臂围度训练",
      subtitle: "AI 定制 • 手臂优先",
      duration: "45 分钟",
      goal: "二头三头均衡增量",
      bodyPart: "手臂 + 肩稳定",
      score: 8.3,
      exercises: [
        {
          id: "barbell-curl",
          name: "杠铃弯举",
          target: "二头肌",
          recommendation: "推荐：3组 • 10-12次",
          sets: [{ set: 1, weight: "25", reps: "12", done: false }],
        },
        {
          id: "triceps-pushdown",
          name: "绳索下压",
          target: "三头肌",
          recommendation: "推荐：3组 • 12-15次",
          sets: [{ set: 1, weight: "35", reps: "15", done: false }],
        },
      ],
    },
    核心: {
      id: "today-core",
      title: "核心稳定训练",
      subtitle: "AI 定制 • 核心优先",
      duration: "35 分钟",
      goal: "腰腹稳定与体态",
      bodyPart: "核心 + 灵活性",
      score: 8.2,
      exercises: [
        {
          id: "plank",
          name: "平板支撑",
          target: "核心",
          recommendation: "推荐：3组 • 45-60秒",
          sets: [{ set: 1, weight: "自重", reps: "60秒", done: false }],
        },
        {
          id: "dead-bug",
          name: "死虫",
          target: "腹部稳定",
          recommendation: "推荐：3组 • 每侧10次",
          sets: [{ set: 1, weight: "自重", reps: "10", done: false }],
        },
      ],
    },
    有氧: {
      id: "today-cardio",
      title: "心肺间歇训练",
      subtitle: "AI 定制 • 有氧优先",
      duration: "40 分钟",
      goal: "心肺与热量消耗",
      bodyPart: "有氧 + 拉伸",
      score: 8.1,
      exercises: [
        {
          id: "treadmill-interval",
          name: "跑步机间歇",
          target: "心肺",
          recommendation: "推荐：8轮 • 30秒快 + 60秒慢",
          sets: [{ set: 1, weight: "-", reps: "8轮", done: false }],
        },
      ],
    },
    全身: {
      id: "today-full-body",
      title: "全身循环训练",
      subtitle: "AI 定制 • 全身均衡",
      duration: "55 分钟",
      goal: "力量与心肺综合",
      bodyPart: "全身循环",
      score: 8.4,
      exercises: [
        {
          id: "full-body-circuit",
          name: "全身循环训练",
          target: "全身",
          recommendation: "推荐：4轮 • 每站40秒",
          sets: [{ set: 1, weight: "-", reps: "4轮", done: false }],
        },
        {
          id: "barbell-squat",
          name: "杠铃深蹲",
          target: "腿部",
          recommendation: "推荐：3组 • 10次",
          sets: [{ set: 1, weight: "80", reps: "10", done: false }],
        },
      ],
    },
    自定义: {
      id: "today-custom",
      title: `${part}专项训练`,
      subtitle: "AI 定制 • 自定义",
      duration: "50 分钟",
      goal: "按自定义目标调整",
      bodyPart: `${part || "自定义"}专项`,
      score: 8.2,
      exercises: [
        {
          id: "full-body-circuit",
          name: "全身循环训练",
          target: "全身",
          recommendation: "推荐：4轮 • 每站40秒",
          sets: [{ set: 1, weight: "-", reps: "4轮", done: false }],
        },
      ],
    },
  };

  return workoutMap[normalized] ?? workoutMap.自定义;
}

export function inferExerciseFromPrompt(
  prompt: string,
  fallbackPart: string,
): Exercise {
  const text = prompt.trim() || "自定义动作";
  const targetPart = inferBodyPart(text, fallbackPart);
  const id = `custom-${Date.now()}`;
  const upperChest = text.includes("上斜") || text.includes("上胸");
  const isBarbell = text.includes("杠铃");
  const isDumbbell = text.includes("哑铃");
  const equipment = isBarbell ? "杠铃" : isDumbbell ? "哑铃" : "器械/自重";
  const target =
    targetPart === "胸部" && upperChest
      ? ["胸部", "上胸", "三头肌"]
      : [targetPart, targetPart === "背部" ? "背阔肌" : "目标肌群"];

  return {
    id,
    name: text,
    target,
    defaultSets: targetPart === "有氧" ? "6轮" : targetPart === "胸部" ? "3组" : "4组",
    reps:
      targetPart === "有氧"
        ? "40秒快 + 80秒慢"
        : /飞鸟|面拉|侧平举|下压/.test(text)
          ? "12-15次"
          : "8-12次",
    rest: targetPart === "有氧" ? "按轮次" : "75s",
    level: "中级",
    hasVideo: false,
    enabled: true,
    image:
      "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=900&q=80",
    description: `AI 根据“${text}”识别为${targetPart}训练动作，建议使用${equipment}并优先控制动作轨迹。`,
    cues: [
      `先热身并找到${targetPart}发力感`,
      "每组保留 1-2 次余力，避免动作变形",
      "如果出现关节不适，降低重量并缩小动作幅度",
    ],
  };
}

function inferBodyPart(text: string, fallbackPart: string) {
  if (/胸|卧推|飞鸟/.test(text)) return "胸部";
  if (/背|划船|引体|下拉/.test(text)) return "背部";
  if (/肩|推举|侧平举|面拉/.test(text)) return "肩部";
  if (/腿|深蹲|腿举|箭步/.test(text)) return "腿部";
  if (/臀|硬拉|臀推/.test(text)) return "臀部";
  if (/臂|二头|三头|弯举|下压/.test(text)) return "手臂";
  if (/腹|核心|平板|卷腹/.test(text)) return "核心";
  if (/跑|有氧|心肺|跳绳/.test(text)) return "有氧";
  if (exerciseCategories.some((part) => part === fallbackPart)) return fallbackPart;
  return "全身";
}

export function getRecommendedSetCount(recommendation: string, fallback = 1) {
  const match = recommendation.match(/(\d+)\s*组/);
  return match ? Number(match[1]) : fallback;
}

export function getWorkoutInsights(workout: Workout) {
  const distribution = getWorkoutDistribution(workout);
  const directSets = distribution.find((item) => item.label === "主项")?.sets ?? 0;
  const supportSets = distribution
    .filter((item) => item.label !== "主项")
    .reduce((total, item) => total + item.sets, 0);
  const hasBackOrScapularWork = workout.exercises.some((exercise) =>
    /背|肩胛|后束|划船|面拉|下拉/.test(exercise.target + exercise.name),
  );

  const reason = hasBackOrScapularWork
    ? "今天不是只堆目标肌群，而是用主项训练建立刺激，再加入肩胛/后束稳定，减少推举和卧推造成的肩前侧压力。"
    : "今天安排为单部位集中刺激，目的是提高目标肌群招募和充血质量；因为训练量集中，下一次需要避开同部位高强度。";

  return {
    distribution,
    summary: `${workout.bodyPart}，主项 ${directSets} 组，辅助稳定 ${supportSets} 组`,
    reason,
    pumpWindow: "前 25-40 分钟完成主项递进，后 15-20 分钟做孤立补量，充血更集中也更容易控制动作质量。",
    recovery: "同一主力部位建议间隔 48-72 小时再高强度训练，期间可以安排下肢、轻有氧或主动恢复。",
    nextWorkout: getNextWorkoutSuggestion(workout.bodyPart),
  };
}

function getWorkoutDistribution(workout: Workout) {
  const totals = new Map<string, number>();
  const primaryKey = getPrimaryKey(workout.bodyPart);

  workout.exercises.forEach((exercise) => {
    const sets = getRecommendedSetCount(exercise.recommendation, exercise.sets.length);
    const label = classifyTarget(exercise.target, exercise.name, primaryKey);
    totals.set(label, (totals.get(label) ?? 0) + sets);
  });

  return Array.from(totals.entries()).map(([label, sets]) => ({ label, sets }));
}

function getPrimaryKey(bodyPart: string) {
  if (/胸/.test(bodyPart)) return "胸";
  if (/肩/.test(bodyPart)) return "肩";
  if (/背/.test(bodyPart)) return "背";
  if (/腿/.test(bodyPart)) return "腿";
  if (/臀/.test(bodyPart)) return "臀";
  if (/手臂|二头|三头/.test(bodyPart)) return "手臂";
  if (/核心/.test(bodyPart)) return "核心";
  return "全身";
}

function classifyTarget(target: string, name: string, primaryKey: string) {
  const text = `${target}${name}`;
  if (
    (primaryKey === "胸" && /胸|飞鸟|卧推/.test(text)) ||
    (primaryKey === "肩" && /肩|推举|侧平举|后束|面拉/.test(text)) ||
    (primaryKey === "背" && /背|划船|下拉|引体/.test(text)) ||
    (primaryKey === "腿" && /腿|深蹲|腿举/.test(text)) ||
    (primaryKey === "臀" && /臀|硬拉|臀推/.test(text)) ||
    (primaryKey === "手臂" && /二头|三头|弯举|下压/.test(text)) ||
    (primaryKey === "核心" && /核心|腹|平板/.test(text))
  ) {
    return "主项";
  }
  if (/肩胛|后束|面拉|背/.test(text)) return "肩背稳定";
  if (/核心|腹|平板/.test(text)) return "核心";
  return "辅助";
}

function getNextWorkoutSuggestion(bodyPart: string) {
  if (/胸/.test(bodyPart)) return "下次建议 48 小时后练背部 + 二头，平衡推拉并强化肩胛稳定。";
  if (/肩/.test(bodyPart)) return "下次建议间隔 48 小时做下肢或背部，避免连续重压肩关节。";
  if (/背/.test(bodyPart)) return "下次建议 48 小时后做胸部推举或下肢，保持推拉比例。";
  if (/腿|臀/.test(bodyPart)) return "下次建议间隔 48-72 小时再练下肢，期间可做上肢或轻有氧。";
  return "下次建议根据酸痛程度间隔 48 小时，再安排互补部位训练。";
}
