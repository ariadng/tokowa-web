import { Button } from "@/library/ui";
import { FileFieldProps } from "./interface";
import { ChangeEventHandler, useRef } from "react";
import { uploadFile } from "./utils/upload";
import { useForm } from "../..";
import styles from "./styles/style.module.scss";

export function FileField(props: FileFieldProps) {
	
	const inputRef = useRef<HTMLInputElement>(null);
	const form = useForm();

	const startFileUpload = async (file: File) => {

		let inputFile: File = file;

		if (props.preprocess) {
			inputFile = await props.preprocess(file);
		}

		const response = await uploadFile(inputFile);
		if (response.path) {
			form.updateValue(props.name, response.path);
		}
	};

	const handleButtonClick = () => {
		if (inputRef.current) inputRef.current.click();
	};

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			startFileUpload(selectedFile);
		}
	};

	return (
		<div className={styles.FileField}>
			<Button
				label={props?.button?.label ?? "Pilih file"}
				size="small"
				onClick={() => handleButtonClick()}
			/>
			<input
				ref={inputRef} type="file"
				onChange={handleInputChange}
			/>
		</div>
	);

}