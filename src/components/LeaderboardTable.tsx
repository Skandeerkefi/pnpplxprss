import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

type LeaderboardPeriod = "weekly" | "biweekly" | "monthly";

interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardTableProps {
	period: LeaderboardPeriod;
	data: LeaderboardPlayer[] | undefined;
}

// 💸 Prize mappings for all periods
const PRIZES: Record<LeaderboardPeriod, Record<number, number>> = {
	weekly: {
		1: 100,
		2: 50,
		3: 30,
		4: 20,
	},
	biweekly: {
		1: 210,
		2: 120,
		3: 90,
		4: 60,
		5:50,
		6:40,
		7:30,
	},
	monthly: {
		1: 225,
		2: 125,
		3: 75,
		4: 50,
		5:25,
	},
};

export function LeaderboardTable({ period, data }: LeaderboardTableProps) {
	if (!data || data.length === 0) {
		return (
			<div className='text-center py-10 text-[#F97316]'>
				No leaderboard data available for {period}.
			</div>
		);
	}

	return (
		<div className='overflow-hidden border rounded-xl border-[#EA6D0C]/30 bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] shadow-xl shadow-black/20'>
			<Table>
				<TableHeader className='bg-[#0D0D0D]/80 border-b border-[#EA6D0C]/20'>
					<TableRow>
						<TableHead className='w-12 text-center text-[#F97316] font-bold'>
							Rank
						</TableHead>
						<TableHead className='text-white/90 font-bold'>Player</TableHead>
						<TableHead className='text-right text-white/90 font-bold'>Wager</TableHead>
						<TableHead className='text-right text-[#F97316] font-bold'>Prize</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((player) => {
						const prize = PRIZES[period]?.[player.rank] || 0;

						return (
							<TableRow
								key={player.username}
								className={`border-b border-[#EA6D0C]/10 transition-colors duration-200 hover:bg-[#1A1A2E]/80 ${
									player.isFeatured ? "bg-[#F97316]/10" : ""
								}`}
							>
								<TableCell className='font-medium text-center text-[#F97316]'>
									{player.rank <= 3 ? (
										<div className='flex items-center justify-center'>
											<Crown
												className={`h-5 w-5 ${
													player.rank === 1
														? "text-[#F97316] drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
														: player.rank === 2
														? "text-white/80"
														: "text-[#EA6D0C]"
												}`}
											/>
										</div>
									) : (
										player.rank
									)}
								</TableCell>
								<TableCell className='flex items-center gap-2 font-medium text-white'>
									{player.username}
									{player.isFeatured && (
										<Badge
											variant='outline'
											className='border-[#F97316] text-[#F97316] bg-[#F97316]/10'
										>
											Streamer
										</Badge>
									)}
								</TableCell>
								<TableCell className='text-right text-white/80'>
									${player.wager.toLocaleString()}
								</TableCell>
								<TableCell className='text-right font-semibold text-[#F97316]'>
									{prize > 0 ? `$${prize}` : "-"}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
