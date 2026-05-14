import AdminAiSettingsForm from "@/components/AdminAiSettingsForm";
import PageShell from "@/components/PageShell";

export default function AdminAiPage() {
  return (
    <PageShell showBack>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">AI 提示词设置</h1>
        <p className="mt-3 leading-7 text-muted">
          配置智能服务商，并根据整体健康目标量身定制辅导体验。
        </p>
      </section>

      <AdminAiSettingsForm />
    </PageShell>
  );
}
