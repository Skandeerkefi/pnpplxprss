import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export type SlotCallStatus = "pending" | "accepted" | "rejected";

export interface SlotCall {
	id: string;
	slotName: string;
	requester: string;
	betAmount: number;
	timestamp: string;
	status: SlotCallStatus;
}

interface SlotCallState {
	slotCalls: SlotCall[];
	isSubmitting: boolean;
	addSlotCall: (
		slotName: string,
		betAmount: number
	) => Promise<{ success: boolean; error?: string }>;
	updateSlotStatus: (
		id: string,
		status: SlotCallStatus
	) => Promise<{ success: boolean; error?: string }>;
	fetchSlotCalls: () => Promise<void>;
}

export const useSlotCallStore = create<SlotCallState>((set, get) => ({
	slotCalls: [],
	isSubmitting: false,

	addSlotCall: async (slotName, betAmount) => {
		const token = useAuthStore.getState().token;
		if (!token) return { success: false, error: "Not authenticated" };

		set({ isSubmitting: true });
		try {
			const res = await fetch("http://localhost:3000/api/slot-calls", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name: slotName, betAmount }),
				credentials: "include",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Failed to add slot call");
			}

			const newCall = await res.json();

			set((state) => ({
				slotCalls: [
					{
						id: newCall._id,
						slotName: newCall.name,
						requester: useAuthStore.getState().user?.kickUsername || "You",
						betAmount: newCall.betAmount,
						timestamp: new Date(newCall.createdAt).toLocaleString(),
						status: newCall.status,
					},
					...state.slotCalls,
				],
				isSubmitting: false,
			}));

			return { success: true };
		} catch (error: any) {
			set({ isSubmitting: false });
			return { success: false, error: error.message };
		}
	},

	updateSlotStatus: async (id, status) => {
		const token = useAuthStore.getState().token;
		if (!token) return { success: false, error: "Not authenticated" };

		try {
			const res = await fetch(
				`http://localhost:3000/api/slot-calls/${id}/status`,
				{
					method: "POST", // Changed from PATCH to POST
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status }),
					credentials: "include",
				}
			);

			if (!res.ok) {
				const data = await res.json();
				throw new Error(
					data.message || `Failed to update slot call status to ${status}`
				);
			}

			const updated = (await res.json()).slotCall;

			set((state) => ({
				slotCalls: state.slotCalls.map((call) =>
					call.id === id
						? {
								...call,
								status: updated.status,
						  }
						: call
				),
			}));

			return { success: true };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	},

	fetchSlotCalls: async () => {
		const token = useAuthStore.getState().token;
		const userRole = useAuthStore.getState().user?.role;
		if (!token) return;

		const url =
			userRole === "admin"
				? "http://localhost:3000/api/slot-calls"
				: "http://localhost:3000/api/slot-calls/my";

		try {
			const res = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			});

			if (!res.ok) throw new Error("Failed to fetch slot calls");

			const data = await res.json();

			const mapped = data.map((item: any) => ({
				id: item._id,
				slotName: item.name,
				requester:
					item.user?.kickUsername ||
					useAuthStore.getState().user?.kickUsername ||
					"You",
				betAmount: item.betAmount,
				timestamp: new Date(item.createdAt).toLocaleString(),
				status: item.status,
			}));

			set({ slotCalls: mapped });
		} catch (error) {
			console.error("Error fetching slot calls:", error);
		}
	},
}));
