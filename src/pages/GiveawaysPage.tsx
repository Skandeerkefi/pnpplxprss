import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GiveawayCard } from "@/components/GiveawayCard";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Gift, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function GiveawaysPage() {
  const { giveaways, fetchGiveaways, enterGiveaway, createGiveaway, drawWinner } = useGiveawayStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "upcoming">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const filteredGiveaways = giveaways.filter((giveaway) => {
    const matchesSearch = giveaway.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter === "all" || giveaway.status === filter;
    return matchesSearch && matchesStatus;
  });

  const handleEnter = async (id: string) => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to enter the giveaway.",
        variant: "destructive",
      });
      return;
    }
    await enterGiveaway(id, toast);
  };

  const handleCreateGiveaway = async () => {
    if (!newTitle || !newEndTime) {
      toast({
        title: "Missing fields",
        description: "Please provide both title and end time.",
        variant: "destructive",
      });
      return;
    }
    await createGiveaway(newTitle, newEndTime, toast);
    setNewTitle("");
    setNewEndTime("");
  };

  const handleDrawWinner = async (id: string) => {
    await drawWinner(id, toast);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="container flex-grow py-8">
        <div className="flex items-center gap-2 mb-8">
          <Gift className="w-6 h-6 text-secondary" />
          <h1 className="text-3xl font-bold">Giveaways</h1>
        </div>

        <div className="p-6 mb-8 rounded-lg glass-card">
          <p className="mb-6">
            Join 5MOKING's exciting giveaways for a chance to win real prizes! New opportunities every week.
          </p>

          {user?.role === "admin" && (
            <div className="mb-6">
              <h2 className="mb-2 font-semibold">Create New Giveaway</h2>
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mb-2"
              />
              <Input
                type="datetime-local"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleCreateGiveaway}>Create Giveaway</Button>
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Search giveaways..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Tabs defaultValue="all" onValueChange={(val) => setFilter(val as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {filteredGiveaways.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredGiveaways.map((giveaway) => (
              <div key={giveaway._id} className="p-4 rounded-lg shadow-md glass-card">
                <GiveawayCard
                  id={giveaway._id}
                  title={giveaway.title}
                  prize={"Surprise Prize"}
                  endTime={new Date(giveaway.endTime).toLocaleString()}
                  participants={giveaway.totalParticipants}
                  maxParticipants={100}
                  status={giveaway.status}
                  isEntered={giveaway.isEntered}
                  onEnter={handleEnter}
                />
                {giveaway.winner && (
                  <p className="mt-2 text-sm">
                    🎉 Winner: <strong>{giveaway.winner.kickUsername}</strong>
                  </p>
                )}
                {user?.role === "admin" && giveaway.status === "active" && giveaway.totalParticipants > 0 && (
                  <Button onClick={() => handleDrawWinner(giveaway._id)} variant="destructive" className="w-full mt-2">
                    Draw Winner
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">No Giveaways Found</h2>
            <p className="text-muted-foreground">
              {searchQuery || filter !== "all" ? "No giveaways match your filters." : "Check back soon for exciting giveaways!"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default GiveawaysPage;
