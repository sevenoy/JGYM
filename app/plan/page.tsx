import PageShell from "@/components/PageShell";
import PersonalPlanExecutionSettings from "@/components/PersonalPlanExecutionSettings";
import PersonalPlanReference from "@/components/PersonalPlanReference";
import SelectedPlanDetail from "@/components/SelectedPlanDetail";

export default function PlanPage() {
  return (
    <PageShell>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">训练计划详情</h1>
        <p className="mt-2 text-muted">
          查看已选择计划，从开始日期起按第 1 天、第 2 天执行。
        </p>
      </section>

      <PersonalPlanReference />
      <PersonalPlanExecutionSettings />
      <SelectedPlanDetail />
    </PageShell>
  );
}
