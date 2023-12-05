"use client";

import { useDateSelector } from "./context";

import classNames from "classnames";
import styles from "./styles/style.module.scss";
import { DateViews } from "./components/date-views";

export function DateSelectorComponent (props: {
	className?: string;
}) {

	return (
		<div className={classNames(styles.DateSelectorComponent, props.className)}>
			
			<DateViews />

		</div>
	);

}