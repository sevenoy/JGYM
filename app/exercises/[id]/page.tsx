import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Bookmark,
  Layers,
  Play,
  Repeat2,
  Share2,
  Timer,
  Trophy,
} from "lucide-react";
import FeedbackButton from "@/components/FeedbackButton";
import PageShell from "@/components/PageShell";
import SectionCard from "@/components/SectionCard";
import { exercises } from "@/lib/mock-data";

export function generateStaticParams() {
  return exercises.map((exercise) => ({ id: exercise.id }));
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise =
    exercises.find((item) => item.id === id) ??
    exercises.find((item) => item.id === "barbell-bench-press");

  if (!exercise) notFound();

  return (
    <PageShell headerTitle="动作详情" showBack>
      <div className="relative h-60 overflow-hidden rounded-card-lg bg-ink shadow-soft">
        <Image
          src={exercise.image ?? ""}
          alt={`${exercise.name} 演示视频封面`}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 grid place-items-center">
          <FeedbackButton
            type="button"
            aria-label="播放动作视频"
            feedback="视频播放入口已响应，接入视频源后会开始播放"
            className="grid h-20 w-20 place-items-center rounded-full bg-white/78 text-primary backdrop-blur"
          >
            <Play size={34} fill="currentColor" />
          </FeedbackButton>
        </div>
        <span className="absolute bottom-3 right-3 rounded-lg bg-ink/65 px-2 py-1 text-xs font-bold text-white">
          01:45
        </span>
      </div>

      <section className="mt-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-bold">{exercise.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {exercise.target.map((target) => (
                <span
                  key={target}
                  className="rounded-full bg-surface-muted px-3 py-2 text-xs font-bold text-primary"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>
          <FeedbackButton
            type="button"
            aria-label="分享动作"
            feedback="分享卡片已准备，接入系统分享后可发送"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-soft"
          >
            <Share2 size={20} />
          </FeedbackButton>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <SectionCard className="grid place-items-center p-4 text-center">
          <Layers className="text-primary" size={25} />
          <p className="mt-3 font-display text-2xl font-bold">
            {exercise.defaultSets.replace("组", "")}
          </p>
          <p className="text-xs font-bold text-muted">推荐组数</p>
        </SectionCard>
        <SectionCard className="grid place-items-center p-4 text-center">
          <Repeat2 className="text-secondary" size={25} />
          <p className="mt-3 font-display text-2xl font-bold">{exercise.reps}</p>
          <p className="text-xs font-bold text-muted">次 / 组</p>
        </SectionCard>
        <SectionCard className="grid place-items-center p-4 text-center">
          <Timer className="text-accent" size={25} />
          <p className="mt-3 font-display text-2xl font-bold">{exercise.rest}</p>
          <p className="text-xs font-bold text-muted">休息时间</p>
        </SectionCard>
      </div>

      <SectionCard className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Trophy size={22} className="text-primary" />
          动作说明
        </h2>
        <p className="mt-4 leading-7 text-muted">{exercise.description}</p>
        <ul className="mt-5 space-y-3">
          {exercise.cues.map((cue) => (
            <li key={cue} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
              <span>{cue}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="mt-6 flex gap-3">
        <FeedbackButton
          type="button"
          aria-label="收藏动作"
          feedback={`${exercise.name} 已加入收藏`}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-soft"
        >
          <Bookmark size={21} />
        </FeedbackButton>
        <Link
          href="/workout"
          className="flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-primary px-5 font-bold text-white shadow-soft"
        >
          加入今日训练
        </Link>
      </div>
    </PageShell>
  );
}
