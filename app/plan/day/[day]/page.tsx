import PageShell from "@/components/PageShell";
import PlanDayDetail from "@/components/PlanDayDetail";
import { clampPlanDay } from "@/lib/personal-plan";

type PlanDayPageProps = {
  params: Promise<{
    day: string;
  }>;
};

export function generateStaticParams() {
  return Array.from({ length: 112 }, (_, index) => ({
    day: String(index + 1),
  }));
}

export default async function PlanDayPage({ params }: PlanDayPageProps) {
  const { day } = await params;
  const planDay = clampPlanDay(Number(day));

  return (
    <PageShell showBack headerTitle={`第 ${planDay} 天`} headerSubtitle="完整执行内容">
      <PlanDayDetail planDay={planDay} />
    </PageShell>
  );
}
