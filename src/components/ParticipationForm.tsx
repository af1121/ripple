import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export interface ParticipationFormData {
  userName: string;
  mediaUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  challengeTitle?: string;
  challengeDescription?: string;
  startDate?: string;
  endDate?: string;
  charityName?: string;
  charityUrl?: string;
  evidence?: {
    description: string;
    mediaUrls: string[];
  };
}

interface ParticipationFormProps {
  challengeId?: string;
  isFirstNode?: boolean;
  onSubmit: (data: ParticipationFormData) => void;
}

export function ParticipationForm({ 
  challengeId, 
  isFirstNode = false, 
  onSubmit 
}: ParticipationFormProps) {
  const [userName, setUserName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [charityName, setCharityName] = useState("");
  const [charityUrl, setCharityUrl] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const handleAddMediaUrl = () => {
    setEvidenceUrls([...evidenceUrls, ""]);
  };

  const handleRemoveMediaUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
  };

  const handleMediaUrlChange = (index: number, value: string) => {
    const newUrls = [...evidenceUrls];
    newUrls[index] = value;
    setEvidenceUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({ 
        userName, 
        mediaUrl, 
        location: { lat: 51.5074, lng: -0.1278 },
        ...(isFirstNode && {
          challengeTitle,
          challengeDescription,
          startDate,
          endDate,
          charityName,
          charityUrl,
          evidence: {
            description: evidenceDescription,
            mediaUrls: evidenceUrls.filter(url => url.trim() !== "")
          }
        })
      });
      toast.success(isFirstNode ? "Challenge created successfully!" : "Successfully joined the challenge!");
      setUserName("");
      setMediaUrl("");
      if (isFirstNode) {
        setChallengeTitle("");
        setChallengeDescription("");
        setStartDate("");
        setEndDate("");
        setCharityName("");
        setCharityUrl("");
        setEvidenceDescription("");
        setEvidenceUrls([""]);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        {isFirstNode && (
          <>
            <div className="space-y-2">
              <Label htmlFor="challengeTitle">Challenge Title</Label>
              <Input
                id="challengeTitle"
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                placeholder="Enter challenge title"
                required={isFirstNode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="challengeDescription">Challenge Description</Label>
              <Textarea
                id="challengeDescription"
                value={challengeDescription}
                onChange={(e) => setChallengeDescription(e.target.value)}
                placeholder="Enter challenge description"
                required={isFirstNode}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required={isFirstNode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required={isFirstNode}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="charityName">Supporting Charity (Optional)</Label>
              <Input
                id="charityName"
                value={charityName}
                onChange={(e) => setCharityName(e.target.value)}
                placeholder="Enter charity name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="charityUrl">Charity URL (Optional)</Label>
              <Input
                id="charityUrl"
                type="url"
                value={charityUrl}
                onChange={(e) => setCharityUrl(e.target.value)}
                placeholder="Enter charity website URL"
              />
            </div>
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="font-semibold">Challenge Evidence</h3>
              <div className="space-y-2">
                <Label htmlFor="evidenceDescription">Evidence Description</Label>
                <Textarea
                  id="evidenceDescription"
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  placeholder="Describe your challenge evidence"
                  required={isFirstNode}
                />
              </div>
              <div className="space-y-4">
                <Label>Evidence Media URLs</Label>
                {evidenceUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                      placeholder="Enter media URL"
                      required={index === 0 && isFirstNode}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveMediaUrl(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMediaUrl}
                  className="w-full"
                >
                  Add Another Media URL
                </Button>
              </div>
            </div>
          </>
        )}
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
          {loading ? "Submitting..." : (isFirstNode ? "Create Challenge" : "Join Challenge")}
        </Button>
      </form>
    </Card>
  );
}