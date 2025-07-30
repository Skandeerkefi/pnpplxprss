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

	const handleDelete = async (id: string) => {
		const result = await deleteSlotCall(id);
		if (result.success) {
			toast({
				title: "Deleted",
				description: "Slot call deleted successfully.",
			});
			// fetchSlotCalls already called inside deleteSlotCall
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to delete slot call",
				variant: "destructive",
			});
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-[#191F3B] text-white'>
			<Navbar />
			<main className='container flex-grow py-8'>
				<div className='flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between'>
					<h1 className='text-3xl font-bold'>Slot Calls</h1>

					<Dialog>
						<DialogTrigger asChild>
							<Button variant='outline' className='flex items-center gap-2'>
								<Plus className='w-5 h-5' />
								New Slot Call
							</Button>
						</DialogTrigger>

						<DialogContent className='sm:max-w-lg'>
							<DialogHeader>
								<DialogTitle>Submit a New Slot Call</DialogTitle>
								<DialogDescription>
									Enter the name of the slot machine you want to call.
								</DialogDescription>
							</DialogHeader>
							<Input
								autoFocus
								type='text'
								value={slotName}
								onChange={(e) => setSlotName(e.target.value)}
								placeholder='Slot Name'
								className='mt-4'
							/>
							<DialogFooter>
								<Button onClick={handleSubmit} disabled={isSubmitting}>
									Submit
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				<div className='flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between'>
					<Input
						placeholder='Search slot calls...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='max-w-xs'
					/>

					<Tabs
						value={filter}
						onValueChange={(value) => setFilter(value as FilterStatus)}
						className='max-w-xs'
					>
						<TabsList>
							<TabsTrigger value='all'>All</TabsTrigger>
							<TabsTrigger value='pending'>Pending</TabsTrigger>
							<TabsTrigger value='accepted'>Accepted</TabsTrigger>
							<TabsTrigger value='rejected'>Rejected</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{isLoading && <p>Loading slot calls...</p>}

				{!isLoading && filteredSlotCalls.length === 0 && (
					<p>No slot calls found.</p>
				)}

				<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
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
							isAdminView={isAdmin}
							isUserView={!isAdmin}
							onAccept={handleAccept}
							onReject={handleReject}
							onBonusSubmit={handleBonusSubmit}
							onDelete={handleDelete}
						/>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default SlotCallsPage;
