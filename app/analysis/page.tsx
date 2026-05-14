import Link from "next/link";
import { Bookmark, CalendarDays, Flame, Sparkles, Trophy } from "lucide-react";
import FeedbackButton from "@/components/FeedbackButton";
import PageShell from "@/components/PageShell";
import AiAnalysisCard from "@/components/AiAnalysisCard";
import SectionCard from "@/components/SectionCard";
import { analysisItems } from "@/lib/mock-data";

export default function AnalysisPage() {
  return (
    <PageShell showBack>
      <div className="pt-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
          <Sparkles size={14} />
          分析完成
        </span>
      </div>

      <SectionCard className="mt-6 text-center">
        <h1 className="font-display text-2xl font-bold">胸部与三头训练分析</h1>
        <p className="mt-2 text-muted">2026年5月12日 • 55分钟</p>
        <p className="mt-8 font-display text-7xl font-bold text-primary">
          8.5<span className="text-2xl font-normal text-muted">/10</span>
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface-soft p-4">
            <Flame className="mx-auto text-secondary" size={23} />
            <p className="mt-2 text-sm font-bold text-muted">强度</p>
            <p className="font-display text-xl font-bold">中高</p>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4">
            <Trophy className="mx-auto text-accent" size={23} />
            <p className="mt-2 text-sm font-bold text-muted">完成度</p>
            <p className="font-display text-xl font-bold">92%</p>
          </div>
        </div>
      </SectionCard>

      <div className="mt-6">
        <AiAnalysisCard
          summary="卧推表现稳定，但最后几组耐力有所下降。动作形态在孤立动作中表现出色，建议在复合动作组间稍微延长休息时间，以维持动力输出。"
          items={analysisItems}
        />
      </div>

      <SectionCard className="mt-6 border-secondary/25 bg-secondary-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-secondary">下一场训练</p>
            <h2 className="mt-1 font-display text-2xl font-bold">背部 + 二头</h2>
            <p className="mt-1 text-sm text-muted">5月14日 • 60分钟</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-white">
            <CalendarDays size={24} />
          </span>
        </div>
      </SectionCard>

      <div className="mt-6 space-y-3">
        <FeedbackButton
          type="button"
          feedback="训练分析已保存到本地计划记录"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
        >
          <Bookmark size={18} />
          保存分析
        </FeedbackButton>
        <Link
          href="/workout"
          className="flex w-full items-center justify-center rounded-full bg-surface-high px-5 py-4 font-bold text-ink"
        >
          查看下一次训练
        </Link>
      </div>
    </PageShell>
  );
}
