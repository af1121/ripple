import { useState } from "react";
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

const MOCK_CHALLENGE = {
  id: "1",
  title: "30 Days of Fitness",
  description: "Join the fitness revolution! Complete 30 days of progressive workouts and share your journey with the community. Together, we'll build healthier habits and inspire others to join the movement.",
  startDate: "2024-03-01",
  endDate: "2024-03-30",
  participants: 60,
  charityName: "Global Health Foundation",
  charityUrl: "https://example.com/charity",
  imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
};

const MOCK_CHAIN = (() => {
  const chain = [];
  const cities = [
    { name: "New York", coords: { lat: 40.7128, lng: -74.0060 } },
    { name: "London", coords: { lat: 51.5074, lng: -0.1278 } },
    { name: "Paris", coords: { lat: 48.8566, lng: 2.3522 } },
    { name: "Tokyo", coords: { lat: 35.6762, lng: 139.6503 } },
    { name: "Sydney", coords: { lat: -33.8688, lng: 151.2093 } },
    { name: "Berlin", coords: { lat: 52.5200, lng: 13.4050 } },
    // ... previous cities ...
  ];

  // Helper function to get random number between min and max (inclusive)
  const getRandomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Generate 60 participants with unique cities
  for (let i = 0; i < 60; i++) {
    const date = new Date("2024-03-01T12:00:00Z");
    date.setHours(date.getHours() + getRandomInt(0, 72));

    const participant: ChainNode = {
      id: (i + 1).toString(),
      userName: `${cities[i % cities.length].name} Participant`,
      createdAt: date.toISOString(),
      location: cities[i % cities.length].coords,
    };

    // First participant is the root (no nominatedBy)
    if (i > 0) {
      // Choose a random previous participant as nominator
      const possibleNominators = chain.slice(0, Math.max(1, Math.floor(i * 0.75)));
      const nominator = possibleNominators[getRandomInt(0, possibleNominators.length - 1)];
      
      // Only add nominatedBy if we found a valid nominator and they haven't nominated too many
      const nominationCount = chain.filter(p => p.nominatedBy === nominator.id).length;
      if (nominator && nominationCount < 3) {
        participant.nominatedBy = nominator.id;
      }
    }

    chain.push(participant);
  }

  return chain;
})();

export default function ChallengeDetail() {
  const { id } = useParams();
  const [showParticipationForm, setShowParticipationForm] = useState(false);

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
              src={MOCK_CHALLENGE.imageUrl}
              alt={MOCK_CHALLENGE.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">Active Challenge</Badge>
                {MOCK_CHALLENGE.charityName && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Supporting Charity
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{MOCK_CHALLENGE.title}</h1>
              <p className="text-muted-foreground mb-6">
                {MOCK_CHALLENGE.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(MOCK_CHALLENGE.startDate).toLocaleDateString()} -{" "}
                    {new Date(MOCK_CHALLENGE.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{MOCK_CHALLENGE.participants} participants</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowParticipationForm(true)}
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
          <ChallengeChain participants={MOCK_CHAIN} />
        </div>

        <div className="space-y-8">
          {showParticipationForm && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Join Challenge</h2>
              <ParticipationForm
                challengeId={id!}
                onSubmit={handleParticipation}
              />
            </div>
          )}

          {MOCK_CHALLENGE.charityName && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Supporting Charity</h2>
              <p className="text-muted-foreground mb-4">
                This challenge supports {MOCK_CHALLENGE.charityName}. Join us in
                making a difference!
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(MOCK_CHALLENGE.charityUrl, "_blank")}
              >
                Learn More
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}