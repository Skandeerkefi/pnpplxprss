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
		<div className='flex flex-col p-4 rounded-lg glass-card bg-[#191F3B] border border-[#EA8105]/40 text-white'>
			<div className='flex items-start justify-between'>
				<h3 className='text-lg font-bold text-[#fffffe]'>{slotName}</h3>
				<StatusBadge status={status} />
			</div>

			<div className='mt-2 text-sm text-[#EA8105]'>
				Requested by: <span className='text-[#ffffff]'>{requester}</span>
			</div>

			<span className='text-[#C33B52] mt-1'>
				${betAmount ? betAmount.toLocaleString() : "0"}
			</span>

			<div className='flex items-center gap-1 mt-4 text-xs text-[#ffffff]'>
				<Clock className='w-3 h-3' />
				{timestamp}
			</div>

			{isAdminView && status === "pending" && (
				<div className='flex gap-2 mt-4'>
					<button
						onClick={() => onAccept && onAccept(id)}
						className='flex items-center justify-center flex-1 gap-1 px-3 py-1 text-sm text-white transition-colors bg-green-600 rounded hover:bg-green-700'
					>
						<Check className='w-4 h-4' /> Accept
					</button>

					<button
						onClick={() => onReject && onReject(id)}
						className='flex items-center justify-center flex-1 gap-1 px-3 py-1 text-sm text-white transition-colors bg-red-600 rounded hover:bg-red-700'
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
				className='text-[#EA8105] border-[#EA8105] bg-[#EA8105]/20'
			>
				Pending
			</Badge>
		);
	} else if (status === "accepted") {
		return (
			<Badge
				variant='outline'
				className='text-[#38BDF8] border-[#38BDF8] bg-[#38BDF8]/20'
			>
				Accepted
			</Badge>
		);
	} else {
		return (
			<Badge
				variant='outline'
				className='text-[#C33B52] border-[#C33B52] bg-[#C33B52]/20'
			>
				Rejected
			</Badge>
		);
	}
}
