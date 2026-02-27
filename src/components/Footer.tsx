import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='py-8 mt-16 border-t border-[#EA6D0C]/20 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A2E] text-white'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
					<div>
						<h3 className='mb-3 text-lg font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>
							Pnppl
						</h3>
						<p className='text-sm leading-relaxed text-white/70'>
							Join Pnppl's community for exciting gambling streams,
							giveaways, and more. Use affiliate code{" "}
							<span className='font-semibold text-[#F97316] bg-[#F97316]/10 px-1 rounded'>pnppl</span> on
							Rainbet.
						</p>
					</div>

					<div>
						<h3 className='mb-3 text-lg font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>Links</h3>
						<div className='grid grid-cols-2 gap-2'>
							<Link
								to='/'
								className='text-sm text-white/70 hover:text-[#F97316] transition-colors duration-300'
							>
								Home
							</Link>
							<Link
								to='/leaderboard'
								className='text-sm text-white/70 hover:text-[#F97316] transition-colors duration-300'
							>
								Leaderboard
							</Link>
							{/* Uncomment if needed */}
							{/* <Link to="/slot-calls" className="text-sm text-white/70 hover:text-[#F97316] transition-colors duration-300">
                Slot Calls
              </Link>
              <Link to="/giveaways" className="text-sm text-white/70 hover:text-[#F97316] transition-colors duration-300">
                Giveaways
              </Link> */}
							<Link
								to='/terms'
								className='text-sm text-white/70 hover:text-[#F97316] transition-colors duration-300'
							>
								Terms & Conditions
							</Link>
							<Link
								to='/privacy'
								className='text-sm text-white/70 hover:text-[#F97316] transition-colors duration-300'
							>
								Privacy Policy
							</Link>
						</div>
					</div>

					<div>
						<h3 className='mb-3 text-lg font-bold bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>Connect</h3>
						<div className='flex gap-3'>
							<a
								href='https://kick.com/pnpplxprss'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] transition-all duration-300 shadow-md shadow-[#EA6D0C]/20 font-semibold'
							>
								K
							</a>
							<a
								href='https://x.com/pnpplxprss1'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#1A1A2E] border border-[#EA6D0C]/30 hover:bg-[#EA6D0C] hover:border-[#EA6D0C] transition-all duration-300 font-semibold'
							>
								X
							</a>
							<a
								href='https://discord.gg/A5TdPxB5nN'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#1A1A2E] border border-[#EA6D0C]/30 hover:bg-[#EA6D0C] hover:border-[#EA6D0C] transition-all duration-300 font-semibold'
							>
								D
							</a>
							<a
								href='https://www.instagram.com/pnpplxprss1/'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#1A1A2E] border border-[#EA6D0C]/30 hover:bg-[#EA6D0C] hover:border-[#EA6D0C] transition-all duration-300 font-semibold'
							>
								I
							</a>
						</div>
					</div>
				</div>

				<div className='pt-4 mt-8 text-sm text-center border-t border-[#EA6D0C]/20 text-white/60'>
					<p className='flex flex-wrap items-center justify-center gap-1 text-sm'>
						© {currentYear} Pnppl. Made with
						<Heart className='w-3 h-3 mx-1 text-[#F97316]' />
						for the community by
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-[#F97316] hover:underline'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
