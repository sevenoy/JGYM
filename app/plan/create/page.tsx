import CreatePlanForm from "@/components/CreatePlanForm";
import PageShell from "@/components/PageShell";

export default function CreatePlanPage() {
  return (
    <PageShell>
      <section className="pt-3 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">
          生成你的 AI 计划
        </h1>
        <p className="mx-auto mt-3 max-w-sm leading-7 text-muted">
          像和教练聊天一样说明目标、时间和训练环境，再选择最适合的计划。
        </p>
      </section>
      <CreatePlanForm />
    </PageShell>
  );
}
