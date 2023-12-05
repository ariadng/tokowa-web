import { Button, useSheet } from "@/library/ui";
import styles from "./styles/style.module.scss";
import { LoginForm } from "../login-form";
import { RegisterForm } from "../register-form";
import { NavLink } from "react-router-dom";

export function LoginPage() {

	const sheet = useSheet();

	const openLoginSheet = () => {
		sheet.open({
			title: "Login",
			component: <div className="p-6">
				<LoginForm />
			</div>
		});
	};

	const openRegisterSheet = () => {
		sheet.open({
			title: "Register",
			component: <div className="p-6">
				<RegisterForm />
			</div>
		});
	};

	return (
		<div className={styles.LoginPage}>

			<div className={styles.Cover}>
				<img src="/pages/login_bg.webp" />
				<div className={styles.Header}>
					<NavLink to="/">
						<img src="/logo/logotype.svg" height="48" />
					</NavLink>
				</div>
			</div>
			
			<div className={styles.Text}>
				<h2>Welcome to TokoWA</h2>
				<p className={styles.Lead}>
					Please login or register to continue
				</p>

				<div className={styles.Form}>
					<LoginForm />
					<Button label="Register" width="full" href="/register" />
				</div>

			</div>

			<div className={styles.Actions}>
				<Button label="Login" width="full" color="dark" onClick={() => openLoginSheet()} />
				<Button label="Daftar" width="full" color="default" onClick={() => openRegisterSheet()} />
			</div>

		</div>
	);

}