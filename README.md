# Jasper GYM

Jasper GYM 是一个由 Stitch 静态页面转换而来的 Next.js App Router 项目，使用 TypeScript、Tailwind CSS 和 lucide-react。当前版本使用 `lib/mock-data.ts` 提供演示数据，并预留 Supabase 客户端。

## 安装

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

打开 `http://localhost:3000` 查看应用。

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AI_API_KEY=
AI_BASE_URL=
AI_MODEL=
```

## Supabase 配置

当前还没有真正连接数据库。`lib/supabase.ts` 已经读取：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

填写后即可在后续功能中通过导出的 `supabase` 客户端接入真实数据。

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 新建项目并选择该仓库。
3. Framework Preset 选择 Next.js。
4. 在 Vercel Project Settings 中添加 `.env.example` 对应的环境变量。
5. 部署后运行默认构建命令 `npm run build`。

## 后续数据库表建议

- `profiles`：用户基础资料、目标、偏好。
- `plans`：AI 训练计划主表。
- `plan_days`：计划每日安排。
- `exercises`：动作库、目标肌群、默认组数、难度。
- `exercise_videos`：YouTube 或自托管视频链接。
- `workouts`：每次训练记录。
- `workout_sets`：每个动作的组、重量、次数、完成状态。
- `ai_analyses`：训练总结、评分、进步点和风险提醒。
- `progress_photos`：进步相册照片与体重记录。
- `ai_settings`：模型、基础 URL、提示词模板。

## 常用命令

```bash
npm run lint
npm run build
```
