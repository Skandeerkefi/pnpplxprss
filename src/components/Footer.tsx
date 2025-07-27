import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='py-6 mt-16 border-t border-[#EA8105]/20 bg-[#191F3B] text-white'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#EA8105]'>
							PnpplXprss
						</h3>
						<p className='text-sm text-[#C33B52]'>
							Join PnpplXprss's community for exciting gambling streams,
							giveaways, and more. Use affiliate code{" "}
							<span className='font-semibold text-[#EA8105]'>PnpplXprss</span>{" "}
							on Rainbet.
						</p>
					</div>

					<div>
						<h3 className='mb-3 text-lg font-bold text-[#EA8105]'>Links</h3>
						<div className='grid grid-cols-2 gap-2'>
							<Link
								to='/'
								className='text-sm text-[#38BDF8] hover:text-[#EA8105] transition-colors'
							>
								Home
							</Link>
							<Link
								to='/leaderboard'
								className='text-sm text-[#38BDF8] hover:text-[#EA8105] transition-colors'
							>
								Leaderboard
							</Link>
							{/* Uncomment if needed */}
							{/* <Link to="/slot-calls" className="text-sm text-[#38BDF8] hover:text-[#EA8105] transition-colors">
                Slot Calls
              </Link>
              <Link to="/giveaways" className="text-sm text-[#38BDF8] hover:text-[#EA8105] transition-colors">
                Giveaways
              </Link> */}
							<Link
								to='/terms'
								className='text-sm text-[#38BDF8] hover:text-[#EA8105] transition-colors'
							>
								Terms & Conditions
							</Link>
							<Link
								to='/privacy'
								className='text-sm text-[#38BDF8] hover:text-[#EA8105] transition-colors'
							>
								Privacy Policy
							</Link>
						</div>
					</div>

					<div>
						<h3 className='mb-3 text-lg font-bold text-[#EA8105]'>Connect</h3>
						<div className='flex gap-3'>
							<a
								href='https://kick.com/pnpplxprss'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#AF2D03] hover:bg-[#EA8105] transition-colors'
							>
								K
							</a>
							<a
								href='https://x.com/pnpplxprss1'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#C33B52] hover:bg-[#EA8105] transition-colors'
							>
								X
							</a>
							<a
								href='https://discord.gg/A5TdPxB5nN'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#38BDF8] hover:bg-[#EA8105] transition-colors'
							>
								D
							</a>
							<a
								href='https://www.instagram.com/pnpplxprss1/'
								target='_blank'
								rel='noreferrer'
								className='w-9 h-9 rounded-full flex items-center justify-center bg-[#EA8105] hover:bg-[#38BDF8] transition-colors'
							>
								I
							</a>
						</div>
					</div>
				</div>

				<div className='pt-4 mt-8 text-sm text-center border-t border-[#EA8105]/20 text-[#C33B52]'>
					<p className='flex flex-wrap items-center justify-center gap-1 text-sm'>
						© {currentYear} PnpplXprss. Made with
						<Heart className='w-3 h-3 mx-1 text-[#AF2D03]' />
						for the community by
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-[#EA8105] hover:underline'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
