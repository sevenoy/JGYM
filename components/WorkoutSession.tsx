"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Dumbbell,
  ImagePlus,
  Pause,
  Play,
  Plus,
  Sparkles,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import SectionCard from "@/components/SectionCard";
import {
  exerciseCatalog,
  getWorkoutForBodyPart,
  getRecommendedSetCount,
  inferExerciseFromPrompt,
} from "@/lib/fitness-data";
import { useSelectedBodyPart, useUploadedPhotos } from "@/lib/client-state";
import type {
  Exercise,
  PhotoEntry,
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from "@/lib/types";
import { cn } from "@/lib/utils";

function cloneExercise(exercise: WorkoutExercise): WorkoutExercise {
  return {
    ...exercise,
    sets: exercise.sets.map((set) => ({ ...set })),
  };
}

function nextSetFrom(previous?: WorkoutSet): WorkoutSet {
  return {
    set: previous ? previous.set + 1 : 1,
    weight: previous?.weight ?? "",
    reps: previous?.reps ?? "",
    done: false,
  };
}

function toWorkoutExercise(exercise: Exercise): WorkoutExercise {
  const setCount = Number.parseInt(exercise.defaultSets, 10);
  const safeSetCount = Number.isFinite(setCount) ? Math.min(setCount, 4) : 1;

  return {
    id: exercise.id,
    name: exercise.name,
    target: exercise.target[0] ?? "全身",
    recommendation: `推荐：${exercise.defaultSets} • ${exercise.reps}`,
    sets: Array.from({ length: safeSetCount }, (_, index) => ({
      set: index + 1,
      weight: exercise.target.includes("有氧") ? "-" : index === 0 ? "建议" : "",
      reps: exercise.reps.replace("次", ""),
      done: false,
    })),
  };
}

function normalizeWorkoutExercise(exercise: WorkoutExercise): WorkoutExercise {
  const copy = cloneExercise(exercise);
  const expectedCount = getRecommendedSetCount(copy.recommendation, copy.sets.length);

  if (copy.sets.length >= expectedCount) return copy;

  const lastSet = copy.sets[copy.sets.length - 1] ?? {
    set: 1,
    weight: "",
    reps: "",
    done: false,
  };
  const missingSets = Array.from(
    { length: expectedCount - copy.sets.length },
    (_, index) => ({
      ...lastSet,
      set: copy.sets.length + index + 1,
      done: false,
    }),
  );

  return {
    ...copy,
    sets: [...copy.sets, ...missingSets],
  };
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function formatChineseDate(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function WorkoutSession() {
  const searchParams = useSearchParams();
  const [storedPart] = useSelectedBodyPart();
  const selectedPart = searchParams.get("part") || storedPart;

  return <WorkoutSessionContent key={selectedPart} selectedPart={selectedPart} />;
}

function WorkoutSessionContent({ selectedPart }: { selectedPart: string }) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const initialWorkout = getWorkoutForBodyPart(selectedPart);
  const [workout] = useState<Workout>(initialWorkout);
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    initialWorkout.exercises.map(normalizeWorkoutExercise),
  );
  const [uploadedPhotos, persistUploadedPhotos] = useUploadedPhotos();
  const [currentWorkoutPhoto, setCurrentWorkoutPhoto] = useState<PhotoEntry | null>(
    null,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(45 * 60 + 20);
  const [duration, setDuration] = useState(initialWorkout.duration.replace(" 分钟", ""));
  const [fatigue, setFatigue] = useState(7);
  const [pump, setPump] = useState(8);
  const [status, setStatus] = useState("好");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addPrompt, setAddPrompt] = useState("");

  const completedSets = useMemo(
    () =>
      exercises.reduce(
        (total, exercise) => total + exercise.sets.filter((set) => set.done).length,
        0,
      ),
    [exercises],
  );
  const totalSets = useMemo(
    () => exercises.reduce((total, exercise) => total + exercise.sets.length, 0),
    [exercises],
  );
  const suggestedExercises = useMemo(
    () =>
      exerciseCatalog
        .filter(
          (exercise) =>
            !exercises.some((item) => item.id === exercise.id) &&
            (exercise.target.includes(selectedPart) ||
              exercise.target.some((target) => workout.bodyPart.includes(target))),
        )
        .slice(0, 4),
    [exercises, selectedPart, workout.bodyPart],
  );
  const savedWorkoutPhoto = useMemo(
    () =>
      currentWorkoutPhoto ??
      uploadedPhotos.find(
        (photo) =>
          photo.workoutId === workout.id &&
          photo.trainingTitle === `今日训练：${selectedPart}`,
      ) ??
      null,
    [currentWorkoutPhoto, selectedPart, uploadedPhotos, workout.id],
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function updateSet(
    exerciseId: string,
    setNumber: number,
    field: "weight" | "reps",
    value: string,
  ) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.set === setNumber ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  }

  function toggleSet(exerciseId: string, setNumber: number) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.set === setNumber ? { ...set, done: !set.done } : set,
              ),
            }
          : exercise,
      ),
    );
  }

  function addSet(exerciseId: string) {
    setExercises((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const previous = exercise.sets[exercise.sets.length - 1];
        return { ...exercise, sets: [...exercise.sets, nextSetFrom(previous)] };
      }),
    );
    setFeedback("已添加一组，可以直接修改重量和次数");
  }

  function addExercise() {
    setAddPrompt("");
    setIsAddDialogOpen(true);
  }

  function submitAiExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const generated = inferExerciseFromPrompt(addPrompt, selectedPart);
    const workoutExercise = toWorkoutExercise(generated);

    setExercises((current) => [...current, workoutExercise]);
    setIsAddDialogOpen(false);
    setAddPrompt("");
    setFeedback(
      `AI 已添加 ${generated.name}：${generated.defaultSets}，${generated.reps}`,
    );
  }

  function copyPreviousWorkout() {
    setExercises((current) =>
      current.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => ({
          ...set,
          done: false,
        })),
      })),
    );
    setFatigue(6);
    setPump(7);
    setStatus("一般");
    setFeedback("已复制上次训练模板，完成状态已重置");
  }

  function uploadWorkoutPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photo: PhotoEntry = {
        id: `workout-photo-${Date.now()}`,
        date: formatChineseDate(new Date()),
        weight: "未记录体重",
        image: String(reader.result),
        uploaded: true,
        uploadedAt: new Date().toISOString(),
        trainingTitle: `今日训练：${selectedPart}`,
        workoutId: workout.id,
      };
      persistUploadedPhotos([photo, ...uploadedPhotos].slice(0, 12));
      setCurrentWorkoutPhoto(photo);
      setFeedback("训练照片已保存到今天的训练记录和进步相册");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeWorkoutPhoto() {
    if (!savedWorkoutPhoto) return;

    persistUploadedPhotos(
      uploadedPhotos.filter((photo) => photo.id !== savedWorkoutPhoto.id),
    );
    setCurrentWorkoutPhoto(null);
    setFeedback("已移除本次训练照片，不影响训练反馈提交");
  }

  return (
    <PageShell hideHeader className="overflow-x-hidden pt-5">
      <header className="grid grid-cols-[3rem_minmax(0,1fr)_3.5rem] items-start gap-3">
        <Link
          href="/"
          aria-label="关闭训练"
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-muted shadow-soft"
        >
          <X size={24} />
        </Link>
        <div className="min-w-0 text-center">
          <h1 className="break-words font-display text-3xl font-bold leading-tight text-primary">
            今日训练：{selectedPart}
          </h1>
          <p className="mt-2 inline-flex items-center gap-2 font-bold text-secondary">
            <Timer size={18} />
            {isPaused ? `暂停 ${formatElapsed(elapsedSeconds)}` : formatElapsed(elapsedSeconds)}
          </p>
        </div>
        <button
          type="button"
          aria-label={isPaused ? "继续训练" : "暂停训练"}
          onClick={() => {
            setIsPaused((value) => !value);
            setFeedback(isPaused ? "训练已继续" : "训练已暂停");
          }}
          className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary"
        >
          {isPaused ? <Play size={25} fill="currentColor" /> : <Pause size={25} />}
        </button>
      </header>

      <div className="mt-8 space-y-6">
        <div className="rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-muted shadow-soft">
          {workout.subtitle}，已完成 <span className="text-primary">{completedSets}</span> / {totalSets} 组
        </div>

        {exercises.map((exercise) => (
          <SectionCard key={exercise.id} className="overflow-hidden p-5">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Dumbbell size={22} />
                </span>
                <div className="min-w-0">
                  <h2 className="break-words font-display text-2xl font-bold">
                    {exercise.name}
                  </h2>
                  <p className="text-sm text-muted">{exercise.recommendation}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label={`${exercise.name} 更多操作`}
                onClick={() => setFeedback(`${exercise.name}：可编辑组数和完成状态`)}
                className="shrink-0 px-1 text-muted"
              >
                ...
              </button>
            </div>

            <div className="mt-5 grid grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,0.9fr)_2.4rem] gap-2 text-center text-xs font-bold text-muted">
              <span>组数</span>
              <span>重量</span>
              <span>次数</span>
              <span>完成</span>
            </div>

            <div className="mt-3 space-y-3">
              {exercise.sets.map((set, index) => (
                <div
                  key={`${exercise.id}-${set.set}`}
                  className={cn(
                    "grid grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,0.9fr)_2.4rem] items-center gap-2 rounded-2xl p-2 text-center",
                    index === 1
                      ? "border border-primary/40 bg-primary-soft/35"
                      : set.done
                        ? "bg-surface-soft"
                        : "bg-surface-soft/55",
                  )}
                >
                  <span className="font-bold text-muted">{set.set}</span>
                  <input
                    aria-label={`${exercise.name} 第 ${set.set} 组重量`}
                    inputMode="decimal"
                    value={set.weight}
                    onChange={(event) =>
                      updateSet(exercise.id, set.set, "weight", event.target.value)
                    }
                    className="h-12 min-w-0 rounded-xl bg-surface-high px-2 text-center text-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    aria-label={`${exercise.name} 第 ${set.set} 组次数`}
                    inputMode="numeric"
                    value={set.reps}
                    onChange={(event) =>
                      updateSet(exercise.id, set.set, "reps", event.target.value)
                    }
                    className="h-12 min-w-0 rounded-xl bg-surface-high px-2 text-center text-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    aria-label={`${exercise.name} 第 ${set.set} 组标记完成`}
                    onClick={() => toggleSet(exercise.id, set.set)}
                    className="grid h-9 w-9 place-items-center rounded-full"
                  >
                    {set.done ? (
                      <CheckCircle2 className="text-primary" size={26} />
                    ) : (
                      <span className="h-6 w-6 rounded-full border-2 border-outline" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSet(exercise.id)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-surface-soft px-4 py-3 font-bold text-primary"
            >
              <Plus size={18} />
              添加一组
            </button>
          </SectionCard>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={addExercise}
            className="flex min-w-0 items-center justify-center gap-2 rounded-full bg-primary-soft px-3 py-4 font-bold text-primary"
          >
            <Plus size={18} />
            <span>添加动作</span>
          </button>
          <button
            type="button"
            onClick={copyPreviousWorkout}
            className="flex min-w-0 items-center justify-center gap-2 rounded-full bg-surface-high px-3 py-4 font-bold text-muted"
          >
            <Copy size={18} />
            <span>复制上次</span>
          </button>
        </div>

        <SectionCard>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Bot className="text-accent" size={22} />
            训练反馈
          </h2>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-muted">训练时长 (分钟)</span>
              <input
                inputMode="numeric"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="mt-2 h-14 w-full rounded-2xl bg-surface-high px-4 text-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <div>
              <div className="flex justify-between text-sm font-bold">
                <span>疲劳程度评分</span>
                <span className="text-primary">{fatigue}/10</span>
              </div>
              <input
                aria-label="疲劳程度评分"
                type="range"
                min="1"
                max="10"
                value={fatigue}
                onChange={(event) => setFatigue(Number(event.target.value))}
                className="mt-3 w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold">
                <span>泵感评分</span>
                <span className="text-secondary">{pump}/10</span>
              </div>
              <input
                aria-label="泵感评分"
                type="range"
                min="1"
                max="10"
                value={pump}
                onChange={(event) => setPump(Number(event.target.value))}
                className="mt-3 w-full accent-secondary"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-muted">今日状态</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {["差", "一般", "好"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className={cn(
                      "rounded-2xl px-4 py-3 font-bold",
                      status === item
                        ? "bg-primary-soft text-primary"
                        : "bg-surface-soft text-muted",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-muted">备注</span>
              <textarea
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="记录一下今天的感受、饮食或需要改进的地方..."
                className="mt-2 w-full resize-none rounded-2xl bg-surface-high px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </label>

            <div className="rounded-3xl border border-primary/15 bg-primary-soft/35 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-soft">
                  <Camera size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold">
                    当日训练照片（可选）
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    可以拍摄或上传一张身材参考照；也可以暂不拍，不会影响完成训练。
                  </p>
                </div>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={uploadWorkoutPhoto}
                className="hidden"
              />

              {savedWorkoutPhoto ? (
                <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-soft">
                  <div
                    role="img"
                    aria-label={`${savedWorkoutPhoto.date} 当日训练照片`}
                    className="relative aspect-[1.1] bg-surface-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${savedWorkoutPhoto.image})` }}
                  >
                    <button
                      type="button"
                      aria-label="删除当日训练照片"
                      onClick={removeWorkoutPhoto}
                      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-primary shadow-soft backdrop-blur"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="font-bold">已保存当日训练照片</p>
                    <p className="mt-1 text-sm text-muted">
                      {savedWorkoutPhoto.date} • {savedWorkoutPhoto.trainingTitle}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-sm font-bold text-white shadow-soft"
                  >
                    <ImagePlus size={18} />
                    拍摄/上传
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback("已跳过当日训练照片，可以稍后在相册补传")}
                    className="rounded-full bg-white px-4 py-4 text-sm font-bold text-muted"
                  >
                    暂不拍
                  </button>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        <div className="rounded-full bg-secondary-soft px-4 py-3 text-center font-bold text-secondary">
          {workout.goal}。下一组建议保持动作质量，再根据体感微调重量。
        </div>

        <Link
          href="/analysis"
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-5 text-lg font-bold text-white shadow-[0_18px_32px_-18px_rgba(0,107,95,0.75)]"
        >
          <Sparkles size={22} />
          完成训练并获取 AI 分析
        </Link>
      </div>

      {feedback ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[90] max-w-[min(88vw,360px)] -translate-x-1/2 rounded-full bg-ink px-4 py-3 text-center text-sm font-bold text-white shadow-soft"
        >
          {feedback}
        </div>
      ) : null}

      {isAddDialogOpen ? (
        <div className="fixed inset-0 z-[95] bg-ink/30 px-5 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-md rounded-card bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                  <Bot className="text-primary" size={22} />
                  AI 添加动作
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  当前训练：{selectedPart}。输入你想加的动作，AI 会分析部位、组数、次数和训练目的。
                </p>
              </div>
              <button
                type="button"
                aria-label="关闭添加动作"
                onClick={() => setIsAddDialogOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-soft text-muted"
              >
                <X size={18} />
              </button>
            </div>

            {suggestedExercises.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm font-bold text-muted">当前部位推荐</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => setAddPrompt(exercise.name)}
                      className="rounded-full bg-primary-soft px-3 py-2 text-xs font-bold text-primary"
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form onSubmit={submitAiExercise} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-muted">想添加什么动作？</span>
                <input
                  value={addPrompt}
                  onChange={(event) => setAddPrompt(event.target.value)}
                  required
                  placeholder="例如：哑铃飞鸟、反向飞鸟、绳索面拉"
                  className="mt-2 h-[52px] w-full rounded-2xl bg-surface-soft px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <div className="rounded-3xl bg-secondary-soft p-4 text-sm leading-6 text-muted">
                例：输入“哑铃飞鸟”，AI 会识别为胸部孤立动作，通常给 3 组 12-15 次；如果当前是肩部训练，会标记为上半身辅助补量。
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
              >
                <Check size={18} />
                AI 分析并添加
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
