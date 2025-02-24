import type { YoutubeContent } from "~/types/content";
import ImageCard from "./ui/image-card";

export default function YoutubeCard({ content }: { content: YoutubeContent }) {
  const videoId = content.url.split("v=")[1];
  const url = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  return (
    <ImageCard
      imageUrl={url}
      caption={content.title}
      description={content.description}
      url={content.url}
    ></ImageCard>
  );
}

export const YoutubeCardContent = ({
  imageUrl,
  url,
}: {
  imageUrl: string;
  url: string;
}) => {
  return (
    <div>
      <h1>{url}</h1>
    </div>
  );
};
