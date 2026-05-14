import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
};

export default function SectionCard({
  children,
  className,
  as: Component = "section",
}: SectionCardProps) {
  return (
    <Component
      className={cn(
        "rounded-card border border-white/80 bg-white p-5 shadow-soft",
        className,
      )}
    >
      {children}
    </Component>
  );
}
