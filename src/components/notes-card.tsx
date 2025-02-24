"use client";
import type { NoteContent } from "~/types/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import DialogBox from "./dialog-box";

export default function NotesCard({ note }: { note: NoteContent }) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{note.description}</CardDescription>
      </CardHeader>
      <DialogBox
        title={note.title}
        description={note.description}
        text={note.text}
      >
        <CardContent>
          <ScrollArea className="h-[100px] w-[250px] rounded-base border-2 border-border bg-main p-2 text-mtext shadow-shadow">
            {note.text}
          </ScrollArea>
        </CardContent>
      </DialogBox>
    </Card>
  );
}
