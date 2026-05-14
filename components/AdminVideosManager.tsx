"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Video,
  X,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import { videoLibrary } from "@/lib/mock-data";

type ManagedVideo = {
  id: string;
  title: string;
  category: string;
  status: string;
  image: string;
  url: string;
  target: string;
};

const defaultVideoImage =
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=80";

const categoryOptions = ["力量", "增肌塑形", "高强度间歇训练", "恢复", "动作教学"];
const targetOptions = ["胸部", "背部", "肩部", "腿部", "核心", "全身"];

function makeInitialVideos(): ManagedVideo[] {
  return videoLibrary.map((video, index) => ({
    id: `seed-video-${index}`,
    title: video.title,
    category: video.category,
    status: video.status,
    image: video.image,
    url: "",
    target: video.status,
  }));
}

export default function AdminVideosManager() {
  const [videos, setVideos] = useState(makeInitialVideos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [target, setTarget] = useState(targetOptions[0]);
  const [message, setMessage] = useState("");

  const editingVideo = useMemo(
    () => videos.find((video) => video.id === editingVideoId) ?? null,
    [editingVideoId, videos],
  );

  function resetForm() {
    setUrl("");
    setTitle("");
    setCategory(categoryOptions[0]);
    setTarget(targetOptions[0]);
    setEditingVideoId(null);
  }

  function openAddDialog() {
    resetForm();
    setMessage("");
    setIsDialogOpen(true);
  }

  function openEditDialog(video: ManagedVideo) {
    setEditingVideoId(video.id);
    setUrl(video.url);
    setTitle(video.title);
    setCategory(video.category);
    setTarget(video.target);
    setMessage("");
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
    resetForm();
  }

  function saveVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim() || "新的训练视频";
    const normalizedUrl = url.trim();
    const nextVideo: ManagedVideo = {
      id: editingVideo?.id ?? `custom-video-${Date.now()}`,
      title: normalizedTitle,
      category,
      status: target,
      image: editingVideo?.image ?? defaultVideoImage,
      url: normalizedUrl,
      target,
    };

    setVideos((currentVideos) => {
      if (editingVideo) {
        return currentVideos.map((video) =>
          video.id === editingVideo.id ? nextVideo : video,
        );
      }

      return [nextVideo, ...currentVideos];
    });
    setMessage(editingVideo ? `已更新视频：${normalizedTitle}` : `已添加视频：${normalizedTitle}`);
    closeDialog();
  }

  function deleteVideo(video: ManagedVideo) {
    setVideos((currentVideos) =>
      currentVideos.filter((currentVideo) => currentVideo.id !== video.id),
    );
    setMessage(`已删除视频：${video.title}`);
  }

  return (
    <>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold">视频管理</h1>
        <p className="mt-2 text-muted">管理您的训练视频库。</p>
        <button
          type="button"
          onClick={openAddDialog}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
        >
          <LinkIcon size={18} />
          添加 YouTube 链接
        </button>
      </section>

      {message ? (
        <p className="mt-5 rounded-2xl bg-secondary-soft px-4 py-3 text-sm font-bold text-secondary">
          {message}
        </p>
      ) : null}

      <div className="mt-8 space-y-5">
        {videos.map((video) => (
          <SectionCard key={video.id} as="article" className="overflow-hidden p-0">
            <div className="relative h-52 bg-surface-muted">
              <Image
                src={video.image}
                alt={`${video.title} 视频封面`}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
              />
              <div className="absolute inset-0 grid place-items-center bg-primary/20">
                <span className="rounded-full bg-white/78 px-5 py-3 text-2xl font-bold text-primary backdrop-blur">
                  {video.category.slice(0, 2)}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-bold">{video.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-bold text-secondary">
                  {video.category}
                </span>
                <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-primary">
                  {video.target}
                </span>
                {video.url ? (
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                    已绑定链接
                  </span>
                ) : null}
              </div>
              <div className="mt-5 flex justify-end gap-4 border-t border-outline/40 pt-4 text-muted">
                <button
                  type="button"
                  aria-label={`编辑 ${video.title}`}
                  onClick={() => openEditDialog(video)}
                  className="rounded-full p-2 hover:bg-surface-soft"
                >
                  <Pencil size={19} />
                </button>
                <button
                  type="button"
                  aria-label={`删除 ${video.title}`}
                  onClick={() => deleteVideo(video)}
                  className="rounded-full p-2 hover:bg-surface-soft"
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/25 px-4 pb-4 backdrop-blur-sm sm:items-center">
          <form
            onSubmit={saveVideo}
            className="w-full max-w-md rounded-card bg-white p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  <Video size={14} />
                  YouTube
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold">
                  {editingVideo ? "编辑视频" : "添加 YouTube 链接"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  保存后会立即出现在视频库，后续接入数据库后同步到后台。
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="关闭添加视频弹窗"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-soft text-muted"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-muted">YouTube 链接</span>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  className="mt-2 w-full rounded-2xl bg-surface-soft px-4 py-4 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary/45"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-muted">视频标题</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-2xl bg-surface-soft px-4 py-4 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary/45"
                  placeholder="例如：肩部热身激活"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-muted">分类</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="mt-2 w-full rounded-2xl bg-surface-soft px-3 py-4 font-bold outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary/45"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-muted">训练部位</span>
                  <select
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    className="mt-2 w-full rounded-2xl bg-surface-soft px-3 py-4 font-bold outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary/45"
                  >
                    {targetOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
            >
              <Check size={18} />
              {editingVideo ? "保存修改" : "添加到视频库"}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
