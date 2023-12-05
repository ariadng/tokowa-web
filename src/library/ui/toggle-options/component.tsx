"use client";

import classNames from "classnames";
import styles from "./styles/style.module.scss";

interface Props {
	options: {
		label: string;
		value: string | number;
	}[];
	selected?: string | null;
	onChange?: Function;
}

export function ToggleOptions(props: Props) {

	return (
		<div className={styles.ToggleOptions}>
			{props.options.map(option => (
				<button
					key={option.value}
					className={classNames({
						[styles.Selected]: props.selected === option.value,
					})}
					onClick={() => { if (props.onChange) props.onChange(option.value) }}
				>
					{option.label}
				</button>
			))}
		</div>
	);

}