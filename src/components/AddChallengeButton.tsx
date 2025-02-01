import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddChallengeDialog } from "./AddChallengeDialog"

export function AddChallengeButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white border-none"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Challenge</span>
      </Button>

      <AddChallengeDialog 
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
} 