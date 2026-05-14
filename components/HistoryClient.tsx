"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Calendar, Camera, Clock, Sparkles, Zap } from "lucide-react";
import SectionCard from "@/components/SectionCard";
import { useUploadedPhotos } from "@/lib/client-state";
import { historyEntries } from "@/lib/mock-data";
import type { HistoryEntry } from "@/lib/types";

export default function HistoryClient() {
  const [uploadedPhotos] = useUploadedPhotos();

  const entries = useMemo<HistoryEntry[]>(() => {
    const uploadedEntries = uploadedPhotos.map((photo, index) => ({
      id: `photo-${photo.id}`,
      title: photo.trainingTitle?.replace("今日训练：", "") || "今日训练",
      date: index === 0 ? "今天 已拍照" : photo.date,
      duration: "已拍照",
      tags: ["训练照片", "进步记录"],
      score: 8.6,
      photoImage: photo.image,
      photoCount: 1,
    }));

    return [...uploadedEntries, ...historyEntries];
  }, [uploadedPhotos]);

  return (
    <>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">训练历史记录</h1>
        <p className="mt-2 text-muted">
          训练后如果上传照片，会自动显示在对应训练记录里。
        </p>
      </section>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <SectionCard className="p-5">
          <Zap className="text-primary" size={24} />
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-muted">
            本月训练
          </p>
          <p className="mt-3 font-display text-5xl font-bold">14</p>
        </SectionCard>
        <SectionCard className="bg-gradient-to-br from-white to-secondary-soft p-5">
          <Sparkles className="text-secondary" size={24} />
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-muted">
            平均 AI 评分
          </p>
          <p className="mt-3 font-display text-5xl font-bold text-primary">
            8.8<span className="text-base font-normal text-ink">/10</span>
          </p>
        </SectionCard>
      </div>

      <div className="mt-8 space-y-4">
        {entries.map((entry) => (
          <Link key={entry.id} href="/analysis">
            <SectionCard as="article" className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold">
                    {entry.title}
                  </h2>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary-soft px-3 py-1.5 text-sm font-bold text-secondary">
                    <Calendar size={17} />
                    {entry.date}
                  </p>
                </div>
                {entry.photoImage ? (
                  <div
                    role="img"
                    aria-label={`${entry.title} 训练照片`}
                    className="h-20 w-20 shrink-0 rounded-2xl bg-surface-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${entry.photoImage})` }}
                  />
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
                    <Clock size={15} />
                    {entry.duration}
                  </span>
                )}
              </div>

              <div className="mt-5 border-t border-outline/40 pt-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-surface-muted px-2 py-1 text-xs font-bold text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                    {entry.photoImage ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary-soft px-2 py-1 text-xs font-bold text-primary">
                        <Camera size={13} />
                        {entry.photoCount ?? 1} 张照片
                      </span>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-muted">
                      AI Score
                    </p>
                    <p className="font-display text-4xl font-bold text-primary">
                      {entry.score}
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </Link>
        ))}
      </div>
    </>
  );
}
