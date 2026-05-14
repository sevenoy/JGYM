import type { ReactNode } from "react";
import AppHeader from "./AppHeader";
import BottomTabBar from "./BottomTabBar";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  showBack?: boolean;
  hideHeader?: boolean;
  className?: string;
};

export default function PageShell({
  children,
  headerTitle,
  headerSubtitle,
  showBack,
  hideHeader = false,
  className,
}: PageShellProps) {
  return (
    <>
      <main
        className={cn(
          "mx-auto min-h-screen w-full max-w-md px-5 pb-28 text-ink",
          className,
        )}
      >
        {hideHeader ? null : (
          <AppHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            showBack={showBack}
          />
        )}
        {children}
      </main>
      <BottomTabBar />
    </>
  );
}
