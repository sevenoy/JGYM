"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Flag,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Utensils,
} from "lucide-react";
import BodyPartSelector from "@/components/BodyPartSelector";
import SectionCard from "@/components/SectionCard";
import WorkoutCard from "@/components/WorkoutCard";
import { getWorkoutForBodyPart } from "@/lib/fitness-data";
import {
  usePersonalPlanSettings,
  useSelectedBodyPart,
} from "@/lib/client-state";
import { historyEntries } from "@/lib/mock-data";
import {
  getPersonalPlanForExecutionDay,
  getTodayPerformanceTargets,
  personalPlan,
} from "@/lib/personal-plan";

export default function HomeTrainingPlanner() {
  const lastWorkout = historyEntries[0];
  const [selectedPart, setSelectedPart] = useSelectedBodyPart();
  const [planSettings] = usePersonalPlanSettings();
  const todayPlan = getPersonalPlanForExecutionDay(planSettings.currentPlanDay);
  const currentWeek = Math.floor((planSettings.currentPlanDay - 1) / 7) + 1;
  const progress = Math.min(
    100,
    Math.max(1, Math.round((planSettings.currentPlanDay / 112) * 100)),
  );
  const plannedPart = getPlannedBodyPart(todayPlan.title);
  const activePart = todayPlan.type === "strength" ? plannedPart : selectedPart;
  const workout = getWorkoutForBodyPart(activePart);
  const todayTargets = getTodayPerformanceTargets(todayPlan);
  const nutritionTarget =
    todayPlan.caloriesType === "training"
      ? personalPlan.nutrition.training
      : personalPlan.nutrition.rest;

  return (
    <div className="space-y-8">
      <SectionCard className="p-6">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-primary">
          <Flag size={14} />
          进行中的计划
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold">
          {personalPlan.title}
        </h1>
        <p className="mt-2 text-lg text-ink">第 {currentWeek} / 16 周</p>
        <p className="mt-2 text-sm font-bold text-muted">
          今日执行第 {planSettings.currentPlanDay} 天：{todayPlan.title}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-2 flex-1 rounded-full bg-surface-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <span className="rounded-2xl bg-primary-soft px-2 py-2 text-primary">
            目标 67–68kg
          </span>
          <span className="rounded-2xl bg-surface-soft px-2 py-2 text-muted">
            4天力量
          </span>
          <span className="rounded-2xl bg-surface-soft px-2 py-2 text-muted">
            肩背上胸
          </span>
        </div>
      </SectionCard>

      <SectionCard className="bg-gradient-to-br from-white to-secondary-soft/80 p-6">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <CalendarCheck className="text-primary" size={22} />
          今日提醒
        </h2>
        <div className="mt-5 grid gap-3">
          <div className="rounded-3xl bg-white/80 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-primary" size={21} />
              <div>
                <p className="font-bold">第 {planSettings.currentPlanDay} 天 · {todayPlan.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {todayPlan.duration} · {todayPlan.goal}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white/80 p-4">
            <div className="flex items-start gap-3">
              <Utensils className="mt-0.5 text-secondary" size={21} />
              <div>
                <p className="font-bold">今日饮食</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  约 {nutritionTarget.calories} kcal · 蛋白质 {nutritionTarget.protein} · 碳水 {nutritionTarget.carbs}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white/80 p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 text-primary" size={21} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">上次数值与今天目标</p>
                <div className="mt-2 space-y-2">
                  {todayTargets.map((target) => (
                    <p key={target.label} className="rounded-2xl bg-surface-soft px-3 py-2 text-xs leading-5 text-muted">
                      <span className="font-bold text-ink">{target.label}</span>：上次 {target.last}，今天 {target.next}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {todayPlan.type === "strength" ? (
        <WorkoutCard
          workout={workout}
          startHref={`/workout?part=${encodeURIComponent(activePart)}`}
        />
      ) : (
        <SectionCard className="bg-white p-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck size={14} />
            今日不安排力量训练
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold">{todayPlan.title}</h2>
          <p className="mt-2 leading-7 text-muted">{todayPlan.goal}</p>
          <div className="mt-4 space-y-2">
            {todayPlan.exercises.slice(0, 4).map((exercise) => (
              <p
                key={exercise.name}
                className="rounded-2xl bg-surface-soft px-4 py-3 text-sm font-bold text-muted"
              >
                {exercise.name} · {exercise.sets} · {exercise.reps}
              </p>
            ))}
          </div>
        </SectionCard>
      )}

      <BodyPartSelector selected={activePart} onSelect={setSelectedPart} />

      <SectionCard className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">上次训练：胸部</h2>
            <p className="mt-1 text-muted">5 个动作</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-muted">AI 评分</p>
            <p className="font-display text-3xl font-bold text-primary">
              {lastWorkout.score}
              <span className="text-base font-normal text-ink">/10</span>
            </p>
          </div>
        </div>
        <div className="mt-5 border-t border-outline/40 pt-5">
          <Link
            href="/history"
            className="flex items-center justify-between font-bold text-primary"
          >
            <span>下次：{workout.bodyPart}</span>
            <span className="inline-flex items-center gap-1">
              查看详情 <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </SectionCard>

      <Link
        href="/analysis"
        className="flex items-center justify-center gap-2 rounded-full bg-secondary-soft px-5 py-4 font-bold text-secondary"
      >
        <Sparkles size={19} />
        查看最近 AI 训练分析
      </Link>
    </div>
  );
}

function getPlannedBodyPart(title: string) {
  if (title.includes("背")) return "背部";
  if (title.includes("腿") || title.includes("臀")) return "腿部";
  if (title.includes("肩")) return "肩部";
  if (title.includes("胸")) return "胸部";
  if (title.includes("核心")) return "核心";
  return "全身";
}
