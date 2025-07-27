import { create } from "zustand";

export type LeaderboardPeriod = "weekly" | "biweekly" | "monthly";

export interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardState {
	weeklyLeaderboard: LeaderboardPlayer[];
	biweeklyLeaderboard: LeaderboardPlayer[];
	monthlyLeaderboard: LeaderboardPlayer[];
	period: LeaderboardPeriod;
	isLoading: boolean;
	error: string | null;
	setPeriod: (period: LeaderboardPeriod) => void;
	fetchLeaderboard: (period: LeaderboardPeriod) => Promise<void>;
}

const API_URL = "http://localhost:3000/api/affiliates";

const getDateRange = (
	period: LeaderboardPeriod
): { start_at: string; end_at: string } => {
	const now = new Date();
	const endDate = new Date(now);
	endDate.setHours(23, 59, 59, 999);

	const startDate = new Date(now);

	if (period === "weekly") {
		startDate.setDate(now.getDate() - 7);
	} else if (period === "biweekly") {
		startDate.setDate(now.getDate() - 14);
	} else {
		startDate.setFullYear(now.getFullYear(), now.getMonth(), 1);
	}

	startDate.setHours(0, 0, 0, 0);

	return {
		start_at: startDate.toISOString().split("T")[0],
		end_at: endDate.toISOString().split("T")[0],
	};
};

const processApiData = (data: any): LeaderboardPlayer[] => {
	if (!data?.affiliates || !Array.isArray(data.affiliates)) {
		console.error("Invalid API response structure - missing affiliates array");
		return [];
	}

	return data.affiliates
		.filter((item: any) => item && item.username)
		.map((item: any, index: number) => ({
			rank: index + 1,
			username: item.username,
			wager: parseFloat(item.wagered_amount) || 0,
			isFeatured: item.username.toLowerCase().includes("5moking"),
		}))
		.sort((a, b) => b.wager - a.wager)
		.map((player, idx) => ({ ...player, rank: idx + 1 }));
};

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
	weeklyLeaderboard: [],
	biweeklyLeaderboard: [],
	monthlyLeaderboard: [],
	period: "biweekly",
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
			console.log("API Response:", data);
			const processedData = processApiData(data);

			// ✅ Set the correct leaderboard
			if (period === "weekly") {
				set({ weeklyLeaderboard: processedData });
			} else if (period === "biweekly") {
				set({ biweeklyLeaderboard: processedData });
			} else if (period === "monthly") {
				set({ monthlyLeaderboard: processedData });
			}
		} catch (error) {
			console.error("Failed to fetch leaderboard:", error);
			set({
				error: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			set({ isLoading: false });
		}
	},
}));
