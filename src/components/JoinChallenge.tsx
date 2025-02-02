import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImagePlus, MapPin } from "lucide-react";
import { createShareMessage, shareViaSMS } from "@/lib/shareUtils";
import { Challenge, getUserById } from "@/firebase_functions";

interface JoinChallengeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: Challenge | null;
  userId: string;
  // challengeTitle: string;
  // causeName?: string;
  // username: string;
}

interface NomineeInput {
  phone: string;
}

export function JoinChallenge({ 
  open, 
  onOpenChange, 
  challenge,
  userId,
  // username 
}: JoinChallengeProps) {
  const [loading, setLoading] = useState(false);
  const [nominees, setNominees] = useState<NomineeInput[]>([{ phone: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isCollectingLocation, setIsCollectingLocation] = useState(false);
  const [username, setUsername] = useState("");


  useEffect(() => {
    const fetchUsername = async () => {
      const user = await getUserById(userId);
      setUsername(user?.Username || "");
    };
    fetchUsername();
  }, [userId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddNominee = () => {
    if (nominees.length < 3) {
      setNominees([...nominees, { phone: "" }]);
    }
  };

  const handleRemoveNominee = (index: number) => {
    if (nominees.length > 1) {
      setNominees(nominees.filter((_, i) => i !== index));
    }
  };

  const handleNomineeChange = (index: number, value: string) => {
    const newNominees = [...nominees];
    newNominees[index].phone = value;
    setNominees(newNominees);
  };

  const handleShare = async (nominees: NomineeInput[]) => {
    const challengeUrl = `${window.location.origin}/challenge/${challenge?.id}`;
    const message = createShareMessage({
      username,
      challengeTitle: challenge?.Title || "",
      causeName: challenge?.CauseName || "",
      challengeUrl,
    });

    nominees.forEach(nominee => {
      if (nominee.phone) {
        shareViaSMS(nominee.phone, message);
      }
    });
  };

  const handleGetLocation = () => {
    setIsCollectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError("");
        setIsCollectingLocation(false);
        toast.success("Location collected successfully");
      },
      (error) => {
        setLocationError("Please enable location access to join the challenge");
        toast.error("Location access is required");
        setIsCollectingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!location) {
      toast.error("Location is required to join the challenge");
      setLoading(false);
      return;
    }

    if (!image) {
      toast.error("Please upload a photo");
      setLoading(false);
      return;
    }

    // Validate at least one nominee
    if (nominees.length < 1 || !nominees[0].phone) {
      toast.error("Please nominate at least one person");
      setLoading(false);
      return;
    }

    const validNominees = nominees.filter(n => n.phone);

    const data = {
      UserID: userId,
      ChallengeID: challenge?.id,
      image,  
      description,
      nominees: validNominees,
      location,
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Join challenge data:", data);
      
      // Share with nominees
      await handleShare(validNominees);
      
      toast.success("Successfully joined the challenge!");
      setLoading(false);
      onOpenChange(false);
      // Reset form
      setImage(null);
      setPreviewUrl(null);
      setDescription("");
      setNominees([{ phone: "" }]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to share with nominees");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Join Challenge</DialogTitle>
        </DialogHeader>
        {locationError && (
          <div className="text-red-500 text-sm mb-4">
            {locationError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Your Challenge Photo</Label>
            <div className="grid gap-4">
              <div 
                className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer text-center"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-[200px] mx-auto rounded-lg"
                  />
                ) : (
                  <div className="py-4 flex flex-col items-center gap-2 text-muted-foreground">
                    <ImagePlus className="w-8 h-8" />
                    <span>Click to upload a photo</span>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your participation"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Nominate Others (1-3 people)</Label>
              {nominees.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddNominee}
                >
                  Add Nominee
                </Button>
              )}
            </div>
            
            <div className="grid gap-2">
              {nominees.map((nominee, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="tel"
                      value={nominee.phone}
                      onChange={(e) => handleNomineeChange(index, e.target.value)}
                      placeholder={`Nominee ${index + 1} phone number`}
                      required
                    />
                  </div>
                  {nominees.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveNominee(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Location</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGetLocation}
                disabled={isCollectingLocation}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isCollectingLocation 
                  ? "Collecting Location..." 
                  : location 
                    ? "Update Location" 
                    : "Enter Your Location"
                }
              </Button>
              {location && (
                <div className="text-sm text-muted-foreground">
                  📍 Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join Challenge"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 