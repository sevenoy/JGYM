"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Check, FastForward, RotateCcw } from "lucide-react";
import SectionCard from "@/components/SectionCard";
import { usePersonalPlanSettings } from "@/lib/client-state";
import { SELECTED_PLAN_STORAGE_KEY, toIsoDate } from "@/lib/plan-generator";
import {
  buildStrictPersonalPlanOption,
  clampPlanDay,
  getPersonalPlanForExecutionDay,
  PERSONAL_PLAN_STRICT_STORAGE_KEY,
  type PersonalPlanSettings,
} from "@/lib/personal-plan";

export default function PersonalPlanExecutionSettings() {
  const [settings, setSettings] = usePersonalPlanSettings();
  const [feedback, setFeedback] = useState("");
  const [missedDays, setMissedDays] = useState("1");

  const currentDayNumber = settings.currentPlanDay;
  const currentSchedule = getPersonalPlanForExecutionDay(currentDayNumber);

  function persistSettings(nextSettings: PersonalPlanSettings, message: string) {
    const normalizedSettings = {
      ...nextSettings,
      startPlanDay: clampPlanDay(nextSettings.startPlanDay),
      currentPlanDay: clampPlanDay(nextSettings.currentPlanDay),
      updatedAt: new Date().toISOString(),
    };
    const strictPlan = buildStrictPersonalPlanOption({
      startDate: normalizedSettings.startDate,
      startPlanDay: normalizedSettings.startPlanDay,
    });

    setSettings(normalizedSettings);
    window.localStorage.setItem(PERSONAL_PLAN_STRICT_STORAGE_KEY, "true");
    window.localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, JSON.stringify(strictPlan));
    window.dispatchEvent(new Event("fitpilot-plan-selected"));
    setFeedback(message);
  }

  function saveExecutionSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextStartDate = String(formData.get("startDate") || settings.startDate);
    const nextStartPlanDay = clampPlanDay(Number(formData.get("startPlanDay")));
    const nextCurrentPlanDay = clampPlanDay(Number(formData.get("currentPlanDay")));

    persistSettings(
      {
        startDate: nextStartDate,
        startPlanDay: nextStartPlanDay,
        currentPlanDay: nextCurrentPlanDay,
      },
      `已保存：从 ${nextStartDate} 执行第 ${nextStartPlanDay} 天，今天显示第 ${nextCurrentPlanDay} 天。`,
    );
  }

  function postponeToToday() {
    const today = toIsoDate(new Date());
    const missedCount = Math.max(1, Math.min(30, Math.round(Number(missedDays) || 1)));
    persistSettings(
      {
        startDate: today,
        startPlanDay: currentDayNumber,
        currentPlanDay: currentDayNumber,
      },
      `已处理耽误 ${missedCount} 天：不跳过训练，从今天继续第 ${currentDayNumber} 天，后续计划整体顺延。`,
    );
  }

  function goNextExecutionDay() {
    const nextDay = clampPlanDay(currentDayNumber + 1);
    persistSettings(
      {
        startDate: settings.startDate,
        startPlanDay: settings.startPlanDay,
        currentPlanDay: nextDay,
      },
      `已推进：下一次执行第 ${nextDay} 天。`,
    );
  }

  return (
    <SectionCard className="mt-6 bg-gradient-to-br from-white to-secondary-soft/70">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-soft">
          <CalendarDays size={22} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">计划执行设置</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            不按真实星期几硬排，按你选择的“第几天”顺序执行。漏练时可以顺延，练完后再推进。
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-primary/15 bg-white/75 p-4">
        <p className="text-sm font-bold text-primary">漏练 / 请假处理</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          如果你有一天或几天没练，不要跳过原计划。保持当前第几天，点下面按钮，
          系统会把这一天放到今天继续练，后面的训练全部往后顺延。
        </p>
        <div className="mt-4 grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
          <label className="block">
            <span className="text-xs font-bold text-muted">耽误天数</span>
            <input
              type="number"
              min={1}
              max={30}
              value={missedDays}
              onChange={(event) => setMissedDays(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl bg-surface-soft px-4 font-bold outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <button
            type="button"
            onClick={postponeToToday}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-sm font-bold text-white shadow-soft"
          >
            <RotateCcw size={17} />
            今天继续第 {currentDayNumber} 天
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          例：5月13日练完第1天，14日有事没练，15日回来训练，就把“今天执行第几天”设为2，
          再点“今天继续第2天”。
        </p>
      </div>

      <div className="mt-5 rounded-3xl bg-white/80 p-4">
        <p className="text-sm font-bold text-muted">今天显示</p>
        <p className="mt-1 font-display text-2xl font-bold text-primary">
          第 {currentDayNumber} 天 · {currentSchedule.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {currentSchedule.duration} · {currentSchedule.goal}
        </p>
      </div>

      <form
        key={`${settings.startDate}-${settings.startPlanDay}-${settings.currentPlanDay}`}
        onSubmit={saveExecutionSettings}
        className="mt-5 space-y-4"
      >
        <label className="block">
          <span className="text-sm font-bold text-muted">开始日期</span>
          <input
            name="startDate"
            type="date"
            defaultValue={settings.startDate}
            className="mt-2 h-12 w-full rounded-2xl bg-white px-4 font-bold outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-bold text-muted">从第几天开始</span>
            <input
              name="startPlanDay"
              type="number"
              min={1}
              max={112}
              defaultValue={settings.startPlanDay}
              className="mt-2 h-12 w-full rounded-2xl bg-white px-4 font-bold outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-muted">今天执行第几天</span>
            <input
              name="currentPlanDay"
              type="number"
              min={1}
              max={112}
              defaultValue={settings.currentPlanDay}
              className="mt-2 h-12 w-full rounded-2xl bg-white px-4 font-bold outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
        >
          <Check size={18} />
          保存并更新计划
        </button>
      </form>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={postponeToToday}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-4 text-sm font-bold text-primary shadow-soft"
        >
          <RotateCcw size={17} />
          顺延到今天
        </button>
        <button
          type="button"
          onClick={goNextExecutionDay}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-high px-4 py-4 text-sm font-bold text-ink"
        >
          <FastForward size={17} />
          下一天
        </button>
      </div>

      {feedback ? (
        <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-bold text-primary">
          {feedback}
        </p>
      ) : null}
    </SectionCard>
  );
}
