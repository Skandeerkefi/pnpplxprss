import { Button } from "@/components/ui/button";
import { Clock, Users, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type GiveawayStatus = "active" | "completed" | "upcoming";

interface GiveawayCardProps {
  id: string;
  title: string;
  prize: string;
  endTime: string;
  participants: number;
  maxParticipants?: number;
  status: GiveawayStatus;
  isEntered?: boolean;
  onEnter?: (id: string) => void;
}

export function GiveawayCard({
  id,
  title,
  prize,
  endTime,
  participants,
  maxParticipants = 100,
  status,
  isEntered = false,
  onEnter,
}: GiveawayCardProps) {
  const participationPercentage = Math.min(100, Math.floor((participants / maxParticipants) * 100));
  
  return (
    <div className="overflow-hidden rounded-lg glass-card">
      <div className="h-3 bg-gradient-to-r from-primary to-secondary" />
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <StatusPill status={status} />
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Gift className="w-5 h-5 text-secondary" />
          <span className="text-lg font-semibold">{prize}</span>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{participants} participants</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{endTime}</span>
            </div>
          </div>
          
          <Progress value={participationPercentage} className="h-2" />
          
          <div className="text-xs text-right text-muted-foreground">
            {participants} / {maxParticipants} entries
          </div>
        </div>
        
        <div className="mt-4">
          {status === "active" && !isEntered && (
            <Button 
              className="w-full"
              onClick={() => onEnter && onEnter(id)}
            >
              Enter Giveaway
            </Button>
          )}
          
          {status === "active" && isEntered && (
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Entered
            </Button>
          )}
          
          {status === "completed" && (
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Giveaway Ended
            </Button>
          )}
          
          {status === "upcoming" && (
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: GiveawayStatus }) {
  if (status === "active") {
    return (
      <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
        Active
      </div>
    );
  } else if (status === "completed") {
    return (
      <div className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">
        Completed
      </div>
    );
  } else {
    return (
      <div className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
        Upcoming
      </div>
    );
  }
}