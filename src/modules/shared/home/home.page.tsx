import { NavLink, Outlet, useLocation } from "react-router-dom";
import styles from "./styles/style.module.scss";
import { Button } from "@/library/ui";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Page } from "@/library/views";
import { useApp } from "@/modules/app";

export function HomePage() {

	const location = useLocation();
	const [ isChildActive, setIsChildActive ] = useState<boolean>(false);

	const { user } = useApp();
	
	useEffect(() => {
		if (location.pathname !== "/") {
			setIsChildActive(true);
		} else {
			setIsChildActive(false);
		}
	}, [location]);

	return (
		<Page className={classNames(
			styles.HomePage,
			{
				[styles.ChildActive]: isChildActive,
			}
		)}>

			<div className={styles.MainPage}>

				<div className={styles.Hero}>

					<div className={styles.Main} style={{
						backgroundImage: `url(/home/bg.webp)`,
					}}>
						<div className={styles.Header}>
							<NavLink to="/">
								<img src="/logo/logotype.svg" height="48" />
							</NavLink>
						</div>
						<div className={styles.Text}>
							<h1>Artificial Intelligence <br /> for your online business</h1>
							<p>
								By using <strong>TokoWA</strong>, you can leverage the AI technology to improve your online business and increase profit
							</p>
							<div className={styles.Actions}>
								{user ? (
									<Button label="Profile" icon="arrow_forward" href="/profile" />
								) : (
									<Button label = "Login or Register" href = "/login" />
								)}
							</div>
						</div>
					</div>
				</div>

			</div>

			<div className={styles.ChildPage}>
				<Outlet />
			</div>

		</Page>
	);
}