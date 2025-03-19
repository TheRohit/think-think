import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const DialogBox = ({
  children,
  title,
  description,
  className,
  open,
  onOpenChange,
  content,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: React.ComponentProps<typeof DialogContent>["className"];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  content?: React.ReactNode;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("w-full", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
