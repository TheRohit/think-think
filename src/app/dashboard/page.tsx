import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "~/lib/auth";
import { getContentByUserId } from "~/server/db/queries";
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

  const data = await getContentByUserId(session.user.id);

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          {data.map((item) => {
            return (
              <div key={item.id} className="rounded-lg border p-4 shadow-sm">
                {item.type === "note" && (
                  <div>
                    {(item.content as NoteContent).title && (
                      <h3 className="mb-2 font-semibold">
                        {(item.content as NoteContent).title}
                      </h3>
                    )}
                    <p>{(item.content as NoteContent).text}</p>
                  </div>
                )}
                {item.type === "youtube" && (
                  <div>
                    <h3 className="mb-2 font-semibold">
                      {(item.content as YoutubeContent).title}
                    </h3>
                    <a
                      href={(item.content as YoutubeContent).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Watch on YouTube
                    </a>
                    {(item.content as YoutubeContent).description && (
                      <p className="mt-2 text-gray-600">
                        {(item.content as YoutubeContent).description}
                      </p>
                    )}
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
                    {(item.content as PdfContent).pageNumber &&
                      (item.content as PdfContent).totalPages && (
                        <p className="mt-2 text-sm text-gray-500">
                          Page {(item.content as PdfContent).pageNumber} of{" "}
                          {(item.content as PdfContent).totalPages}
                        </p>
                      )}
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
