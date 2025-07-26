// ✅ SignupPage.tsx
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
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const { signup, isLoading } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username || !password) return;

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		if (!agreedToTerms) return;

		try {
			const success = await signup(username, password, confirmPassword);
			if (success) {
				toast({
					title: "Account Created",
					description: "Your account has been created successfully!",
				});
				navigate("/");
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
		<div className='flex flex-col min-h-screen bg-background'>
			<Navbar />
			<main className='container flex items-center justify-center flex-grow py-12'>
				<Card className='w-full max-w-md glass-card'>
					<CardHeader className='space-y-1'>
						<div className='flex items-center justify-center gap-2 mb-2'>
							<UserPlus className='w-6 h-6 text-secondary' />
							<CardTitle className='text-2xl'>Create an Account</CardTitle>
						</div>
						<CardDescription className='text-center'>
							Enter your Kick username to register and join the community
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='username'>Kick Username</Label>
								<Input
									id='username'
									placeholder='Enter your Kick username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
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
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='confirmPassword'>Confirm Password</Label>
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
								/>
								{passwordError && (
									<p className='mt-1 text-xs text-red-500'>{passwordError}</p>
								)}
							</div>

							<div className='flex items-center space-x-2'>
								<Checkbox
									id='terms'
									checked={agreedToTerms}
									onCheckedChange={(checked) =>
										setAgreedToTerms(checked as boolean)
									}
								/>
								<label
									htmlFor='terms'
									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
								>
									I agree to the{" "}
									<Link to='/terms' className='text-primary hover:underline'>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link to='/privacy' className='text-primary hover:underline'>
										Privacy Policy
									</Link>
								</label>
							</div>
						</CardContent>

						<CardFooter className='flex flex-col space-y-4'>
							<Button
								type='submit'
								className='w-full'
								disabled={isLoading || !agreedToTerms}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>

							<div className='text-sm text-center'>
								Already have an account?{" "}
								<Link to='/login' className='text-primary hover:underline'>
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
