import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddChallengeDialog } from "./AddChallengeDialog"
import { JoinChallenge } from "./JoinChallenge"

export function AddChallengeButton() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newChallenge, setNewChallenge] = useState<{
    id: string;
    title: string;
    causeName?: string;
  } | null>(null);

  const handleChallengeCreated = (id: string, title: string, causeName?: string) => {
    setShowAddDialog(false);
    setNewChallenge({ id, title, causeName });
    setShowJoinDialog(true);
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-teal-500 hover:bg-teal-600 text-white border-none"
        size="icon"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Challenge</span>
      </Button>

      <AddChallengeDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onChallengeCreated={handleChallengeCreated}
      />

      {newChallenge && (
        <JoinChallenge
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          challengeId={newChallenge.id}
          challengeTitle={newChallenge.title}
          causeName={newChallenge.causeName}
          userId={"John Doe"}
        />
      )}
    </>
  )
} 