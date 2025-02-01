import { useState, useEffect } from "react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { AddChallengeButton } from "@/components/AddChallengeButton";
import { RequestsSection } from "@/components/RequestsSection";
import { getUserById, type User } from "@/firebase_functions";


const MOCK_CHALLENGES = [
  {
    id: "1",
    title: "30 Days of Fitness",
    description:
      "Join the fitness revolution! Complete 30 days of progressive workouts.",
    startDate: "2024-03-01",
    participants: 1234,
    location: "Global",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Plant a Tree Challenge",
    description:
      "Help combat climate change by planting trees in your community.",
    startDate: "2024-03-15",
    participants: 567,
    location: "Worldwide",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Digital Detox Week",
    description: "Disconnect to reconnect. Take a break from social media.",
    startDate: "2024-04-01",
    participants: 890,
    location: "Online",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80",
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const filteredChallenges = MOCK_CHALLENGES.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }));
        setUsers(usersData);
        console.log("Fetched users:", usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    console.log(users);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = "your-user-id"; // Replace with actual user ID
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
        console.log("Found user:", userData);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Hi, Username <span className="wave">👋</span>
      </h1>

      <p className="text-muted-foreground mb-8 text-center">
        Participate in challenges that make a difference and visualise your
        impact
      </p>

      <ImpactMetrics goodDeeds={596} />

      <RequestsSection />

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

      <AddChallengeButton />
    </div>
  );
}
