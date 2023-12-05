export async function getUser(token?: string | null) {
	const response = await fetch(import.meta.env.VITE_API_URL! + "/user/current", {
		method: "GET",
		headers: {
			'Authorization': 'Bearer ' + token,
		}
	});
	const json = await response.json();
	if (!json.error && json.user) {
		localStorage.setItem("user", JSON.stringify(json.user));
		return json.user;
	}
	return null;
}

export async function updateUser(payload: any) {
	const token = localStorage.getItem("token");
	if (!token) return null;

	const response = await fetch(import.meta.env.VITE_API_URL! + "/profile", {
		method: "PUT",
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});
	const json = await response.json();
	if (!json.error && json.data) {
		return json.data;
	}
	return null;
}