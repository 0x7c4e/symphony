/* eslint-disable react/prop-types */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import { PuffLoader } from "react-spinners";

const override = {
	display: "block",
	margin: " auto",
	borderColor: "black",
};

const PrivateRoute = ({ children }) => {
	// checks if user is authenticated. Using double negation here '!!' because userinfo isnt expicitly a boolean, it could be an object or string, using double negation will make sure it returns a boolean.
	// if the user is authenticated, show the children passed, else show the auth page. we will use this to make sure users cant access other private routes, chat and profile.
	const { userInfo } = useAppStore();
	const isAuthenticated = !!userInfo;

	return isAuthenticated ? children : <Navigate to={"/auth"} />;
};

const AuthRoute = ({ children }) => {
	// checks if user is authenticated. Using double negation here '!!' because userinfo isnt expicitly a boolean, it could be an object or string, using double negation will make sure it returns a boolean.
	// if the user is authenicated , show the chat page, else show the children passed (the Auth page is the child passed)
	const { userInfo } = useAppStore();
	const isAuthenticated = !!userInfo;

	return isAuthenticated ? <Navigate to={"/chat"} /> : children;
};

const App = () => {
	const { userInfo, setUserInfo } = useAppStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const response = await apiClient.get(GET_USER_INFO, {
					withCredentials: true,
				});
				// Check if the response is successful and contains user data
				if (response.status === 200 && response.data.user.id) {
					// Update the global store with user info
					setUserInfo(response.data.user);
				} else {
					// If response is not as expected, clear user info
					setUserInfo(undefined);
				}

				console.log({ response });
			} catch (error) {
				// If there's an error, clear user info
				setUserInfo(undefined);
			} finally {
				// finally will run if the code in the try block resolves successfuly.
				setLoading(false);
			}
		};
		// If there's no user info in the store, fetch it
		if (!userInfo) {
			getUserData();
		} else {
			// If user info exists, set loading to false
			setLoading(false);
		}
	}, [userInfo, setUserInfo]); // This effect runs when userInfo or setUserInfo changes

	// If still loading, show a loading message
	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<PuffLoader color={"black"} cssOverride={override} size={75} />
			</div>
		);
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/auth"
					element={
						<AuthRoute>
							<Auth />
						</AuthRoute>
					}
				/>
				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<Chat />
						</PrivateRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<Navigate to={"/auth"} />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
