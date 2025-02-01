import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  participants: number;
  location: string;
  imageUrl: string;
}

export function ChallengeCard({
  id,
  title,
  description,
  startDate,
  participants,
  location,
  imageUrl,
}: ChallengeCardProps) {
  return (
    <Card className="overflow-hidden hover-scale">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="glass-card">
            Active Challenge
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{participants} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        <Link to={`/challenge/${id}`}>
          <Button className="w-full">View Challenge</Button>
        </Link>
      </div>
    </Card>
  );
}