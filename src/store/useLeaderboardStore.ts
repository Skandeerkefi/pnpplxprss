import { create } from "zustand";

export type LeaderboardPeriod = "weekly" | "monthly";

export interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;

	isFeatured?: boolean;
}

interface LeaderboardState {
	weeklyLeaderboard: LeaderboardPlayer[];
	monthlyLeaderboard: LeaderboardPlayer[];
	period: LeaderboardPeriod;
	isLoading: boolean;
	error: string | null;
	setPeriod: (period: LeaderboardPeriod) => void;
	fetchLeaderboard: (period: LeaderboardPeriod) => Promise<void>;
}

// const API_URL = "https://mokingdata.onrender.com/api/affiliates";
const API_URL = "http://localhost:3000/api/affiliates";

const getDateRange = (
	period: LeaderboardPeriod
): { start_at: string; end_at: string } => {
	const now = new Date();
	const endDate = new Date(now);
	endDate.setHours(23, 59, 59, 999); // End of day

	if (period === "weekly") {
		const startDate = new Date(now);
		startDate.setDate(now.getDate() - 7); // 7 days ago
		startDate.setHours(0, 0, 0, 0); // Start of day

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: endDate.toISOString().split("T")[0],
		};
	} else {
		// Monthly
		const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		startDate.setHours(0, 0, 0, 0); // Start of day

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: endDate.toISOString().split("T")[0],
		};
	}
};

const processApiData = (data: any): LeaderboardPlayer[] => {
	// Check if we have the affiliates array in the response
	if (!data?.affiliates || !Array.isArray(data.affiliates)) {
		console.error("Invalid API response structure - missing affiliates array");
		return [];
	}

	return data.affiliates
		.filter((item: any) => item && item.username) // Filter out invalid items
		.map((item: any, index: number) => ({
			rank: index + 1,
			username: item.username,
			wager: parseFloat(item.wagered_amount) || 0,
			profit: 0, // The API response doesn't show profit, set to 0 or adjust if needed
			isFeatured: item.username.toLowerCase().includes("5moking"),
		}))
		.sort((a: any, b: any) => b.wager - a.wager) // Sort by wager descending
		.map((player: any, idx: number) => ({
			...player,
			rank: idx + 1, // Re-rank after sorting
		}));
};

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
	weeklyLeaderboard: [],
	monthlyLeaderboard: [],
	period: "weekly",
	isLoading: false,
	error: null,
	setPeriod: (period) => set({ period }),
	fetchLeaderboard: async (period) => {
		set({ isLoading: true, error: null });

		try {
			const { start_at, end_at } = getDateRange(period);

			const response = await fetch(
				`${API_URL}?start_at=${start_at}&end_at=${end_at}`
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						errorData?.error ||
						`API request failed with status ${response.status}`
				);
			}

			const data = await response.json();
			console.log("API Response:", data); // For debugging

			const processedData = processApiData(data);

			if (period === "weekly") {
				set({ weeklyLeaderboard: processedData });
			} else {
				set({ monthlyLeaderboard: processedData });
			}
		} catch (error) {
			console.error("Failed to fetch leaderboard:", error);
			set({
				error: error instanceof Error ? error.message : "Unknown error",
				weeklyLeaderboard: period === "weekly" ? [] : get().weeklyLeaderboard,
				monthlyLeaderboard:
					period === "monthly" ? [] : get().monthlyLeaderboard,
			});
		} finally {
			set({ isLoading: false });
		}
	},
}));
