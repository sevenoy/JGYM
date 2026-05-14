import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Dumbbell } from "lucide-react";
import type { PlanDay } from "@/lib/types";
import SectionCard from "./SectionCard";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  days: PlanDay[];
};

export default function PlanCard({ days }: PlanCardProps) {
  return (
    <SectionCard className="overflow-hidden p-0">
      <div className="bg-gradient-to-br from-white to-primary-soft/55 p-6">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
          <CalendarDays size={14} />
          进行中的计划
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold">15天塑形计划</h2>
        <p className="mt-2 text-muted">第 4 / 15 天</p>
        <div className="mt-5 h-2 rounded-full bg-surface-muted">
          <div className="h-2 w-[26%] rounded-full bg-primary" />
        </div>
        <div className="mt-2 flex justify-between text-sm font-bold text-primary">
          <span>AI 自适应强度</span>
          <span>26%</span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {days.map((day) => (
          <div
            key={day.day}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3",
              day.status === "今日"
                ? "border-primary/35 bg-primary-soft/50"
                : "border-outline/35 bg-white",
            )}
          >
            <div
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
                day.status === "完成"
                  ? "bg-primary text-white"
                  : "bg-surface-soft text-primary",
              )}
            >
              {day.status === "完成" ? (
                <CheckCircle2 size={20} />
              ) : (
                <Dumbbell size={19} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{day.title}</p>
              <p className="text-sm text-muted">
                第 {day.day} 天 • {day.focus} • {day.duration}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-soft px-2 py-1 text-[11px] font-bold text-muted">
              {day.status}
            </span>
          </div>
        ))}
        <Link
          href="/plan/create"
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
        >
          生成新的 AI 计划
          <ArrowRight size={18} />
        </Link>
      </div>
    </SectionCard>
  );
}
