import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ParticipationFormData {
  userName: string;
  mediaUrl: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface ParticipationFormProps {
  challengeId: string;
  onSubmit: (data: ParticipationFormData) => void;
}

export function ParticipationForm({ challengeId, onSubmit }: ParticipationFormProps) {
  const [userName, setUserName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({ userName, mediaUrl, location: { lat: 51.5074, lng: -0.1278 } });
      toast.success("Successfully joined the challenge!");
      setUserName("");
      setMediaUrl("");
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userName">Your Name</Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mediaUrl">Media URL (Image/Video)</Label>
          <Input
            id="mediaUrl"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Enter media URL"
            type="url"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Join Challenge"}
        </Button>
      </form>
    </Card>
  );
}