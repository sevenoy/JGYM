import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type Exercise = {
  id: string;
  name: string;
  target: string[];
  defaultSets: string;
  reps: string;
  rest: string;
  level: "初级" | "中级" | "高级";
  hasVideo: boolean;
  enabled: boolean;
  image?: string;
  description: string;
  cues: string[];
};

export type WorkoutSet = {
  set: number;
  weight: string;
  reps: string;
  done: boolean;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  target: string;
  recommendation: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  goal: string;
  bodyPart: string;
  score?: number;
  exercises: WorkoutExercise[];
};

export type HistoryEntry = {
  id: string;
  title: string;
  date: string;
  duration: string;
  tags: string[];
  score: number;
  photoImage?: string;
  photoCount?: number;
};

export type PhotoEntry = {
  id: string;
  date: string;
  weight: string;
  image: string;
  uploaded?: boolean;
  uploadedAt?: string;
  trainingTitle?: string;
  workoutId?: string;
};

export type PlanDay = {
  day: number;
  title: string;
  focus: string;
  duration: string;
  status: "完成" | "今日" | "待训练";
};

export type AnalysisItem = {
  title: string;
  detail: string;
  type: "positive" | "warning";
};
