"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  NotebookPen,
  RotateCcw,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import TrainingSummary, { extractActualDuration } from "@/components/TrainingSummary";
import {
  usePersonalPlanSettings,
  usePersonalTrainingLogs,
} from "@/lib/client-state";
import { SELECTED_PLAN_STORAGE_KEY, formatDateLabel, toIsoDate } from "@/lib/plan-generator";
import {
  buildStrictPersonalPlanOption,
  clampPlanDay,
  getPersonalPlanForExecutionDay,
  getPlanDateForDay,
  personalPlan,
  PERSONAL_PLAN_STRICT_STORAGE_KEY,
  type PersonalTrainingLog,
} from "@/lib/personal-plan";
import { cn } from "@/lib/utils";

type PlanDayDetailProps = {
  planDay: number;
};

export default function PlanDayDetail({ planDay }: PlanDayDetailProps) {
  const normalizedDay = clampPlanDay(planDay);
  const schedule = getPersonalPlanForExecutionDay(normalizedDay);
  const nutrition =
    schedule.caloriesType === "training"
      ? personalPlan.nutrition.training
      : personalPlan.nutrition.rest;
  const [settings, setSettings] = usePersonalPlanSettings();
  const [logs, setLogs] = usePersonalTrainingLogs();
  const [feedback, setFeedback] = useState("");
  const matchedLogs = useMemo(
    () =>
      logs
        .filter((log) => log.planDay === normalizedDay)
        .sort(
          (first, second) =>
            Date.parse(second.createdAt) - Date.parse(first.createdAt),
        ),
    [logs, normalizedDay],
  );
  const latestLog = matchedLogs[0];
  const actualDuration = latestLog
    ? extractActualDuration(latestLog.summary, latestLog.duration)
    : "";
  const plannedDate = getPlanDateForDay(settings, normalizedDay);

  function setAsCurrentExecutionDay() {
    const today = toIsoDate(new Date());
    const nextSettings = {
      startDate: today,
      startPlanDay: normalizedDay,
      currentPlanDay: normalizedDay,
      updatedAt: new Date().toISOString(),
    };
    const strictPlan = buildStrictPersonalPlanOption({
      startDate: today,
      startPlanDay: normalizedDay,
    });

    setSettings(nextSettings);
    window.localStorage.setItem(PERSONAL_PLAN_STRICT_STORAGE_KEY, "true");
    window.localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, JSON.stringify(strictPlan));
    window.dispatchEvent(new Event("fitpilot-plan-selected"));
    setFeedback(`已设置：今天从第 ${normalizedDay} 天开始执行，后续计划自动顺延。`);
  }

  function quickComplete() {
    if (latestLog) {
      setFeedback(`第 ${normalizedDay} 天已按补录内容标记完成。`);
      return;
    }

    const nextLog: PersonalTrainingLog = {
      id: `quick-${normalizedDay}-${Date.now()}`,
      planDay: normalizedDay,
      title: schedule.title,
      date: toIsoDate(new Date()),
      duration: "",
      score: schedule.type === "strength" ? 8.6 : 8.2,
      fatigue: schedule.type === "strength" ? 7 : 4,
      pump: schedule.type === "strength" ? 8 : 4,
      status: "好",
      summary: `已手动标记第 ${normalizedDay} 天完成，尚未补录详细训练内容。`,
      createdAt: new Date().toISOString(),
    };

    setLogs([nextLog, ...logs]);
    setFeedback(`已把第 ${normalizedDay} 天加入训练历史。`);
  }

  return (
    <div className="space-y-6">
      <section className="pt-3">
        <p className="text-sm font-bold text-primary">第 {normalizedDay} 天</p>
        <h1 className="mt-2 font-display text-4xl font-bold">{schedule.title}</h1>
        <p className="mt-3 leading-7 text-muted">{schedule.goal}</p>
      </section>

      <SectionCard className="bg-gradient-to-br from-white to-primary-soft/60">
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={CalendarCheck} label="计划日期" value={formatDateLabel(plannedDate)} />
          <Metric
            icon={Clock3}
            label={latestLog ? "实际时长" : "训练时长"}
            value={latestLog ? actualDuration || "未记录" : schedule.duration}
          />
          <Metric icon={ShieldCheck} label="强度" value={schedule.intensity} />
          <Metric icon={Flame} label="今日热量" value={`${nutrition.calories} kcal`} />
        </div>
        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={setAsCurrentExecutionDay}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
          >
            <Check size={18} />
            设为今天开始执行
          </button>
          <Link
            href={schedule.type === "strength" ? `/workout?part=${encodeURIComponent(getPlannedBodyPart(schedule.title))}` : "/history"}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-bold text-primary shadow-soft"
          >
            {schedule.type === "strength" ? "进入实时训练" : "完成后去记录"}
            <ArrowRight size={18} />
          </Link>
        </div>
        {feedback ? (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-primary">
            {feedback}
          </p>
        ) : null}
      </SectionCard>

      {matchedLogs.length > 0 ? (
        <SectionCard className="border-primary/20 bg-primary-soft/30">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
            <NotebookPen className="text-primary" size={22} />
            实际执行记录
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            这里仅展示你补录或完成时记录的真实内容；原计划不会被当成已完成动作。
          </p>
          <div className="mt-4 space-y-3">
            {matchedLogs.map((log) => (
              <div key={log.id} className="rounded-3xl bg-white/85 p-4">
                <p className="text-sm font-bold text-primary">
                  {formatDateLabel(log.date)} · AI {log.score}/10
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-surface-muted px-2 py-1 text-xs font-bold text-muted">
                    {log.status}
                  </span>
                  <span className="rounded-lg bg-surface-muted px-2 py-1 text-xs font-bold text-muted">
                    疲劳 {log.fatigue}/10
                  </span>
                  <span className="rounded-lg bg-surface-muted px-2 py-1 text-xs font-bold text-muted">
                    泵感 {log.pump}/10
                  </span>
                </div>
                <TrainingSummary summary={log.summary} title="补录内容" />
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {matchedLogs.length === 0 ? (
        <>
          <SectionCard>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <HeartPulse className="text-primary" size={22} />
              热身与激活
            </h2>
            <List items={schedule.warmup} />
          </SectionCard>

          <SectionCard>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <Dumbbell className="text-primary" size={22} />
              正式执行内容
            </h2>
            <div className="mt-4 space-y-3">
              {schedule.exercises.map((exercise, index) => (
                <article key={exercise.name} className="rounded-3xl bg-surface-soft p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white font-display font-bold text-primary">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-bold">{exercise.name}</h3>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                        <span className="rounded-2xl bg-white px-2 py-2">{exercise.sets}</span>
                        <span className="rounded-2xl bg-white px-2 py-2">{exercise.reps}</span>
                        <span className="rounded-2xl bg-white px-2 py-2">{exercise.rest}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{exercise.note}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <RotateCcw className="text-primary" size={22} />
              结束恢复
            </h2>
            <List items={schedule.recovery} />
          </SectionCard>
        </>
      ) : null}

      <SectionCard className="bg-gradient-to-br from-white to-secondary-soft/70">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Utensils className="text-secondary" size={22} />
          当日饮食目标
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SmallMetric label="热量" value={`${nutrition.calories} kcal`} />
          <SmallMetric label="蛋白质" value={nutrition.protein} />
          <SmallMetric label="脂肪" value={nutrition.fat} />
          <SmallMetric label="碳水" value={nutrition.carbs} />
        </div>
        <button
          type="button"
          onClick={quickComplete}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
        >
          <NotebookPen size={18} />
          {latestLog ? "确认这天已完成" : "快速标记这天已完成"}
        </button>
      </SectionCard>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-3xl bg-surface-soft px-4 py-3 text-sm leading-6">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/85 p-4">
      <Icon className="text-primary" size={20} />
      <p className="mt-3 text-xs font-bold text-muted">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/85 p-4">
      <p className="text-xs font-bold text-muted">{label}</p>
      <p className={cn("mt-1 font-display text-xl font-bold", label === "热量" && "text-primary")}>
        {value}
      </p>
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
