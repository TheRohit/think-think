import Image from "next/image";
import type { LinkPreviewData } from "~/types/link-preview";

export const YouTubeCard = ({
  metadata,
}: {
  metadata: Omit<LinkPreviewData, "siteName" | "url">;
}) => {
  if (!metadata.title || !metadata.type || metadata.type !== "youtube")
    return null;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <div className="flex p-2">
        {metadata.image && (
          <Image
            width={200}
            height={200}
            src={metadata.image}
            alt={metadata.title}
            className="rounded-xl object-cover"
            loading="eager"
            priority
          />
        )}

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-lg font-semibold">
            {metadata.title}
          </h3>
          <div className="mt-1 space-y-1">
            {metadata.description && (
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {metadata.description}
              </p>
            )}
          </div>
          <div className="mt-auto flex items-center pt-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
              <span className="text-xs font-bold">YT</span>
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              YouTube
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
