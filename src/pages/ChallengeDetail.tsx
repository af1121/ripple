import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ParticipationForm, ParticipationFormData } from "@/components/ParticipationForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Users,
  Heart,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChallengeMap } from "@/components/ChallengeMap";
import { ChallengeChain, ChainNode } from "@/components/ChallengeChain";
import { JoinChallenge } from "@/components/JoinChallenge";
import { getNominationById, getRequestById, getTotalDeedGeneratedByChallenge, getUserById, Nomination, User, Request, Challenge, getDeedById, getContributionsForUserInChallenge, getDeedsByPrevId } from "@/firebase_functions";
import { getChallengeById } from "@/firebase_functions";

const MOCK_CHALLENGES = [
  {
    id: "1",
    title: "30 Days of Fitness",
    description: "Join the fitness revolution! Complete 30 days of progressive workouts and share your journey with the community.",
    startDate: "2024-03-01",
    endDate: "2024-03-30",
    participants: 100,
    causeName: "Global Health Foundation",
    causeURL: "https://example.com/cause",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Plant a Tree Challenge",
    description: "Help combat climate change by joining our global tree-planting initiative. One person, one tree, one planet.",
    startDate: "2024-02-15",
    endDate: "2024-04-15",
    participants: 60,  // Changed from 75 to 60
    causeName: "Earth Restoration Project",
    causeURL: "https://example.com/earth",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
  },
  // ... other challenges
];

const MOCK_CHAIN = (() => {
  const chain: ChainNode[] = [];
  const cities = [
    { name: "New York", coords: { lat: 40.7128, lng: -74.0060 } },
    { name: "London", coords: { lat: 51.5074, lng: -0.1278 } },
    { name: "Paris", coords: { lat: 48.8566, lng: 2.3522 } },
    { name: "Tokyo", coords: { lat: 35.6762, lng: 139.6503 } },
    { name: "Sydney", coords: { lat: -33.8688, lng: 151.2093 } },
    { name: "Berlin", coords: { lat: 52.5200, lng: 13.4050 } },
    { name: "Moscow", coords: { lat: 55.7558, lng: 37.6173 } },
    { name: "Singapore", coords: { lat: 1.3521, lng: 103.8198 } },
    { name: "Buenos Aires", coords: { lat: -34.6037, lng: -58.3816 } },
    { name: "Nairobi", coords: { lat: -1.2921, lng: 36.8219 } },
    { name: "Cape Town", coords: { lat: -33.9249, lng: 18.4241 } },
    { name: "Rio de Janeiro", coords: { lat: -22.9068, lng: -43.1729 } },
    { name: "Barcelona", coords: { lat: 41.3888, lng: 2.1589 } },
    { name: "Rome", coords: { lat: 41.9028, lng: 12.4964 } },
    { name: "Madrid", coords: { lat: 40.4637, lng: -3.7492 } },
    { name: "Amsterdam", coords: { lat: 52.3702, lng: 4.8952 } },
    { name: "Vienna", coords: { lat: 48.2082, lng: 16.3738 } },
  ];

  const getRandomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Create root participant
  const rootDate = new Date("2024-03-01T12:00:00Z");
  chain.push({
    id: "1",
    userName: "Challenge Creator",
    createdAt: rootDate.toISOString(),
    location: cities[0].coords,
  });

  let currentId = 1;
  let currentLevel = [1]; // IDs of nodes at current level

  // Generate 3-4 levels of participants
  while (chain.length < 100 && currentLevel.length > 0) {
    const nextLevel: number[] = [];
    
    for (const parentId of currentLevel) {
      // Each parent nominates 2-4 participants
      const numChildren = getRandomInt(2, 4);
      
      for (let i = 0; i < numChildren && chain.length < 100; i++) {
        currentId++;
        const date = new Date(rootDate);
        date.setHours(date.getHours() + getRandomInt(1, 72));

        const participant: ChainNode = {
          id: currentId.toString(),
          userName: `${cities[currentId % cities.length].name} Participant`,
          createdAt: date.toISOString(),
          location: cities[currentId % cities.length].coords,
          nominatedBy: parentId.toString()
        };

        chain.push(participant);
        nextLevel.push(currentId);
      }
    }

    currentLevel = nextLevel;
  }

  return chain;
})();

export default function ChallengeDetail() {
  const { requestId } = useParams();
  console.log("Request ID:", requestId);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [request, setRequest] = useState<Request | null>(null);
  const [nomination, setNomination] = useState<Nomination>(null);
  const [nominator, setNominator] = useState<User | null>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [chain, setChain] = useState<ChainNode[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Use MOCK_CHAIN instead of REAL_CHAIN
    setChain(MOCK_CHAIN);
    fetchNominations();
  }, [challenge]);

  // Comment out or remove REAL_CHAIN since we're not using it
  // const REAL_CHAIN = async () => { ... };
/*
    const fetchChain = async () => {
      await fetchNominations();
      console.log("challenge::::::", challenge);
      const chain = await REAL_CHAIN();
      setChain(chain);
    };
    fetchChain();
  }, []);

  // const fetchChain = async () => {
  //   const chain = await REAL_CHAIN();
  //   setChain(chain);
  // };

  const REAL_CHAIN = async () => {
    const chain: ChainNode[] = [];
    const user = await getUserById(challenge?.StartedBy!);
    console.log("Root user:", user);
    const deedID = await getContributionsForUserInChallenge(challenge?.id!, user?.id!);
    const deed = await getDeedById(deedID!);
    setUser(user);  
    

    chain.push({  
      id: user.id,      
      userName: user?.Username,
      createdAt: deed?.DoneAt.toISOString(),
      location: deed.Location,
    });
 
    const children = await getDeedsByPrevId(deed?.id);
    while (children.length > 0) {
      for (const child of children) {
        const user = await getUserById(child.UserID);
        const participant: ChainNode = {
          id: child.id,
          userName: user.Username,
          createdAt: child.DoneAt.toISOString(),
          location: child.Location,
          nominatedBy: child.PrevDeedID 
        };

        chain.push(participant);
        // Get the next level of children
        const newChildren = await getDeedsByPrevId(child.id);
        children.push(...newChildren);
      }
    }
    return chain;
  };
*/

  const fetchNominations = async () => {
    try {
      const request = await getRequestById(requestId!);
      if (request) {
        setRequest(request);
        const nomination = await getNominationById(request.NominationID);
        console.log("Nomination:", nomination);
        if (nomination) {
          setNomination(nomination); 
          const challenge = await getChallengeById(nomination.ChallengeID);
          console.log("Challenge:", challenge);
          if (challenge) {
            setChallenge(challenge);
            const nominator = await getUserById(nomination.Nominator);
            const totalContributions =
              await getTotalDeedGeneratedByChallenge(challenge?.id);
            if (nominator) {
              setNominator(nominator);
              console.log("Nominator:", nominator);
            }

            if (totalContributions) {
              setTotalContributions(totalContributions);
              console.log("Total contributions:", totalContributions);
            }
          }
        }
      }

    } catch (error) {
      console.error("Error fetching requests and nominations:", error);
    }
  };
 
  // useEffect(() => { 
  //   const fetchNominations = async () => {
  //     try {
  //       const request = await getRequestById(requestId!);
  //       if (request) {
  //         setRequest(request);
  //         const nomination = await getNominationById(request.NominationID);
  //         console.log("Nomination:", nomination);
  //         if (nomination) {
  //           setNomination(nomination); 
  //           const challenge = await getChallengeById(nomination.ChallengeID);
  //           console.log("Challenge:", challenge);
  //           if (challenge) {
  //             setChallenge(challenge);
  //             const nominator = await getUserById(nomination.Nominator);
  //             const totalContributions =
  //               await getTotalDeedGeneratedByChallenge(challenge?.id);
  //             if (nominator) {
  //               setNominator(nominator);
  //               console.log("Nominator:", nominator);
  //             }

  //             if (totalContributions) {
  //               setTotalContributions(totalContributions);
  //               console.log("Total contributions:", totalContributions);
  //             }
  //           }
  //         }
  //       }

  //     } catch (error) {
  //       console.error("Error fetching requests and nominations:", error);
  //     }
  //   };

  //   fetchNominations();
  // }, []); 

  const [showParticipationForm, setShowParticipationForm] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  // You would typically get these from your auth context/state
  const username = "John Doe"; // Replace with actual username

  const handleParticipation = async (data: ParticipationFormData) => {
    console.log("Participation data:", data);
    setShowParticipationForm(false);
  };

  return (
    <div className="container py-8 animate-fade-up">
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Challenges
      </Link>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <Card className="overflow-hidden">
            <img
              src={challenge?.CoverImage}
              alt={challenge?.Title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">Active Challenge</Badge>
                {challenge?.CauseName && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Supporting cause
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{challenge?.Title}</h1>
              <p className="text-muted-foreground mb-6">
                {challenge?.Description}
              </p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(challenge?.StartedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{totalContributions} participants</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowJoinDialog(true)}
                  className="flex-1"
                >
                  Join Challenge
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
          <ChallengeChain participants={chain} />
        </div>

        <div className="space-y-8">
          {showParticipationForm && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Join Challenge</h2>
              <ParticipationForm
                challengeId={challenge?.id}
                onSubmit={handleParticipation}
              />
            </div>
          )}

          {challenge?.CauseName && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Supporting cause</h2>
              <p className="text-muted-foreground mb-4">
                This challenge supports {challenge?.CauseName}. Join us in
                making a difference!
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(challenge?.CauseURL, "_blank")}
              >
                Donate Now
              </Button>
            </Card>
          )}
        </div>
      </div>

      <JoinChallenge
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        challenge={challenge || null}
        userId={request?.NomineeID}
        prevUserId={nominator?.id}
        nomination={nomination}
        // username={username}
      />
    </div>
  );
}