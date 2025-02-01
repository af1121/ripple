import { useState } from "react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const MOCK_CHALLENGES = [
  {
    id: "1",
    title: "30 Days of Fitness",
    description: "Join the fitness revolution! Complete 30 days of progressive workouts.",
    startDate: "2024-03-01",
    participants: 1234,
    location: "Global",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Plant a Tree Challenge",
    description: "Help combat climate change by planting trees in your community.",
    startDate: "2024-03-15",
    participants: 567,
    location: "Worldwide",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Digital Detox Week",
    description: "Disconnect to reconnect. Take a break from social media.",
    startDate: "2024-04-01",
    participants: 890,
    location: "Online",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80",
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChallenges = MOCK_CHALLENGES.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8 animate-fade-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Chain of Challenges</h1>
        <p className="text-xl text-muted-foreground">
          Join viral challenges and make a difference
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-8">
        <Input
          type="search"
          placeholder="Search challenges..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} {...challenge} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Button size="lg">Load More Challenges</Button>
      </div>
    </div>
  );
}