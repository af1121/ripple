import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

interface ChallengeRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nominatorName: string;
  challengeTitle: string;
  onAccept: () => void;
  onDecline: () => void;
  stats: {
    totalPeople: number;
    timeLeft: string;
  };
}

export function ChallengeRequestDialog({
  open,
  onOpenChange,
  nominatorName,
  challengeTitle,
  onAccept,
  onDecline,
  stats
}: ChallengeRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <Coffee className="w-12 h-12" />
          </div>
          
          <h2 className="text-xl font-semibold">
            {nominatorName} nominated you to {challengeTitle}!
          </h2>

          <div className="flex gap-4 w-full">
            <Button 
              className="flex-1 bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-600 to-teal-400 text-white"
              onClick={onAccept}
            >
              Accept!
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={onDecline}
            >
              Decline
            </Button>
          </div>

          {stats && (
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4">Challenge Details</h3>
              <div className="space-y-2 text-left">
                <div>
                  <div className="font-medium">Total People:</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.totalPeople || 0}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Time Left:</div>
                  <div className="text-muted-foreground text-sm">
                    {stats.timeLeft || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 