import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trees, Coffee, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import {
  addDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import {
  Request,
  Nomination,
  Challenge,
  getNominationById,
  getChallengeById,
  getUserById,
  User,
  getTotalDeedGeneratedByChallenge,
  deleteRequest,
  updateRequestActive,
} from "@/firebase_functions";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ChallengeRequestDialog } from "@/components/ChallengeRequestDialog";

// interface Request {
//   id: string;
//   title: string;
//   nominatedBy: string;
//   timeLeft: string;
//   peopleInChain: number;
//   icon: "tree" | "coffee";
// }

// const MOCK_REQUESTS: Request[] = [
//   {
//     id: "1",
//     title: "Plant a tree",
//     nominatedBy: "USERNAME2",
//     timeLeft: "00:00:00",
//     peopleInChain: 75,
//     icon: "tree"
//   },
//   {
//     id: "2",
//     title: "Buy someone a coffee",
//     nominatedBy: "USERNAME3",
//     timeLeft: "00:00:00",
//     peopleInChain: 54,
//     icon: "coffee"
//   }
// ];

const timeLeft = (date: Date) => {
  const futureDate = addDays(date, 2);
  const currentTime = new Date();
  const daysLeft = differenceInDays(futureDate, currentTime);
  const hoursLeft = differenceInHours(futureDate, currentTime) % 24;
  const minutesLeft = differenceInMinutes(futureDate, currentTime) % 60;
  return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
};

const MOCK_USER_ID = "ThKZKgw7aa3tel9KKGk9"; // TODO: Replace with real user ID

const IconMap = {
  tree: Trees,
  coffee: Coffee,
  dumbbell: Dumbbell,
};

export function RequestsSection({ requests }: { requests: Request[] }) {
  const [nominationsMap, setNominationsMap] = useState<
    Map<Request, [Nomination, Challenge, User, number]>
  >(new Map());
  const [selectedRequest, setSelectedRequest] = useState<{
    request: Request;
    nomination: Nomination;
    challenge: Challenge;
    nominator: User;
  } | null>(null);

  useEffect(() => {
    const fetchNominations = async () => {
      try {
        const nominationsMap = new Map<
          Request,
          [Nomination, Challenge, User, number]
        >();

        await Promise.all(
          requests.map(async (request) => {
            const nomination = await getNominationById(request.NominationID);
            if (nomination) {
              const challenge = await getChallengeById(nomination.ChallengeID);
              if (challenge) {
                const nominator = await getUserById(nomination.Nominator);
                const totalContributions =
                  await getTotalDeedGeneratedByChallenge(challenge.id);
                if (nominator) {
                  nominationsMap.set(request, [
                    nomination,
                    challenge,
                    nominator,
                    totalContributions,
                  ]);
                }
              }
            }
          })
        );

        setNominationsMap(nominationsMap);
      } catch (error) {
        console.error("Error fetching requests and nominations:", error);
      }
    };

    fetchNominations();
  }, [requests]); // Add requests as dependency to rerun when it changes

  const handleAccept = async () => {
    if (!selectedRequest) return;
                             
    try {
      // Update request to be active
     // await createRequest(selectedRequest.request.id, { Active: true });
     const success = await updateRequestActive(selectedRequest.request.id);
      if (!success) {
        toast.error("Failed to accept challenge");
        return;
      }

      // Refresh the requests list
      const updatedRequests = requests.filter(r => r.id !== selectedRequest.request.id);
      setNominationsMap(new Map(
        Array.from(nominationsMap.entries()).filter(([req]) => req.id !== selectedRequest.request.id)
      ));
      
      toast.success("Challenge accepted!");
    } catch (error) {
      console.error("Error accepting challenge:", error);
      toast.error("Failed to accept challenge");
    }
    
    setSelectedRequest(null);
  };

  const handleDecline = async () => {
    if (!selectedRequest) return;
    
    try {
      // Delete or mark request as declined
      await deleteRequest(selectedRequest.request.id);
      
      // Refresh the requests list
      const updatedRequests = requests.filter(r => r.id !== selectedRequest.request.id);
      setNominationsMap(new Map(
        Array.from(nominationsMap.entries()).filter(([req]) => req.id !== selectedRequest.request.id)
      ));
      
      toast.success("Challenge declined");
    } catch (error) {
      console.error("Error declining challenge:", error);
      toast.error("Failed to decline challenge");
    }
    
    setSelectedRequest(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Requests</h2>
      <div className="space-y-4">
        {Array.from(nominationsMap.entries()).map(
          ([request, [nomination, challenge, nominator, totalContributions]]) => (
            <Card   
              key={request.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setSelectedRequest({
                request,
                nomination,
                challenge,
                nominator
              })}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  {(() => {
                    const Icon = IconMap[nomination .Icon];
                    return <Icon className="h-6 w-6 text-muted-foreground" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{challenge.Title}</h3>
                  <p className="text-sm text-muted-foreground">
                    NOMINATED BY {nominator.Username}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span>Time left: {timeLeft(nomination.StartedAt)}</span>
                    <span>{totalContributions} people in the chain</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        )}
      </div>

      {selectedRequest && (
        <ChallengeRequestDialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
          nominatorName={selectedRequest.nominator.Username}
          challengeTitle={selectedRequest.challenge.Title}
          onAccept={handleAccept}
          onDecline={handleDecline}
          stats={{
            totalPeople: nominationsMap.get(selectedRequest.request)?.[3] || 0,
            timeLeft: timeLeft(selectedRequest.nomination.StartedAt)
          }}
        />
      )}
    </div>
  );
}
