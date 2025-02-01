import { useState, useEffect } from "react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { AddChallengeButton } from "@/components/AddChallengeButton";
import { RequestsSection } from "@/components/RequestsSection";
import { getUserById, type User } from "@/firebase_functions";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";    
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { CalendarIcon, Users } from "lucide-react"

const MOCK_USER_ID = "DbDAsedHMR5g8h8ohdas";

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


export default function Index() {
  return (
    <>
      <header className="border-b">
        <div className="container max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-teal-500">Ripple</h1>
        </div>
      </header>
      
      <div className="container max-w-2xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">
          Hi, Username <span className="wave">👋</span>
        </h2>
        
        <p className="text-muted-foreground mb-8 text-center">
          Participate in challenges that make a difference and visualise your impact
        </p>

        <ImpactMetrics goodDeeds={596} />
        
        <RequestsSection />
        
        <div className="mb-8">
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
                            {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all" 
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        <AddChallengeButton />
      </div>
    </>
  );
}
