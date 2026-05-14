import Link from "next/link";
import AdminVideosManager from "@/components/AdminVideosManager";
import PageShell from "@/components/PageShell";

export default function AdminVideosPage() {
  return (
    <PageShell showBack>
      <AdminVideosManager />

      <Link
        href="/admin"
        className="mt-6 block rounded-full bg-surface-high px-5 py-4 text-center font-bold text-ink"
      >
        返回后台配置
      </Link>
    </PageShell>
  );
}
