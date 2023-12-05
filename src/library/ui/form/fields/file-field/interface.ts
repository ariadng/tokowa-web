export interface FileFieldProps {
	name: string;
	button?: {
		label?: string;
	}
	preprocess?: (file: File) => Promise<File>;
}