// src/pages/SlotOverlay.tsx
import { useEffect, useState } from "react";
import { useSlotCallStore } from "@/store/useSlotCallStore";

export default function SlotOverlay() {
	const { fetchSlotCalls, slotCalls } = useSlotCallStore();
	const [visibleCalls, setVisibleCalls] = useState<any[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			fetchSlotCalls();
		}, 5000); // fetch every 5 seconds
		fetchSlotCalls();
		return () => clearInterval(interval);
	}, [fetchSlotCalls]);

	useEffect(() => {
		const accepted = slotCalls.filter((call) => call.status === "accepted");
		setVisibleCalls(accepted.slice(0, 3));
	}, [slotCalls]);

	return (
		<div
			className='w-screen h-screen overflow-hidden bg-transparent flex flex-col items-center justify-end pb-10 space-y-4'
			style={{ pointerEvents: "none" }}
		>
			{visibleCalls.map((call) => (
				<div
					key={call.id}
					className='px-6 py-3 text-lg font-bold text-white bg-[#AF2D03]/90 rounded-xl animate-slide-up shadow-xl backdrop-blur'
				>
					🎰 @{call.requester} called{" "}
					<span className='text-[#EA6D0C]'>{call.slotName}</span> for $
					{call.betAmount}
				</div>
			))}
		</div>
	);
}
