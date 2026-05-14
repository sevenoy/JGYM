"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Bot,
  Check,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ExerciseCard from "@/components/ExerciseCard";
import SectionCard from "@/components/SectionCard";
import {
  exerciseCatalog,
  exerciseCategories,
  inferExerciseFromPrompt,
} from "@/lib/fitness-data";
import type { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ExercisesManager() {
  const [items, setItems] = useState<Exercise[]>(() => exerciseCatalog);
  const [selectedPart, setSelectedPart] = useState("胸部");
  const [query, setQuery] = useState("");
  const [onlyEnabled, setOnlyEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExercisePart, setNewExercisePart] = useState("胸部");
  const [feedback, setFeedback] = useState("");

  const filteredExercises = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter((exercise) => {
      const matchesPart =
        selectedPart === "全部" ||
        exercise.target.some((target) => target.includes(selectedPart));
      const matchesQuery =
        !text ||
        exercise.name.toLowerCase().includes(text) ||
        exercise.target.some((target) => target.toLowerCase().includes(text));
      const matchesEnabled = !onlyEnabled || exercise.enabled;
      return matchesPart && matchesQuery && matchesEnabled;
    });
  }, [items, onlyEnabled, query, selectedPart]);

  function handleAiAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const generated = inferExerciseFromPrompt(newExerciseName, newExercisePart);

    setItems((current) => [generated, ...current]);
    setSelectedPart(generated.target[0] ?? newExercisePart);
    setQuery("");
    setNewExerciseName("");
    setNewExercisePart("胸部");
    setIsDialogOpen(false);
    setFeedback(`AI 已生成动作卡片：${generated.name}`);
  }

  return (
    <>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">动作库管理</h1>
        <p className="mt-2 text-sm text-muted">
          先选择训练部位，再从动作库里挑动作；也可以输入动作名让 AI 自动生成卡片。
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {["全部", ...exerciseCategories].map((part) => (
            <button
              key={part}
              type="button"
              onClick={() => setSelectedPart(part)}
              className={cn(
                "min-h-12 rounded-2xl px-2 text-sm font-bold shadow-soft",
                selectedPart === part
                  ? "bg-primary text-white"
                  : "bg-white text-muted",
              )}
            >
              {part}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-full bg-white px-4 py-4 shadow-soft">
          <Search size={20} className="text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`搜索${selectedPart === "全部" ? "" : selectedPart}动作...`}
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOnlyEnabled((value) => !value)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full px-4 py-4 font-bold shadow-soft",
              onlyEnabled ? "bg-primary-soft text-primary" : "bg-white text-ink",
            )}
          >
            <SlidersHorizontal size={18} />
            {onlyEnabled ? "已启用" : "筛选"}
          </button>
          <button
            type="button"
            onClick={() => {
              setNewExercisePart(selectedPart === "全部" ? "胸部" : selectedPart);
              setIsDialogOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 font-bold text-white shadow-soft"
          >
            <Plus size={20} />
            新增动作
          </button>
        </div>

        {feedback ? (
          <p className="mt-3 rounded-2xl bg-secondary-soft px-4 py-3 text-sm font-bold text-secondary">
            {feedback}
          </p>
        ) : null}
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            {selectedPart}动作
          </h2>
          <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-muted">
            {filteredExercises.length} 个
          </span>
        </div>
        <div className="space-y-4">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))
          ) : (
            <div className="rounded-3xl bg-white px-5 py-8 text-center text-sm font-bold text-muted shadow-soft">
              没有找到匹配动作，可以点“新增动作”让 AI 生成。
            </div>
          )}
        </div>
      </section>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-[95] bg-ink/30 px-5 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-md rounded-card bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                  <Bot className="text-primary" size={22} />
                  AI 新增动作
                </h2>
                <p className="mt-1 text-sm text-muted">
                  输入动作名称，AI 会分析部位、组数、次数和动作要点。
                </p>
              </div>
              <button
                type="button"
                aria-label="关闭新增动作"
                onClick={() => setIsDialogOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-soft text-muted"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAiAdd} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-muted">动作名称</span>
                <input
                  value={newExerciseName}
                  onChange={(event) => setNewExerciseName(event.target.value)}
                  required
                  placeholder="例如：杠铃上斜练胸"
                  className="mt-2 h-[52px] w-full rounded-2xl bg-surface-soft px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-muted">主要训练部位</span>
                <select
                  value={newExercisePart}
                  onChange={(event) => setNewExercisePart(event.target.value)}
                  className="mt-2 h-[52px] w-full rounded-2xl bg-surface-soft px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                >
                  {exerciseCategories.map((part) => (
                    <option key={part} value={part}>
                      {part}
                    </option>
                  ))}
                </select>
              </label>

              <SectionCard className="bg-secondary-soft p-4">
                <p className="text-sm font-bold text-secondary">生成示例</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  “杠铃上斜练胸”会生成胸部/上胸动作，推荐 4 组 8-12 次，并给出肩胛稳定、角度控制等提示。
                </p>
              </SectionCard>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
              >
                <Check size={18} />
                AI 生成并添加
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
