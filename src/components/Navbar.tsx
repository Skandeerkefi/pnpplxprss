import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dices, Crown, Gift, Users, LogIn, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
	const location = useLocation();
	const isMobile = useIsMobile();
	const [isOpen, setIsOpen] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [viewerCount, setViewerCount] = useState<number | null>(null);

	const { user, logout } = useAuthStore();

	useEffect(() => {
		const fetchLiveStatus = async () => {
			try {
				const res = await fetch("https://kick.com/api/v2/channels/5moking");
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
		<nav className='sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-card/70'>
			<div className='container flex items-center justify-between py-3 mx-auto'>
				{/* Logo + Live Status */}
				<div className='flex items-center gap-2'>
					<Link to='/' className='flex items-center gap-2'>
						<img
							src='https://files.kick.com/images/user/48867484/profile_image/conversion/ae281c89-eae8-44d5-ab0c-6bb20b93ee6d-fullsize.webp'
							alt='5MOKING Logo'
							className='object-cover w-10 h-10 border rounded-full shadow-sm border-white/20'
						/>
						<span className='text-xl font-bold gradient-text'>5MOKING</span>
					</Link>
					{isLive ? (
						<span className='ml-2 px-2 py-0.5 text-xs bg-red-600 text-white rounded-full animate-pulse'>
							🔴 LIVE {viewerCount !== null ? `(${viewerCount})` : ""}
						</span>
					) : (
						<span className='ml-2 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full'>
							Offline
						</span>
					)}
				</div>

				{/* Desktop Navigation */}
				{!isMobile && (
					<div className='flex items-center gap-4'>
						{/* Menu Links */}
						<div className='flex items-center'>
							{menuItems.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={`nav-link flex items-center ${
										location.pathname === item.path ? "nav-link-active" : ""
									}`}
								>
									{item.icon}
									{item.name}
								</Link>
							))}
						</div>

						{/* Authentication Buttons */}
						<div className='flex items-center gap-2'>
							{user ? (
								<>
									<Button variant='ghost' size='sm' asChild>
										<Link to='/' className='flex items-center gap-1'>
											<User className='w-4 h-4' />
											<span>{user.username}</span>
										</Link>
									</Button>
									<Button variant='outline' size='sm' onClick={logout}>
										<LogOut className='w-4 h-4 mr-1' />
										Logout
									</Button>
								</>
							) : (
								<>
									<Button variant='outline' size='sm' asChild>
										<Link to='/login' className='flex items-center'>
											<LogIn className='w-4 h-4 mr-1' />
											Login
										</Link>
									</Button>
									<Button size='sm' asChild>
										<Link to='/signup'>Sign Up</Link>
									</Button>
								</>
							)}
						</div>
					</div>
				)}

				{/* Mobile Navigation Toggle */}
				{isMobile && (
					<button
						className='p-2 rounded-md hover:bg-primary/10'
						onClick={() => setIsOpen(!isOpen)}
						aria-label='Toggle menu'
					>
						<div className='space-y-1.5'>
							<span
								className={`block h-0.5 w-6 bg-white transition-transform ${
									isOpen ? "rotate-45 translate-y-2" : ""
								}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-white transition-opacity ${
									isOpen ? "opacity-0" : ""
								}`}
							/>
							<span
								className={`block h-0.5 w-6 bg-white transition-transform ${
									isOpen ? "-rotate-45 -translate-y-2" : ""
								}`}
							/>
						</div>
					</button>
				)}
			</div>

			{/* Mobile Navigation Menu */}
			{isMobile && isOpen && (
				<div className='container flex flex-col gap-2 py-2 pb-4 mx-auto border-t border-white/10'>
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`nav-link flex items-center ${
								location.pathname === item.path ? "nav-link-active" : ""
							}`}
							onClick={() => setIsOpen(false)}
						>
							{item.icon}
							{item.name}
						</Link>
					))}
					<div className='flex flex-col gap-2 mt-2'>
						{user ? (
							<>
								<Button variant='ghost' size='sm' className='w-full' asChild>
									<Link
										to='/profile'
										onClick={() => setIsOpen(false)}
										className='flex items-center'
									>
										<User className='w-4 h-4 mr-1' />
										{user.username}
									</Link>
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='w-full'
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
								<Button variant='outline' size='sm' className='w-full' asChild>
									<Link
										to='/login'
										onClick={() => setIsOpen(false)}
										className='flex items-center'
									>
										<LogIn className='w-4 h-4 mr-1' />
										Login
									</Link>
								</Button>
								<Button size='sm' className='w-full' asChild>
									<Link to='/signup' onClick={() => setIsOpen(false)}>
										Sign Up
									</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
