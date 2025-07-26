import { useEffect, useState } from "react";
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
	// Display only the first few items on the homepage
	const topLeaderboard = weeklyLeaderboard.slice(0, 5);
	const recentSlotCalls = slotCalls.slice(0, 3);
	const activeGiveaways = giveaways
		.filter((g) => g.status === "active")
		.slice(0, 2);
	useEffect(() => {
		// Only fetch if the leaderboard is empty (optional check)
		if (weeklyLeaderboard.length === 0) {
			fetchLeaderboard("weekly");
		}
	}, []);
	return (
		<div className='flex flex-col min-h-screen bg-background'>
			<Navbar />

			<main className='flex-grow'>
				{/* Hero Section */}
				<section className='relative overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-br from-[#191F3B]/90 to-[#191F3B]/70'></div>
					<div
						className='absolute inset-0 z-0 bg-center bg-cover opacity-30'
						style={{
							backgroundImage:
								"url(https://images.unsplash.com/photo-1614585507279-e3dda7937fdf?w=1200&h=600&fit=crop)",
						}}
					/>

					<div className='container relative z-10 px-4 py-16 md:py-28 md:px-8'>
						<div className='max-w-3xl mx-auto text-center'>
							<h1 className='mb-4 text-4xl font-bold md:text-6xl gradient-text'>
								Welcome to 5MOKING's
								<span className='block mt-2'>Official Website</span>
							</h1>

							<p className='mb-8 text-lg md:text-xl text-muted-foreground'>
								Join the community for exciting gambling streams, giveaways,
								slot calls, and compete on the Rainbet leaderboard with
								affiliate code{" "}
								<span className='font-semibold text-primary'>5MOKING</span>
							</p>

							<div className='flex flex-col justify-center gap-4 sm:flex-row'>
								<Button size='lg' asChild>
									<a
										href='https://kick.com/5moking'
										target='_blank'
										rel='noreferrer'
									>
										Watch Stream
									</a>
								</Button>
								<Button size='lg' variant='outline' asChild>
									<a
										href='https://rainbet.com/?r=5moking'
										target='_blank'
										rel='noreferrer'
									>
										Join Rainbet with Code: 5MOKING
									</a>
								</Button>
							</div>

							{/* Stream Status */}
						</div>
					</div>
				</section>

				{/* Leaderboard Preview Section */}
				<section className='container py-12 md:py-16'>
					<div className='flex items-center justify-between mb-8'>
						<div className='flex items-center gap-2'>
							<Crown className='w-6 h-6 text-secondary' />
							<h2 className='text-2xl font-bold'>Weekly Leaderboard</h2>
						</div>

						<Button variant='outline' size='sm' asChild>
							<Link to='/leaderboard' className='flex items-center gap-1'>
								View Full Leaderboard <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>

					<LeaderboardTable period='weekly' data={topLeaderboard} />
				</section>

				{/* Features Section */}
				<section className='py-12 md:py-16 bg-primary/5 border-y border-white/10'>
					<div className='container'>
						<h2 className='mb-12 text-2xl font-bold text-center'>
							What We Offer
						</h2>

						<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
							<FeatureCard
								icon={<Dices className='w-8 h-8 text-secondary' />}
								title='Exciting Gambling Streams'
								description='Watch thrilling slot sessions, casino games, and big win moments with 5MOKING on Rainbet.'
							/>
							<FeatureCard
								icon={<Users className='w-8 h-8 text-secondary' />}
								title='Slot Call System'
								description='Suggest slots for 5MOKING to play during streams and see your suggestions come to life.'
							/>
							<FeatureCard
								icon={<Gift className='w-8 h-8 text-secondary' />}
								title='Regular Giveaways'
								description='Participate in frequent giveaways for a chance to win cash, gaming gear, and more.'
							/>
						</div>
					</div>
				</section>

				{/* Slot Calls Preview
				<section className='container py-12 md:py-16'>
					<div className='flex items-center justify-between mb-8'>
						<div className='flex items-center gap-2'>
							<Dices className='w-6 h-6 text-secondary' />
							<h2 className='text-2xl font-bold'>Recent Slot Calls</h2>
						</div>

						<Button variant='outline' size='sm' asChild>
							<Link to='/slot-calls' className='flex items-center gap-1'>
								View All Slot Calls <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>

					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{recentSlotCalls.map((slotCall) => (
							<SlotCallCard
								key={slotCall.id}
								id={slotCall.id}
								slotName={slotCall.slotName}
								requester={slotCall.requester}
								betAmount={slotCall.betAmount}
								timestamp={slotCall.timestamp}
								status={slotCall.status}
							/>
						))}
					</div>
				</section> */}

				{/* Active Giveaways Preview
				<section className='py-12 md:py-16 bg-primary/5 border-y border-white/10'>
					<div className='container'>
						<div className='flex items-center justify-between mb-8'>
							<div className='flex items-center gap-2'>
								<Gift className='w-6 h-6 text-secondary' />
								<h2 className='text-2xl font-bold'>Active Giveaways</h2>
							</div>

							<Button variant='outline' size='sm' asChild>
								<Link to='/giveaways' className='flex items-center gap-1'>
									View All Giveaways <ArrowRight className='w-4 h-4' />
								</Link>
							</Button>
						</div>

						<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
							{activeGiveaways.length > 0 ? (
								activeGiveaways.map((giveaway) => (
									<GiveawayCard
										key={giveaway.id}
										id={giveaway.id}
										title={giveaway.title}
										prize={giveaway.prize}
										endTime={giveaway.endTime}
										participants={giveaway.participants}
										maxParticipants={giveaway.maxParticipants}
										status={giveaway.status}
										isEntered={giveaway.isEntered}
									/>
								))
							) : (
								<div className='py-8 text-center col-span-full'>
									<Clock className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
									<h3 className='mb-2 text-xl font-bold'>
										No Active Giveaways
									</h3>
									<p className='text-muted-foreground'>
										Check back soon for upcoming giveaways or follow 5MOKING's
										stream to be notified.
									</p>
								</div>
							)}
						</div>
					</div>
				</section> */}

				{/* CTA Section
				<section className='py-16 md:py-24'>
					<div className='container'>
						<div className='max-w-3xl mx-auto text-center'>
							<h2 className='mb-4 text-3xl font-bold md:text-4xl gradient-text'>
								Ready to Join the 5MOKING Community?
							</h2>
							<p className='mb-8 text-muted-foreground'>
								Create an account to participate in giveaways, submit slot
								calls, and connect with other community members.
							</p>
							<div className='flex flex-col justify-center gap-4 sm:flex-row'>
								<Button size='lg' asChild>
									<Link to='/signup'>Create Account</Link>
								</Button>
								<Button size='lg' variant='outline' asChild>
									<Link to='/login'>Login</Link>
								</Button>
							</div>
						</div>
					</div>
				</section> */}
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
		<div className='flex flex-col items-center p-6 text-center rounded-lg glass-card'>
			<div className='mb-4'>{icon}</div>
			<h3 className='mb-2 text-xl font-bold'>{title}</h3>
			<p className='text-muted-foreground'>{description}</p>
		</div>
	);
}

export default HomePage;
