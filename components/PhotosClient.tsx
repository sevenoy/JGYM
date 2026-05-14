"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  ImagePlus,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import PhotoGrid from "@/components/PhotoGrid";
import NutritionPhotoTracker from "@/components/NutritionPhotoTracker";
import SectionCard from "@/components/SectionCard";
import {
  SELECTED_BODY_PART_STORAGE_KEY,
} from "@/lib/fitness-data";
import { useUploadedPhotos } from "@/lib/client-state";
import { photos } from "@/lib/mock-data";
import type { PhotoEntry } from "@/lib/types";

export default function PhotosClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotos, persistUploaded] = useUploadedPhotos();
  const [beforePhoto, setBeforePhoto] = useState(
    photos[photos.length - 1]?.id ?? "",
  );
  const [afterPhoto, setAfterPhoto] = useState(photos[0]?.id ?? "");
  const [feedback, setFeedback] = useState("");
  const [showGrowthCard, setShowGrowthCard] = useState(false);

  const allPhotos = useMemo(
    () => [...uploadedPhotos, ...photos].slice(0, 24),
    [uploadedPhotos],
  );
  const recentPhotos = allPhotos.slice(0, 6);
  const safeBeforePhoto = allPhotos.some((photo) => photo.id === beforePhoto)
    ? beforePhoto
    : (allPhotos[0]?.id ?? "");
  const safeAfterPhoto = allPhotos.some((photo) => photo.id === afterPhoto)
    ? afterPhoto
    : (allPhotos[0]?.id ?? "");
  const before = allPhotos.find((photo) => photo.id === safeBeforePhoto) ?? allPhotos[0];
  const after = allPhotos.find((photo) => photo.id === safeAfterPhoto) ?? allPhotos[0];
  const stats = getCompareStats(before, after);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const selectedPart =
        window.localStorage.getItem(SELECTED_BODY_PART_STORAGE_KEY) || "背部";
      const photo: PhotoEntry = {
        id: `uploaded-${Date.now()}`,
        date: formatChineseDate(new Date()),
        weight: "176 斤",
        image: String(reader.result),
        uploaded: true,
        uploadedAt: new Date().toISOString(),
        trainingTitle: `今日训练：${selectedPart}`,
        workoutId: "today-workout",
      };
      const nextPhotos = [photo, ...uploadedPhotos].slice(0, 12);
      persistUploaded(nextPhotos);
      setAfterPhoto(photo.id);
      setShowGrowthCard(false);
      setFeedback("照片已上传，并已归档到今天的训练记录");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function deleteUploadedPhoto(photoId: string) {
    const nextPhotos = uploadedPhotos.filter((photo) => photo.id !== photoId);
    persistUploaded(nextPhotos);
    if (afterPhoto === photoId) {
      setAfterPhoto(nextPhotos[0]?.id ?? photos[0]?.id ?? "");
    }
    if (beforePhoto === photoId) {
      setBeforePhoto(photos[photos.length - 1]?.id ?? "");
    }
    setFeedback("已删除上传照片，训练记录已同步更新");
  }

  function autoPickCompare() {
    if (allPhotos.length < 2) return;
    setBeforePhoto(allPhotos[allPhotos.length - 1].id);
    setAfterPhoto(allPhotos[0].id);
    setShowGrowthCard(false);
    setFeedback("已自动选择最早和最近照片进行对比");
  }

  return (
    <>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">相册与饮食记录</h1>
        <p className="mt-2 text-muted">身材照片和餐食照片放在同一页追踪。</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
        >
          <Camera size={19} />
          上传今日照片
        </button>
      </section>

      {uploadedPhotos[0] ? (
        <SectionCard className="mt-6 overflow-hidden p-0">
          <div
            role="img"
            aria-label={`${uploadedPhotos[0].date} 已上传照片`}
            className="relative aspect-[1.12] overflow-hidden bg-surface-muted bg-cover bg-center"
            style={{ backgroundImage: `url(${uploadedPhotos[0].image})` }}
          >
            <button
              type="button"
              aria-label="删除最新上传照片"
              onClick={() => deleteUploadedPhoto(uploadedPhotos[0].id)}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-primary shadow-soft backdrop-blur"
            >
              <Trash2 size={17} />
            </button>
          </div>
          <div className="p-4">
            <p className="font-bold">已上传照片</p>
            <p className="mt-1 text-sm text-muted">
              {uploadedPhotos[0].date} • {uploadedPhotos[0].trainingTitle}
            </p>
          </div>
        </SectionCard>
      ) : null}

      <NutritionPhotoTracker />

      <SectionCard className="mt-8 bg-gradient-to-br from-white to-secondary-soft">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <ImagePlus className="text-secondary" size={23} />
          对比工具
        </h2>
        <p className="mt-2 text-sm text-muted">选择两张照片后会立即生成对比结果</p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-bold">对比前（基准）</span>
            <select
              value={safeBeforePhoto}
              onChange={(event) => {
                setBeforePhoto(event.target.value);
                setShowGrowthCard(false);
              }}
              className="mt-2 h-[52px] w-full rounded-2xl bg-surface-soft px-4 py-3 outline-none"
            >
              {allPhotos.map((photo) => (
                <option key={photo.id} value={photo.id}>
                  {photo.date}（{photo.weight}）
                </option>
              ))}
            </select>
          </label>
          <div className="grid place-items-center text-muted">
            <ArrowRight className="rotate-90" size={22} />
          </div>
          <label className="block">
            <span className="text-sm font-bold">对比后（当前）</span>
            <select
              value={safeAfterPhoto}
              onChange={(event) => {
                setAfterPhoto(event.target.value);
                setShowGrowthCard(false);
              }}
              className="mt-2 h-[52px] w-full rounded-2xl bg-surface-soft px-4 py-3 outline-none"
            >
              {allPhotos.map((photo) => (
                <option key={photo.id} value={photo.id}>
                  {photo.date}（{photo.weight}）
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[before, after].map((photo, index) => (
            <div key={`${photo?.id}-${index}`} className="overflow-hidden rounded-3xl bg-white">
              <div
                role="img"
                aria-label={`${photo?.date} 对比照片`}
                className="aspect-[0.86] bg-surface-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${photo?.image})` }}
              />
              <div className="p-3">
                <p className="text-xs font-bold text-muted">
                  {index === 0 ? "基准" : "当前"}
                </p>
                <p className="mt-1 text-sm font-bold">{photo?.date}</p>
                <p className="text-xs text-muted">{photo?.weight}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-secondary/25 bg-secondary-soft p-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] font-bold text-secondary">
            <Sparkles size={13} />
            AI 分析
          </span>
          <p className="mt-2 text-sm leading-6 text-ink">
            {before?.date} 到 {after?.date}：{stats.analysis}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={autoPickCompare}
            className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-white"
          >
            自动选择对比
          </button>
          <button
            type="button"
            onClick={() => {
              setShowGrowthCard(true);
              setFeedback("成长卡片已生成");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-surface-high px-4 py-3 text-sm font-bold text-ink"
          >
            <Share2 size={16} />
            生成成长卡片
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-soft p-4 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {stats.days}
            </p>
            <p className="text-xs font-bold text-muted">相隔天数</p>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {stats.weightDiff}
            </p>
            <p className="text-xs font-bold text-muted">体重差异</p>
          </div>
        </div>

        {showGrowthCard ? (
          <div className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
            <p className="text-sm font-bold text-primary">成长卡片</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {stats.days} 天记录，体重变化 {stats.weightDiff}。继续保持当前训练节奏，每 2-4 周复盘一次照片。
            </p>
          </div>
        ) : null}
      </SectionCard>

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">最近6次上传</h2>
            <p className="mt-1 text-sm text-muted">
              新照片会排在最前面，并同步到训练历史。
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-muted shadow-soft">
            {recentPhotos.length}/6
          </span>
        </div>
        <div className="mt-4">
          <PhotoGrid photos={recentPhotos} onDelete={deleteUploadedPhoto} />
        </div>
      </section>

      {feedback ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[90] max-w-[min(88vw,360px)] -translate-x-1/2 rounded-full bg-ink px-4 py-3 text-center text-sm font-bold text-white shadow-soft"
        >
          {feedback}
        </div>
      ) : null}
    </>
  );
}

function formatChineseDate(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function parseDate(dateLabel?: string) {
  const match = dateLabel?.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function parseWeight(weight?: string) {
  const match = weight?.match(/-?\d+/);
  return match ? Number(match[0]) : undefined;
}

function getCompareStats(before?: PhotoEntry, after?: PhotoEntry) {
  const beforeDate = parseDate(before?.date);
  const afterDate = parseDate(after?.date);
  const beforeWeight = parseWeight(before?.weight);
  const afterWeight = parseWeight(after?.weight);
  const days =
    beforeDate && afterDate
      ? Math.abs(
          Math.round((afterDate.getTime() - beforeDate.getTime()) / 86400000),
        )
      : 0;
  const diff =
    typeof beforeWeight === "number" && typeof afterWeight === "number"
      ? afterWeight - beforeWeight
      : 0;
  const signedDiff = diff > 0 ? `+${diff} 斤` : `${diff} 斤`;
  const analysis =
    diff < 0
      ? "体重下降且线条更清晰，建议继续保持力量训练，避免过快减重。"
      : diff > 0
        ? "体重上升，适合结合围度和照片判断是否为增肌变化。"
        : "体重稳定，照片对比更适合观察体态、线条和肌肉饱满度。";

  return {
    days,
    weightDiff: signedDiff,
    analysis,
  };
}
