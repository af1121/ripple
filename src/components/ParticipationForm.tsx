import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ParticipationFormProps {
  challengeId: string;
  onSubmit: (data: {
    userName: string;
    mediaUrl: string;
    location: { lat: number; lng: number };
  }) => void;
}

export function ParticipationForm({ challengeId, onSubmit }: ParticipationFormProps) {
  const [userName, setUserName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      await onSubmit({ userName, mediaUrl, location });
      toast.success("Successfully joined the challenge!");
      setUserName("");
      setMediaUrl("");
    } catch (error) {
      toast.error("Failed to submit participation. Please try again.");
    } finally {
      setLoading(false);
    }
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