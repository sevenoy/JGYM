import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import FeedbackButton from "./FeedbackButton";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
  className?: string;
};

export default function AppHeader({
  title = "Jasper GYM",
  subtitle,
  showBack = false,
  rightSlot,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 -mx-5 mb-5 flex items-center justify-between bg-background/85 px-5 py-4 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {showBack ? (
          <Link
            href=".."
            aria-label="返回"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-soft"
          >
            <ArrowLeft size={22} />
          </Link>
        ) : (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-muted text-primary ring-1 ring-white">
            <span className="text-lg font-bold">JG</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-bold text-primary">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {rightSlot ?? (
        <FeedbackButton
          type="button"
          aria-label="通知"
          feedback="暂无新通知"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-primary shadow-soft"
        >
          <Bell size={21} />
        </FeedbackButton>
      )}
    </header>
  );
}
