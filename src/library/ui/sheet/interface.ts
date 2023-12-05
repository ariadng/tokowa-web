import { ReactNode } from "react";

export interface SheetComponentProps {
	active: boolean;
	children?: ReactNode;
	title?: string;
}

export interface SheetProps {
	component: ReactNode;
	onClose?: (data: any | null) => void;
	title?: string;
}

export interface SheetContextProps {
	open: (sheet: SheetProps) => void;
	close: (data?: any | null) => void;
}

export interface SheetProviderProps {
	children: ReactNode;
}