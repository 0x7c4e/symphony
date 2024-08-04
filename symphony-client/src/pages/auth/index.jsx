import { Background, Victory } from "@/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { useState } from "react";

const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleLogin = async () => {};

	const handleSignup = async () => {};

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
						<Tabs className="w-3/4">
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
