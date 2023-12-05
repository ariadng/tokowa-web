import { useApp } from "@/modules/app";
import styles from "./styles/style.module.scss";
import { Button, Icon, useSheet } from "@/library/ui";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { Page } from "@/library/views";

export function GuestProfilePage() {

	const sheet = useSheet();
	const location = useLocation();
	const navigate = useNavigate();
	const [ isChildActive, setIsChildActive ] = useState<boolean>(false);
	const { user, logout } = useApp();
	
	useEffect(() => {
		if (location.pathname !== "/profile" && location.pathname.includes("/profile")) {
			setIsChildActive(true);
		} else {
			setIsChildActive(false);
		}
	}, [location]);
	
	if (!user) return <></>;
	return (
		<Page className={classNames(
			styles.GuestProfilePage,
			{
				[styles.ChildActive]: isChildActive,
			}
		)}>
			
			<div className={styles.MainPage}>
				
				<div className={styles.PageHeader}>
					<h2 className={styles.PageTitle}>Profil</h2>
				</div>

				<div className={styles.UserBadge}>
					<div className={styles.Photo}>
						<img src="/pages/profile.png" />
					</div>
					<div className={styles.Details}>
						<div className={styles.Name}>{user.name}</div>
						<div className={styles.Info}>
							<span>{user.username}</span>
						</div>
					</div>
				</div>

				<div className={styles.SecondaryActions}>
					<Button label="Logout" width="full" color="dark" onClick={() => logout()} />
				</div>

			</div>

			<div className={styles.ChildPage}>
				<Outlet />
			</div>

		</Page>
	)

}