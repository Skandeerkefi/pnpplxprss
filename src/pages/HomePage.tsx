import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Link } from "react-router-dom";
import { Dices, Crown, Gift, Users, ArrowRight } from "lucide-react";
import {
	useLeaderboardStore,
	getCurrentBiweeklyRange,
} from "@/store/useLeaderboardStore";
import { useSlotCallStore } from "@/store/useSlotCallStore";
import { useGiveawayStore } from "@/store/useGiveawayStore";

function HomePage() {
	const { slotCalls } = useSlotCallStore();
	const { giveaways } = useGiveawayStore();
	const { biweeklyLeaderboard, fetchLeaderboard } = useLeaderboardStore();

	const topLeaderboard = Array.isArray(biweeklyLeaderboard)
		? biweeklyLeaderboard.slice(0, 5)
		: [];

	useEffect(() => {
		if (biweeklyLeaderboard.length === 0) {
			fetchLeaderboard("biweekly");
		}
	}, []);

	const { end_at } = getCurrentBiweeklyRange();
	const [timeLeft, setTimeLeft] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const end = new Date(end_at);
			const diff = end.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("00d : 00h : 00m : 00s");
				clearInterval(interval);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(
				`${days.toString().padStart(2, "0")}d : ${hours
					.toString()
					.padStart(2, "0")}h : ${minutes
					.toString()
					.padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [end_at]);

	// Simple time extractor for labels
	function renderTimeUnit(timeStr: string, unit: "d" | "h" | "m" | "s") {
		const regex = new RegExp(`(\\d{2})${unit}`);
		const match = timeStr.match(regex);
		return match ? match[1] : "00";
	}

	return (
		<div className='flex flex-col min-h-screen bg-[#191F3B] text-white'>
			<Navbar />

			<main className='flex-grow'>
				{/* Hero Section */}
				<section className='relative overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-br from-[#191F3B]/90 to-[#191F3B]/70 z-10' />
					<div
						className='absolute inset-0 z-0 bg-center bg-cover opacity-30'
						style={{
							backgroundImage:
								"url(https://images.unsplash.com/photo-1614585507279-e3dda7937fdf?w=1200&h=600&fit=crop)",
						}}
					/>

					<div className='container relative z-20 px-4 py-20 text-center md:py-28'>
						<h1 className='mb-4 text-4xl md:text-6xl font-bold text-[#EA6D0C]'>
							Welcome to PnpplXprss's
							<span className='block mt-2 text-[#AF2D03]'>
								Official Website
							</span>
						</h1>
						<p className='mb-8 text-lg md:text-xl text-[#FFFFFF]'>
							Join the community for exciting gambling streams, giveaways, slot
							calls, and leaderboard competitions with affiliate code{" "}
							<span className='font-bold text-[#EA6D0C]'>PnpplXprss</span>
						</p>

						<div className='flex flex-col justify-center gap-4 sm:flex-row'>
							<Button
								size='lg'
								className='bg-[#AF2D03] hover:bg-[#EA6D0C] text-white'
								asChild
							>
								<a
									href='https://kick.com/pnpplxprss'
									target='_blank'
									rel='noreferrer'
								>
									Watch Stream
								</a>
							</Button>
							<Button
								size='lg'
								variant='outline'
								className='border-[#EA6D0C] text-[#EA6D0C] hover:bg-[#EA6D0C] hover:text-white'
								asChild
							>
								<a
									href='https://rainbet.com/?r=pnpplxprss'
									target='_blank'
									rel='noreferrer'
								>
									Join Rainbet with Code: pnpplxprss
								</a>
							</Button>
						</div>
					</div>
				</section>

				{/* Compact Centered Countdown */}
				{/* Compact Centered Countdown */}
				<section className='flex justify-center py-12'>
					<div className='text-center border border-[#EA6D0C] rounded-lg px-6 py-6 bg-[#1E2547] shadow-md inline-flex flex-col items-center'>
						<h2 className='text-xl font-semibold text-[#EA6D0C] mb-4'>
							⏳ Leaderboard Ends In
						</h2>
						<p className='font-mono text-3xl text-[#38BDF8] tracking-widest select-none'>
							{timeLeft}
						</p>
						<p className='mt-2 text-sm text-[#FFFFFF]/80'>
							Keep playing to secure your rank!
						</p>
					</div>
				</section>

				{/* Leaderboard Section */}
				<section className='container py-16'>
					<div className='flex items-center justify-between mb-8'>
						<div className='flex items-center gap-2'>
							<Crown className='w-6 h-6 text-[#EA6D0C]' />
							<h2 className='text-2xl font-bold text-[#EA6D0C]'>
								Biweekly Leaderboard
							</h2>
						</div>
						<Button
							variant='outline'
							size='sm'
							className='border-[#EA6D0C] text-[#EA6D0C] hover:bg-[#EA6D0C] hover:text-white'
							asChild
						>
							<Link to='/leaderboard' className='flex items-center gap-1'>
								View Full Leaderboard <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>

					<LeaderboardTable period='biweekly' data={topLeaderboard} />
				</section>

				{/* Features */}
				<section className='bg-[#191F3B] border-y border-[#EA6D0C]/30 py-16'>
					<div className='container text-center'>
						<h2 className='text-2xl font-bold text-[#EA6D0C] mb-12'>
							What We Offer
						</h2>
						<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
							<FeatureCard
								icon={<Dices className='w-8 h-8 text-[#EA6D0C]' />}
								title='Exciting Gambling Streams'
								description='Watch thrilling slot sessions, casino games, and big win moments with pnpplxprss on Rainbet.'
							/>
							<FeatureCard
								icon={<Users className='w-8 h-8 text-[#EA6D0C]' />}
								title='Slot Call System'
								description='Suggest slots for pnpplxprss to play during streams and see your suggestions come to life.'
							/>
							<FeatureCard
								icon={<Gift className='w-8 h-8 text-[#EA6D0C]' />}
								title='Regular Giveaways'
								description='Participate in frequent giveaways for a chance to win cash, gaming gear, and more.'
							/>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className='bg-[#1E2547] p-6 rounded-2xl border border-[#EA6D0C]/20 text-white shadow-md hover:shadow-xl transition'>
			<div className='flex justify-center mb-4 text-[#EA6D0C]'>{icon}</div>
			<h3 className='text-xl font-bold text-[#EA6D0C] mb-2'>{title}</h3>
			<p className='text-[#FFFFFF]/80'>{description}</p>
		</div>
	);
}

export default HomePage;
