import { ReactNode } from "react";

export interface ScrimProps {
	active: boolean;
	onClose: () => void;
	opacity?: number;
}

export interface ScrimContextProps {
	open: (onClose?: () => void) => void;
	close: () => void;
}

export interface ScrimProviderProps {
	children: ReactNode;
}