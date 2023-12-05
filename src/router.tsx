import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./modules/auth";
import { AppProvider } from "./modules/app";
import { GuestGuard } from "./modules/auth/route-loaders/guest.guard";
import { AuthGuard } from "./modules/auth/route-loaders/auth.guard";
import { GuestProfilePage } from "./modules/guest";
import { HomePage } from "./modules/shared/home";
import { RegisterPage } from "./modules/auth/login/register.page";
import { AboutPage } from "./modules/shared/about/about.page";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AppProvider tabBar={true} />,
		children: [
			{
				path: "/",
				element: <HomePage />
			},
			{
				path: "/about",
				element: <AboutPage />,
			},
			{
				path: "/login",
				element: <LoginPage />,
				loader: GuestGuard,
			},
			{
				path: "/register",
				element: <RegisterPage />,
				loader: GuestGuard,
			},
			{
				path: "/profile",
				element: <GuestProfilePage />,
				loader: AuthGuard,
			},
		],
	},
]);