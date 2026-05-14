import Link from "next/link";
import { ChevronRight, Cloud, Download, Shield } from "lucide-react";
import FeedbackButton from "@/components/FeedbackButton";
import PageShell from "@/components/PageShell";
import SectionCard from "@/components/SectionCard";
import { adminLinks } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <PageShell>
      <SectionCard className="mt-4 p-7 text-center">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-surface-soft ring-8 ring-surface-muted">
          <span className="font-display text-4xl font-bold text-primary">J</span>
        </div>
        <h1 className="mt-7 font-display text-3xl font-bold">Jasper</h1>
        <p className="mt-2 text-muted">专注于：力量与灵活性</p>
        <div className="mt-6 flex justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-soft px-4 py-2 text-sm font-bold text-secondary">
            <Cloud size={17} />
            数据库已同步
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-bold text-primary">
            AI 已连接
          </span>
        </div>
      </SectionCard>

      <section className="mt-8">
        <h2 className="px-2 text-sm font-bold text-muted">账户与偏好</h2>
        <SectionCard className="mt-4 divide-y divide-outline/40 p-0">
          {adminLinks.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-5 py-5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-soft text-primary">
                  <Icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold">{item.title}</span>
                  <span className="block text-sm text-muted">
                    {item.description}
                  </span>
                </span>
                <ChevronRight className="text-muted" size={21} />
              </Link>
            );
          })}
        </SectionCard>
      </section>

      <SectionCard className="mt-6 divide-y divide-outline/40 p-0">
        <Link href="/admin" className="flex items-center gap-4 px-5 py-5">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-soft text-primary">
            <Shield size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold">隐私与安全</span>
            <span className="block text-sm text-muted">数据保护和权限</span>
          </span>
          <ChevronRight className="text-muted" size={21} />
        </Link>
        <FeedbackButton
          type="button"
          feedback="数据导出任务已准备，接入账号后会生成下载文件"
          className="flex w-full items-center gap-4 px-5 py-5 text-left"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-soft text-primary">
            <Download size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold">数据导出</span>
            <span className="block text-sm text-muted">下载您的运动历史</span>
          </span>
          <ChevronRight className="text-muted" size={21} />
        </FeedbackButton>
      </SectionCard>

      <FeedbackButton
        type="button"
        feedback="当前是演示账号，接入登录后会执行退出"
        className="mx-auto mt-16 block px-6 py-4 text-center font-bold text-red-600"
      >
        退出登录
      </FeedbackButton>
    </PageShell>
  );
}
