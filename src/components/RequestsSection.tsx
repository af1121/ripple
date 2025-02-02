import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trees, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { addDays, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import {
  Request,
  Nomination,
  Challenge,
  getNominationById,
  getRequestsList,
  getChallengeById,
  getUserById,
  UserType,
} from "@/firebase_functions";
import { useEffect, useState } from "react";

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

  // Calculate differences
  const currentTime = new Date();
  const daysLeft = differenceInDays(futureDate, currentTime);
  const hoursLeft = differenceInHours(futureDate, currentTime) % 24;
  const minutesLeft = differenceInMinutes(futureDate, currentTime) % 60;

  return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
};
 
const MOCK_USER_ID = "DbDAsedHMR5g8h8ohdas"; // TODO: Replace with real user ID


const IconMap = {
  tree: Trees,
  coffee: Coffee,
};

export function RequestsSection({ requests }: { requests: Request[] }) {
  console.log("Requests in component:", requests);
  const [nominationsMap, setNominationsMap] = useState<
    Map<Request, [Nomination, Challenge, UserType]>
  >(new Map());

  useEffect(() => {
    const fetchNominations = async () => {
      try {
        // Fetch all associated nominations
        const nominationsMap: Map<Request, [Nomination, Challenge, UserType]> = new Map();
        await Promise.all(
          requests.map(async (request) => {
            const nomination = await getNominationById(request.nominationID);
            if (nomination) {
              const challenge = await getChallengeById(nomination.challengeID);
              if (challenge) {
                const nominator = await getUserById(nomination.nominator);
                if (nominator) {
                  nominationsMap.set(request, [nomination, challenge, nominator]);
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
    console.log("Nominations map:", nominationsMap);
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Requests</h2>
      <div className="space-y-4">
        {Array.from(nominationsMap.entries()).map(
          ([request, [nomination, challenge, nominator]]) => {
            const Icon = IconMap[nomination.icon];
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
                    <div className="flex-1">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        NOMINATED BY {nominator.username}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span>Time left: {timeLeft(nomination.started_at)}</span>
                        <span>{3 /* Ifaz fix please */} people in the chain</span> 
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button> 
                  </div>
                </Card>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
