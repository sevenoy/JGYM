"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Camera, Check, Flame, Trash2, Utensils } from "lucide-react";
import SectionCard from "@/components/SectionCard";
import { usePersonalPlanSettings } from "@/lib/client-state";
import {
  getPersonalPlanForExecutionDay,
  personalPlan,
} from "@/lib/personal-plan";

const MEAL_RECORDS_STORAGE_KEY = "fitpilot-meal-records";
const mealRecordsEvent = "fitpilot-meal-records-updated";

type MealType = "早餐" | "午餐" | "晚餐" | "加餐";

type MealRecord = {
  id: string;
  date: string;
  mealType: MealType;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photo?: string;
};

const mealTypes: MealType[] = ["早餐", "午餐", "晚餐", "加餐"];

function subscribeMealRecords(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(mealRecordsEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(mealRecordsEvent, callback);
  };
}

function getMealRecordsSnapshot() {
  return window.localStorage.getItem(MEAL_RECORDS_STORAGE_KEY) || "[]";
}

function parseMealRecords(raw: string): MealRecord[] {
  try {
    return JSON.parse(raw) as MealRecord[];
  } catch {
    return [];
  }
}

function getDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function persistMealRecords(records: MealRecord[]) {
  window.localStorage.setItem(MEAL_RECORDS_STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(mealRecordsEvent));
}

function estimateMeal(description: string, mealType: MealType) {
  const text = description.toLowerCase();
  const baseByType: Record<MealType, number> = {
    早餐: 520,
    午餐: 720,
    晚餐: 650,
    加餐: 260,
  };
  let calories = baseByType[mealType];
  let protein = mealType === "加餐" ? 18 : 35;
  let carbs = mealType === "加餐" ? 28 : 78;
  let fat = mealType === "加餐" ? 8 : 18;

  const add = (kcal: number, p = 0, c = 0, f = 0) => {
    calories += kcal;
    protein += p;
    carbs += c;
    fat += f;
  };

  if (text.includes("燕麦")) add(220, 7, 38, 4);
  if (text.includes("米饭") || text.includes("饭")) add(260, 5, 56, 1);
  if (text.includes("鸡") || text.includes("牛") || text.includes("鱼") || text.includes("虾")) add(240, 35, 0, 8);
  if (text.includes("鸡蛋") || text.includes("蛋")) add(140, 12, 1, 10);
  if (text.includes("香蕉")) add(100, 1, 26, 0);
  if (text.includes("酸奶") || text.includes("牛奶")) add(150, 10, 16, 5);
  if (text.includes("油炸") || text.includes("奶茶") || text.includes("甜")) add(350, 4, 45, 16);
  if (text.includes("少")) calories = Math.max(180, calories - 120);

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

export default function NutritionPhotoTracker() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawRecords = useSyncExternalStore(
    subscribeMealRecords,
    getMealRecordsSnapshot,
    () => "[]",
  );
  const records = useMemo(() => parseMealRecords(rawRecords), [rawRecords]);
  const [planSettings] = usePersonalPlanSettings();
  const todayKey = getDateKey();
  const todayRecords = records.filter((record) => record.date === todayKey);
  const todayPlan = getPersonalPlanForExecutionDay(planSettings.currentPlanDay);
  const target =
    todayPlan.caloriesType === "training"
      ? personalPlan.nutrition.training
      : personalPlan.nutrition.rest;
  const [mealType, setMealType] = useState<MealType>("早餐");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [feedback, setFeedback] = useState("");

  const totals = useMemo(
    () =>
      todayRecords.reduce(
        (sum, record) => ({
          calories: sum.calories + record.calories,
          protein: sum.protein + record.protein,
          carbs: sum.carbs + record.carbs,
          fat: sum.fat + record.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [todayRecords],
  );
  const targetCalories = target.calories;
  const calorieProgress = Math.min(100, Math.round((totals.calories / targetCalories) * 100));

  function uploadMealPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setFeedback("餐食照片已读取");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function saveMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const estimate = estimateMeal(description, mealType);
    const nextRecord: MealRecord = {
      id: `meal-${Date.now()}`,
      date: todayKey,
      mealType,
      description: description.trim() || `${mealType}照片记录`,
      photo: photo || undefined,
      ...estimate,
    };
    persistMealRecords([nextRecord, ...records].slice(0, 80));
    setDescription("");
    setPhoto("");
    setFeedback(`已记录${mealType}，估算 ${estimate.calories} kcal`);
  }

  function deleteMeal(id: string) {
    persistMealRecords(records.filter((record) => record.id !== id));
    setFeedback("已删除这餐记录");
  }

  return (
    <SectionCard className="mt-8 bg-gradient-to-br from-white to-primary-soft/45">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
            <Utensils size={14} />
            饮食控制
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold">餐食照片与热量</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            今日目标：{targetCalories} kcal · 蛋白质 {target.protein}
          </p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-primary shadow-soft">
          <Flame size={23} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-xs font-bold text-muted">已记录热量</p>
          <p className="mt-1 font-display text-3xl font-bold text-primary">
            {totals.calories}
          </p>
          <div className="mt-3 h-2 rounded-full bg-surface-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${calorieProgress}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-xs font-bold text-muted">蛋白 / 碳水 / 脂肪</p>
          <p className="mt-2 text-sm font-bold text-ink">{totals.protein}g 蛋白</p>
          <p className="mt-1 text-sm text-muted">{totals.carbs}g 碳水 · {totals.fat}g 脂肪</p>
        </div>
      </div>

      <form onSubmit={saveMeal} className="mt-5 space-y-3">
        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
          <label>
            <span className="text-xs font-bold text-muted">餐次</span>
            <select
              value={mealType}
              onChange={(event) => setMealType(event.target.value as MealType)}
              className="mt-2 h-12 w-full rounded-2xl bg-white px-3 text-sm font-bold outline-none ring-1 ring-outline/50"
            >
              {mealTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-muted">食物描述</span>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="米饭、鸡肉、蔬菜..."
              className="mt-2 h-12 w-full rounded-2xl bg-white px-4 outline-none ring-1 ring-outline/50 focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={uploadMealPhoto}
          className="hidden"
        />

        {photo ? (
          <div
            role="img"
            aria-label="待记录餐食照片"
            className="aspect-[1.35] rounded-3xl bg-surface-muted bg-cover bg-center"
            style={{ backgroundImage: `url(${photo})` }}
          />
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-4 text-sm font-bold text-primary shadow-soft"
          >
            <Camera size={18} />
            拍一餐
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-sm font-bold text-white shadow-soft"
          >
            <Check size={18} />
            估算记录
          </button>
        </div>
      </form>

      {todayRecords.length ? (
        <div className="mt-5 space-y-3">
          {todayRecords.map((record) => (
            <article
              key={record.id}
              className="flex gap-3 rounded-2xl bg-white/80 p-3"
            >
              {record.photo ? (
                <div
                  role="img"
                  aria-label={`${record.mealType}照片`}
                  className="h-16 w-16 shrink-0 rounded-2xl bg-surface-muted bg-cover bg-center"
                  style={{ backgroundImage: `url(${record.photo})` }}
                />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface-soft text-primary">
                  <Utensils size={20} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold">{record.mealType} · {record.calories} kcal</p>
                <p className="mt-1 truncate text-sm text-muted">{record.description}</p>
                <p className="mt-1 text-xs text-muted">
                  蛋白 {record.protein}g · 碳水 {record.carbs}g · 脂肪 {record.fat}g
                </p>
              </div>
              <button
                type="button"
                aria-label={`删除${record.mealType}记录`}
                onClick={() => deleteMeal(record.id)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-soft text-primary"
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      ) : null}

      {feedback ? (
        <p className="mt-4 rounded-2xl bg-secondary-soft px-4 py-3 text-sm font-bold text-secondary">
          {feedback}
        </p>
      ) : null}
    </SectionCard>
  );
}
