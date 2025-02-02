import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { MOCK_USER_ID } from "@/pages/Index";
import { createChallenge, Challenge } from "@/firebase_functions";
import { storage } from "@/firebase"; // Make sure this exists
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AddChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeCreated: (id: string, title: string, causeName?: string) => void;
  setNewChallenge: (challenge: Challenge) => void;
}

export function AddChallengeDialog({ 
  open, 
  onOpenChange,
  onChallengeCreated,
  setNewChallenge
}: AddChallengeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Add image to firebase storage
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Create a storage reference with user ID and original filename
    const fileName = `${MOCK_USER_ID}/${file.name}`;
    const storageRef = ref(storage, fileName);

    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; 
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try { 
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }
        
      const data = {
        Title: formData.get("title") as string,
        Description: formData.get("description") as string,
        CoverImage: imageUrl || "",
        StartedBy: MOCK_USER_ID,
        CauseName: formData.get("causeName") as string || null,
        CauseURL: formData.get("causeURL") as string || null,
        StartedAt: new Date(),
      };

      const challenge = await createChallenge(data);
      if (challenge) {  
        setNewChallenge(challenge);
        toast.success("Challenge created successfully!");
        setLoading(false);
        onOpenChange(false);
        // Call the callback with challenge details
        onChallengeCreated(challenge.id, data.Title, data.CauseName || undefined);
      } else {
        toast.error("Failed to create challenge");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create challenge");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Challenge Title</Label>
            <Input id="title" name="title" placeholder="Enter challenge title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe your challenge"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Cover Image</Label>
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
                  <span>Click to upload a cover image</span>
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

          <div className="space-y-2">
            <Label htmlFor="causeName">Supporting Cause (Optional)</Label>
            <Input
              id="causeName"
              name="causeName"
              placeholder="Enter cause name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="causeURL">Cause URL (Optional)</Label>
            <Input
              id="causeURL"
              name="causeURL"
              placeholder="Enter cause website URL"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Challenge"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 