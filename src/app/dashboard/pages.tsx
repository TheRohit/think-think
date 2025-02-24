import { redirect } from "next/navigation";
import { Suspense } from "react";
import InputField from "~/components/input-field";
import NotesCard from "~/components/notes-card";
import YoutubeCard from "~/components/youtube-card";
import { getSession } from "~/lib/auth";
import type {
  LinkContent,
  NoteContent,
  PdfContent,
  YoutubeContent,
} from "~/types/content";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // const data = await getContentByUserId(session.user.id);

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

  return (
    <div className="flex h-full flex-col p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <InputField />
        <div className="flex flex-row gap-4">
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
                {item.type === "pdf" && (
                  <div>
                    <h3 className="mb-2 font-semibold">
                      {(item.content as PdfContent).fileName}
                    </h3>
                    <a
                      href={(item.content as PdfContent).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View PDF
                    </a>
                    {/* {(item.content as PdfContent).pageNumber &&
                      (item.content as PdfContent).totalPages && (
                        <p className="mt-2 text-sm text-gray-500">
                          Page {(item.content as PdfContent).pageNumber} of{" "}
                          {(item.content as PdfContent).totalPages}
                        </p>
                      )} */}
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
      </Suspense>
    </div>
  );
}
