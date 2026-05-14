import HomeTrainingPlanner from "@/components/HomeTrainingPlanner";
import PageShell from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <section className="pt-3">
        <p className="text-sm font-bold text-muted">5月13日 星期三</p>
      </section>

      <div className="mt-6">
        <HomeTrainingPlanner />
      </div>
    </PageShell>
  );
}
