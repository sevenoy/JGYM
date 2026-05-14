"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  Cloud,
  Eye,
  EyeOff,
  ImageOff,
  Loader2,
  RadioTower,
  TriangleAlert,
} from "lucide-react";
import SectionCard from "@/components/SectionCard";

const STORAGE_KEY = "fitpilot-ai-settings";

type SavedSettings = {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl: string;
  imageAnalysis: boolean;
  systemPrompt: string;
};

type TestState =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const defaultPrompt =
  "你是 Jasper GYM，一位精英健康教练。专注于鼓励可持续的健康习惯，而不是激进的内卷文化。根据用户的日常活动和姿势检查照片提供简明、可操作的见解。";

function readSavedSettings(): Partial<SavedSettings> {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Partial<SavedSettings>;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

export default function AdminAiSettingsForm() {
  const [savedInitial] = useState(readSavedSettings);
  const [provider, setProvider] = useState(savedInitial.provider ?? "openai");
  const [apiKey, setApiKey] = useState(savedInitial.apiKey ?? "");
  const [model, setModel] = useState(savedInitial.model ?? "gpt-4o");
  const [baseUrl, setBaseUrl] = useState(
    savedInitial.baseUrl ?? "https://api.openai.com/v1",
  );
  const [imageAnalysis, setImageAnalysis] = useState(
    savedInitial.imageAnalysis ?? true,
  );
  const [systemPrompt, setSystemPrompt] = useState(
    savedInitial.systemPrompt ?? defaultPrompt,
  );
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState<TestState>({
    type: "idle",
    message: "填写配置后可以测试连接。",
  });

  const isTesting = testState.type === "loading";
  const statusStyle = useMemo(() => {
    if (testState.type === "success") {
      return "border-primary/25 bg-primary-soft text-primary";
    }

    if (testState.type === "error") {
      return "border-accent/30 bg-accent-soft text-[#865000]";
    }

    return "border-outline/40 bg-surface-soft text-muted";
  }, [testState.type]);

  async function handleTestConnection() {
    setTestState({
      type: "loading",
      message: "正在测试连接...",
    });

    try {
      const response = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          baseUrl,
          model,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      setTestState({
        type: result.ok ? "success" : "error",
        message:
          result.message ||
          (result.ok ? "连接成功。" : "测试失败，请检查配置。"),
      });
    } catch {
      setTestState({
        type: "error",
        message: "测试请求没有发出去，请确认本地服务正在运行。",
      });
    }
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const settings: SavedSettings = {
      provider,
      apiKey,
      model,
      baseUrl,
      imageAnalysis,
      systemPrompt,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setTestState({
      type: "success",
      message: "设置已保存到本机浏览器。生产环境建议改为服务端加密保存。",
    });
  }

  return (
    <SectionCard className="mt-8">
      <form className="space-y-6" onSubmit={handleSave}>
        <label className="block" htmlFor="provider">
          <span className="text-sm font-bold">服务商</span>
          <select
            id="provider"
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="mt-3 h-16 w-full rounded-2xl bg-surface-soft px-5 text-lg outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="openai">OpenAI（推荐）</option>
            <option value="custom">兼容 OpenAI 的服务商</option>
          </select>
        </label>

        <label className="block" htmlFor="api-key">
          <span className="text-sm font-bold">API 密钥</span>
          <div className="mt-3 flex h-16 items-center rounded-2xl bg-surface-soft px-5">
            <input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-..."
              className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-outline"
              autoComplete="off"
            />
            <button
              type="button"
              aria-label={showKey ? "隐藏 API 密钥" : "显示 API 密钥"}
              className="text-muted"
              onClick={() => setShowKey((value) => !value)}
            >
              {showKey ? <Eye size={21} /> : <EyeOff size={21} />}
            </button>
          </div>
          <span className="mt-2 block text-sm text-muted">
            留空时会使用服务端环境变量 AI_API_KEY。
          </span>
        </label>

        <label className="block" htmlFor="model">
          <span className="text-sm font-bold">模型</span>
          <input
            id="model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="gpt-4o"
            className="mt-3 h-16 w-full rounded-2xl bg-surface-soft px-5 text-lg outline-none placeholder:text-outline focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="block" htmlFor="base-url">
          <span className="text-sm font-bold">基础 URL</span>
          <input
            id="base-url"
            type="url"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://api.openai.com/v1"
            className="mt-3 h-16 w-full rounded-2xl bg-surface-soft px-5 text-lg outline-none placeholder:text-outline focus:ring-2 focus:ring-primary"
          />
        </label>

        <div className="rounded-2xl border border-outline/45 bg-surface-soft p-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary-soft text-secondary">
              <ImageOff size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold">启用图像分析</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                允许 Jasper GYM 通过上传照片分析训练姿势和体态变化。
              </p>
            </div>
            <button
              type="button"
              aria-label="启用图像分析"
              aria-pressed={imageAnalysis}
              onClick={() => setImageAnalysis((value) => !value)}
              className={`flex h-8 w-14 items-center rounded-full px-1 transition ${
                imageAnalysis ? "justify-end bg-primary" : "justify-start bg-outline"
              }`}
            >
              <span className="h-6 w-6 rounded-full bg-white" />
            </button>
          </div>
        </div>

        <label className="block" htmlFor="system-prompt">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Cloud size={17} />
            系统提示词模板
          </span>
          <textarea
            id="system-prompt"
            rows={6}
            value={systemPrompt}
            onChange={(event) => setSystemPrompt(event.target.value)}
            className="mt-3 w-full resize-none rounded-2xl bg-surface-soft px-5 py-4 leading-7 outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${statusStyle}`}
        >
          {testState.type === "loading" ? (
            <Loader2 className="mt-0.5 animate-spin" size={18} />
          ) : testState.type === "error" ? (
            <TriangleAlert className="mt-0.5" size={18} />
          ) : (
            <CheckCircle2 className="mt-0.5" size={18} />
          )}
          <span>{testState.message}</span>
        </div>

        <div className="border-t border-outline/40 pt-6">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-surface-high px-5 py-4 font-bold text-ink disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isTesting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RadioTower size={18} />
            )}
            {isTesting ? "测试中..." : "测试连接"}
          </button>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-soft"
          >
            <Cloud size={18} />
            保存设置
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
