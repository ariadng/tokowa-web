import classNames from "classnames";
import styles from "./styles/style.module.scss";
import { useForm } from "../..";
import { ChangeEventHandler, useMemo } from "react";
import { NumberFieldProps } from "./interface";

export function NumberField(props: NumberFieldProps) {

	const form = useForm();

	const value = useMemo(() => {
		const rawValue = form.getValue(props.name);
		if (rawValue) return String(rawValue);
		return "";
	}, [form.values]);

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		event.preventDefault();
		const inputValue = event.target.value.replace(/[^0-9]/g, '');;
		form.updateValue(props.name, inputValue);
	}
	
	return (
		<div className={classNames(
			styles.TextField,
		)}>
			{props.label && (
				<label htmlFor="#">{props.label}</label>
			)}
			{props.description && (
				<p className={styles.Description}>{props.description}</p>
			)}
			<input type="number" value={value} onChange={handleInputChange} />
		</div>
	);

}