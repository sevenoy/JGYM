import { NextResponse } from "next/server";

type TestAiRequest = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

function normalizeBaseUrl(baseUrl?: string) {
  const value = baseUrl?.trim() || process.env.AI_BASE_URL || "https://api.openai.com/v1";
  return value.replace(/\/+$/, "");
}

function readErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

async function readJson(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TestAiRequest;
  const apiKey = body.apiKey?.trim() || process.env.AI_API_KEY;
  const model = body.model?.trim() || process.env.AI_MODEL || "gpt-4o";
  const baseUrl = normalizeBaseUrl(body.baseUrl);

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        message: "请先填写 API 密钥，或在 .env.local 中配置 AI_API_KEY。",
      },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const modelsResponse = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    });

    const modelsPayload = await readJson(modelsResponse);

    if (modelsResponse.ok) {
      const maybeData =
        modelsPayload &&
        typeof modelsPayload === "object" &&
        "data" in modelsPayload &&
        Array.isArray(modelsPayload.data)
          ? modelsPayload.data
          : [];
      const hasModel = maybeData.some(
        (item) =>
          item &&
          typeof item === "object" &&
          "id" in item &&
          item.id === model,
      );

      return NextResponse.json({
        ok: true,
        message: hasModel
          ? `连接成功，模型 ${model} 可用。`
          : `连接成功，服务可访问。未在模型列表中确认 ${model}，但密钥有效。`,
      });
    }

    if (modelsResponse.status === 401 || modelsResponse.status === 403) {
      return NextResponse.json(
        {
          ok: false,
          message: readErrorMessage(modelsPayload, "API 密钥无效或没有访问权限。"),
        },
        { status: modelsResponse.status },
      );
    }

    const chatResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
      signal: controller.signal,
    });
    const chatPayload = await readJson(chatResponse);

    if (chatResponse.ok) {
      return NextResponse.json({
        ok: true,
        message: `连接成功，模型 ${model} 已响应。`,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        message: readErrorMessage(chatPayload, "测试连接失败，请检查 Base URL、模型和 API 密钥。"),
      },
      { status: chatResponse.status || 502 },
    );
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        message: isTimeout
          ? "测试连接超时，请检查网络或服务商 Base URL。"
          : "无法连接到 AI 服务，请检查 Base URL 是否正确。",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
