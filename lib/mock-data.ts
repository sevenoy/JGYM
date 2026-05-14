import {
  Activity,
  BookOpen,
  Bot,
  Calendar,
  Camera,
  Database,
  Dumbbell,
  History,
  Image,
  Settings,
  User,
  Video,
} from "lucide-react";
import type {
  AnalysisItem,
  Exercise,
  HistoryEntry,
  NavItem,
  PhotoEntry,
  PlanDay,
  Workout,
} from "./types";

export const navItems: NavItem[] = [
  { label: "今日", href: "/", icon: Calendar },
  { label: "计划", href: "/plan", icon: Dumbbell },
  { label: "记录", href: "/history", icon: History },
  { label: "相册", href: "/photos", icon: Image },
  { label: "我的", href: "/profile", icon: User },
];

export const adminLinks = [
  {
    title: "动作库管理",
    description: "管理练习、目标肌群和默认组数",
    href: "/exercises",
    icon: Database,
  },
  {
    title: "YouTube 视频管理",
    description: "保存的例程和灵感视频",
    href: "/admin/videos",
    icon: Video,
  },
  {
    title: "AI API 设置",
    description: "配置模型参数与提示词模板",
    href: "/admin/ai",
    icon: Bot,
  },
  {
    title: "后台管理与配置",
    description: "统一管理动作库、视频库和 API 配置",
    href: "/admin",
    icon: Settings,
  },
];

export const exercises: Exercise[] = [
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
    id: "pull-up",
    name: "引体向上",
    target: ["背部", "背阔肌"],
    defaultSets: "3组",
    reps: "力竭",
    rest: "90s",
    level: "高级",
    hasVideo: false,
    enabled: false,
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    description:
      "先下沉肩胛，再用背部发力带动身体向上，避免耸肩和摆动借力。",
    cues: ["全程控制离心", "下巴越过横杆", "保持肋骨回收"],
  },
  {
    id: "push-up",
    name: "俯卧撑",
    target: ["胸大肌", "肱三头肌"],
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
];

export const todayWorkout: Workout = {
  id: "today-lower-strength",
  title: "下肢力量强化",
  subtitle: "今日训练 • 2026年5月12日",
  duration: "65 分钟",
  goal: "改善线条",
  bodyPart: "背部 + 二头",
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
      id: "romanian-deadlift",
      name: "罗马尼亚硬拉",
      target: "后链",
      recommendation: "推荐：3组 • 10-12次",
      sets: [{ set: 1, weight: "80", reps: "10", done: false }],
    },
  ],
};

export const historyEntries: HistoryEntry[] = [
  {
    id: "chest-triceps",
    title: "胸部 + 三头",
    date: "昨天 18:30",
    duration: "55 分钟",
    tags: ["力量训练", "高强度"],
    score: 8.5,
  },
  {
    id: "back-biceps",
    title: "背部 + 二头",
    date: "5月10日 07:00",
    duration: "60 分钟",
    tags: ["力量训练", "拉力"],
    score: 9.0,
  },
  {
    id: "legs-core",
    title: "腿部 + 核心",
    date: "5月8日 19:15",
    duration: "45 分钟",
    tags: ["下肢", "耐力"],
    score: 8.2,
  },
];

export const planDays: PlanDay[] = [
  { day: 1, title: "胸部 + 三头", focus: "力量与推举", duration: "55 分钟", status: "完成" },
  { day: 2, title: "背部 + 二头", focus: "拉力与姿态", duration: "60 分钟", status: "今日" },
  { day: 3, title: "主动恢复", focus: "灵活性与呼吸", duration: "30 分钟", status: "待训练" },
  { day: 4, title: "下肢力量", focus: "臀腿线条", duration: "65 分钟", status: "待训练" },
];

export const photos: PhotoEntry[] = [
  {
    id: "may-01",
    date: "2026年5月1日",
    weight: "176 斤",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=700&q=80",
    trainingTitle: "胸部 + 三头",
  },
  {
    id: "apr-12",
    date: "2026年4月12日",
    weight: "177 斤",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80",
    trainingTitle: "背部 + 二头",
  },
  {
    id: "mar-20",
    date: "2026年3月20日",
    weight: "178 斤",
    image:
      "https://images.unsplash.com/photo-1609899464726-209befaac5cb?auto=format&fit=crop&w=700&q=80",
    trainingTitle: "肩部 + 核心",
  },
  {
    id: "feb-28",
    date: "2026年2月28日",
    weight: "180 斤",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=700&q=80",
    trainingTitle: "腿部 + 核心",
  },
  {
    id: "jan-15",
    date: "2026年1月15日",
    weight: "185 斤",
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=700&q=80",
    trainingTitle: "全身循环",
  },
  {
    id: "dec-01",
    date: "2025年12月1日",
    weight: "190 斤",
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c1d3a0?auto=format&fit=crop&w=700&q=80",
    trainingTitle: "有氧恢复",
  },
];

export const analysisItems: AnalysisItem[] = [
  {
    title: "三头下压",
    detail: "+10 斤，动作节奏稳定",
    type: "positive",
  },
  {
    title: "节奏",
    detail: "复合动作组间休息更稳定",
    type: "positive",
  },
  {
    title: "上斜卧推",
    detail: "最后一套检测到肘部外展",
    type: "warning",
  },
  {
    title: "耐力",
    detail: "循环末段出现疲劳",
    type: "warning",
  },
];

export const aiSteps = [
  { label: "照片", icon: Camera },
  { label: "基础信息", icon: Activity },
  { label: "目标", icon: BookOpen },
  { label: "计划", icon: Bot },
];

export const videoLibrary = [
  {
    title: "晨间 15 分钟高强度燃脂",
    category: "高强度间歇训练",
    status: "有氧",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "壶铃基础：完美挥摆训练",
    category: "力量",
    status: "核心",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "主动恢复：全身流动性拉伸",
    category: "恢复",
    status: "柔韧性",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
  },
];
