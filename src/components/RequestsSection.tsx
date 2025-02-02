import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trees, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { getRequestsList } from "@/firebase_functions";
import { useState, useEffect } from "react";

interface Request {
  id: string;
  title: string;
  nominatedBy: string;
  timeLeft: string;
  peopleInChain: number;
  icon: "tree" | "coffee";
}

const MOCK_USER_ID = "DbDAsedHMR5g8h8ohdas"; // TODO: Replace with real user ID

const IconMap = {
  tree: Trees,
  coffee: Coffee
};

export function RequestsSection() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsList = await getRequestsList(MOCK_USER_ID);
        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => {
          const Icon = IconMap[request.icon];
          return (
            <Link to={`/challenge/${request.id}`} key={request.id}>
              <Card className="p-4 hover:bg-muted/50 transition-colors">
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}