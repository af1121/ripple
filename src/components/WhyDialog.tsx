import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WhyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhyDialog({ open, onOpenChange }: WhyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Why are we doing this?</DialogTitle>
          <DialogDescription className="pt-4 space-y-4">
            <p>
            We believe small actions can ignite global movements—just like the ALS Ice Bucket Challenge proved a simple act could reach millions. Our platform harnesses that same ripple effect of good deeds, inspiring others to join and magnify positive impact. By linking individuals through chains of challenges, we show how each contribution, when connected, can transform communities and champion worthy causes. Every time you participate, you spark more momentum for change, proving that one person’s effort can truly become an ever-growing force for good.
            </p>
            <p>
              Here's how it works:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Someone starts a challenge for a good cause</li>
              <li>They complete the challenge and nominate others</li>
              <li>Nominees do the same, creating a chain reaction</li>
              <li>Each completion adds to the collective impact</li>
            </ul>
            <p>
              By tracking and visualizing these chains of good deeds, we can see how our individual actions connect to create meaningful change in our communities and beyond.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 