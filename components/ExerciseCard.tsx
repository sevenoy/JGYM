import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Pencil,
  PlayCircle,
  Trash2,
} from "lucide-react";
import type { Exercise } from "@/lib/types";
import FeedbackButton from "./FeedbackButton";
import SectionCard from "./SectionCard";
import { cn } from "@/lib/utils";

type ExerciseCardProps = {
  exercise: Exercise;
  compact?: boolean;
};

const levelClass = {
  初级: "bg-primary-soft text-primary",
  中级: "bg-accent-soft text-[#865000]",
  高级: "bg-rose-100 text-rose-700",
};

export default function ExerciseCard({ exercise, compact = false }: ExerciseCardProps) {
  return (
    <SectionCard
      as="article"
      className={cn(
        "transition hover:-translate-y-0.5 hover:shadow-glow",
        !exercise.enabled && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Link href={`/exercises/${exercise.id}`} className="min-w-0">
          <h3 className="font-display text-2xl font-bold">{exercise.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {exercise.target.slice(0, compact ? 2 : 3).map((target) => (
              <span
                key={target}
                className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-muted"
              >
                {target}
              </span>
            ))}
          </div>
        </Link>
        <div className="flex h-8 w-14 items-center justify-end rounded-full bg-primary px-1">
          {exercise.enabled ? (
            <CheckCircle2 className="text-white" size={28} fill="#2563EB" />
          ) : (
            <Circle className="text-white" size={25} />
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-surface-soft p-4">
        <div>
          <p className="text-xs font-bold text-muted">默认组数 / 次数</p>
          <p className="mt-1 text-lg font-bold">
            {exercise.defaultSets} x {exercise.reps}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted">难度等级</p>
          <span
            className={cn(
              "mt-1 inline-flex rounded-lg px-2 py-1 text-xs font-bold",
              levelClass[exercise.level],
            )}
          >
            {exercise.level}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-outline/40 pt-4">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-sm font-bold",
            exercise.hasVideo ? "text-primary" : "text-muted",
          )}
        >
          <PlayCircle size={19} />
          {exercise.hasVideo ? "已绑定视频" : "无视频"}
        </span>
        <div className="flex gap-3 text-muted">
          <FeedbackButton
            type="button"
            aria-label={`编辑 ${exercise.name}`}
            feedback={`已打开 ${exercise.name} 的编辑入口`}
          >
            <Pencil size={19} />
          </FeedbackButton>
          <FeedbackButton
            type="button"
            aria-label={`删除 ${exercise.name}`}
            feedback={`${exercise.name} 会在接入数据库后执行删除确认`}
          >
            <Trash2 size={19} />
          </FeedbackButton>
        </div>
      </div>
    </SectionCard>
  );
}
