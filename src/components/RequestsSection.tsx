import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trees, Coffee } from "lucide-react";

interface Request {
  id: string;
  title: string;
  nominatedBy: string;
  timeLeft: string;
  peopleInChain: number;
  icon: "tree" | "coffee";
}

const MOCK_REQUESTS: Request[] = [
  {
    id: "1",
    title: "Plant a tree",
    nominatedBy: "USERNAME2",
    timeLeft: "00:00:00",
    peopleInChain: 75,
    icon: "tree"
  },
  {
    id: "2",
    title: "Buy someone a coffee",
    nominatedBy: "USERNAME3",
    timeLeft: "00:00:00",
    peopleInChain: 54,
    icon: "coffee"
  }
];

const IconMap = {
  tree: Trees,
  coffee: Coffee
};

export function RequestsSection() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Requests</h2>
      <div className="space-y-4">
        {MOCK_REQUESTS.map((request) => {
          const Icon = IconMap[request.icon];
          return (
            <Card key={request.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    NOMINATED BY {request.nominatedBy}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span>Time left: {request.timeLeft}</span>
                    <span>{request.peopleInChain} people in the chain</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 