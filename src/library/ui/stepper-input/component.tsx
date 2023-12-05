"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { Icon } from "../icon";
import classNames from "classnames";
import styles from "./style.module.scss";

interface Props {
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	onChange?: (value: number) => void;
} // ↑ interface Props

export function StepperInput (props: Props) {

	// -- Internal State
	const min = props.min ? props.min : 0;
	const max = props.max ? props.max : 100;
	const step = props.step ? props.step : 1;
	const [ value, setValue ] = useState<number>(props.value || 0);

	// -- Computed Properties
	const canStepUp = (value + step <= max);
	const canStepDown = (value - step >= min);

	// -- Internal Methods
	// Update value
	const updateValue = (newValue: number) => {
		setValue(newValue);
		if (props.onChange) props.onChange(newValue);
	};
	// Step up
	const stepUp = () => {
		if (canStepUp) updateValue(value + step);
	};
	// Step down
	const stepDown = () => {
		if (canStepDown) updateValue(value - step);
	};

	// -- Input
	// Handle input change
	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		event.preventDefault();
		let inputValue: number = 0;
		if (event.target.value !== "") {
			inputValue = Number(event.target.value);
		}
		if (inputValue >= min && inputValue <= max) updateValue(inputValue);
	};

	// -- Listeners
	// React to props value change
	useEffect(() => {
		if (props.value && props.value !== value) setValue(props.value);
	}, [props.value]);

	// -- Render UI
	return (
		<div className={classNames(
			styles.Stepper
		)}>
			<button className={styles.StepperButton} disabled={!canStepDown} onClick={() => stepDown()}>
				<Icon className={styles.Icon} name="remove" />
			</button>
			<div className={styles.Value}>
				<input value={value} onChange={handleInputChange} />
			</div>
			<button className={styles.StepperButton} disabled={!canStepUp} onClick={() => stepUp()}>
				<Icon className={styles.Icon} name="add" />
			</button>
		</div>
	);

} // ↑ function Switch