import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Info, Loader2, Trophy, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

function LeaderboardPage() {
	const {
		weeklyLeaderboard,
		monthlyLeaderboard,
		period,
		setPeriod,
		fetchLeaderboard,
		isLoading,
		error,
	} = useLeaderboardStore();

	useEffect(() => {
		fetchLeaderboard(period);
	}, [period]);

	const handleTabChange = (value: string) => {
		setPeriod(value as LeaderboardPeriod);
	};

	const currentData =
		period === "weekly" ? weeklyLeaderboard : monthlyLeaderboard;

	return (
		<div className='flex flex-col min-h-screen bg-background'>
			<Navbar />

			<main className='container flex-grow py-8'>
				<div className='flex items-center justify-between mb-8'>
					<div className='flex items-center gap-2'>
						<Crown className='w-6 h-6 text-secondary' />
						<h1 className='text-3xl font-bold'>Rainbet Leaderboard</h1>
					</div>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className='flex items-center gap-1 text-sm text-muted-foreground hover:text-white cursor-help'>
									<Info className='w-4 h-4' />
									<span>How It Works</span>
								</div>
							</TooltipTrigger>
							<TooltipContent className='max-w-xs'>
								<p>
									The leaderboard ranks players based on their total wager
									amount using the 5MOKING affiliate code on Rainbet. Higher
									wagers result in a better ranking.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<div className='p-6 mb-8 rounded-lg glass-card'>
					<p className='mb-4'>
						Use affiliate code{" "}
						<span className='font-semibold text-primary'>5MOKING</span> on
						<a
							href='https://rainbet.com'
							target='_blank'
							rel='noreferrer'
							className='mx-1 text-secondary hover:text-secondary/80'
						>
							Rainbet
						</a>
						to appear on this leaderboard and compete for rewards!
					</p>

					<div className='flex items-center gap-4'>
						<div className='px-3 py-1.5 rounded-md bg-primary/10 flex items-center'>
							<span className='text-muted-foreground'>Affiliate Code:</span>
							<span className='ml-2 font-bold text-primary'>5MOKING</span>
						</div>
					</div>
				</div>

				{error && (
					<Alert variant='destructive' className='mb-6'>
						<AlertDescription>
							Failed to load leaderboard: {error}
						</AlertDescription>
					</Alert>
				)}

				<div className='mb-8'>
					<h2 className='mb-6 text-2xl font-bold text-center'>Top Players</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{currentData.length > 0 ? (
							<>
								<RewardCard
									position='2nd Place'
									reward='$250 Cash + Special Role'
									backgroundColor='from-slate-300 to-slate-400'
									player={currentData[1]}
									icon={<Award className='w-8 h-8 text-slate-300' />}
								/>
								<RewardCard
									position='1st Place'
									reward='$500 Cash + Special Role'
									backgroundColor='from-yellow-400 to-amber-600'
									player={currentData[0]}
									icon={<Trophy className='w-8 h-8 text-yellow-400' />}
								/>
								<RewardCard
									position='3rd Place'
									reward='$100 Cash + Special Role'
									backgroundColor='from-amber-700 to-amber-800'
									player={currentData[2]}
									icon={<Medal className='w-8 h-8 text-amber-600' />}
								/>
							</>
						) : (
							<>
								<RewardCard
									position='1st Place'
									reward='$500 Cash + Special Role'
									backgroundColor='from-yellow-400 to-amber-600'
									icon={<Trophy className='w-8 h-8 text-yellow-400' />}
								/>
								<RewardCard
									position='2nd Place'
									reward='$250 Cash + Special Role'
									backgroundColor='from-slate-300 to-slate-400'
									icon={<Award className='w-8 h-8 text-slate-300' />}
								/>
								<RewardCard
									position='3rd Place'
									reward='$100 Cash + Special Role'
									backgroundColor='from-amber-700 to-amber-800'
									icon={<Medal className='w-8 h-8 text-amber-600' />}
								/>
							</>
						)}
					</div>
				</div>

				<Tabs
					defaultValue={period}
					onValueChange={handleTabChange}
					className='mb-6'
				>
					<TabsList className='grid w-full max-w-xs grid-cols-2'>
						<TabsTrigger value='weekly'>Weekly</TabsTrigger>
						<TabsTrigger value='monthly'>Monthly</TabsTrigger>
					</TabsList>

					<TabsContent value='weekly' className='mt-6'>
						{isLoading && period === "weekly" ? (
							<div className='flex items-center justify-center h-64'>
								<Loader2 className='w-8 h-8 animate-spin' />
							</div>
						) : (
							<LeaderboardTable
								period='weekly'
								data={weeklyLeaderboard}
								isLoading={isLoading && period === "weekly"}
							/>
						)}
					</TabsContent>

					<TabsContent value='monthly' className='mt-6'>
						{isLoading && period === "monthly" ? (
							<div className='flex items-center justify-center h-64'>
								<Loader2 className='w-8 h-8 animate-spin' />
							</div>
						) : (
							<LeaderboardTable
								period='monthly'
								data={monthlyLeaderboard}
								isLoading={isLoading && period === "monthly"}
							/>
						)}
					</TabsContent>
				</Tabs>
			</main>

			<Footer />
		</div>
	);
}

interface RewardCardProps {
	position: string;
	reward: string;
	backgroundColor: string;
	player?: LeaderboardPlayer;
	icon?: React.ReactNode;
}

function RewardCard({
	position,
	reward,
	backgroundColor,
	player,
	icon,
}: RewardCardProps) {
	return (
		<div className='flex flex-col h-full overflow-hidden rounded-lg glass-card'>
			<div className={`h-2 bg-gradient-to-r ${backgroundColor}`} />
			<div className='flex flex-col items-center flex-grow p-6 text-center'>
				<div className='mb-4'>{icon}</div>
				<h3 className='mb-2 text-xl font-bold'>{position}</h3>

				{player ? (
					<>
						<p className='font-medium'>{player.username}</p>
						<p className='text-muted-foreground'>
							${player.wager.toLocaleString()}
						</p>

						{/* Claim Button */}
						<a
							href='https://discord.gg/3eVUWD4BtF'
							target='_blank'
							rel='noreferrer'
							className='w-full mt-4'
						>
							<Button className='w-full' variant='secondary'>
								Claim Prize
							</Button>
						</a>
					</>
				) : (
					<p className='text-muted-foreground'>{reward}</p>
				)}
			</div>
		</div>
	);
}

export default LeaderboardPage;
