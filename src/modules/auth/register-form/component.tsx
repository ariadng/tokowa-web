import { Button, useSheet } from "@/library/ui";
import { Form, FormValues, PasswordField, TextField } from "@/library/ui/form";
import styles from "./styles/style.module.scss";
import { useNavigate } from "react-router-dom";

export function RegisterForm() {

	const sheet = useSheet();
	const navigate = useNavigate();
	
	const handleSubmit = async (values: FormValues) => {
		const response = await fetch(import.meta.env.VITE_API_URL + "/register", {
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
			alert(json.message);
			sheet.close();
			navigate("/profile");
		}
	};

	return (
		<Form
			className={styles.RegisterForm}
			initialValue={{
				username: "",
				password: "",
			}}
			onSubmit={handleSubmit}
		>
			<TextField name="name" label="Your Name" />
			<TextField name="username" label="Username" />
			<PasswordField name="password" label="Password" />
			<br />
			<Button label="Register" width="full" color="dark" type="submit" />
		</Form>
	);

}