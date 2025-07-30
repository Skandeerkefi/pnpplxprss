import { useState } from "react";
import { Clock, Check, X, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type SlotCallStatus = "pending" | "accepted" | "rejected" | "played";

interface SlotCallProps {
	id: string;
	slotName: string;
	requester: string;
	timestamp: string;
	status: SlotCallStatus;
	x250Hit?: boolean;
	bonusCall?: { name: string; createdAt: string };
	onAccept?: (id: string, x250Hit: boolean, newStatus?: SlotCallStatus) => void;
	onReject?: (id: string) => void;
	isAdminView?: boolean;
	isUserView?: boolean;
	onBonusSubmit?: (id: string, bonusSlot: string) => void;
}

export function SlotCallCard({
	id,
	slotName,
	requester,
	timestamp,
	status,
	x250Hit,
	bonusCall,
	onAccept,
	onReject,
	isAdminView = false,
	isUserView = false,
	onBonusSubmit,
}: SlotCallProps) {
	const [x250Checked, setX250Checked] = useState(false);
	const [bonusInput, setBonusInput] = useState("");

	const showBonusInput = isUserView && x250Hit && !bonusCall;

	return (
		<div className='flex flex-col p-4 rounded-lg glass-card bg-[#191F3B] border border-[#EA6D0C]/40 text-white'>
			<div className='flex items-start justify-between'>
				<h3 className='text-lg font-bold text-white'>{slotName}</h3>
				<StatusBadge status={status} />
			</div>

			<div className='mt-2 text-sm text-[#EA6D0C]'>
				Requested by: <span className='text-white'>{requester}</span>
			</div>

			<div className='flex items-center gap-1 mt-4 text-xs text-white'>
				<Clock className='w-3 h-3' />
				{timestamp}
			</div>

			{/* Admin Controls */}
			{isAdminView && status === "accepted" && (
				<button
					onClick={() => onAccept?.(id, x250Hit || false, "played")}
					className='w-full py-1 mt-2 text-sm text-white bg-blue-700 rounded hover:bg-blue-800'
				>
					Mark as Played
				</button>
			)}

			{/* Bonus Call Submitted */}
			{bonusCall && (
				<div className='mt-4 text-sm text-[#38BDF8]'>
					<Gift className='inline w-4 h-4 mr-1' />
					Bonus Call:{" "}
					<span className='font-semibold text-white'>{bonusCall.name}</span>
				</div>
			)}

			{/* Bonus Call Submission */}
			{showBonusInput && (
				<div className='mt-4 space-y-2'>
					<label htmlFor={`bonus-${id}`} className='text-sm text-[#EA6D0C]'>
						🎁 20$ Bonus Call Slot Name
					</label>
					<input
						id={`bonus-${id}`}
						type='text'
						placeholder='e.g. Sugar Rush'
						value={bonusInput}
						onChange={(e) => setBonusInput(e.target.value)}
						className='w-full px-3 py-1 bg-[#191F3B] border border-[#EA6D0C] text-white rounded'
					/>
					<button
						onClick={() =>
							bonusInput.trim() && onBonusSubmit?.(id, bonusInput.trim())
						}
						className='w-full py-1 mt-1 bg-[#AF2D03] hover:bg-[#C33B52] text-white rounded'
					>
						Submit Bonus Call
					</button>
				</div>
			)}
		</div>
	);
}

function StatusBadge({ status }: { status: SlotCallStatus }) {
	const baseClass =
		"text-xs px-2 py-0.5 rounded-full border font-medium inline-block";

	if (status === "pending") {
		return (
			<span
				className={`${baseClass} text-[#EA8105] border-[#EA8105] bg-[#EA8105]/20`}
			>
				Pending
			</span>
		);
	}
	if (status === "accepted") {
		return (
			<span
				className={`${baseClass} text-[#38BDF8] border-[#38BDF8] bg-[#38BDF8]/20`}
			>
				Accepted
			</span>
		);
	}
	if (status === "played") {
		return (
			<span
				className={`${baseClass} text-[#00FF99] border-[#00FF99] bg-[#00FF99]/20`}
			>
				Played
			</span>
		);
	}
	return (
		<span
			className={`${baseClass} text-[#C33B52] border-[#C33B52] bg-[#C33B52]/20`}
		>
			Rejected
		</span>
	);
}
