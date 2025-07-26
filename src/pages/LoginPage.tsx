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
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username || !password) return;

		try {
			const success = await login(username, password);

			if (success) {
				toast({
					title: "Logged In",
					description: `Welcome back, ${username}!`,
				});
				navigate("/");
			}
		} catch (error: any) {
			toast({
				title: "Login Failed",
				description: error.message || "Invalid username or password.",
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
							<LogIn className='w-6 h-6 text-secondary' />
							<CardTitle className='text-2xl'>Login</CardTitle>
						</div>
						<CardDescription className='text-center'>
							Enter your Kick username and password to access your account
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='username'>Kick Username</Label>
								<Input
									id='username'
									placeholder='Enter your username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='password'>Password</Label>
									<Link
										to='/forgot-password'
										className='text-xs text-primary hover:underline'
									>
										Forgot password?
									</Link>
								</div>
								<Input
									id='password'
									type='password'
									placeholder='Enter your password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						</CardContent>

						<CardFooter className='flex flex-col space-y-4'>
							<Button type='submit' className='w-full' disabled={isLoading}>
								{isLoading ? "Signing In..." : "Sign In"}
							</Button>

							<div className='text-sm text-center'>
								Don't have an account?{" "}
								<Link to='/signup' className='text-primary hover:underline'>
									Sign Up
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

export default LoginPage;
