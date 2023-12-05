"use client";

import classNames from 'classnames';
import styles from './style.module.scss';

interface Props {
	color?: string,
	size?: "normal" | "medium" | "large";
	className?: string,
}

export function LoadingSpinner ({
	color,
	size = "normal",
	className,
}: Props) {

	const getSpinnerSize = (): number => {
		switch (size) {
			case "large":
				return 48;
			case "medium":
				return 32;
			default:
				return 24;
		}
	};

	return (
		<div className={classNames(
			styles.LoadingSpinner,
			styles['_size_' + size],
			className,	
		)}>
			<svg
				className={styles.Front}
				xmlns="http://www.w3.org/2000/svg"
				width={getSpinnerSize()}
				height={getSpinnerSize()}
				viewBox={`0 0 24 24`}
				fill="none"
			>
				<path
					fill={color ? color : "var(--color-primary, #000000)"}
					d="M24 12C24 9.62662 23.2962 7.30655 21.9776 5.33316C20.6591 3.35977 18.7849 1.8217 16.5922 0.913446C14.3995 0.005194 11.9867 -0.232446 9.65892 0.230577C7.33114 0.693599 5.19295 1.83649 3.51472 3.51472C1.83649 5.19295 0.693599 7.33114 0.230577 9.65892C-0.232446 11.9867 0.00519403 14.3995 0.913446 16.5922C1.8217 18.7849 3.35977 20.6591 5.33316 21.9776C7.30655 23.2962 9.62662 24 12 24L12 21C10.22 21 8.47991 20.4722 6.99987 19.4832C5.51983 18.4943 4.36627 17.0887 3.68508 15.4442C3.0039 13.7996 2.82567 11.99 3.17293 10.2442C3.5202 8.49836 4.37737 6.89471 5.63604 5.63604C6.89471 4.37737 8.49836 3.5202 10.2442 3.17293C11.99 2.82567 13.7996 3.0039 15.4442 3.68508C17.0887 4.36627 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12H24Z"
				/>
			</svg>
		</div>
	);
}