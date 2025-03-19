"use client";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { ingestNoteAction } from "~/actions/ingest-note";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "~/hooks/use-toast";

const NotesTab = ({ close }: { close: () => void }) => {
  const [note, setNote] = useState("");

  const { executeAsync: ingestNote, isPending: isIngestingNotePending } =
    useAction(ingestNoteAction, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Note added successfully",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to add note",
        });
      },
    });

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Note cannot be empty",
      });
      return;
    }
    await ingestNote({ note: note.trim() });
    close();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add a Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            id="note"
            placeholder="Write your note here..."
            className="relative min-h-[120px] bg-white/20 backdrop-blur-xl focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/30 sm:min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleAddNote} isLoading={isIngestingNotePending}>
          Add Note
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotesTab;
