import { Bot, CheckCircle2, TriangleAlert } from "lucide-react";
import type { AnalysisItem } from "@/lib/types";
import SectionCard from "./SectionCard";

type AiAnalysisCardProps = {
  title?: string;
  summary: string;
  items: AnalysisItem[];
};

export default function AiAnalysisCard({
  title = "AI 训练总结",
  summary,
  items,
}: AiAnalysisCardProps) {
  return (
    <div className="space-y-4">
      <SectionCard className="border-primary/15 bg-gradient-to-br from-primary-soft/70 to-secondary-soft/70">
        <div className="flex items-center gap-2 text-primary">
          <Bot size={22} />
          <h2 className="font-display text-xl font-bold">{title}</h2>
        </div>
        <p className="mt-4 text-base leading-7 text-ink">{summary}</p>
      </SectionCard>

      <SectionCard>
        <h3 className="font-display text-xl font-bold">进步点</h3>
        <div className="mt-4 space-y-4">
          {items
            .filter((item) => item.type === "positive")
            .map((item) => (
              <div key={item.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 text-primary" size={21} />
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-muted">{item.detail}</p>
                </div>
              </div>
            ))}
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="font-display text-xl font-bold">关注区域</h3>
        <div className="mt-4 space-y-4">
          {items
            .filter((item) => item.type === "warning")
            .map((item) => (
              <div key={item.title} className="flex gap-3">
                <TriangleAlert className="mt-0.5 text-accent" size={21} />
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-muted">{item.detail}</p>
                </div>
              </div>
            ))}
        </div>
      </SectionCard>
    </div>
  );
}
