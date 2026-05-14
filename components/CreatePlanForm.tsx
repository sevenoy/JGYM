"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Dumbbell,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCw,
  SendHorizontal,
  Target,
  WandSparkles,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";
import {
  formatDateLabel,
  generatePlanOptions,
  getNextMonday,
  PLAN_OPTIONS_STORAGE_KEY,
  SELECTED_PLAN_STORAGE_KEY,
  toIsoDate,
  type GeneratedPlanOption,
  type PlanAnswers,
} from "@/lib/plan-generator";
import { cn } from "@/lib/utils";

type QuestionKey = keyof PlanAnswers;
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};
type Question = {
  key: QuestionKey;
  prompt: string;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
  inputType?: "date" | "text";
};

function displayAnswer(key: QuestionKey, value: string) {
  return key === "startDate" ? formatDateLabel(value) : value;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function CreatePlanForm() {
  const today = useMemo(() => toIsoDate(new Date()), []);
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return toIsoDate(date);
  }, []);

  const questions = useMemo<Question[]>(
    () => [
      {
        key: "goal",
        prompt: "这次计划最重要的训练目标是什么？",
        placeholder: "例如：增肌塑形，体脂不要涨太快",
        options: [
          { label: "增肌塑形", value: "增肌塑形" },
          { label: "减脂塑形", value: "减脂塑形" },
          { label: "增肌力量", value: "增肌力量" },
          { label: "体态改善", value: "体态改善" },
        ],
      },
      {
        key: "focus",
        prompt: "这次训练想重点练哪里？我会据此调整每周拆分。",
        placeholder: "例如：重点练上半身，背部和肩膀优先",
        options: [
          { label: "上半身优先", value: "上半身优先" },
          { label: "下半身/臀腿", value: "下半身/臀腿" },
          { label: "核心体态", value: "核心体态" },
          { label: "全身均衡", value: "全身均衡" },
        ],
      },
      {
        key: "duration",
        prompt: "每次训练希望控制在多久？",
        placeholder: "例如：45 分钟",
        options: [
          { label: "30 分钟", value: "30 分钟" },
          { label: "45 分钟", value: "45 分钟" },
          { label: "60 分钟", value: "60 分钟" },
        ],
      },
      {
        key: "location",
        prompt: "主要在哪里训练？我会按器械条件安排动作。",
        placeholder: "例如：家里，只有哑铃和弹力带",
        options: [
          { label: "健身房", value: "健身房" },
          { label: "家里", value: "家里" },
          { label: "户外/酒店", value: "户外或酒店" },
        ],
      },
      {
        key: "startDate",
        prompt: "计划从哪一天开始？这会作为第 1 天。",
        placeholder: "选择开始日期",
        inputType: "date",
        options: [
          { label: "今天", value: today },
          { label: "明天", value: tomorrow },
          { label: "下周一", value: getNextMonday() },
        ],
      },
      {
        key: "frequency",
        prompt: "每周大概能训练几天？",
        placeholder: "例如：每周 4 天",
        options: [
          { label: "每周 3 天", value: "每周 3 天" },
          { label: "每周 4 天", value: "每周 4 天" },
          { label: "每周 5 天", value: "每周 5 天" },
        ],
      },
      {
        key: "level",
        prompt: "目前训练经验和身体限制是什么？",
        placeholder: "例如：有基础，膝盖偶尔不舒服",
        options: [
          { label: "新手", value: "新手" },
          { label: "有基础", value: "有基础" },
          { label: "进阶", value: "进阶" },
        ],
      },
    ],
    [today, tomorrow],
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-hello",
      role: "assistant",
      text: questions[0].prompt,
    },
  ]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<PlanAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [planOptions, setPlanOptions] = useState<GeneratedPlanOption[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const currentQuestion = questions[step];
  const isComplete = step >= questions.length;
  const selectedPlan = planOptions.find((plan) => plan.id === selectedPlanId);

  function answerQuestion(value: string) {
    if (!currentQuestion || !value.trim()) return;

    const cleanValue = value.trim();
    const nextAnswers = {
      ...answers,
      [currentQuestion.key]: cleanValue,
    };
    const nextStep = step + 1;
    const nextQuestion = questions[nextStep];

    setAnswers(nextAnswers);
    setInput("");
    setStep(nextStep);
    setPlanOptions([]);
    setSelectedPlanId("");
    setMessages((current) => [
      ...current,
      {
        id: makeId("user"),
        role: "user",
        text: displayAnswer(currentQuestion.key, cleanValue),
      },
      {
        id: makeId("assistant"),
        role: "assistant",
        text: nextQuestion
          ? nextQuestion.prompt
          : "信息收集完成。我先汇总你的需求，然后生成多个可选计划。",
      },
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    answerQuestion(input);
  }

  function resetConversation() {
    setMessages([
      {
        id: "assistant-hello",
        role: "assistant",
        text: questions[0].prompt,
      },
    ]);
    setStep(0);
    setInput("");
    setAnswers({});
    setPlanOptions([]);
    setSelectedPlanId("");
    setIsGenerating(false);
  }

  function handleGeneratePlans() {
    setIsGenerating(true);
    setSelectedPlanId("");
    window.setTimeout(() => {
      const options = generatePlanOptions(answers);
      setPlanOptions(options);
      window.localStorage.setItem(
        PLAN_OPTIONS_STORAGE_KEY,
        JSON.stringify(options),
      );
      setMessages((current) => [
        ...current,
        {
          id: makeId("assistant"),
          role: "assistant",
          text: "我生成了 3 个计划方案。你可以选择更稳、更快，或更容易坚持的版本。",
        },
      ]);
      setIsGenerating(false);
    }, 900);
  }

  function selectPlan(plan: GeneratedPlanOption) {
    setSelectedPlanId(plan.id);
    window.localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, JSON.stringify(plan));
    window.dispatchEvent(new Event("fitpilot-plan-selected"));
    setMessages((current) => [
      ...current,
      {
        id: makeId("user"),
        role: "user",
        text: `选择：${plan.title}`,
      },
      {
        id: makeId("assistant"),
        role: "assistant",
        text: `已选择 ${plan.title}，第 1 天会从 ${formatDateLabel(
          plan.startDate,
        )} 开始。`,
      },
    ]);
  }

  return (
    <div className="mt-8 space-y-5">
      <SectionCard>
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
            <MessageCircle size={23} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">AI 计划对话</h2>
            <p className="mt-2 leading-7 text-muted">
              我会根据训练目标、时长、地点、开始日期和经验生成完整计划，并提供多个版本供选择。
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6",
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-surface-soft text-ink",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {!isComplete && currentQuestion ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => answerQuestion(option.value)}
                  className="rounded-full bg-primary-soft px-4 py-2 text-sm font-bold text-primary"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type={currentQuestion.inputType ?? "text"}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={currentQuestion.placeholder}
                className="min-w-0 flex-1 rounded-2xl bg-surface-soft px-4 py-3 outline-none placeholder:text-muted focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                aria-label="发送回答"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-soft"
              >
                <SendHorizontal size={19} />
              </button>
            </form>
          </div>
        ) : null}

        {isComplete ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-3xl bg-surface-soft p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">需求总结</h3>
                <button
                  type="button"
                  onClick={resetConversation}
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary"
                >
                  <RefreshCw size={15} />
                  重新对话
                </button>
              </div>
              <div className="grid gap-3 text-sm">
                <SummaryItem icon={Target} label="目标" value={answers.goal} />
                <SummaryItem
                  icon={Dumbbell}
                  label="重点"
                  value={answers.focus}
                />
                <SummaryItem icon={Clock3} label="单次时长" value={answers.duration} />
                <SummaryItem icon={MapPin} label="训练地点" value={answers.location} />
                <SummaryItem
                  icon={CalendarDays}
                  label="开始日期"
                  value={formatDateLabel(answers.startDate)}
                />
                <SummaryItem
                  icon={Dumbbell}
                  label="训练频率"
                  value={answers.frequency}
                />
                <SummaryItem
                  icon={ClipboardList}
                  label="经验/限制"
                  value={answers.level}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeneratePlans}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <WandSparkles size={18} />
              )}
              {isGenerating ? "正在生成..." : "生成 3 个计划方案"}
            </button>
          </div>
        ) : null}
      </SectionCard>

      {planOptions.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold">选择一个计划</h2>
          {planOptions.map((plan) => (
            <SectionCard
              key={plan.id}
              as="article"
              className={cn(
                "border transition",
                selectedPlanId === plan.id
                  ? "border-primary/45 bg-primary-soft/30"
                  : "border-white/80",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-bold text-secondary">
                    {plan.style}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold">
                    {plan.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {plan.summary}
                  </p>
                </div>
                {selectedPlanId === plan.id ? (
                  <CheckCircle2 className="shrink-0 text-primary" size={25} />
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniMetric label="第 1 天" value={formatDateLabel(plan.startDate)} />
                <MiniMetric label="周期" value={`${plan.days.length} 天`} />
                <MiniMetric label="地点" value={plan.location} />
                <MiniMetric label="频率" value={plan.frequency} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {plan.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-white/75 p-4">
                <p className="text-xs font-bold text-muted">前 3 天预览</p>
                <div className="mt-3 space-y-2">
                  {plan.days.slice(0, 3).map((day) => (
                    <div key={day.day} className="flex items-start gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-soft text-xs font-bold text-primary">
                        {day.day}
                      </span>
                      <div>
                        <p className="font-bold">{day.title}</p>
                        <p className="text-xs text-muted">
                          {formatDateLabel(day.date)} • {day.focus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => selectPlan(plan)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white"
              >
                {selectedPlanId === plan.id ? "已选择此计划" : "选择此计划"}
                <Check size={18} />
              </button>
            </SectionCard>
          ))}
        </section>
      ) : null}

      {selectedPlan ? (
        <Link
          href="/plan"
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-5 text-lg font-bold text-white shadow-soft"
        >
          查看已选择计划
          <ArrowRight size={19} />
        </Link>
      ) : (
        <div className="rounded-3xl bg-secondary-soft px-4 py-3 text-center text-sm font-bold text-secondary">
          选择计划后，计划主页会显示从开始日期起算的完整日程。
        </div>
      )}
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3">
      <Icon className="shrink-0 text-primary" size={18} />
      <span className="text-muted">{label}</span>
      <span className="ml-auto text-right font-bold">{value || "未填写"}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-soft p-3">
      <p className="text-xs font-bold text-muted">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
