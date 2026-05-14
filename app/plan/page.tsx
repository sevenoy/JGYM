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
          点击任意一天会把这一天设为今天执行，并进入完整执行内容。
        </p>
      </section>

      <PersonalPlanReference />
      <PersonalPlanExecutionSettings />
      <SelectedPlanDetail />
    </PageShell>
  );
}
