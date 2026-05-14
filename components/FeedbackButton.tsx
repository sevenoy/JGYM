"use client";

import { useEffect, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  feedback: string;
};

export default function FeedbackButton({
  children,
  className,
  feedback,
  onClick,
  ...props
}: FeedbackButtonProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <>
      <button
        {...props}
        className={className}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setMessage(feedback);
          }
        }}
      >
        {children}
      </button>
      {message ? (
        <div
          role="status"
          className={cn(
            "fixed bottom-24 left-1/2 z-[90] flex max-w-[min(88vw,360px)] -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-bold text-white shadow-soft",
          )}
        >
          <CheckCircle2 size={17} className="shrink-0 text-primary-soft" />
          <span>{message}</span>
        </div>
      ) : null}
    </>
  );
}
