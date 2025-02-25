"use client";

import { ChevronsDownIcon } from "lucide-react";
import type { LinkContent } from "~/types/content";
import NotesCard from "./notes-card";
import type { NoteContent, YoutubeContent } from "~/types/content";
import YoutubeCard from "./youtube-card";
const data = [
  {
    id: "1",
    type: "note",
    content: {
      title: "My Note",
      description: "This is a description",
      text: "Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king&apos;s pillow, in his soup, even in the royal toilet. The king was furious, but he couldn&apos;t seem to stop Jokester. And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn&apos;t help but laugh. And once they started laughing, they couldn&apos;t stop.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "2",
    type: "youtube",
    content: {
      title: "Mission To Ancient Mountain Ghost Town Remnants",
      url: "https://www.youtube.com/watch?v=SizS5Nr0Yf0",
      description: "Mission yayyyyy",
    },
  },
];

export default function NotesSection() {
  const handleScroll = () => {
    document.getElementById("notes-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      <div
        className="flex w-full cursor-pointer flex-col items-center py-8"
        onClick={handleScroll}
      >
        <ChevronsDownIcon className="h-10 w-10 animate-bounce" />
        <h1 className="text-md font-medium">Scroll down to see your notes</h1>
      </div>

      <div id="notes-section" className="w-full p-4">
        <div className="flex flex-wrap gap-4">
          {data.map((item) => {
            return (
              <div key={item.id} className="rounded-lg p-4 shadow-sm">
                {item.type === "note" && (
                  <div>
                    {/* {(item.content as NoteContent).title && (
                      <h3 className="mb-2 font-semibold">
                        {(item.content as NoteContent).title}
                      </h3>
                    )}
                    <p>{(item.content as NoteContent).text}</p> */}
                    <NotesCard note={item.content as NoteContent} />
                  </div>
                )}
                {item.type === "youtube" && (
                  <div>
                    <YoutubeCard content={item.content as YoutubeContent} />
                  </div>
                )}

                {item.type === "link" && (
                  <div>
                    <h3 className="mb-2 font-semibold">
                      {(item.content as LinkContent).title}
                    </h3>
                    <a
                      href={(item.content as LinkContent).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Link
                    </a>
                    {(item.content as LinkContent).description && (
                      <p className="mt-2 text-gray-600">
                        {(item.content as LinkContent).description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
