import classNames from "classnames";
import { TextFieldProps } from "./interface";
import styles from "./styles/style.module.scss";
import { useForm } from "../..";
import { ChangeEventHandler, useMemo } from "react";

export function TextField(props: TextFieldProps) {

	const form = useForm();

	const value = useMemo(() => {
		const rawValue = form.getValue(props.name);
		if (rawValue) return String(rawValue);
		return "";
	}, [form.values]);

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		event.preventDefault();
		form.updateValue(props.name, event.target.value);
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
			<input type="text" value={value} onChange={handleInputChange} />
		</div>
	);

}