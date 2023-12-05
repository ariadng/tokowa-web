import { Button } from "@/library/ui";
import styles from "./styles/style.module.scss";
import { RegisterForm } from "../register-form";
import { NavLink } from "react-router-dom";

export function RegisterPage() {

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
				<h2>Register</h2>
				<p className={styles.Lead}>
					Please fill out form below to continue
				</p>

				<div className={styles.Form}>
					<RegisterForm />
					<Button label="Login" width="full" href="/login" />
				</div>

			</div>

			<div className={styles.Actions}>
				<Button label="Login" width="full" color="dark" />
				<Button label="Daftar" width="full" color="default" />
			</div>

		</div>
	);

}