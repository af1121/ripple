import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Coffee, Trees, Dumbbell } from "lucide-react";
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
} from "@/firebase_functions";
import { useEffect, useState } from "react";

const timeLeft = (date: Date) => {
  const futureDate = addDays(date, 2);
  const currentTime = new Date();
  const daysLeft = differenceInDays(futureDate, currentTime);
  const hoursLeft = differenceInHours(futureDate, currentTime) % 24;
  const minutesLeft = differenceInMinutes(futureDate, currentTime) % 60;
  return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
};

// Define the possible icon types
type IconType = "tree" | "coffee" | "dumbbell" | "book";

const IconMap: Record<IconType, any> = {
  tree: Trees,
  coffee: Coffee,
  dumbbell: Coffee, // Replace with actual Dumbbell icon if available
  book: Coffee, // Replace with actual Book icon if available
};

export function ActiveChallengeSection({ requests }: { requests: Request[] }) {
  const [nominationsMap, setNominationsMap] = useState<
    Map<Request, [Nomination, Challenge, User, number]>
  >(new Map());

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

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Active Challenges</h2>
      <div className="space-y-4">
        {Array.from(nominationsMap.entries()).map(
          ([
            request,
            [nomination, challenge, nominator, totalContributions],
          ]) => {
            // Use a default icon if the nomination.Icon is not in IconMap
            const IconComponent =
              IconMap[nomination.Icon as IconType] || Coffee;
            return (
              <Link to={`/challenge/${request.id}`} key={request.id}>
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
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
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
