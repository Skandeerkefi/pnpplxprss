import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='py-6 mt-16 border-t border-white/10'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
					<div>
						<h3 className='mb-3 text-lg font-bold gradient-text'>5MOKING</h3>
						<p className='text-sm text-muted-foreground'>
							Join 5MOKING's community for exciting gambling streams, giveaways,
							and more. Use affiliate code{" "}
							<span className='font-semibold text-primary'>5MOKING</span> on
							Rainbet.
						</p>
					</div>

					<div>
						<h3 className='mb-3 text-lg font-bold'>Links</h3>
						<div className='grid grid-cols-2 gap-2'>
							<Link
								to='/'
								className='text-sm text-muted-foreground hover:text-primary'
							>
								Home
							</Link>
							<Link
								to='/leaderboard'
								className='text-sm text-muted-foreground hover:text-primary'
							>
								Leaderboard
							</Link>
							{/* <Link to="/slot-calls" className="text-sm text-muted-foreground hover:text-primary">
                Slot Calls
              </Link>
              <Link to="/giveaways" className="text-sm text-muted-foreground hover:text-primary">
                Giveaways
              </Link> */}
							<Link
								to='/terms'
								className='text-sm text-muted-foreground hover:text-primary'
							>
								Terms & Conditions
							</Link>
							<Link
								to='/privacy'
								className='text-sm text-muted-foreground hover:text-primary'
							>
								Privacy Policy
							</Link>
						</div>
					</div>

					<div>
						<h3 className='mb-3 text-lg font-bold'>Connect</h3>
						<div className='flex gap-3'>
							<a
								href='https://kick.com/5moking'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#42ff2d] hover:bg-[#38BDF8]/80 transition-colors'
							>
								K
							</a>
							<a
								href='https://x.com/5moki_ng'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#000000] hover:bg-[#38BDF8]/80 transition-colors'
							>
								X
							</a>
							<a
								href='https://discord.gg/3eVUWD4BtF'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#5865F2] hover:bg-[#5865F2]/80 transition-colors'
							>
								D
							</a>
							<a
								href='https://www.instagram.com/5moking5'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#f258ce] hover:bg-[#5865F2]/80 transition-colors'
							>
								I
							</a>
						</div>
					</div>
				</div>

				<div className='pt-4 mt-8 text-sm text-center border-t border-white/10 text-muted-foreground'>
					<p className='flex flex-wrap items-center justify-center gap-1 text-sm'>
						© {currentYear} 5MOKING. Made with
						<Heart className='w-3 h-3 mx-1 text-red-500' />
						for the community by
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-primary hover:underline'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
