import Link from "next/link";
import { Activity, Clock, Play, Sparkles, Target } from "lucide-react";
import type { Workout } from "@/lib/types";
import { getWorkoutInsights } from "@/lib/fitness-data";
import SectionCard from "./SectionCard";

type WorkoutCardProps = {
  workout: Workout;
  startHref?: string;
};

export default function WorkoutCard({ workout, startHref = "/workout" }: WorkoutCardProps) {
  const insights = getWorkoutInsights(workout);

  return (
    <SectionCard className="relative overflow-hidden p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-soft/60 blur-2xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
          <Sparkles size={14} />
          AI 定制
        </span>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted">今日推荐</p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight">
              {workout.bodyPart}
            </h2>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-surface-soft text-primary">
            <Sparkles size={26} />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-surface-soft px-3 py-3 text-sm text-ink">
            <Clock size={18} className="text-primary" />
            {workout.duration}
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-surface-soft px-3 py-3 text-sm text-ink">
            <Target size={18} className="text-secondary" />
            目标：{workout.goal}
          </div>
        </div>
        <div className="mt-5 rounded-3xl bg-surface-soft p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Activity size={17} />
            今日动作分配
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {insights.distribution.map((item) => (
              <span
                key={item.label}
                className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink"
              >
                {item.label} {item.sets} 组
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{insights.summary}</p>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-6">
          <p>
            <span className="font-bold text-primary">目的：</span>
            <span className="text-muted">{insights.reason}</span>
          </p>
          <p>
            <span className="font-bold text-secondary">充血时间：</span>
            <span className="text-muted">{insights.pumpWindow}</span>
          </p>
          <p>
            <span className="font-bold text-primary">恢复：</span>
            <span className="text-muted">{insights.recovery}</span>
          </p>
          <p>
            <span className="font-bold text-secondary">下次：</span>
            <span className="text-muted">{insights.nextWorkout}</span>
          </p>
        </div>
        <Link
          href={startHref}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-base font-bold text-white shadow-[0_16px_30px_-18px_rgba(0,107,95,0.7)]"
        >
          开始训练
          <Play size={18} fill="currentColor" />
        </Link>
      </div>
    </SectionCard>
  );
}
