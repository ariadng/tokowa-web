import { Button, useSheet } from "@/library/ui";
import { Form, FormValues, PasswordField, TextField } from "@/library/ui/form";
import styles from "./styles/style.module.scss";
import { useNavigate } from "react-router-dom";

export function LoginForm() {

	const sheet = useSheet();
	const navigate = useNavigate();
	
	const handleSubmit = async (values: FormValues) => {
		const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(values),
		});
		const json = await response.json();
		if (json.error) {
			alert(json.message);
		} else {
			localStorage.setItem("token", json.token);
			sheet.close();
			navigate("/profile");
		}
	};

	return (
		<Form
			className={styles.LoginForm}
			initialValue={{
				username: "",
				password: "",
			}}
			onSubmit={handleSubmit}
		>
			<TextField name="username" label="Username" />
			<PasswordField name="password" label="Password" />
			<br />
			<Button label="Login" width="full" color="dark" type="submit" />
		</Form>
	);

}