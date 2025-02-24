import Image from "next/image";
import { Badge } from "./badge";
import { ExpandIcon } from "lucide-react";
import { Button } from "./button";
import DialogBox from "../dialog-box";
import { YoutubeCardContent } from "../youtube-card";

type Props = {
  imageUrl: string;
  caption: string;
  description?: string;
  url?: string;
};

export default function ImageCard({
  imageUrl,
  caption,
  description,
  url,
}: Props) {
  return (
    <figure className="h-[280px] w-[300px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow">
      <Image
        priority
        alt="thumbnail"
        src={imageUrl}
        width={560}
        height={200}
        className="object-cover"
        loading="eager"
      />
      <div className="flex items-center justify-between border-t-2 border-border p-1">
        <Badge className="bg-red-400" variant="neutral">
          YouTube
        </Badge>
        <DialogBox
          title={caption}
          description={description ?? ""}
          content={<YoutubeCardContent imageUrl={imageUrl} url={url ?? ""} />}
        >
          <Button variant="reverse" className="h-4 w-4">
            <ExpandIcon className="h-4 w-4" />
          </Button>
        </DialogBox>
      </div>
      <figcaption className="p-1 text-mtext">
        <a href={url} className="hover:underline">
          {caption}
        </a>
      </figcaption>
    </figure>
  );
}
