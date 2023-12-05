import { Button } from "..";
import styles from "./styles/style.module.scss";

export function ScreenBar(props: {
	title: string;
	onBackClick: Function;
}) {
	return (
		<div className={styles.ScreenBar}>
			<div className={styles.Navigation}>
				<Button icon="chevron_left" size="small" onClick={() => props.onBackClick()} />
			</div>
			<div className={styles.Content}>
				<span className={styles.Title}>{props.title}</span>
			</div>
		</div>
	);
}