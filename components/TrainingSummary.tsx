function stripMarkdown(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*#+\s*/g, "")
    .trim();
}

function cleanInlineMarkdown(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*#+\s*/g, "");
}

function normalizeSummary(summary: string) {
  return summary
    .replace(/\r\n/g, "\n")
    .replace(/(\*\*[^*]+\*\*)\s+(?=[^#\n-])/g, "$1\n")
    .replace(/\s*(---+)\s*/g, "\n$1\n")
    .replace(/\s*(#{1,4}\s+)/g, "\n$1")
    .replace(/([。；])\s+/g, "$1\n")
    .replace(/\s+(\d+[.、]\s+)/g, "\n$1")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function extractActualDuration(summary: string, duration: string) {
  const normalizedSummary = stripMarkdown(summary);
  const explicitDuration = normalizedSummary.match(
    /(训练时长|实际时长|总时长|用时|耗时)[:：]?\s*(\d{1,3}(?:\.\d+)?\s*(?:分钟|分|小时))/,
  );

  if (explicitDuration?.[2]) {
    return explicitDuration[2].replace(/\s+/g, "");
  }

  const minuteDuration = normalizedSummary.match(
    /(?:实际完成|完成度|训练总结|今日训练)[^。；\n]{0,80}?(\d{1,3}\s*(?:分钟|分))/,
  );

  if (minuteDuration?.[1]) {
    return minuteDuration[1].replace(/\s+/g, "");
  }

  const times = Array.from(
    normalizedSummary.matchAll(/(?:^|[^.\d])(\d{1,2}):(\d{2})(?=$|[^.\d])/g),
  ).map((match) => Number(match[1]) * 60 + Number(match[2]));

  if (times.length >= 2) {
    const diff = times[times.length - 1] - times[0];
    if (diff > 0 && diff <= 240) {
      return `${diff}分钟`;
    }
  }

  const cleanDuration = duration.trim();
  if (cleanDuration && !/[–-]/.test(cleanDuration)) {
    return cleanDuration.includes("分钟") || cleanDuration.includes("小时")
      ? cleanDuration
      : `${cleanDuration}分钟`;
  }

  return "";
}

function renderInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-bold text-ink">
          {part.slice(2, -2).trim()}
        </strong>
      );
    }

    return cleanInlineMarkdown(part);
  });
}

export default function TrainingSummary({
  summary,
  title = "训练总结",
}: {
  summary: string;
  title?: string;
}) {
  const lines = normalizeSummary(summary);

  return (
    <div className="mt-4 max-h-[28rem] overflow-y-auto rounded-2xl bg-surface-soft px-4 py-4 text-sm leading-7 text-muted">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">
        {title}
      </p>
      <div className="space-y-3">
        {lines.map((line, index) => {
          if (!stripMarkdown(line)) return null;

          if (/^-{3,}$/.test(line)) {
            return <div key={`${line}-${index}`} className="h-px bg-outline/50" />;
          }

          if (/^#{1,4}\s+/.test(line)) {
            return (
              <h3
                key={`${line}-${index}`}
                className="rounded-xl bg-white/75 px-3 py-2 text-base font-bold leading-6 text-ink"
              >
                {renderInlineText(line.replace(/^#{1,4}\s+/, ""))}
              </h3>
            );
          }

          if (/^(\d+[.、]|[-•])\s+/.test(line)) {
            const itemText = line.replace(/^(\d+[.、]|[-•])\s+/, "").trim();
            if (!stripMarkdown(itemText)) return null;

            return (
              <p key={`${line}-${index}`} className="pl-3">
                <span className="mr-2 text-primary">•</span>
                {renderInlineText(itemText)}
              </p>
            );
          }

          return <p key={`${line}-${index}`}>{renderInlineText(line)}</p>;
        })}
      </div>
    </div>
  );
}
