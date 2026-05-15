"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  Calendar,
  Camera,
  Check,
  Clock,
  NotebookPen,
  Sparkles,
  Zap,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import {
  usePersonalPlanSettings,
  usePersonalTrainingLogs,
  useUploadedPhotos,
} from "@/lib/client-state";
import { formatDateLabel } from "@/lib/plan-generator";
import {
  getPersonalPlanForExecutionDay,
  getPlanDateForDay,
  type PersonalTrainingLog,
} from "@/lib/personal-plan";
import type { HistoryEntry } from "@/lib/types";

function stripMarkdown(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*#+\s*/g, "")
    .trim();
}

function cleanInlineMarkdown(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*#+\s*/g, "");
}

function normalizeSummary(summary: string) {
  return summary
    .replace(/\r\n/g, "\n")
    .replace(/(\*\*[^*]+\*\*)\s+(?=[^#\n-])/g, "$1\n")
    .replace(/\s*(---+)\s*/g, "\n$1\n")
    .replace(/\s*(#{1,4}\s+)/g, "\n$1")
    .replace(/([。；])\s+/g, "$1\n")
    .replace(/\s+(\d+[.、]\s+)/g, "\n$1")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractActualDuration(summary: string, duration: string) {
  const normalizedSummary = stripMarkdown(summary);
  const explicitDuration = normalizedSummary.match(
    /(训练时长|实际时长|总时长|用时|耗时)[:：]?\s*(\d{1,3}(?:\.\d+)?\s*(?:分钟|分|小时))/,
  );

  if (explicitDuration?.[2]) {
    return explicitDuration[2].replace(/\s+/g, "");
  }

  const minuteDuration = normalizedSummary.match(
    /(?:实际完成|完成度|训练总结|今日训练)[^。；\n]{0,80}?(\d{1,3}\s*(?:分钟|分))/,
  );

  if (minuteDuration?.[1]) {
    return minuteDuration[1].replace(/\s+/g, "");
  }

  const times = Array.from(
    normalizedSummary.matchAll(/(?:^|[^.\d])(\d{1,2}):(\d{2})(?=$|[^.\d])/g),
  ).map((match) => Number(match[1]) * 60 + Number(match[2]));

  if (times.length >= 2) {
    const diff = times[times.length - 1] - times[0];
    if (diff > 0 && diff <= 240) {
      return `${diff}分钟`;
    }
  }

  const cleanDuration = duration.trim();
  if (cleanDuration && !/[–-]/.test(cleanDuration)) {
    return cleanDuration.includes("分钟") || cleanDuration.includes("小时")
      ? cleanDuration
      : `${cleanDuration}分钟`;
  }

  return "";
}

function renderInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-bold text-ink">
          {part.slice(2, -2).trim()}
        </strong>
      );
    }

    return cleanInlineMarkdown(part);
  });
}

function HistorySummary({ summary }: { summary: string }) {
  const lines = normalizeSummary(summary);

  return (
    <div className="mt-4 max-h-[28rem] overflow-y-auto rounded-2xl bg-surface-soft px-4 py-4 text-sm leading-7 text-muted">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">
        训练总结
      </p>
      <div className="space-y-3">
        {lines.map((line, index) => {
          if (!stripMarkdown(line)) return null;

          if (/^-{3,}$/.test(line)) {
            return <div key={`${line}-${index}`} className="h-px bg-outline/50" />;
          }

          if (/^#{1,4}\s+/.test(line)) {
            return (
              <h3
                key={`${line}-${index}`}
                className="rounded-xl bg-white/75 px-3 py-2 text-base font-bold leading-6 text-ink"
              >
                {renderInlineText(line.replace(/^#{1,4}\s+/, ""))}
              </h3>
            );
          }

          if (/^(\d+[.、]|[-•])\s+/.test(line)) {
            const itemText = line.replace(/^(\d+[.、]|[-•])\s+/, "").trim();
            if (!stripMarkdown(itemText)) return null;

            return (
              <p key={`${line}-${index}`} className="pl-3">
                <span className="mr-2 text-primary">•</span>
                {renderInlineText(itemText)}
              </p>
            );
          }

          return <p key={`${line}-${index}`}>{renderInlineText(line)}</p>;
        })}
      </div>
    </div>
  );
}

export default function HistoryClient() {
  const [uploadedPhotos] = useUploadedPhotos();
  const [planSettings] = usePersonalPlanSettings();
  const [trainingLogs, setTrainingLogs] = usePersonalTrainingLogs();
  const firstDraftDay = Math.max(1, Math.min(planSettings.currentPlanDay - 1, 2));
  const firstDraftSchedule = getPersonalPlanForExecutionDay(firstDraftDay);
  const [draftPlanDay, setDraftPlanDay] = useState(firstDraftDay);
  const [draftDate, setDraftDate] = useState(
    getPlanDateForDay(planSettings, firstDraftDay),
  );
  const [draftDuration, setDraftDuration] = useState(firstDraftSchedule.duration);
  const [draftScore, setDraftScore] = useState("8.6");
  const [draftFatigue, setDraftFatigue] = useState("7");
  const [draftPump, setDraftPump] = useState("8");
  const [draftStatus, setDraftStatus] = useState<"差" | "一般" | "好">("好");
  const [draftSummary, setDraftSummary] = useState(
    "已按计划完成，动作控制稳定，后续可以继续按原计划推进。",
  );
  const [feedback, setFeedback] = useState("");

  const loggedPlanDays = useMemo(
    () => new Set(trainingLogs.map((log) => log.planDay)),
    [trainingLogs],
  );
  const missingPreviousDays = useMemo(
    () =>
      Array.from(
        { length: Math.max(0, planSettings.currentPlanDay - 1) },
        (_, index) => index + 1,
      ).filter((day) => !loggedPlanDays.has(day)),
    [loggedPlanDays, planSettings.currentPlanDay],
  );

  const entries = useMemo<HistoryEntry[]>(() => {
    const uploadedEntries = uploadedPhotos.map((photo, index) => ({
      id: `photo-${photo.id}`,
      title: photo.trainingTitle?.replace("今日训练：", "") || "今日训练",
      date: index === 0 ? "今天 已拍照" : photo.date,
      duration: "已拍照",
      tags: ["训练照片", "进步记录"],
      score: 8.6,
      photoImage: photo.image,
      photoCount: 1,
    }));
    const planLogEntries = [...trainingLogs]
      .sort((first, second) => first.planDay - second.planDay)
      .map((log) => ({
        id: `plan-log-${log.id}`,
        title: `第 ${log.planDay} 天 · ${log.title}`,
        date: `${formatDateLabel(log.date)} 已补录`,
        duration: extractActualDuration(log.summary, log.duration),
        tags: [
          `计划第${log.planDay}天`,
          log.status,
          `疲劳 ${log.fatigue}/10`,
          `泵感 ${log.pump}/10`,
        ],
        score: log.score,
        planDay: log.planDay,
        summary: log.summary,
      }));

    return [...planLogEntries, ...uploadedEntries];
  }, [trainingLogs, uploadedPhotos]);

  const averageScore =
    entries.length > 0
      ? (
          entries.reduce((total, entry) => total + entry.score, 0) / entries.length
        ).toFixed(1)
      : "0";

  function loadPlanDay(planDay: number) {
    const safeDay = Math.max(1, Math.min(112, Math.round(planDay)));
    const schedule = getPersonalPlanForExecutionDay(safeDay);

    setDraftPlanDay(safeDay);
    setDraftDate(getPlanDateForDay(planSettings, safeDay));
    setDraftDuration(schedule.duration);
    setDraftScore(schedule.type === "strength" ? "8.6" : "8.2");
    setDraftFatigue(schedule.type === "strength" ? "7" : "4");
    setDraftPump(schedule.type === "strength" ? "8" : "4");
    setDraftStatus("好");
    setDraftSummary(
      schedule.type === "strength"
        ? `已完成${schedule.title}，主要动作质量稳定，保留恢复能力。`
        : `已完成${schedule.title}，以恢复和体态为主，没有额外增加力量训练。`,
    );
  }

  function submitBackfill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const schedule = getPersonalPlanForExecutionDay(draftPlanDay);
    const nextLog: PersonalTrainingLog = {
      id: `manual-${draftPlanDay}-${Date.now()}`,
      planDay: draftPlanDay,
      title: schedule.title,
      date: draftDate,
      duration: draftDuration || schedule.duration,
      score: Number(draftScore) || 8.5,
      fatigue: Number(draftFatigue) || 7,
      pump: Number(draftPump) || 8,
      status: draftStatus,
      summary: draftSummary.trim() || "已完成训练，按计划继续推进。",
      createdAt: new Date().toISOString(),
    };
    const remainingLogs = trainingLogs.filter((log) => log.planDay !== draftPlanDay);
    setTrainingLogs([nextLog, ...remainingLogs]);
    setFeedback(`已补录第 ${draftPlanDay} 天，并融合到完整计划历史里。`);

    const nextMissing = missingPreviousDays.find((day) => day !== draftPlanDay);
    if (nextMissing) loadPlanDay(nextMissing);
  }

  return (
    <>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">训练历史记录</h1>
        <p className="mt-2 text-muted">
          训练后如果上传照片，会自动显示在对应训练记录里。
        </p>
      </section>

      <SectionCard className="mt-8 bg-gradient-to-br from-white to-primary-soft/60">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-soft">
            <NotebookPen size={22} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">补录已完成训练</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              如果你从第 {planSettings.currentPlanDay} 天开始，前面已经练过的训练可以在这里提交总结。
              补录后会出现在历史记录，并能在计划详情里看到。
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(missingPreviousDays.length > 0 ? missingPreviousDays : [1, 2])
            .slice(0, 6)
            .map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => loadPlanDay(day)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  draftPlanDay === day
                    ? "bg-primary text-white"
                    : "bg-white text-primary shadow-soft"
                }`}
              >
                第 {day} 天
              </button>
            ))}
        </div>

        <form onSubmit={submitBackfill} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-bold text-muted">计划天数</span>
              <input
                type="number"
                min={1}
                max={112}
                value={draftPlanDay}
                onChange={(event) => loadPlanDay(Number(event.target.value) || 1)}
                className="mt-2 h-12 w-full rounded-2xl bg-white px-4 font-bold outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-muted">训练日期</span>
              <input
                type="date"
                value={draftDate}
                onChange={(event) => setDraftDate(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl bg-white px-4 font-bold outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
              />
            </label>
          </div>

          <div className="rounded-3xl bg-white/80 p-4">
            <p className="text-xs font-bold text-primary">当前补录</p>
            <p className="mt-1 font-display text-2xl font-bold">
              第 {draftPlanDay} 天 · {getPersonalPlanForExecutionDay(draftPlanDay).title}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {getPersonalPlanForExecutionDay(draftPlanDay).goal}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-sm font-bold text-muted">AI评分</span>
              <input
                type="number"
                min={1}
                max={10}
                step={0.1}
                value={draftScore}
                onChange={(event) => setDraftScore(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl bg-white px-3 font-bold outline-none ring-1 ring-outline/50"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-muted">疲劳</span>
              <input
                type="number"
                min={1}
                max={10}
                value={draftFatigue}
                onChange={(event) => setDraftFatigue(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl bg-white px-3 font-bold outline-none ring-1 ring-outline/50"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-muted">泵感</span>
              <input
                type="number"
                min={1}
                max={10}
                value={draftPump}
                onChange={(event) => setDraftPump(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl bg-white px-3 font-bold outline-none ring-1 ring-outline/50"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-muted">训练时长</span>
            <input
              value={draftDuration}
              onChange={(event) => setDraftDuration(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl bg-white px-4 font-bold outline-none ring-1 ring-outline/50"
            />
          </label>

          <div>
            <p className="text-sm font-bold text-muted">今日状态</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["差", "一般", "好"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setDraftStatus(status)}
                  className={`rounded-2xl px-3 py-3 font-bold ${
                    draftStatus === status
                      ? "bg-primary text-white"
                      : "bg-white text-muted"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-muted">训练总结</span>
            <textarea
              value={draftSummary}
              onChange={(event) => setDraftSummary(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-3xl bg-white px-4 py-4 text-sm leading-6 outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
          >
            <Check size={18} />
            提交并融合到计划
          </button>
        </form>

        {feedback ? (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-primary">
            {feedback}
          </p>
        ) : null}
      </SectionCard>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <SectionCard className="p-5">
          <Zap className="text-primary" size={24} />
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-muted">
            本月训练
          </p>
          <p className="mt-3 font-display text-5xl font-bold">
            {entries.length}
          </p>
        </SectionCard>
        <SectionCard className="bg-gradient-to-br from-white to-secondary-soft p-5">
          <Sparkles className="text-secondary" size={24} />
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-muted">
            平均 AI 评分
          </p>
          <p className="mt-3 font-display text-5xl font-bold text-primary">
            {averageScore}<span className="text-base font-normal text-ink">/10</span>
          </p>
        </SectionCard>
      </div>

      <div className="mt-8 space-y-4">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.planDay ? `/plan/day/${entry.planDay}` : "/analysis"}
          >
            <SectionCard as="article" className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold">
                    {entry.title}
                  </h2>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary-soft px-3 py-1.5 text-sm font-bold text-secondary">
                    <Calendar size={17} />
                    {entry.date}
                  </p>
                </div>
                {entry.photoImage ? (
                  <div
                    role="img"
                    aria-label={`${entry.title} 训练照片`}
                    className="h-20 w-20 shrink-0 rounded-2xl bg-surface-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${entry.photoImage})` }}
                  />
                ) : entry.duration ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
                    <Clock size={15} />
                    {entry.duration}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 border-t border-outline/40 pt-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-surface-muted px-2 py-1 text-xs font-bold text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                    {entry.photoImage ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary-soft px-2 py-1 text-xs font-bold text-primary">
                        <Camera size={13} />
                        {entry.photoCount ?? 1} 张照片
                      </span>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-muted">
                      AI Score
                    </p>
                    <p className="font-display text-4xl font-bold text-primary">
                      {entry.score}
                    </p>
                  </div>
                </div>
                {entry.summary ? <HistorySummary summary={entry.summary} /> : null}
              </div>
            </SectionCard>
          </Link>
        ))}
      </div>
    </>
  );
}
