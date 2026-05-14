"use client";

import { useState } from "react";
import {
  Activity,
  Dumbbell,
  Hand,
  HeartPulse,
  PersonStanding,
  Pencil,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import {
  bodyPartLabels,
} from "@/lib/fitness-data";
import { useSelectedBodyPart } from "@/lib/client-state";
import { cn } from "@/lib/utils";

type BodyPartSelectorProps = {
  selected?: string;
  onSelect?: (part: string) => void;
};

const iconMap = {
  胸部: PersonStanding,
  背部: Hand,
  肩部: HeartPulse,
  腿部: Dumbbell,
  臀部: Activity,
  手臂: Repeat2,
  核心: ShieldCheck,
  有氧: Sparkles,
  全身: Target,
  自定义: Pencil,
};

function isKnownBodyPart(value: string) {
  return bodyPartLabels.some((part) => part === value);
}

export default function BodyPartSelector({
  selected: controlledSelected,
  onSelect,
}: BodyPartSelectorProps) {
  const [storedSelected, setStoredSelected] = useSelectedBodyPart();
  const [customPart, setCustomPart] = useState("");
  const selected = controlledSelected ?? storedSelected;

  function selectPart(part: string) {
    onSelect?.(part);
    setStoredSelected(part);
  }

  function applyCustomPart() {
    const nextPart = customPart.trim();
    if (!nextPart) return;
    selectPart(nextPart);
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">训练部位</h2>
          <p className="mt-1 text-sm text-muted">选择后会同步更新 AI 定制训练</p>
        </div>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
          {selected}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {bodyPartLabels.map((part) => {
          const Icon = iconMap[part];
          const active =
            selected === part || (part === "自定义" && !isKnownBodyPart(selected));
          return (
            <button
              key={part}
              type="button"
              onClick={() => selectPart(part)}
              className={cn(
                "grid min-h-[104px] min-w-0 place-items-center rounded-3xl border px-2 py-3 shadow-soft transition",
                active
                  ? "border-primary/40 bg-primary-soft text-primary"
                  : "border-outline/35 bg-white text-ink",
              )}
            >
              <span
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full",
                  active ? "bg-primary text-white" : "bg-surface-soft text-muted",
                )}
              >
                <Icon size={22} />
              </span>
              <span className="mt-2 text-sm font-bold">{part}</span>
            </button>
          );
        })}
      </div>

      {selected === "自定义" || !isKnownBodyPart(selected) ? (
        <div className="mt-3 flex gap-2 rounded-3xl bg-white p-2 shadow-soft">
          <input
            value={customPart}
            onChange={(event) => setCustomPart(event.target.value)}
            placeholder="输入自定义部位，如上胸、肩颈、髋部"
            className="min-w-0 flex-1 rounded-2xl bg-surface-soft px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={applyCustomPart}
            className="rounded-2xl bg-primary px-4 text-sm font-bold text-white"
          >
            应用
          </button>
        </div>
      ) : null}

      <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-muted shadow-soft">
        已选择 {selected}，今日 AI 定制和开始训练会按这个部位重新推荐。
      </p>
    </section>
  );
}
