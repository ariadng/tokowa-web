import { FormEventHandler, ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

export interface FormValues {
	[key: string]: any;
}

export interface FormContextProps {
	values: FormValues;
	getValue: Function;
	updateValue: Function;
	submit: Function;
}

export const FormContextDefaults: FormContextProps = {
	values: {},
	getValue: () => {},
	updateValue: () => {},
	submit: () => {},
}

export const FormContext = createContext<FormContextProps>(FormContextDefaults);

export interface FormProviderProps {
	initialValue?: FormValues;
	contextRef?: (ref: FormContextProps) => void;
	onSubmit?: Function;
	children?: ReactNode;
	className?: string;
}

export function Form(props: FormProviderProps) {

	const [ values, setValues ] = useState<FormValues>(props.initialValue ?? {});

	// Form events

	const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		if (props.onSubmit) {
			props.onSubmit(values);
		}
	};

	// Context-related events & values

	const getValue = (key: string): any => {
		return values[key];
	}

	const updateValue = (key: string, value: any) => {
		setValues({...values, [key]: value});
	};

	const submit = () => {
		if (props.onSubmit) {
			props.onSubmit(values);
		}
	};

	const contextValue: FormContextProps = useMemo(() => {
		return {
			values, getValue, updateValue,
			submit,
		}
	}, [values]);

	useEffect(() => {
		if (props.contextRef) {
			props.contextRef(contextValue);
		}
	}, [props.contextRef, contextValue]);

	return (
		<FormContext.Provider value={contextValue}>
			<form
				className={props.className}
				onSubmit={handleFormSubmit}
			>
				{props.children}
			</form>
		</FormContext.Provider>
	)

}

export function useForm() {
	return useContext(FormContext);
}