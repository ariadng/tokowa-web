import { NavLink } from "react-router-dom";
import styles from "./styles/style.module.scss";
import classNames from "classnames";
import { Icon } from "@/library/ui";
import { useApp } from "../..";

export function TabBar() {

	const { user } = useApp();

	return (
		<div className={styles.TabBar}>
			<NavLink
				to="/"
				className={({ isActive, isPending }) => classNames(
					styles.TabItem, {
						[styles.Active]: isActive,
						[styles.Pending]: isPending,
					}
				)}
			>
				<Icon className={styles.Icon} name="home" />
				<span className={styles.Label}>Home</span>
			</NavLink>
			{user ? <>
				<NavLink
					to="/profile"
					className={({ isActive, isPending }) => classNames(
						styles.TabItem, {
						[styles.Active]: isActive,
						[styles.Pending]: isPending,
					}
					)}
				>
					<Icon className={styles.Icon} name="person" />
					<span className={styles.Label}>Profile</span>
				</NavLink>
			</> : <>
				<NavLink
					to="/login"
					className={({ isActive, isPending }) => classNames(
						styles.TabItem, {
						[styles.Active]: isActive,
						[styles.Pending]: isPending,
					}
					)}
				>
					<Icon className={styles.Icon} name="person" />
					<span className={styles.Label}>Login</span>
				</NavLink>
			</>}
		</div>
	);
}