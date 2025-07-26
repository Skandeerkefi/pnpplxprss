import { Clock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type SlotCallStatus = "pending" | "accepted" | "rejected";

interface SlotCallProps {
	id: string;
	slotName: string;
	requester: string;
	betAmount: number;
	timestamp: string;
	status: SlotCallStatus;
	onAccept?: (id: string) => void;
	onReject?: (id: string) => void;
	isAdminView?: boolean;
}

export function SlotCallCard({
	id,
	slotName,
	requester,
	betAmount,
	timestamp,
	status,
	onAccept,
	onReject,
	isAdminView = false,
}: SlotCallProps) {
	return (
		<div className='flex flex-col p-4 rounded-lg glass-card'>
			<div className='flex items-start justify-between'>
				<h3 className='text-lg font-bold'>{slotName}</h3>
				<StatusBadge status={status} />
			</div>

			<div className='mt-2 text-sm text-muted-foreground'>
				Requested by: <span className='text-white'>{requester}</span>
			</div>

			<span className='text-secondary'>
				${betAmount ? betAmount.toLocaleString() : "0"}
			</span>

			<div className='flex items-center gap-1 mt-4 text-xs text-muted-foreground'>
				<Clock className='w-3 h-3' />
				{timestamp}
			</div>

			{isAdminView && status === "pending" && (
				<div className='flex gap-2 mt-4'>
					<button
						onClick={() => onAccept && onAccept(id)}
						className='flex items-center justify-center flex-1 gap-1 px-3 py-1 text-sm text-green-400 transition-colors rounded bg-green-600/20 hover:bg-green-600/30'
					>
						<Check className='w-4 h-4' /> Accept
					</button>
					<button
						onClick={() => onReject && onReject(id)}
						className='flex items-center justify-center flex-1 gap-1 px-3 py-1 text-sm text-red-400 transition-colors rounded bg-red-600/20 hover:bg-red-600/30'
					>
						<X className='w-4 h-4' /> Reject
					</button>
				</div>
			)}
		</div>
	);
}

function StatusBadge({ status }: { status: SlotCallStatus }) {
	if (status === "pending") {
		return (
			<Badge
				variant='outline'
				className='text-yellow-400 border-yellow-400 bg-yellow-500/20'
			>
				Pending
			</Badge>
		);
	} else if (status === "accepted") {
		return (
			<Badge
				variant='outline'
				className='text-green-400 border-green-400 bg-green-500/20'
			>
				Accepted
			</Badge>
		);
	} else {
		return (
			<Badge
				variant='outline'
				className='text-red-400 border-red-400 bg-red-500/20'
			>
				Rejected
			</Badge>
		);
	}
}
