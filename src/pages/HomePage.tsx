import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Link } from "react-router-dom";
import { Dices, Crown, Gift, Users, ArrowRight, ChevronDown } from "lucide-react";
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

	// Audio autoplay on first click
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [audioStarted, setAudioStarted] = useState(false);

	useEffect(() => {
		const handleFirstInteraction = () => {
			if (!audioStarted && audioRef.current) {
				audioRef.current.play().catch(() => {});
				setAudioStarted(true);
				document.removeEventListener('click', handleFirstInteraction);
			}
		};

		document.addEventListener('click', handleFirstInteraction);
		return () => document.removeEventListener('click', handleFirstInteraction);
	}, [audioStarted]);

	const topLeaderboard = Array.isArray(biweeklyLeaderboard)
		? biweeklyLeaderboard.slice(0, 5)
		: [];

	useEffect(() => {
		if (biweeklyLeaderboard.length === 0) {
			fetchLeaderboard("biweekly");
		}
	}, []);

	const { end_at } = getCurrentBiweeklyRange();

	const [range, setRange] = useState(() => getCurrentBiweeklyRange());
	const [timeLeft, setTimeLeft] = useState<string>("");
	useEffect(() => {
		const interval = setInterval(() => {
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

			setTimeLeft(
				`${days.toString().padStart(2, "0")}d : ${hours
					.toString()
					.padStart(2, "0")}h : ${minutes
					.toString()
					.padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [range]);

	// Simple time extractor for labels
	function renderTimeUnit(timeStr: string, unit: "d" | "h" | "m" | "s") {
		const regex = new RegExp(`(\\d{2})${unit}`);
		const match = timeStr.match(regex);
		return match ? match[1] : "00";
	}

	return (
		<div className='flex flex-col min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] text-white'>
			{/* Background audio - plays on first click */}
			<audio
				ref={audioRef}
				src="https://res.cloudinary.com/ddyb6vfje/video/upload/v1772139187/PNPPL_jugt46.mp3"
				loop
				preload="auto"
			/>
			<Navbar />

			<main className='flex-grow'>
				{/* Hero Section */}
				<section className='relative overflow-hidden min-h-[90vh] flex items-center'>
					{/* Animated gradient background */}
					<div className='absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] z-0' />
					
					{/* Decorative glow effects */}
					<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-[#EA6D0C]/20 rounded-full blur-[120px] z-0' />
					<div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#AF2D03]/15 rounded-full blur-[100px] z-0' />
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F97316]/10 rounded-full blur-[150px] z-0' />

					<div className='container relative z-20 px-4 py-16 text-center'>
						{/* Logo Image */}
						<div className='flex justify-center mb-8'>
							<img 
								src='https://i.ibb.co/vx47Rk0b/November-25-Logo.png' 
								alt='Pnppl Logo' 
								className='w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(234,109,12,0.5)] animate-pulse'
							/>
						</div>

						<h1 className='mb-6 text-4xl font-extrabold md:text-6xl lg:text-7xl'>
							<span className='bg-gradient-to-r from-[#F97316] via-[#EA6D0C] to-[#AF2D03] bg-clip-text text-transparent'>
								Pnppl
							</span>
							<span className='block mt-3 text-2xl font-bold md:text-4xl lg:text-5xl text-white/90'>
								Official Website
							</span>
						</h1>
						
						<p className='max-w-2xl mx-auto mb-10 text-lg leading-relaxed md:text-xl text-white/80'>
							Join the community for exciting gambling streams, giveaways, slot
							calls, and leaderboard competitions with affiliate code{" "}
							<span className='font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-1 rounded'>pnppl</span>
						</p>

						<div className='flex flex-col justify-center gap-4 sm:flex-row'>
							<Button
								size='lg'
								className='bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-[#EA6D0C]/25 transition-all duration-300 hover:scale-105'
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
								className='border-2 border-[#EA6D0C] text-[#EA6D0C] hover:bg-[#EA6D0C] hover:text-white font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#EA6D0C]/25'
								asChild
							>
								<a
									href='https://rainbet.com/?r=pnppl'
									target='_blank'
									rel='noreferrer'
								>
									Join Rainbet with Code: pnppl
								</a>
							</Button>
						</div>
					</div>

					{/* Scroll Down Button */}
					<button
						onClick={() => document.getElementById('countdown-section')?.scrollIntoView({ behavior: 'smooth' })}
						className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 hover:text-[#F97316] transition-colors duration-300 cursor-pointer group'
					>
						<span className='text-sm font-medium'>Scroll Down</span>
						<ChevronDown className='w-6 h-6 animate-bounce group-hover:text-[#F97316]' />
					</button>

					{/* Bottom gradient fade */}
					<div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent z-10' />
				</section>

				{/* Compact Centered Countdown */}
				{/* Compact Centered Countdown */}
				<section id='countdown-section' className='flex justify-center py-16 bg-[#0D0D0D]'>
					<div className='text-center border border-[#EA6D0C]/40 rounded-2xl px-8 py-8 bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] shadow-2xl shadow-[#EA6D0C]/10 inline-flex flex-col items-center backdrop-blur-sm'>
						<h2 className='text-2xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent mb-6'>
							⏳ Leaderboard Ends In
						</h2>
						<p className='font-mono text-4xl md:text-5xl text-[#F97316] tracking-widest select-none font-bold'>
							{timeLeft}
						</p>
						<p className='mt-4 text-sm text-white/70'>
							Keep playing to secure your rank!
						</p>
					</div>
				</section>

				{/* Leaderboard Section */}
				<section className='container py-20'>
					<div className='flex items-center justify-between mb-10'>
						<div className='flex items-center gap-3'>
							<Crown className='w-8 h-8 text-[#F97316]' />
							<h2 className='text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>
								Biweekly Leaderboard
							</h2>
						</div>
						<Button
							variant='outline'
							size='sm'
							className='border-[#EA6D0C] text-[#EA6D0C] hover:bg-[#EA6D0C] hover:text-white transition-all duration-300'
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
				<section className='bg-gradient-to-b from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] border-y border-[#EA6D0C]/20 py-20'>
					<div className='container text-center'>
						<h2 className='text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent mb-14'>
							What We Offer
						</h2>
						<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
							<FeatureCard
								icon={<Dices className='w-10 h-10 text-[#F97316]' />}
								title='Exciting Gambling Streams'
								description='Watch thrilling slot sessions, casino games, and big win moments with pnppl on Rainbet.'
							/>
							<FeatureCard
								icon={<Users className='w-10 h-10 text-[#F97316]' />}
								title='Slot Call System'
								description='Suggest slots for pnppl to play during streams and see your suggestions come to life.'
							/>
							<FeatureCard
								icon={<Gift className='w-10 h-10 text-[#F97316]' />}
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
		<div className='bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] p-8 rounded-2xl border border-[#EA6D0C]/20 text-white shadow-xl hover:shadow-2xl hover:shadow-[#EA6D0C]/10 transition-all duration-300 hover:scale-105 hover:border-[#EA6D0C]/40'>
			<div className='flex justify-center mb-6'>{icon}</div>
			<h3 className='text-xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent mb-3'>{title}</h3>
			<p className='leading-relaxed text-white/70'>{description}</p>
		</div>
	);
}

export default HomePage;
