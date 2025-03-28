import Image from "next/image";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
export const Thumbnail = ({
  title,
  author,
  viewCount,
  imgSrc,
}: {
  title: string;
  author: string;
  viewCount: number;
  imgSrc: string;
}) => {
  return (
    <div>
      <Card className="rounded-xl">
        <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
          <p className="text-xl font-bold uppercase">{title}</p>
          <small className="text-default-500">{author}</small>
          <h4 className="text-large font-bold">{viewCount} Views</h4>
        </CardHeader>
        <CardContent className="overflow-visible py-2">
          <Image
            priority
            alt="thumbnail"
            src={imgSrc ?? ""}
            width={300}
            height={300}
            className="rounded-xl object-cover"
            loading="eager"
          />
        </CardContent>
      </Card>
    </div>
  );
};
