"use client";

import { useEffect, useState } from "react";
import { ScrimProps } from "./interface";

import classNames from "classnames";
import styles from "./styles/style.module.scss";

export function Scrim (props: ScrimProps) {

	const [ inactive, setInactive ] = useState<boolean>(!props.active);

	const inactivate = () => {
		setTimeout(() => {
			setInactive(true);
		}, 600);
	};

	const handleClose = () => {
		props.onClose();
	};

	useEffect(() => {
		if (props.active && inactive) {
			setInactive(false);
		}
		else if (!props.active && !inactive) {
			inactivate();
		}
	}, [props.active]);

	return (
		<div
			className={classNames(styles.Scrim, {
				[styles.Active]: props.active,
				[styles.Inactive]: inactive,
			})}
			onClick={() => handleClose()}
		></div>
	);

}