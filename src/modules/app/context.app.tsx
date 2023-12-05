import { createContext, useContext, useEffect, useState } from "react";
import { ScrimProvider, SheetProvider } from "@/library/ui";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "./layouts";
import { getUser } from "./utils/user";

export interface AppContextProps {
	user: any | null;
	logout: Function;
}

export const AppContext = createContext<AppContextProps>({
	user: null,
	logout: () => {},
});

export function AppProvider(props: {
	tabBar?: boolean;
}) {

	const location = useLocation();
	const navigate = useNavigate();

	const [user, setUser] = useState<any|null>(null);

	const loadUser = async (token?: string) => {
		const sessionToken = token ?? localStorage.getItem("token");
		if (sessionToken) {
			setUser(await getUser(sessionToken));
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		navigate("/login");
	};

	const contextValue: AppContextProps = {
		user,
		logout,
	};

	useEffect(() => {
		if (location.search && location.search !== "") {
			const searchParams = new URLSearchParams(location.search);
			if (searchParams.has("token")) {
				localStorage.setItem("token", searchParams.get("token")!);
				loadUser(searchParams.get("token")!);
			}
		} else {
			loadUser();
		}
	}, [location]);

	return (
		<AppContext.Provider value={contextValue}>
			<ScrimProvider>
				<SheetProvider>
					<AppLayout tabBar={props.tabBar}>
						<Outlet />
					</AppLayout>
				</SheetProvider>
			</ScrimProvider>
		</AppContext.Provider>
	);

}

export function useApp() {
	return useContext(AppContext);
}