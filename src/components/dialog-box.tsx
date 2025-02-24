import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { ScrollArea } from "./ui/scroll-area";

const DialogBox = ({
  children,
  title,
  description,
  text,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  text?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full w-full rounded-base border-2 border-border bg-main p-2 text-mtext shadow-shadow">
          {text}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
