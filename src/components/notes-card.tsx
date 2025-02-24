import { NoteContent } from "~/types/content";

export default function NotesCard({ note }: { note: NoteContent }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Notes</h3>
      </div>
    </div>
  );
}
