import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SlotCallCard } from "@/components/SlotCallCard";
import { useSlotCallStore } from "@/store/useSlotCallStore";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useDebounce } from "@/hooks/use-debounce";

type FilterStatus = "all" | "pending" | "accepted" | "rejected" | "played";

function SlotCallsPage() {
	const {
		slotCalls,
		addSlotCall,
		updateSlotStatus,
		submitBonusCall,
		fetchSlotCalls,
		isSubmitting,
	} = useSlotCallStore();

	const { user, token } = useAuthStore();
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState("");
	const [slotName, setSlotName] = useState("");
	const [filter, setFilter] = useState<FilterStatus>("all");
	const [isLoading, setIsLoading] = useState(true);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const isAdmin = user?.role === "admin";

	useEffect(() => {
		if (token) {
			fetchSlotCalls().finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, [token]);

	const filteredSlotCalls = useMemo(() => {
		return slotCalls.filter((call) => {
			const query = debouncedSearchQuery.toLowerCase();
			const matchesSearch =
				call.slotName.toLowerCase().includes(query) ||
				call.requester.toLowerCase().includes(query);
			if (filter === "all") return matchesSearch;
			return matchesSearch && call.status === filter;
		});
	}, [slotCalls, debouncedSearchQuery, filter]);

	const handleSubmit = async () => {
		if (!slotName.trim()) {
			toast({
				title: "Error",
				description: "Slot name is required.",
				variant: "destructive",
			});
			return;
		}

		const result = await addSlotCall(slotName.trim());
		if (result.success) {
			toast({ title: "Submitted", description: "Slot call sent!" });
			setSlotName("");
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Something went wrong.",
				variant: "destructive",
			});
		}
	};

	const handleAccept = async (
		id: string,
		newX250Value: boolean,
		newStatus: "accepted" | "played" = "accepted"
	) => {
		const result = await updateSlotStatus(id, newStatus, newX250Value);
		if (result.success) {
			toast({
				title: "Updated",
				description: `Slot status set to ${newStatus}.`,
			});
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to update slot",
				variant: "destructive",
			});
		}
	};

	const handleReject = async (id: string) => {
		const result = await updateSlotStatus(id, "rejected");
		if (result.success) {
			toast({ title: "Rejected", description: "Slot call rejected." });
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to reject slot call",
				variant: "destructive",
			});
		}
	};

	const handleBonusSubmit = async (id: string, slotName: string) => {
		const result = await submitBonusCall(id, slotName);
		if (result.success) {
			toast({
				title: "Bonus Call Submitted",
				description: "Your $20 bonus call has been recorded.",
			});
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to submit bonus call",
				variant: "destructive",
			});
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-[#191F3B] text-white'>
			<Navbar />
			<main className='container flex-grow py-8'>
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-3xl font-bold text-white'>Slot Calls</h1>
					{!isAdmin && (
						<Dialog>
							<DialogTrigger asChild>
								<Button className='bg-[#EA8105] hover:bg-[#C33B52] text-white'>
									<Plus className='w-4 h-4 mr-1' /> Request Slot
								</Button>
							</DialogTrigger>
							<DialogContent className='bg-[#191F3B] text-white border border-[#EA6D0C]/40 rounded-lg'>
								<DialogHeader>
									<DialogTitle>Request a Slot</DialogTitle>
									<DialogDescription>
										Ask pnpplxprss to play a slot live on stream.
									</DialogDescription>
								</DialogHeader>
								<div className='py-4'>
									<label htmlFor='slotName' className='block mb-2 text-sm'>
										Slot Name
									</label>
									<Input
										id='slotName'
										placeholder='e.g. Wanted Dead or a Wild'
										value={slotName}
										onChange={(e) => setSlotName(e.target.value)}
										className='bg-[#191F3B] border border-[#EA6D0C] text-white'
									/>
								</div>
								<DialogFooter>
									<Button
										onClick={handleSubmit}
										disabled={isSubmitting}
										className='bg-[#EA8105] hover:bg-[#C33B52]'
									>
										{isSubmitting ? "Submitting..." : "Submit"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</div>

				<div className='flex flex-col items-center gap-4 mb-4 md:flex-row'>
					<div className='relative w-full md:w-1/2'>
						<Search className='absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-[#C33B52]' />
						<Input
							placeholder='Search slot calls...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-9 bg-[#191F3B] border border-[#EA6D0C] text-white'
						/>
					</div>
					<div className='flex items-center gap-2'>
						<Filter className='w-4 h-4 text-[#C33B52]' />
						<Tabs onValueChange={(val) => setFilter(val as FilterStatus)}>
							<TabsList>
								{["all", "pending", "accepted", "rejected", "played"].map(
									(f) => (
										<TabsTrigger
											key={f}
											value={f}
											className='text-[#EA6D0C] hover:bg-[#EA6D0C] hover:text-white'
										>
											{f.charAt(0).toUpperCase() + f.slice(1)}
										</TabsTrigger>
									)
								)}
							</TabsList>
						</Tabs>
					</div>
				</div>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
					{!isLoading &&
						filteredSlotCalls.map((call) => (
							<SlotCallCard
								key={call.id}
								id={call.id}
								slotName={call.slotName}
								requester={call.requester}
								timestamp={call.timestamp}
								status={call.status}
								x250Hit={call.x250Hit}
								bonusCall={call.bonusCall}
								isAdminView={isAdmin}
								isUserView={!isAdmin}
								onAccept={handleAccept}
								onReject={handleReject}
								onBonusSubmit={handleBonusSubmit}
							/>
						))}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default SlotCallsPage;
