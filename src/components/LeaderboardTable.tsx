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

type LeaderboardPeriod = "weekly" | "monthly";

interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardTableProps {
	period: LeaderboardPeriod;
	data: LeaderboardPlayer[];
}

// Define prize structure
const PRIZES = {
	weekly: {
		1: 50,
		2: 25,
		3: 10,
	},
	monthly: {
		1: 300,
		2: 200,
		3: 50,
	},
};

export function LeaderboardTable({ period, data }: LeaderboardTableProps) {
	return (
		<div className='overflow-hidden border rounded-lg border-white/10'>
			<Table>
				<TableHeader className='bg-primary/10'>
					<TableRow>
						<TableHead className='w-12 text-center'>Rank</TableHead>
						<TableHead>Player</TableHead>
						<TableHead className='text-right'>Wager</TableHead>
						<TableHead className='text-right'>Prize</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((player) => {
						const prize = PRIZES[period][player.rank as 1 | 2 | 3] || 0;
						return (
							<TableRow
								key={player.username}
								className={player.isFeatured ? "bg-primary/5" : ""}
							>
								<TableCell className='font-medium text-center'>
									{player.rank <= 3 ? (
										<div className='flex items-center justify-center'>
											<Crown
												className={`h-4 w-4 ${
													player.rank === 1
														? "text-yellow-400"
														: player.rank === 2
														? "text-gray-300"
														: "text-amber-600"
												}`}
											/>
										</div>
									) : (
										player.rank
									)}
								</TableCell>
								<TableCell className='flex items-center gap-2 font-medium'>
									{player.username}
									{player.isFeatured && (
										<Badge
											variant='outline'
											className='border-primary text-primary'
										>
											Streamer
										</Badge>
									)}
								</TableCell>
								<TableCell className='text-right'>
									${player.wager.toLocaleString()}
								</TableCell>
								<TableCell className='text-right'>
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
