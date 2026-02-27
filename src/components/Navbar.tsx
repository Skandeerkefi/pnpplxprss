import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dices, Crown, Gift, Users, LogIn, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import useMediaQuery from "@/hooks/use-media-query";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
	const location = useLocation();
	const isMobile = useMediaQuery("(max-width: 768px)"); // Using tailwind's md breakpoint
	const [isOpen, setIsOpen] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [viewerCount, setViewerCount] = useState<number | null>(null);

	const { user, logout } = useAuthStore();

	// Close mobile menu when navigating or when viewport changes
	useEffect(() => {
		setIsOpen(false);
	}, [location, isMobile]);

	useEffect(() => {
		const fetchLiveStatus = async () => {
			try {
				const res = await fetch("https://kick.com/api/v2/channels/pnpplxprss");
				const data = await res.json();

				if (data.livestream) {
					setIsLive(true);
					setViewerCount(data.livestream.viewer_count);
				} else {
					setIsLive(false);
					setViewerCount(null);
				}
			} catch (err) {
				console.error("Error fetching live status", err);
			}
		};

		fetchLiveStatus();
		const interval = setInterval(fetchLiveStatus, 60000);
		return () => clearInterval(interval);
	}, []);

	const menuItems = [
		{ path: "/", name: "Home", icon: <Dices className='w-4 h-4 mr-1' /> },
		{
			path: "/leaderboard",
			name: "Leaderboard",
			icon: <Crown className='w-4 h-4 mr-1' />,
		},
		{
			path: "/slot-calls",
			name: "Slot Calls",
			icon: <Users className='w-4 h-4 mr-1' />,
		},
		{
			path: "/giveaways",
			name: "Giveaways",
			icon: <Gift className='w-4 h-4 mr-1' />,
		},
	];

	return (
		<nav className='sticky top-0 z-50 border-b border-[#EA6D0C]/30 backdrop-blur-xl bg-[#0D0D0D]/95 text-white shadow-lg shadow-black/20'>
			<div className='container flex items-center justify-between py-3 mx-auto'>
				{/* Logo & Live status */}
				<div className='flex items-center gap-3'>
					<Link to='/' className='flex items-center gap-2 group'>
						<img
							src='https://i.ibb.co/vx47Rk0b/November-25-Logo.png'
							alt='Pnppl Logo'
							className='object-cover w-10 h-10 rounded-full shadow-md shadow-[#EA6D0C]/30 transition-transform duration-300 group-hover:scale-110'
						/>
						<span className='text-2xl font-extrabold bg-gradient-to-r from-[#F97316] via-[#EA6D0C] to-[#AF2D03] bg-clip-text text-transparent select-none'>
							Pnppl
						</span>
					</Link>

					{isLive ? (
						<span className='ml-2 px-3 py-0.5 text-xs bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] text-white rounded-full font-semibold animate-pulse select-none shadow-md shadow-[#AF2D03]/30'>
							🔴 LIVE {viewerCount !== null ? `(${viewerCount})` : ""}
						</span>
					) : (
						<span className='ml-2 px-3 py-0.5 text-xs bg-[#1A1A2E] text-white/70 rounded-full font-semibold select-none border border-white/10'>
							Offline
						</span>
					)}
				</div>

				{/* Desktop Navigation - Only show when NOT mobile */}
				<div className={`${isMobile ? "hidden" : "flex items-center gap-6"}`}>
					{/* Menu Links */}
						<div className='flex items-center gap-2'>
							{menuItems.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
										location.pathname === item.path
											? "bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] text-white shadow-md shadow-[#EA6D0C]/25"
											: "text-white/80 hover:bg-[#1A1A2E] hover:text-[#F97316]"
									}`}
								>
									{item.icon}
									{item.name}
								</Link>
							))}
						</div>

					{/* Auth Buttons */}
					<div className='flex items-center gap-3'>
						{user ? (
							<>
								<Button variant='ghost' size='sm' asChild>
									<Link
										to='/'
										className='flex items-center gap-1 font-semibold text-white'
									>
										<User className='w-4 h-4' />
										{user.username}
									</Link>
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={logout}
									className='border-white text-white hover:bg-[#AF2D03] hover:border-[#AF2D03]'
								>
									<LogOut className='w-4 h-4 mr-1' />
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									variant='outline'
									size='sm'
									asChild
									className='border-white text-[#ffffff] hover:bg-[#EA8105] hover:border-[#EA8105]'
								>
									<Link to='/login' className='flex items-center'>
										<LogIn className='w-4 h-4 mr-1' />
										Login
									</Link>
								</Button>
								<Button
									size='sm'
									asChild
									className='text-[#ffffff] hover:text-[#EA8105] font-semibold'
								>
									<Link to='/signup'>Sign Up</Link>
								</Button>
							</>
						)}
					</div>
				</div>

				{/* Mobile Nav Toggle - Only show when mobile */}
				{isMobile && (
					<button
						className='p-2 rounded-lg hover:bg-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-colors duration-300'
						onClick={() => setIsOpen(!isOpen)}
						aria-label='Toggle menu'
						aria-expanded={isOpen}
					>
						<div className='space-y-1.5'>
							<span
								className={`block h-0.5 w-6 bg-[#F97316] transition-all duration-300 ${
									isOpen ? "rotate-45 translate-y-2" : ""
								}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-[#F97316] transition-all duration-300 ${
									isOpen ? "opacity-0" : "opacity-100"
								}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-[#F97316] transition-all duration-300 ${
									isOpen ? "-rotate-45 -translate-y-2" : ""
								}`}
							/>
						</div>
					</button>
				)}
			</div>

			{/* Mobile Menu - Only show when mobile and open */}
			{isMobile && (
				<div
					className={`container mx-auto overflow-hidden transition-all duration-300 ease-in-out ${
						isOpen
							? "max-h-screen py-3 border-t border-[#EA6D0C]/30"
							: "max-h-0"
					}`}
				>
					<div className='flex flex-col gap-2 pb-4'>
						{menuItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setIsOpen(false)}
								className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
									location.pathname === item.path
										? "bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] text-white shadow-md shadow-[#EA6D0C]/25"
										: "text-white/80 hover:bg-[#1A1A2E] hover:text-[#F97316]"
								}`}
							>
								{item.icon}
								{item.name}
							</Link>
						))}

						<div className='flex flex-col gap-2 mt-3'>
							{user ? (
								<>
									<Button variant='ghost' size='sm' className='w-full hover:bg-[#1A1A2E]' asChild>
										<Link
											to='/profile'
											onClick={() => setIsOpen(false)}
											className='flex items-center font-semibold text-[#F97316]'
										>
											<User className='w-4 h-4 mr-1' />
											{user.username}
										</Link>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='w-full border-[#EA6D0C]/50 text-white hover:bg-gradient-to-r hover:from-[#AF2D03] hover:to-[#EA6D0C] hover:border-transparent transition-all duration-300'
										onClick={() => {
											logout();
											setIsOpen(false);
										}}
									>
										<LogOut className='w-4 h-4 mr-1' />
										Logout
									</Button>
								</>
							) : (
								<>
									<Button
										variant='outline'
										size='sm'
										className='w-full border-[#EA6D0C]/50 text-white hover:bg-[#1A1A2E] hover:text-[#F97316] hover:border-[#F97316] transition-all duration-300'
										asChild
									>
										<Link
											to='/login'
											onClick={() => setIsOpen(false)}
											className='flex items-center'
										>
											<LogIn className='w-4 h-4 mr-1' />
											Login
										</Link>
									</Button>
									<Button
										size='sm'
										className='w-full bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold shadow-md shadow-[#EA6D0C]/25 transition-all duration-300'
										asChild
									>
										<Link to='/signup' onClick={() => setIsOpen(false)}>
											Sign Up
										</Link>
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
