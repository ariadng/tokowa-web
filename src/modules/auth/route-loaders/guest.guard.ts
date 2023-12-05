import { getUser } from "@/modules/app/utils/user";
import { redirect } from "react-router-dom";

export async function GuestGuard() {
	const token = localStorage.getItem("token");
	if (token) {
		const user = await getUser(token);
		if (user) return redirect("/profile");
	}
	return null;
}