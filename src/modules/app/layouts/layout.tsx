import { ReactNode } from "react";
import { TabBar } from "../components";
import styles from "./styles/style.module.scss";

export function AppLayout(props: {
	children?: ReactNode;
	tabBar?: boolean;
}) {

	return (
		<div className={styles.AppLayout}>
			<div className={styles.AppContent}>
				{props.children}
			</div>
			{props.tabBar && <TabBar />}
		</div>
	);

}