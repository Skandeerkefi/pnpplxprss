import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { SlotCallCard } from "@/components/SlotCallCard";
import { GiveawayCard } from "@/components/GiveawayCard";
import { Link } from "react-router-dom";
import { Dices, Crown, Gift, Users, ArrowRight } from "lucide-react";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";
import { useSlotCallStore } from "@/store/useSlotCallStore";
import { useGiveawayStore } from "@/store/useGiveawayStore";

function HomePage() {
	const { slotCalls } = useSlotCallStore();
	const { giveaways } = useGiveawayStore();
	const { weeklyLeaderboard, fetchLeaderboard } = useLeaderboardStore();

	// ✅ Guards added to avoid errors when arrays are undefined
	const topLeaderboard = Array.isArray(weeklyLeaderboard)
		? weeklyLeaderboard.slice(0, 5)
		: [];
	const recentSlotCalls = Array.isArray(slotCalls) ? slotCalls.slice(0, 3) : [];
	const activeGiveaways = Array.isArray(giveaways)
		? giveaways.filter((g) => g.status === "active").slice(0, 2)
		: [];

	useEffect(() => {
		if (weeklyLeaderboard.length === 0) {
			fetchLeaderboard("weekly");
		}
	}, []);

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

					<LeaderboardTable period='weekly' data={topLeaderboard} />
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

				{/* You can add previews of recentSlotCalls and activeGiveaways below if needed */}
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
