import { useState, useEffect } from "react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trophy, ChevronRight } from "lucide-react";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { AddChallengeButton } from "@/components/AddChallengeButton";
import { RequestsSection } from "@/components/RequestsSection";
import {
  getUserById,
  type User,
  getTotalDeedsGenerated,
  getRequestsByNomineeId,
  type Request,
} from "@/firebase_functions";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CalendarIcon, Users } from "lucide-react";
import { ActiveChallengeSection } from "@/components/ActiveChallengeSection";
import { CompletedChallengesSection } from "@/components/CompletedChallengesSection";
import { WhyDialog } from "@/components/WhyDialog";
import { clearDatabase, populateDatabase } from "@/data/mockDBData";

export const MOCK_USER_ID = "5UFtogUUwLOOvfJKoaCO";

const MOCK_ACTIVE_CHALLENGES = [
  {
    id: "1",
    title: "30 Days of Fitness",
    startDate: "2024-03-01",
    endDate: "2024-03-30",
    participants: 60,
    progress: 70, // percentage complete
  },
  {
    id: "2",
    title: "Plant a Tree Challenge",
    startDate: "2024-03-01",
    endDate: "2024-03-30",
    participants: 60,
    progress: 70, // percentage complete
  },
];

const MOCK_COMPLETED_CHALLENGES = [
  {
    id: "3",
    title: "Beach Cleanup Drive",
    completedDate: "2024-02-28",
    peopleInChain: 89,
    impact: "247 kg waste collected",
    icon: "trophy",
  },
  {
    id: "4",
    title: "Winter Clothing Drive",
    completedDate: "2024-02-15",
    peopleInChain: 123,
    impact: "560 items donated",
    icon: "trophy",
  },
];

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeRequests, setActiveRequests] = useState<Request[]>([]);
  const [totalDeeds, setTotalDeeds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showWhyDialog, setShowWhyDialog] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await getUserById(MOCK_USER_ID);
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    const fetchRequests = async () => {
      try {
        const requests: Request[] = await getRequestsByNomineeId(
          MOCK_USER_ID,
          false
        );
        if (requests) {
          setRequests(requests);
        } else {
          setRequests(null);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]);
      }
    };

    const fetchActiveRequests = async () => {
      try {
        const requests: Request[] = await getRequestsByNomineeId(
          MOCK_USER_ID,
          true
        );
        if (requests) {
          setActiveRequests(requests);
          console.log("Requests:", requests); // Debug log
        } else {
          console.error("No requests found with nomineeID:", MOCK_USER_ID);
          setActiveRequests(null);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setActiveRequests([]);
      }
    };

    const fetchTotalDeeds = async () => {
      try {
        const total = await getTotalDeedsGenerated(MOCK_USER_ID);
        setTotalDeeds(total);
      } catch (error) {
        console.error("Error fetching total deeds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    fetchRequests();
    fetchActiveRequests();
    fetchTotalDeeds();
  }, []);

  return (
    <>
      <header className="border-b">
        <div className="container max-w-2xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-teal-500">Ripple</h1>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">
          Hi, {user?.Username || "Loading..."} <span className="wave">👋</span>
        </h2>

        <p className="text-muted-foreground mb-8 text-center">
          Participate in challenges that make a difference and visualise your
          impact
        </p>

        <div className="mb-2 text-center">
          <button
            onClick={() => setShowWhyDialog(true)}
            className="text-sm text-muted-foreground hover:text-teal-600 hover:underline"
          >
            Why are we doing this?
          </button>
        </div>

        <ImpactMetrics goodDeeds={totalDeeds} />

        <WhyDialog open={showWhyDialog} onOpenChange={setShowWhyDialog} />

        <RequestsSection requests={requests || []} />

        <ActiveChallengeSection requests={activeRequests || []} />

        {/* <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Challenges</h2>
          <div className="space-y-4">
            {MOCK_ACTIVE_CHALLENGES.map((challenge) => (
              <Link to={`/challenge/${challenge.id}`} key={challenge.id}>
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                          {"You were nominated on "}{new Date(challenge.startDate).toLocaleDateString()}{" "}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div> */}

        {/* <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Completed Challenges</h2>
          <div className="space-y-4">
            {MOCK_COMPLETED_CHALLENGES.map((challenge) => (
              <Link to={`/challenge/${challenge.id}`} key={challenge.id}>
                <Card className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed on{" "}
                        {new Date(challenge.completedDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span>{challenge.impact}</span>
                        <span>
                          {challenge.peopleInChain} people participated
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
        </div> */}
        <CompletedChallengesSection userId={MOCK_USER_ID} />

        <AddChallengeButton />
      </div>
    </>
  );
}
