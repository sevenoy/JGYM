import Link from "next/link";
import AdminExercisesPanel from "@/components/AdminExercisesPanel";
import PageShell from "@/components/PageShell";
import { adminLinks } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <PageShell>
      <section className="pt-3">
        <h1 className="font-display text-4xl font-bold text-primary">
          Jasper GYM
        </h1>
        <div className="mt-6 grid grid-cols-3 rounded-3xl bg-surface-soft p-1">
          {["动作库", "视频库", "API 配置"].map((tab, index) => (
            <Link
              key={tab}
              href={index === 1 ? "/admin/videos" : index === 2 ? "/admin/ai" : "/admin"}
              className={`rounded-2xl px-3 py-3 text-center text-sm font-bold ${
                index === 0 ? "bg-primary text-white shadow-soft" : "text-ink"
              }`}
            >
              {tab}
            </Link>
          ))}
        </div>
      </section>

      <AdminExercisesPanel />

      <section className="mt-8">
        <h2 className="px-1 font-display text-2xl font-bold">快捷配置</h2>
        <div className="mt-4 grid gap-3">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-soft text-primary">
                  <Icon size={20} />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{link.title}</span>
                  <span className="text-sm text-muted">{link.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
