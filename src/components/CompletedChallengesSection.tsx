import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Challenge,
  Deed,
  getChallengeById,
  getDeedsByUserId,
  getTotalDeedGeneratedByChallenge,
} from "@/firebase_functions";
import { useEffect, useState } from "react";

interface CompletedChallenge {
  id: string;
  challenge: Challenge;
  completedDate: Date;
  totalParticipants: number;
}

export function CompletedChallengesSection({ userId }: { userId: string }) {
  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallenge[]
  >([]);

  useEffect(() => {
    const fetchCompletedChallenges = async () => {
      try {
        // Get all deeds by user
        const userDeeds = await getDeedsByUserId(userId);

        // Create a map to store unique challenges
        const challengeMap = new Map<string, CompletedChallenge>();

        // Process each deed
        await Promise.all(
          userDeeds.map(async (deed: Deed) => {
            const challenge = await getChallengeById(deed.ChallengeID);
            if (challenge) {
              const totalParticipants = await getTotalDeedGeneratedByChallenge(
                challenge.id
              );

              challengeMap.set(challenge.id, {
                id: challenge.id,
                challenge: challenge,
                completedDate: deed.DoneAt,
                totalParticipants: totalParticipants,
              });
            }
          })
        );

        setCompletedChallenges(Array.from(challengeMap.values()));
      } catch (error) {
        console.error("Error fetching completed challenges:", error);
      }
    };

    fetchCompletedChallenges();
  }, [userId]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Completed Challenges</h2>
      <div className="space-y-4">
        {completedChallenges.map((completedChallenge) => (
          <Link
            to={`/challenge/${completedChallenge.id}`}
            key={completedChallenge.id}
          >
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-teal-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {completedChallenge.challenge.Title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Completed on{" "}
                    {completedChallenge.completedDate.toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span>
                      {completedChallenge.totalParticipants} people participated
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
