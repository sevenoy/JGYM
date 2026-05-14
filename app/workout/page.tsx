import { Suspense } from "react";
import WorkoutSession from "@/components/WorkoutSession";

export default function WorkoutPage() {
  return (
    <Suspense fallback={null}>
      <WorkoutSession />
    </Suspense>
  );
}
