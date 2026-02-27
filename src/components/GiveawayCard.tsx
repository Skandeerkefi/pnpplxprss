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
	const participationPercentage = Math.min(
		100,
		Math.floor((participants / maxParticipants) * 100)
	);

	return (
		<div className='overflow-hidden rounded-xl border border-[#EA6D0C]/30 bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D]'>
			<div className='h-3 bg-gradient-to-r from-[#AF2D03] via-[#EA6D0C] to-[#F97316]' />

			<div className='p-5 text-white'>
				<div className='flex items-start justify-between'>
					<h3 className='text-lg font-bold text-[#F97316]'>{title}</h3>
					<StatusPill status={status} />
				</div>

				<div className='flex items-center gap-2 mt-4'>
					<Gift className='w-5 h-5 text-[#F97316]' />
					<span className='text-lg font-semibold'>{prize}</span>
				</div>

				<div className='mt-4 space-y-3'>
					<div className='flex justify-between text-sm text-white/70'>
						<div className='flex items-center gap-1.5'>
							<Users className='w-4 h-4' />
							<span>{participants} participants</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<Clock className='w-4 h-4' />
							<span>{endTime}</span>
						</div>
					</div>

					<Progress
						value={participationPercentage}
						className='h-2'
						color='#F97316'
					/>

					<div className='text-xs text-right text-white/60'>
						{participants} / {maxParticipants} entries
					</div>
				</div>

				<div className='mt-4'>
					{status === "active" && !isEntered && (
						<Button
							className='w-full bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold shadow-md shadow-[#EA6D0C]/25 transition-all duration-300'
							onClick={() => onEnter && onEnter(id)}
						>
							Enter Giveaway
						</Button>
					)}

					{status === "active" && isEntered && (
						<Button
							variant='outline'
							className='w-full border-[#22C55E]/50 text-[#22C55E] bg-[#22C55E]/10'
							disabled
						>
							Entered
						</Button>
					)}

					{status === "completed" && (
						<Button
							variant='outline'
							className='w-full border-white/30 text-white/60'
							disabled
						>
							Giveaway Ended
						</Button>
					)}

					{status === "upcoming" && (
						<Button
							variant='outline'
							className='w-full border-[#F97316]/50 text-[#F97316]'
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
			<div className='px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-xs border border-[#22C55E]/50'>
				Active
			</div>
		);
	} else if (status === "completed") {
		return (
			<div className='px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs border border-white/30'>
				Completed
			</div>
		);
	} else {
		return (
			<div className='px-2 py-0.5 rounded-full bg-[#F97316]/20 text-[#F97316] text-xs border border-[#F97316]/50'>
				Upcoming
			</div>
		);
	}
}
