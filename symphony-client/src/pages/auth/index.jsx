import { Background, Victory } from "@/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { TabsList } from "@radix-ui/react-tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const validateSignup = () => {
		if (!email.length) {
			toast.error("Email is required.");
			return false;
		}
		if (!password.length) {
			toast.error("Password is required.");
			return false;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return false;
		}
		return true;
	};

	const validateLogin = () => {
		if (!email.length) {
			toast.error("Email is required.");
			return false;
		}
		if (!password.length) {
			toast.error("Password is required.");
			return false;
		}

		return true;
	};

	const handleLogin = async () => {
		if (validateLogin()) {
			try {
				const response = await apiClient.post(
					LOGIN_ROUTE,
					{ email, password },
					{ withCredentials: true }
				);
				if (response.data.user.id) {
					if (response.data.user.profileSetup) {
						navigate("/chat");
					} else {
						navigate("/profile");
					}
				}
				console.log(response);
				toast.success("Login successful.");
			} catch (error) {
				if (
					error.response &&
					error.response.data &&
					error.response.data.message
				) {
					toast.error(`Login failed`, {
						description: `${error.response.data.message}`,
					});
				} else {
					toast.error("An unexpected error occurred during login.");
				}
				console.error("Login error:", error);
			}
		}
	};

	const handleSignup = async () => {
		if (validateSignup()) {
			try {
				const response = await apiClient.post(
					SIGNUP_ROUTE,
					{ email, password },
					{ withCredentials: true }
				);
				if (response.status === 201) {
					navigate("/profile");
				}
				console.log(response);
				toast.success("Registration successful.");
			} catch (error) {
				if (
					error.response &&
					error.response.data &&
					error.response.data.message
				) {
					toast.error(`Signup failed`, {
						description: `${error.response.data.message}`,
					});
				} else {
					toast.error("An unexpected error occurred during signup.");
				}
				console.error("Signup error:", error);
			}
		}
	};

	return (
		<div className="h-[100vh] w-[100vw] flex items-center justify-center">
			<div className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-xl rounded-xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] grid lg:grid-cols-2">
				<div className="flex flex-col gap-10 items-center justify-center">
					<div className="flex items-center justify-center flex-col">
						<div className="flex items-center justify-center">
							<h1 className="text-5xl font-bold">Welcome</h1>
							<img src={Victory} alt="welcome-emoji" className="h-[80px]" />
						</div>
						<p className="font-medium text-center">
							Fill in the details to join Symphony!
						</p>
					</div>
					<div className="flex items-center justify-center w-full">
						<Tabs className="w-3/4" defaultValue="login">
							<TabsList className="bg-transparent rounded-none w-full flex">
								<TabsTrigger
									value="login"
									className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all"
								>
									Login
								</TabsTrigger>
								<TabsTrigger
									value="signup"
									className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all"
								>
									Signup
								</TabsTrigger>
							</TabsList>
							<TabsContent value="login" className="flex flex-col gap-5 mt-10">
								<Input
									placeholder="Email"
									type="email"
									className="rounded-md p-5"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Input
									placeholder="Password"
									type="password"
									className="rounded-md p-5"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Button className="rounded-md p-5" onClick={handleLogin}>
									Login
								</Button>
							</TabsContent>
							<TabsContent value="signup" className="flex flex-col gap-5">
								<Input
									placeholder="Email"
									type="email"
									className="rounded-md p-5"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Input
									placeholder="Password"
									type="password"
									className="rounded-md p-5"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Input
									placeholder="Confirm password"
									type="password"
									className="rounded-md p-5"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<Button className="rounded-md p-5" onClick={handleSignup}>
									Signup
								</Button>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<div className="flex justify-center items-center">
					<img
						src={Background}
						alt="background-login"
						className="h-[600px] hidden lg:block"
					/>
				</div>
			</div>
		</div>
	);
};

export default Auth;
