"use client";

import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Pin,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import { SELECTED_PLAN_STORAGE_KEY } from "@/lib/plan-generator";
import {
  buildStrictPersonalPlanOption,
  getDefaultPersonalPlanSettings,
  PERSONAL_PLAN_SETTINGS_EVENT,
  PERSONAL_PLAN_SETTINGS_STORAGE_KEY,
  PERSONAL_PLAN_STRICT_STORAGE_KEY,
  personalPlan,
  personalPlanDays,
} from "@/lib/personal-plan";
import { cn } from "@/lib/utils";

const PERSONAL_PLAN_STORAGE_KEY = "fitpilot-personal-plan-reference";

type PersonalPlanReferenceData = {
  title: string;
  note: string;
  content: string;
  updatedAt?: string;
};

const defaultReference: PersonalPlanReferenceData = {
  title: personalPlan.title,
  note: "严格保留你的16周训练、饮食和恢复结构，AI 只能补充执行细节，不能删减原计划。",
  content: personalPlanDays
    .map((day) => `${day.weekday}：${day.title}，${day.duration}，${day.goal}`)
    .join("\n"),
};

function readReferenceRaw() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PERSONAL_PLAN_STORAGE_KEY) ?? "";
}

function subscribeReference(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("fitpilot-personal-plan-reference", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("fitpilot-personal-plan-reference", callback);
  };
}

function parseReference(raw: string): PersonalPlanReferenceData {
  if (!raw) return defaultReference;

  try {
    const parsed = JSON.parse(raw) as Partial<PersonalPlanReferenceData>;
    return {
      title: parsed.title?.trim() || defaultReference.title,
      note: parsed.note?.trim() || defaultReference.note,
      content: parsed.content?.trim() || defaultReference.content,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return defaultReference;
  }
}

export default function PersonalPlanReference() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const rawReference = useSyncExternalStore(
    subscribeReference,
    readReferenceRaw,
    () => "",
  );
  const reference = useMemo(() => parseReference(rawReference), [rawReference]);
  const [draftTitle, setDraftTitle] = useState(defaultReference.title);
  const [draftNote, setDraftNote] = useState(defaultReference.note);
  const [draftContent, setDraftContent] = useState(defaultReference.content);

  const planLines = reference.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function openEditor() {
    setDraftTitle(reference.title);
    setDraftNote(reference.note);
    setDraftContent(reference.content);
    setIsEditing(true);
    setIsOpen(true);
    setSaveStatus("");
  }

  function saveReference(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextReference: PersonalPlanReferenceData = {
      title: draftTitle.trim() || defaultReference.title,
      note: draftNote.trim() || defaultReference.note,
      content: draftContent.trim() || defaultReference.content,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      PERSONAL_PLAN_STORAGE_KEY,
      JSON.stringify(nextReference),
    );
    window.dispatchEvent(new Event("fitpilot-personal-plan-reference"));
    setIsEditing(false);
    setSaveStatus("已保存到我的计划参考");
  }

  function applyStrictPlan() {
    const settings = getDefaultPersonalPlanSettings();
    const strictPlan = buildStrictPersonalPlanOption({
      startDate: settings.startDate,
      startPlanDay: settings.startPlanDay,
    });
    window.localStorage.setItem(
      SELECTED_PLAN_STORAGE_KEY,
      JSON.stringify(strictPlan),
    );
    window.localStorage.setItem(
      PERSONAL_PLAN_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings),
    );
    window.localStorage.setItem(PERSONAL_PLAN_STRICT_STORAGE_KEY, "true");
    window.dispatchEvent(new Event("fitpilot-plan-selected"));
    window.dispatchEvent(new Event(PERSONAL_PLAN_SETTINGS_EVENT));
    setIsOpen(true);
    setSaveStatus("已严格套用你的16周专属计划：AI 只能补充，不能删减。");
  }

  return (
    <SectionCard className="mt-6 border-primary/20 bg-gradient-to-br from-white to-primary-soft/45">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
              <Pin size={14} />
              置顶
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-3 py-1 text-xs font-bold text-secondary">
              <ClipboardList size={14} />
              训练计划参考
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">{personalPlan.title}</h2>
          <p className="mt-2 leading-6 text-muted">
            {isOpen
              ? defaultReference.note
              : "已置顶你的16周专属计划，点击后查看训练、饮食和恢复结构。"}
          </p>
        </div>
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-soft",
            isOpen && "bg-primary text-white",
          )}
          aria-hidden="true"
        >
          {isOpen ? <ChevronUp size={21} /> : <ChevronDown size={21} />}
        </span>
      </button>

      {isOpen ? (
        <div className="mt-5 space-y-4">
          {isEditing ? (
            <form onSubmit={saveReference} className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-muted">标题</span>
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  className="mt-2 w-full rounded-2xl bg-white px-4 py-4 font-bold outline-none ring-1 ring-outline/60 focus:ring-2 focus:ring-primary/45"
                  placeholder="例如：我的上半身参考计划"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-muted">参考说明</span>
                <input
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  className="mt-2 w-full rounded-2xl bg-white px-4 py-4 outline-none ring-1 ring-outline/60 focus:ring-2 focus:ring-primary/45"
                  placeholder="告诉 AI 哪些内容需要优先参考"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-muted">我的计划内容</span>
                <textarea
                  value={draftContent}
                  onChange={(event) => setDraftContent(event.target.value)}
                  rows={7}
                  className="mt-2 w-full resize-none rounded-2xl bg-white px-4 py-4 leading-7 outline-none ring-1 ring-outline/60 focus:ring-2 focus:ring-primary/45"
                  placeholder="按日期、训练部位或动作写下你的参考计划"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSaveStatus("");
                  }}
                  className="rounded-full bg-white px-5 py-4 font-bold text-ink"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
                >
                  <Save size={18} />
                  保存参考
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="rounded-3xl bg-white/80 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Sparkles size={17} />
                  {personalPlan.subtitle}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-primary-soft/55 p-3">
                    <p className="text-xs font-bold text-muted">体重目标</p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      67–68kg
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary-soft/70 p-3">
                    <p className="text-xs font-bold text-muted">力量训练</p>
                    <p className="mt-1 text-sm font-bold text-secondary">
                      每周4天
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {personalPlan.profile.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {planLines.map((line) => (
                    <p
                      key={line}
                      className="rounded-2xl bg-surface-soft px-4 py-3 text-sm leading-6 text-ink"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-white/80 p-4">
                <p className="text-sm font-bold text-muted">16周周期</p>
                <div className="mt-3 space-y-2">
                  {personalPlan.phases.map((phase) => (
                    <div key={phase.weeks} className="rounded-2xl bg-surface-soft px-3 py-3">
                      <p className="text-sm font-bold text-ink">
                        {phase.weeks} · {phase.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted">{phase.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              {reference.updatedAt ? (
                <p className="text-xs font-bold text-muted">
                  最近保存：{new Date(reference.updatedAt).toLocaleString("zh-CN")}
                </p>
              ) : null}
              {saveStatus ? (
                <p className="rounded-2xl bg-secondary-soft px-4 py-3 text-sm font-bold text-secondary">
                  {saveStatus}
                </p>
              ) : null}
              <button
                type="button"
                onClick={applyStrictPlan}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
              >
                <ShieldCheck size={18} />
                严格按我的计划制定
              </button>
              <button
                type="button"
                onClick={openEditor}
                className="w-full rounded-full bg-white px-5 py-4 font-bold text-primary shadow-soft"
              >
                编辑我的参考计划
              </button>
            </>
          )}
        </div>
      ) : null}
    </SectionCard>
  );
}
