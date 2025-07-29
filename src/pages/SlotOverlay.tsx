// src/pages/SlotOverlay.tsx
import { useEffect, useState } from "react";
import { useSlotCallStore } from "@/store/useSlotCallStore";

export default function SlotOverlay() {
	const { fetchSlotCalls, slotCalls } = useSlotCallStore();
	const [visibleCalls, setVisibleCalls] = useState<any[]>([]);

	useEffect(() => {
		const fetchOverlayCalls = async () => {
			try {
				const res = await fetch(
					"https://pnpplxprssdata.onrender.com/api/slot-calls",
					{
						headers: {
							Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODdiMjlkNjgwYWE1MzZmOTdiYjI1NCIsInJvbGUiOiJhZG1pbiIsImtpY2tVc2VybmFtZSI6IlBucHBsWHByc3MiLCJpYXQiOjE3NTM3NTA1OTEsImV4cCI6MTc1NDM1NTM5MX0.X3_40SkuhaOEXZzC-YAFMrRCCs0PcwFmDDLYhx2Kaic
`, // 👈 inject admin token
						},
					}
				);
				const data = await res.json();
				const accepted = data
					.filter((call: any) => call.status === "accepted")
					.slice(0, 3)
					.map((call: any) => ({
						id: call._id,
						slotName: call.name,
						betAmount: call.betAmount,
						requester: call.user?.kickUsername || "Unknown",
					}));

				setVisibleCalls(accepted);
			} catch (err) {
				console.error("Overlay fetch failed:", err);
			}
		};

		fetchOverlayCalls();
		const interval = setInterval(fetchOverlayCalls, 5000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const accepted = slotCalls.filter((call) => call.status === "accepted");
		setVisibleCalls(accepted.slice(0, 3));
	}, [slotCalls]);

	return (
		<div
			className='flex flex-col items-center justify-end w-screen h-screen pb-10 space-y-4 overflow-hidden bg-transparent'
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
