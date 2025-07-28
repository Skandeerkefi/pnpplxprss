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
		1: 100,
		2: 50,
		3: 30,
		4: 20,
	},
	monthly: {
		1: 100,
		2: 50,
		3: 30,
		4: 20,
	},
};

export function LeaderboardTable({ period, data }: LeaderboardTableProps) {
	if (!data || data.length === 0) {
		return (
			<div className='text-center py-10 text-[#C33B52]'>
				No leaderboard data available for {period}.
			</div>
		);
	}

	return (
		<div className='overflow-hidden border rounded-lg border-[#FFFFFF]/30'>
			<Table>
				<TableHeader className='bg-[#191F3B]/90'>
					<TableRow>
						<TableHead className='w-12 text-center text-[#EA8105]'>
							Rank
						</TableHead>
						<TableHead className='text-[#FFFFFF]'>Player</TableHead>
						<TableHead className='text-right text-[#FFFFFF]'>Wager</TableHead>
						<TableHead className='text-right text-[#38BDF8]'>Prize</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((player) => {
						const prize = PRIZES[period]?.[player.rank] || 0;

						return (
							<TableRow
								key={player.username}
								className={player.isFeatured ? "bg-[#C33B52]/10" : ""}
							>
								<TableCell className='font-medium text-center text-[#EA8105]'>
									{player.rank <= 3 ? (
										<div className='flex items-center justify-center'>
											<Crown
												className={`h-4 w-4 ${
													player.rank === 1
														? "text-[#EA8105]"
														: player.rank === 2
														? "text-[#FFFFFF]/80"
														: "text-[#C33B52]"
												}`}
											/>
										</div>
									) : (
										player.rank
									)}
								</TableCell>
								<TableCell className='flex items-center gap-2 font-medium text-[#FFFFFF]'>
									{player.username}
									{player.isFeatured && (
										<Badge
											variant='outline'
											className='border-[#C33B52] text-[#C33B52]'
										>
											Streamer
										</Badge>
									)}
								</TableCell>
								<TableCell className='text-right text-[#FFFFFF]'>
									${player.wager.toLocaleString()}
								</TableCell>
								<TableCell className='text-right text-[#AF2D03]'>
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
