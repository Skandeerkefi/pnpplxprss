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

type FilterStatus = "all" | "pending" | "accepted" | "rejected";

function SlotCallsPage() {
	const {
		slotCalls,
		addSlotCall,
		updateSlotStatus,
		submitBonusCall,
		fetchSlotCalls,
		isSubmitting,
		deleteSlotCall,
		updatePlayedStatus,
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

	const handleAccept = async (id: string, newX250Value: boolean) => {
		const result = await updateSlotStatus(id, "accepted", newX250Value);
		if (result.success) {
			toast({ title: "Updated", description: "Slot status updated." });
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to update status.",
				variant: "destructive",
			});
		}
	};

	const handleReject = async (id: string) => {
		const result = await updateSlotStatus(id, "rejected");
		if (result.success) {
			toast({ title: "Updated", description: "Slot status updated." });
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to update status.",
				variant: "destructive",
			});
		}
	};

	const handleBonusSubmit = async (id: string, bonusSlot: string) => {
		if (!bonusSlot.trim()) {
			toast({
				title: "Error",
				description: "Bonus slot name cannot be empty.",
				variant: "destructive",
			});
			return;
		}

		const result = await submitBonusCall(id, bonusSlot);
		if (result.success) {
			toast({ title: "Submitted", description: "Bonus call submitted." });
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to submit bonus call.",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this slot call?")) return;

		const result = await deleteSlotCall(id);
		if (result.success) {
			toast({ title: "Deleted", description: "Slot call deleted." });
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to delete slot call.",
				variant: "destructive",
			});
		}
	};

	const handlePlayedToggle = async (id: string, played: boolean) => {
		const result = await updatePlayedStatus(id, played);
		if (result.success) {
			toast({
				title: "Updated",
				description: `Marked as ${played ? "played" : "not played"}`,
			});
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to update played status",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<Navbar />
			<main className='max-w-4xl p-4 mx-auto'>
				<h1 className='mb-4 text-3xl font-bold text-white'>Slot Calls</h1>

				{/* Submit New Slot Call */}
				{!isAdmin && (
					<div className='mb-6'>
						<Input
							placeholder='Enter slot name'
							value={slotName}
							onChange={(e) => setSlotName(e.target.value)}
							disabled={isSubmitting}
						/>
						<Button
							className='mt-2'
							onClick={handleSubmit}
							disabled={isSubmitting || !slotName.trim()}
						>
							{isSubmitting ? "Submitting..." : "Submit Slot Call"}
						</Button>
					</div>
				)}

				{/* Filters & Search */}
				<div className='flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between'>
					<Tabs
						value={filter}
						onValueChange={(value) => setFilter(value as FilterStatus)}
						className='w-full sm:w-auto'
					>
						<TabsList>
							<TabsTrigger value='all'>All</TabsTrigger>
							<TabsTrigger value='pending'>Pending</TabsTrigger>
							<TabsTrigger value='accepted'>Accepted</TabsTrigger>
							<TabsTrigger value='rejected'>Rejected</TabsTrigger>
						</TabsList>
					</Tabs>
					<Input
						placeholder='Search by slot or requester'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='max-w-sm'
						leftIcon={<Search />}
					/>
				</div>

				{/* Slot Calls List */}
				{isLoading ? (
					<div className='text-white'>Loading slot calls...</div>
				) : filteredSlotCalls.length === 0 ? (
					<div className='text-white'>No slot calls found.</div>
				) : (
					<div className='space-y-4'>
						{filteredSlotCalls.map((call) => (
							<SlotCallCard
								key={call.id}
								id={call.id}
								slotName={call.slotName}
								requester={call.requester}
								timestamp={call.timestamp}
								status={call.status}
								x250Hit={call.x250Hit}
								bonusCall={call.bonusCall}
								played={call.played}
								isAdminView={isAdmin}
								isUserView={!isAdmin}
								onAccept={handleAccept}
								onReject={handleReject}
								onBonusSubmit={handleBonusSubmit}
								onDelete={handleDelete}
								onPlayedToggle={handlePlayedToggle}
							/>
						))}
					</div>
				)}
			</main>
			<Footer />
		</>
	);
}

export default SlotCallsPage;
