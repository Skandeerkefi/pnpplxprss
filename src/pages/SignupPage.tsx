import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

function SignupPage() {
	const [username, setUsername] = useState("");
	const [rainbetUsername, setRainbetUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const { signup, isLoading } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username || !rainbetUsername || !password || !confirmPassword) return;

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		if (!agreedToTerms) return;

		try {
			const success = await signup(
				username,
				rainbetUsername,
				password,
				confirmPassword
			);
			if (success) {
				toast({
					title: "Account Created",
					description: "Your account has been created successfully!",
				});
				navigate("/login");
			}
		} catch (error: any) {
			toast({
				title: "Signup Failed",
				description: error.message || "Unexpected error occurred.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#1A1A2E] to-[#0D0D0D] text-white'>
			<Navbar />

			<main className='container flex items-center justify-center flex-grow py-12'>
				<Card className='w-full max-w-md bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D] border border-[#EA6D0C]/30 text-white shadow-2xl shadow-black/30 rounded-xl'>
					<CardHeader className='space-y-1'>
						<div className='flex items-center justify-center gap-2 mb-2'>
							<UserPlus className='w-6 h-6 text-[#F97316]' />
							<CardTitle className='text-2xl bg-gradient-to-r from-[#F97316] to-[#EA6D0C] bg-clip-text text-transparent'>
								Create an Account
							</CardTitle>
						</div>
						<CardDescription className='text-center text-white/70'>
							Enter your Kick and Rainbet usernames to register and join the
							community
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className='space-y-4'>
							{/* Kick Username */}
							<div className='space-y-2'>
								<Label htmlFor='username' className='text-[#F97316]'>
									Kick Username
								</Label>
								<Input
									id='username'
									placeholder='Enter your Kick username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className='bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316] transition-colors duration-300'
								/>
							</div>

							{/* Rainbet Username */}
							<div className='space-y-2'>
								<Label htmlFor='rainbetUsername' className='text-[#F97316]'>
									Rainbet Username
								</Label>
								<Input
									id='rainbetUsername'
									placeholder='Enter your Rainbet username'
									value={rainbetUsername}
									onChange={(e) => setRainbetUsername(e.target.value)}
									required
									className='bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316] transition-colors duration-300'
								/>
							</div>

							{/* Password */}
							<div className='space-y-2'>
								<Label htmlFor='password' className='text-[#F97316]'>
									Password
								</Label>
								<Input
									id='password'
									type='password'
									placeholder='Create a password'
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										setPasswordError("");
									}}
									required
									className='bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316] transition-colors duration-300'
								/>
							</div>

							{/* Confirm Password */}
							<div className='space-y-2'>
								<Label htmlFor='confirmPassword' className='text-[#F97316]'>
									Confirm Password
								</Label>
								<Input
									id='confirmPassword'
									type='password'
									placeholder='Confirm your password'
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setPasswordError("");
									}}
									required
									className='bg-[#0D0D0D] border border-[#EA6D0C]/50 text-white placeholder:text-white/50 focus:border-[#F97316] transition-colors duration-300'
								/>
								{passwordError && (
									<p className='mt-1 text-xs text-[#F97316]'>{passwordError}</p>
								)}
							</div>

							{/* Terms Agreement */}
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='terms'
									checked={agreedToTerms}
									onCheckedChange={(checked) =>
										setAgreedToTerms(checked as boolean)
									}
									className='border-[#EA6D0C] data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]'
								/>
								<label
									htmlFor='terms'
									className='text-sm leading-none text-white/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
								>
									I agree to the{" "}
									<Link to='/terms' className='text-[#F97316] hover:underline'>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to='/privacy'
										className='text-[#F97316] hover:underline'
									>
										Privacy Policy
									</Link>
								</label>
							</div>
						</CardContent>

						<CardFooter className='flex flex-col space-y-4'>
							<Button
								type='submit'
								className='w-full bg-gradient-to-r from-[#AF2D03] to-[#EA6D0C] hover:from-[#EA6D0C] hover:to-[#F97316] text-white font-semibold shadow-md shadow-[#EA6D0C]/25 transition-all duration-300'
								disabled={isLoading || !agreedToTerms}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>

							<div className='text-sm text-center text-white/70'>
								Already have an account?{" "}
								<Link to='/login' className='text-[#F97316] hover:underline'>
									Sign In
								</Link>
							</div>
						</CardFooter>
					</form>
				</Card>
			</main>

			<Footer />
		</div>
	);
}

export default SignupPage;
