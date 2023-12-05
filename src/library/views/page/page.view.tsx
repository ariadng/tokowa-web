import { ReactNode } from "react";
import styles from "./styles/style.module.scss";
import classNames from "classnames";

export function Page(props: {
	children?: ReactNode;
	className?: string;
}) {

	return (
		<div className={classNames(styles.Page, props.className)}>
			{props.children}
		</div>
	)

}