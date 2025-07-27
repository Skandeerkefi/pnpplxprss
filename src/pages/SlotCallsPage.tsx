import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SlotCallCard } from "@/components/SlotCallCard";
import { useSlotCallStore } from "@/store/useSlotCallStore";
import { Dices, Plus, Search, Filter } from "lucide-react";
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

const EmptyState = ({
	searchQuery,
	filter,
}: {
	searchQuery: string;
	filter: FilterStatus;
}) => (
	<div className='py-12 text-center text-[#C33B52]'>
		<Dices className='w-16 h-16 mx-auto mb-4 text-[#38BDF8]' />
		<h2 className='mb-2 text-2xl font-bold text-[#EA8105]'>
			No Slot Calls Found
		</h2>
		<p>
			{searchQuery || filter !== "all"
				? "Try different filters or search terms."
				: "Be the first to request a slot!"}
		</p>
	</div>
);

const LoadingSkeleton = () => (
	<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
		{[...Array(3)].map((_, i) => (
			<div
				key={i}
				className='h-64 rounded-lg animate-pulse bg-gradient-to-r from-[#191F3B] to-[#38BDF8]/20'
			/>
		))}
	</div>
);

function SlotCallsPage() {
	const {
		slotCalls,
		addSlotCall,
		updateSlotStatus,
		fetchSlotCalls,
		isSubmitting,
	} = useSlotCallStore();

	const { user, token } = useAuthStore();
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState("");
	const [slotName, setSlotName] = useState("");
	const [betAmount, setBetAmount] = useState<number>(100);
	const [filter, setFilter] = useState<FilterStatus>("all");
	const [isLoading, setIsLoading] = useState(true);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const isAdmin = user?.role === "admin";

	useEffect(() => {
		if (token) {
			const loadData = async () => {
				try {
					await fetchSlotCalls();
				} catch {
					toast({
						title: "Error",
						description: "Failed to fetch slot calls",
						variant: "destructive",
					});
				} finally {
					setIsLoading(false);
				}
			};
			loadData();
		} else {
			setIsLoading(false);
		}
	}, [token, fetchSlotCalls, toast]);

	const filteredSlotCalls = useMemo(() => {
		return slotCalls.filter((call) => {
			const slotNameLower = (call.slotName || "").toLowerCase();
			const requesterLower = (call.requester || "").toLowerCase();
			const queryLower = debouncedSearchQuery.toLowerCase();

			const matchesSearch =
				slotNameLower.includes(queryLower) ||
				requesterLower.includes(queryLower);

			if (filter === "all") return matchesSearch;
			return matchesSearch && call.status === filter;
		});
	}, [slotCalls, debouncedSearchQuery, filter]);

	const handleSubmit = async () => {
		if (!slotName || betAmount <= 0) {
			toast({
				title: "Error",
				description: "Please fill out all fields with valid data.",
				variant: "destructive",
			});
			return;
		}

		try {
			const result = await addSlotCall(slotName, betAmount);
			if (result.success) {
				toast({
					title: "Slot Call Submitted",
					description: "Your slot call has been submitted for review.",
				});
				setSlotName("");
				setBetAmount(100);
				await fetchSlotCalls();
			}
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Something went wrong.",
				variant: "destructive",
			});
		}
	};

	const handleAccept = async (id: string) => {
		const result = await updateSlotStatus(id, "accepted");
		if (result.success) {
			toast({ title: "Accepted", description: "Slot call accepted." });
			await fetchSlotCalls();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to accept slot call",
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

	return (
		<div className='flex flex-col min-h-screen bg-[#191F3B] text-white'>
			<Navbar />

			<main className='container flex-grow py-8'>
				<div className='flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between'>
					<div className='flex items-center gap-2'>
						<Dices className='w-6 h-6 text-[#38BDF8]' />
						<h1 className='text-3xl font-bold text-white'>Slot Calls</h1>
					</div>

					{!isAdmin && (
						<Dialog>
							<DialogTrigger asChild>
								<Button className='bg-[#EA8105] hover:bg-[#C33B52] text-white'>
									<Plus className='w-4 h-4 mr-1' /> Request Slot Call
								</Button>
							</DialogTrigger>
							<DialogContent className='bg-[#191F3B] text-white border border-[#EA8105]/40 rounded-lg'>
								<DialogHeader>
									<DialogTitle>Request a Slot Call</DialogTitle>
									<DialogDescription>
										Suggest a slot for pnpplxprss to play during stream.
									</DialogDescription>
								</DialogHeader>

								<div className='py-4 space-y-4'>
									<div className='space-y-2'>
										<label htmlFor='slotName' className='text-sm font-medium'>
											Slot Name
										</label>
										<Input
											id='slotName'
											placeholder='e.g. Gates of Olympus'
											value={slotName}
											onChange={(e) => setSlotName(e.target.value)}
											className='bg-[#191F3B] border border-[#EA8105] text-white placeholder:text-[#C33B52]'
										/>
									</div>
									<div className='space-y-2'>
										<label htmlFor='betAmount' className='text-sm font-medium'>
											Bet Amount ($)
										</label>
										<Input
											id='betAmount'
											type='number'
											min='50'
											step='50'
											placeholder='100'
											value={betAmount}
											onChange={(e) =>
												setBetAmount(parseInt(e.target.value) || 100)
											}
											className='bg-[#191F3B] border border-[#EA8105] text-white placeholder:text-[#C33B52]'
										/>
									</div>
								</div>

								<DialogFooter>
									<Button
										onClick={handleSubmit}
										disabled={isSubmitting}
										className='bg-[#EA8105] hover:bg-[#C33B52] text-white'
									>
										{isSubmitting ? "Submitting..." : "Submit Request"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</div>

				<div className='p-6 mb-8 rounded-lg glass-card bg-[#191F3B] border border-[#EA8105]/40'>
					<p className='mb-6 text-[#ffffff]'>
						{isAdmin
							? "Review and manage slot call requests submitted by users."
							: "Request pnpplxprss to play your favorite slots during his streams!"}
					</p>

					<div className='flex flex-col gap-4 md:flex-row'>
						<div className='relative flex-1'>
							<Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-[#C33B52]' />
							<Input
								placeholder='Search slot calls...'
								className='pl-9 bg-[#191F3B] border border-[#EA8105] text-white placeholder:text-[#C33B52]'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className='flex items-center gap-2'>
							<Filter className='w-4 h-4 text-[#C33B52]' />
							<Tabs
								defaultValue='all'
								onValueChange={(val) => setFilter(val as FilterStatus)}
								className='bg-[#191F3B] border border-[#EA8105] rounded-md'
							>
								<TabsList>
									<TabsTrigger
										value='all'
										className='text-[#EA8105] hover:bg-[#EA8105] hover:text-white'
									>
										All
									</TabsTrigger>
									<TabsTrigger
										value='pending'
										className='text-[#EA8105] hover:bg-[#EA8105] hover:text-white'
									>
										Pending
									</TabsTrigger>
									<TabsTrigger
										value='accepted'
										className='text-[#EA8105] hover:bg-[#EA8105] hover:text-white'
									>
										Accepted
									</TabsTrigger>
									<TabsTrigger
										value='rejected'
										className='text-[#EA8105] hover:bg-[#EA8105] hover:text-white'
									>
										Rejected
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</div>
				</div>

				{isLoading ? (
					<LoadingSkeleton />
				) : filteredSlotCalls.length > 0 ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{filteredSlotCalls.map((slotCall) => (
							<SlotCallCard
								key={slotCall.id}
								id={slotCall.id}
								slotName={slotCall.slotName}
								requester={slotCall.requester}
								betAmount={slotCall.betAmount}
								timestamp={slotCall.timestamp}
								status={slotCall.status}
								isAdminView={isAdmin}
								onAccept={
									isAdmin
										? () =>
												confirm("Accept this slot call?") &&
												handleAccept(slotCall.id)
										: undefined
								}
								onReject={
									isAdmin
										? () =>
												confirm("Reject this slot call?") &&
												handleReject(slotCall.id)
										: undefined
								}
							/>
						))}
					</div>
				) : (
					<EmptyState searchQuery={searchQuery} filter={filter} />
				)}
			</main>

			<Footer />
		</div>
	);
}

export default SlotCallsPage;
