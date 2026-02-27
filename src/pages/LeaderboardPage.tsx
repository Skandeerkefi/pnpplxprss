import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
	useLeaderboardStore,
	getCurrentBiweeklyRange,
	getPreviousBiweeklyRange,
	LeaderboardPlayer,
} from "@/store/useLeaderboardStore";
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
	const { biweeklyLeaderboard, fetchLeaderboard, isLoading, error } =
		useLeaderboardStore();

	const [viewPrevious, setViewPrevious] = useState(false);
	const [range, setRange] = useState(() =>
		viewPrevious ? getPreviousBiweeklyRange() : getCurrentBiweeklyRange()
	);
	const [timeLeft, setTimeLeft] = useState<string>("");
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Background music effect
	useEffect(() => {
		const audio = new Audio("https://res.cloudinary.com/ddyb6vfje/video/upload/v1772157038/Piney_s_Jackpot_Loyalty_tn7xww.mp3");
		audio.loop = true;
		audio.volume = 0.3;
		audioRef.current = audio;

		audio.play().catch((err) => {
			console.log("Audio autoplay blocked:", err);
		});

		return () => {
			audio.pause();
			audio.src = "";
		};
	}, []);

	useEffect(() => {
		const selectedRange = viewPrevious
			? getPreviousBiweeklyRange()
			: getCurrentBiweeklyRange();
		setRange(selectedRange);

		// Pass only YYYY-MM-DD format to fetchLeaderboard
		const start_at = selectedRange.start_at.split("T")[0];
		const end_at = selectedRange.end_at.split("T")[0];

		fetchLeaderboard("biweekly", start_at, end_at);
	}, [viewPrevious, fetchLeaderboard]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (viewPrevious) return; // no countdown on previous

			const now = new Date();
			const end = new Date(range.end_at);
			const diff = end.getTime() - now.getTime();

			if (diff <= 0) {
				const newRange = getCurrentBiweeklyRange();
				setRange(newRange);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
		}, 1000);

		return () => clearInterval(interval);
	}, [range, viewPrevious]);

	return (
		<div className='flex flex-col min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] text-white'>
			<Navbar />
			<main className='container flex-grow py-8'>
				<div className='flex items-center justify-between mb-8'>
					<div className='flex items-center gap-3'>
						<Crown className='w-8 h-8 text-[#F97316]' />
						<h1 className='text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>Rainbet Leaderboard</h1>
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className='flex items-center gap-1 text-sm text-white/70 hover:text-[#F97316] cursor-help transition-colors duration-300'>
									<Info className='w-4 h-4' />
									<span>How It Works</span>
								</div>
							</TooltipTrigger>
							<TooltipContent className='max-w-xs bg-[#1A1A2E] text-white border border-[#EA6D0C]/50 shadow-xl'>
								<p>
									The leaderboard ranks players based on their total wager
									amount using the pnppl affiliate code on Rainbet.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Toggle Period */}
				<div className='flex justify-center gap-4 mb-6'>
					<Button
						variant={viewPrevious ? "outline" : "default"}
						className={`${!viewPrevious ? 'bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] shadow-md shadow-[#EA6D0C]/25' : 'border-[#EA6D0C]/50'} text-white hover:from-[#EA6D0C] hover:to-[#F97316] transition-all duration-300`}
						onClick={() => setViewPrevious(false)}
					>
						Current
					</Button>
					<Button
						variant={viewPrevious ? "default" : "outline"}
						className={`${viewPrevious ? 'bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] shadow-md shadow-[#EA6D0C]/25' : 'bg-[#1A1A2E] border border-[#EA6D0C]/50'} text-white hover:bg-[#EA6D0C] transition-all duration-300`}
						onClick={() => setViewPrevious(true)}
					>
						Previous
					</Button>
				</div>

				{error && (
					<Alert
						variant='destructive'
						className='mb-6 bg-[#AF2D03]/20 border-[#AF2D03]/50 text-white'
					>
						<AlertDescription>
							Failed to load leaderboard: {error}
						</AlertDescription>
					</Alert>
				)}

				<div className='mb-8'>
					<h2 className='mb-6 text-2xl font-bold text-center bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>
						Top Players
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{biweeklyLeaderboard.length > 0 ? (
							<>
								<RewardCard
									position='2nd Place'
									reward='$250 Cash + Special Role'
									backgroundColor='from-slate-300 to-slate-400'
									player={biweeklyLeaderboard[1]}
									icon={<Award className='w-8 h-8 text-slate-300' />}
								/>
								<RewardCard
									position='1st Place'
									reward='$500 Cash + Special Role'
									backgroundColor='from-yellow-400 to-amber-600'
									player={biweeklyLeaderboard[0]}
									icon={<Trophy className='w-8 h-8 text-yellow-400' />}
								/>
								<RewardCard
									position='3rd Place'
									reward='$100 Cash + Special Role'
									backgroundColor='from-amber-700 to-amber-800'
									player={biweeklyLeaderboard[2]}
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

				<div className='flex flex-col items-center justify-center mb-4'>
					<h2 className='text-xl font-semibold text-center text-white border-2 border-[#EA6D0C]/50 rounded-xl py-3 px-8 inline-block bg-[#1A1A2E]/50 backdrop-blur-sm'>
						{viewPrevious
							? "Previous Biweekly Leaderboard"
							: "Current Biweekly Leaderboard"}
					</h2>
					<p className='mt-2 text-sm text-[#F97316]'>
						Period:{" "}
						{new Date(range.start_at).toLocaleString("en-US", {
							timeZone: "America/New_York",
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
						})}{" "}
						→{" "}
						{new Date(range.end_at).toLocaleString("en-US", {
							timeZone: "America/New_York",
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
						})}{" "}
						(EST)
					</p>
					{!viewPrevious && (
						<p className='mt-1 text-sm text-[#F97316] font-mono'>{timeLeft}</p>
					)}
				</div>

				{isLoading ? (
					<div className='flex items-center justify-center h-64'>
						<Loader2 className='w-8 h-8 animate-spin text-[#EA6D0C]' />
					</div>
				) : (
					<LeaderboardTable
						period='biweekly'
						data={biweeklyLeaderboard}
						isLoading={isLoading}
					/>
				)}
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
		<div className='flex flex-col h-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] border border-[#EA6D0C]/30 shadow-xl hover:shadow-2xl hover:shadow-[#EA6D0C]/10 transition-all duration-300 hover:scale-105 hover:border-[#EA6D0C]/50'>
			<div className={`h-2 bg-gradient-to-r ${backgroundColor}`} />
			<div className='flex flex-col items-center flex-grow p-6 text-center text-white'>
				<div className='mb-4'>{icon}</div>
				<h3 className='mb-2 text-xl font-bold'>{position}</h3>

				{player ? (
					<>
						<p className='font-medium text-white'>{player.username}</p>
						<p className='text-[#F97316] font-semibold'>${player.wager.toLocaleString()}</p>
						<a
							href='https://discord.com/invite/A5TdPxB5nN'
							target='_blank'
							rel='noreferrer'
							className='w-full mt-4'
						>
							<Button className='w-full bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold shadow-md shadow-[#EA6D0C]/25 transition-all duration-300'>
								Claim Prize
							</Button>
						</a>
					</>
				) : (
					<p className='text-white/70'>{reward}</p>
				)}
			</div>
		</div>
	);
}

export default LeaderboardPage;
