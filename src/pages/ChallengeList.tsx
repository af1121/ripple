import React, { useState } from 'react';
import { AddChallengeDialog } from '../components/AddChallengeDialog';
import { JoinChallenge } from '../components/JoinChallenge';
import { MOCK_CHALLENGES } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { MOCK_USER_ID } from './Index';

export default function ChallengeList() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [newChallenge, setNewChallenge] = useState<{
    id: string;
    title: string;
    causeName?: string;
  } | null>(null);

  const handleChallengeCreated = (challengeId: string, challengeTitle: string, causeName?: string) => {
    setNewChallenge({ id: challengeId, title: challengeTitle, causeName });
    setShowJoinDialog(true);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">All Challenges</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_CHALLENGES.map((challenge) => (
          <Link to={`/challenge/${challenge.id}`} key={challenge.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-all">
              <img 
                src={challenge.imageUrl} 
                alt={challenge.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      <AddChallengeDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onChallengeCreated={handleChallengeCreated}
      />

      {newChallenge && (
        <JoinChallenge
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          challengeId={newChallenge.id}
          challengeTitle={newChallenge.title}
          causeName={newChallenge.causeName}
          userId={MOCK_USER_ID}
        />
      )}
    </div>
  );
} 