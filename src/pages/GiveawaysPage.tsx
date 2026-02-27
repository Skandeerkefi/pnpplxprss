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
	const {
		giveaways,
		fetchGiveaways,
		enterGiveaway,
		createGiveaway,
		drawWinner,
	} = useGiveawayStore();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<
		"all" | "active" | "completed" | "upcoming"
	>("all");
	const [newTitle, setNewTitle] = useState("");
	const [newEndTime, setNewEndTime] = useState("");

	useEffect(() => {
		fetchGiveaways();
	}, []);

	const filteredGiveaways = giveaways
		.filter((giveaway) => {
			const matchesSearch = giveaway.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesStatus = filter === "all" || giveaway.status === filter;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			// 🟧 Sort Active → Upcoming → Completed
			const order = { active: 1, upcoming: 2, completed: 3 };
			return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
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
		<div className='flex flex-col min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] text-white'>
			<Navbar />

			<main className='container flex-grow py-8'>
				<div className='flex items-center gap-3 mb-8'>
					<Gift className='w-8 h-8 text-[#F97316]' />
					<h1 className='text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>Giveaways</h1>
				</div>

				<div className='p-6 mb-8 rounded-xl bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] border border-[#EA6D0C]/30 shadow-xl'>
					<p className='mb-6 text-white/80'>
						Join pnppl&apos;s exciting giveaways for a chance to win real
						prizes! New opportunities every week.
					</p>

					{user?.role === "admin" && (
						<div className='mb-6'>
							<h2 className='mb-2 font-semibold text-[#F97316]'>
								Create New Giveaway
							</h2>
							<Input
								placeholder='Title'
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								className='mb-2 bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316]'
							/>
							<Input
								type='datetime-local'
								value={newEndTime}
								onChange={(e) => setNewEndTime(e.target.value)}
								className='mb-2 bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316]'
							/>
							<Button
								onClick={handleCreateGiveaway}
								className='bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold shadow-md shadow-[#EA6D0C]/25 transition-all duration-300'
							>
								Create Giveaway
							</Button>
						</div>
					)}

					<div className='flex flex-col gap-4 md:flex-row'>
						<div className='relative flex-1'>
							<Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-[#F97316]' />
							<Input
								placeholder='Search giveaways...'
								className='pl-9 bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316]'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className='flex items-center gap-2'>
							<Filter className='w-4 h-4 text-[#F97316]' />
							<Tabs
								defaultValue='all'
								onValueChange={(val) => setFilter(val as any)}
								className='bg-[#1A1A2E] border border-[#EA6D0C]/30 rounded-lg'
							>
								<TabsList className='flex space-x-2 bg-transparent'>
									{["all", "active", "upcoming", "completed"].map((val) => (
										<TabsTrigger
											key={val}
											value={val}
											className='text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#AF2D03] data-[state=active]:to-[#EA6D0C] data-[state=active]:text-white hover:text-[#F97316] px-4 py-1.5 rounded-lg transition-all duration-300'
										>
											{val.charAt(0).toUpperCase() + val.slice(1)}
										</TabsTrigger>
									))}
								</TabsList>
							</Tabs>
						</div>
					</div>
				</div>

				{filteredGiveaways.length > 0 ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{filteredGiveaways.map((giveaway) => (
							<div
								key={giveaway._id}
								className='p-4 rounded-xl bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] border border-[#EA6D0C]/30 shadow-xl hover:shadow-2xl hover:shadow-[#EA6D0C]/10 transition-all duration-300 hover:border-[#EA6D0C]/50'
							>
								<GiveawayCard
									id={giveaway._id}
									title={giveaway.title}
									prize='Surprise Prize'
									endTime={new Date(giveaway.endTime).toLocaleString()}
									participants={giveaway.totalParticipants}
									maxParticipants={100}
									status={giveaway.status}
									isEntered={giveaway.isEntered}
									onEnter={handleEnter}
								/>
								{giveaway.winner && (
									<p className='mt-2 text-sm text-[#F97316]'>
										🎉 Winner: <strong>{giveaway.winner.kickUsername}</strong>
									</p>
								)}
								{user?.role === "admin" &&
									giveaway.status === "active" &&
									giveaway.totalParticipants > 0 && (
										<Button
											onClick={() => handleDrawWinner(giveaway._id)}
											variant='destructive'
											className='w-full mt-2 bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold'
										>
											Draw Winner
										</Button>
									)}
							</div>
						))}
					</div>
				) : (
					<div className='py-12 text-center'>
						<Gift className='w-16 h-16 mx-auto mb-4 text-[#F97316]' />
						<h2 className='mb-2 text-2xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>
							No Giveaways Found
						</h2>
						<p className='text-white/70'>
							{searchQuery || filter !== "all"
								? "No giveaways match your filters."
								: "Check back soon for exciting giveaways!"}
						</p>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}

export default GiveawaysPage;
