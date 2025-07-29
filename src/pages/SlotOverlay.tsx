import { useEffect, useState, useRef } from "react";
import { useSlotCallStore } from "@/store/useSlotCallStore";

export default function SlotOverlay() {
	const { fetchSlotCalls, slotCalls } = useSlotCallStore();
	const [visibleCalls, setVisibleCalls] = useState<any[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const cycleInterval = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const fetchOverlayCalls = async () => {
			try {
				const res = await fetch(
					"https://pnpplxprssdata.onrender.com/api/slot-calls",
					{
						headers: {
							Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODdiMjlkNjgwYWE1MzZmOTdiYjI1NCIsInJvbGUiOiJhZG1pbiIsImtpY2tVc2VybmFtZSI6IlBucHBsWHByc3MiLCJpYXQiOjE3NTM3NTA1OTEsImV4cCI6MTc1NDM1NTM5MX0.X3_40SkuhaOEXZzC-YAFMrRCCs0PcwFmDDLYhx2Kaic`,
						},
					}
				);

				if (!res.ok) throw new Error("Failed to fetch slot calls");

				const data = await res.json();

				const accepted = data
					.filter((call: any) => call.status === "accepted")
					.map((call: any) => ({
						id: call._id,
						slotName: call.name,
						requester: call.user?.kickUsername || "Unknown",
						betAmount: call.betAmount ?? null,
						x250Hit: call.x250Hit ?? false,
						bonusCallName: call.bonusCallName ?? null,
					}));

				setVisibleCalls(accepted);
				setCurrentIndex(0);
			} catch (err) {
				console.error("Overlay fetch failed:", err);
			}
		};

		fetchOverlayCalls();
		const interval = setInterval(fetchOverlayCalls, 15000); // Refresh data every 15 sec
		return () => clearInterval(interval);
	}, []);

	// Cycle through calls every 5 seconds
	useEffect(() => {
		if (visibleCalls.length <= 1) return;

		cycleInterval.current && clearInterval(cycleInterval.current);
		cycleInterval.current = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % visibleCalls.length);
		}, 5000);

		return () => {
			cycleInterval.current && clearInterval(cycleInterval.current);
		};
	}, [visibleCalls]);

	const call = visibleCalls[currentIndex];

	if (!call) {
		return null; // Or a minimal placeholder while no calls
	}

	return (
		<div
			className='flex items-center justify-center w-screen h-screen bg-transparent'
			style={{ pointerEvents: "none" }}
		>
			<div
				key={call.id}
				className='max-w-md px-8 py-6 rounded-2xl bg-black bg-opacity-70 backdrop-blur-md shadow-2xl border-4 border-[#EA6D0C]'
				style={{ userSelect: "none" }}
			>
				<div className='text-3xl font-extrabold text-center text-white drop-shadow-lg'>
					🎰 <span className='text-[#38BDF8]'>@{call.requester}</span> called{" "}
					<span className='text-[#EA6D0C]'>{call.slotName}</span>
				</div>

				{call.betAmount !== null && (
					<div className='mt-3 text-center text-xl text-[#FFFFFFCC] font-semibold drop-shadow-md'>
						for{" "}
						<span className='text-[#AF2D03]'>
							${call.betAmount.toLocaleString()}
						</span>
					</div>
				)}

				{call.x250Hit && (
					<div className='mt-4 mx-auto w-max px-3 py-1 rounded-full bg-[#38BDF8] text-[#191F3B] font-bold text-sm shadow-lg select-none'>
						💥 250x HIT! 💥
					</div>
				)}

				{call.bonusCallName && (
					<div className='mt-3 text-center text-[#38BDF8] italic font-medium drop-shadow-md'>
						Bonus Call: <span className='font-bold'>{call.bonusCallName}</span>
					</div>
				)}
			</div>
		</div>
	);
}
