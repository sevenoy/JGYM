"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";
import PlanCard from "@/components/PlanCard";
import SectionCard from "@/components/SectionCard";
import { usePersonalPlanSettings } from "@/lib/client-state";
import { planDays } from "@/lib/mock-data";
import {
  formatDateLabel,
  SELECTED_PLAN_STORAGE_KEY,
  toIsoDate,
  type GeneratedPlanOption,
  type GeneratedPlanDay,
} from "@/lib/plan-generator";
import {
  buildStrictPersonalPlanOption,
  clampPlanDay,
  PERSONAL_PLAN_STRICT_STORAGE_KEY,
} from "@/lib/personal-plan";
import { cn } from "@/lib/utils";

function readSelectedPlanRaw() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SELECTED_PLAN_STORAGE_KEY) ?? "";
}

export default function SelectedPlanDetail() {
  const router = useRouter();
  const [planSettings, setPlanSettings] = usePersonalPlanSettings();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const rawPlan = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      window.addEventListener("fitpilot-plan-selected", callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("fitpilot-plan-selected", callback);
      };
    },
    readSelectedPlanRaw,
    () => "",
  );
  const plan = useMemo(() => {
    if (!rawPlan) return null;

    try {
      return JSON.parse(rawPlan) as GeneratedPlanOption;
    } catch {
      return null;
    }
  }, [rawPlan]);

  if (!plan) {
    return (
      <div className="mt-8 space-y-6">
        <PlanCard days={planDays} />

        <SectionCard className="bg-gradient-to-br from-white to-secondary-soft">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Sparkles className="text-secondary" size={22} />
            今日策略
          </h2>
          <p className="mt-4 leading-7 text-muted">
            今天重点是背部发力路径与二头肌耐力。AI 建议第一组保留 2 次余力，
            后两组再逐步提高重量，避免用斜方肌代偿。
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/75 p-4">
              <Target className="text-primary" size={21} />
              <p className="mt-3 text-sm font-bold text-muted">目标</p>
              <p className="font-bold">改善线条</p>
            </div>
            <div className="rounded-2xl bg-white/75 p-4">
              <CalendarCheck className="text-secondary" size={21} />
              <p className="mt-3 text-sm font-bold text-muted">频率</p>
              <p className="font-bold">每周 4 次</p>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  const firstPlanDay = plan.days[0]?.day ?? 1;
  const totalWeeks = Math.max(1, Math.ceil(plan.days.length / 7));
  const currentWeek = clampWeek(
    Math.floor((planSettings.currentPlanDay - firstPlanDay) / 7) + 1,
    totalWeeks,
  );
  const activeWeek = clampWeek(selectedWeek ?? currentWeek, totalWeeks);
  const visibleDays = plan.days.slice((activeWeek - 1) * 7, activeWeek * 7);
  const weekStartDay = visibleDays[0]?.day ?? firstPlanDay;
  const weekEndDay = visibleDays[visibleDays.length - 1]?.day ?? weekStartDay;
  const highlightedDay =
    plan.id === "strict-personal-16-week"
      ? planSettings.currentPlanDay
      : firstPlanDay;

  function openPlanDay(day: GeneratedPlanDay) {
    const selectedDay = clampPlanDay(day.day);
    const today = toIsoDate(new Date());
    const nextSettings = {
      startDate: today,
      startPlanDay: selectedDay,
      currentPlanDay: selectedDay,
      updatedAt: new Date().toISOString(),
    };
    const strictPlan = buildStrictPersonalPlanOption({
      startDate: nextSettings.startDate,
      startPlanDay: nextSettings.startPlanDay,
    });

    setPlanSettings(nextSettings);
    window.localStorage.setItem(PERSONAL_PLAN_STRICT_STORAGE_KEY, "true");
    window.localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, JSON.stringify(strictPlan));
    window.dispatchEvent(new Event("fitpilot-plan-selected"));
    router.push(`/plan/day/${selectedDay}`);
  }

  return (
    <div className="mt-8 space-y-6">
      <SectionCard className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-white to-primary-soft/70 p-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
            <CheckCircle2 size={14} />
            已选择计划
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold">{plan.title}</h2>
          <p className="mt-3 leading-7 text-muted">{plan.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric
              icon={CalendarDays}
              label={`第 ${firstPlanDay} 天`}
              value={formatDateLabel(plan.startDate)}
            />
            <Metric icon={Clock3} label="单次时长" value={plan.duration} />
            <Metric icon={MapPin} label="地点" value={plan.location} />
            <Metric icon={Target} label="目标" value={plan.goal} />
            <Metric icon={CheckCircle2} label="重点" value={plan.focus} />
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {plan.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary"
              >
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/plan/create"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-surface-high px-5 py-4 font-bold text-ink"
          >
            重新生成计划
            <ArrowRight size={18} />
          </Link>
        </div>
      </SectionCard>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">完整日程</h2>
            <p className="mt-1 text-sm text-muted">
              每次只显示一周，手机查看更清爽。
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-soft">
            第 {activeWeek}/{totalWeeks} 周
          </span>
        </div>

        <SectionCard className="mt-4 bg-gradient-to-br from-white to-secondary-soft/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="上一周"
              disabled={activeWeek <= 1}
              onClick={() => setSelectedWeek(activeWeek - 1)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-soft disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-bold text-muted">
                第 {weekStartDay} - {weekEndDay} 天
              </p>
              <select
                aria-label="选择计划周"
                value={activeWeek}
                onChange={(event) => setSelectedWeek(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-2xl bg-white px-3 text-center font-bold text-ink outline-none ring-1 ring-outline/40"
              >
                {Array.from({ length: totalWeeks }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    第 {index + 1} 周
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              aria-label="下一周"
              disabled={activeWeek >= totalWeeks}
              onClick={() => setSelectedWeek(activeWeek + 1)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-soft disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </SectionCard>

        <div className="mt-4 space-y-3">
          {visibleDays.map((day) => (
            <button
              key={`${day.day}-${day.date}`}
              type="button"
              onClick={() => openPlanDay(day)}
              className="block w-full text-left"
            >
              <SectionCard
                as="article"
                className={cn(
                "p-4 transition active:scale-[0.99]",
                day.day === highlightedDay &&
                  "border-primary/35 bg-primary-soft/35",
                )}
              >
              <div className="flex gap-3">
                <span
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold",
                    day.day === highlightedDay
                      ? "bg-primary text-white"
                      : "bg-surface-soft text-primary",
                  )}
                >
                  {day.day}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-muted">
                        第 {day.day} 天 • {formatDateLabel(day.date)}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold">
                        {day.title}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-primary">
                      {day.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{day.focus}</p>
                  <ul className="mt-3 space-y-2">
                    {day.blocks.map((block) => (
                      <li key={block} className="flex gap-2 text-sm">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{block}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 rounded-2xl bg-surface-soft px-3 py-2 text-xs font-bold text-muted">
                    {day.note}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">
                      设为当前执行日
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary">
                      查看完整执行内容
                    </span>
                  </div>
                </div>
              </div>
              </SectionCard>
            </button>
          ))}
        </div>
      </section>

      <Link
        href="/workout"
        className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-5 text-lg font-bold text-white shadow-soft"
      >
        开始第 {highlightedDay} 天训练
        <ArrowRight size={19} />
      </Link>
    </div>
  );
}

function clampWeek(value: number, totalWeeks: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(totalWeeks, Math.round(value)));
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <Icon className="text-primary" size={20} />
      <p className="mt-3 text-xs font-bold text-muted">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
