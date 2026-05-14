"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Timer, Video } from "lucide-react";
import SectionCard from "@/components/SectionCard";
import { exerciseCatalog } from "@/lib/fitness-data";
import type { Exercise } from "@/lib/types";

const adminDemoExercise: Exercise = {
  id: "cable-face-pull",
  name: "绳索面拉",
  target: ["肩部", "后束", "肩胛稳定"],
  defaultSets: "3组",
  reps: "12-15次",
  rest: "60s",
  level: "初级",
  hasVideo: false,
  enabled: true,
  image:
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
  description: "改善肩胛稳定和后束发力，适合作为上肢训练的辅助动作。",
  cues: ["绳索拉向眉心", "手肘略高于肩", "不要耸肩借力"],
};

export default function AdminExercisesPanel() {
  const [items, setItems] = useState<Exercise[]>(() => exerciseCatalog.slice(0, 6));
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const filteredItems = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return items;

    return items.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(text) ||
        exercise.target.some((target) => target.toLowerCase().includes(text)),
    );
  }, [items, query]);

  function addExercise() {
    if (items.some((exercise) => exercise.id === adminDemoExercise.id)) {
      setFeedback("绳索面拉已经在后台动作库中");
      return;
    }

    setItems((current) => [adminDemoExercise, ...current]);
    setQuery("");
    setFeedback("已添加后台示例动作：绳索面拉");
  }

  return (
    <>
      <section className="mt-8">
        <h2 className="font-display text-3xl font-bold">动作库管理</h2>
        <p className="mt-2 text-muted">管理应用内的所有训练动作。</p>
        <button
          type="button"
          onClick={addExercise}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-white shadow-soft"
        >
          <Plus size={20} />
          添加动作
        </button>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface-soft px-4 py-4">
          <Search className="text-muted" size={21} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索动作名称或目标肌群..."
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
          />
        </div>
        {feedback ? (
          <p className="mt-3 rounded-2xl bg-secondary-soft px-4 py-3 text-sm font-bold text-secondary">
            {feedback}
          </p>
        ) : null}
      </section>

      <div className="mt-6 space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((exercise) => (
            <SectionCard key={exercise.id} as="article">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Video size={25} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold">
                    {exercise.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {exercise.target.slice(0, 3).map((target) => (
                      <span
                        key={target}
                        className="rounded-lg bg-secondary-soft px-2 py-1 text-xs font-bold text-secondary"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 flex flex-wrap items-center gap-3 text-muted">
                    <span>
                      {exercise.defaultSets} x {exercise.reps}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Timer size={16} />
                      {exercise.rest} 休息
                    </span>
                  </p>
                </div>
              </div>
            </SectionCard>
          ))
        ) : (
          <div className="rounded-3xl bg-white px-5 py-8 text-center text-sm font-bold text-muted shadow-soft">
            没有找到匹配动作。
          </div>
        )}
      </div>
    </>
  );
}
