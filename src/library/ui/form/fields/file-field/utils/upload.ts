export async function uploadFile(file: File) {
	const token = localStorage.getItem("token");
	if (!token) return null;

	const payload = new FormData();
	payload.append("file", file);

	const response = await fetch(import.meta.env.VITE_API_URL! + "/storage/upload", {
		method: "POST",
		headers: {
			'Authorization': 'Bearer ' + token,
		},
		body: payload,
	});
	const json = await response.json();
	if (!json.error && json.data) {
		return json.data;
	}
	return null;
}