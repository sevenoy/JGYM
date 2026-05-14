import { MoreVertical, Trash2 } from "lucide-react";
import type { PhotoEntry } from "@/lib/types";
import FeedbackButton from "./FeedbackButton";

type PhotoGridProps = {
  photos: PhotoEntry[];
  onDelete?: (photoId: string) => void;
};

export default function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo) => (
        <article
          key={photo.id}
          className="group relative aspect-[0.82] overflow-hidden rounded-3xl bg-surface-muted bg-cover bg-center shadow-soft"
          role="img"
          aria-label={`${photo.date} 进步照片`}
          style={{ backgroundImage: `url(${photo.image})` }}
        >
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-white">
            <p className="text-xs font-bold leading-tight">{photo.date}</p>
            <p className="text-xs">{photo.weight}</p>
            {photo.trainingTitle ? (
              <p className="mt-1 truncate text-[11px]">{photo.trainingTitle}</p>
            ) : null}
          </div>

          {photo.uploaded && onDelete ? (
            <button
              type="button"
              aria-label={`删除 ${photo.date} 上传照片`}
              onClick={() => onDelete(photo.id)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/75 text-primary backdrop-blur"
            >
              <Trash2 size={15} />
            </button>
          ) : null}

          <FeedbackButton
            type="button"
            aria-label="照片菜单"
            feedback={`${photo.date} 的照片菜单已打开`}
            className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/35 text-white backdrop-blur"
          >
            <MoreVertical size={16} />
          </FeedbackButton>
        </article>
      ))}
    </div>
  );
}
