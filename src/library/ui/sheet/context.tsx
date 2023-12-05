"use client";

import { ReactNode, createContext, useContext, useMemo, useRef, useState } from "react";
import { SheetContextProps, SheetProps, SheetProviderProps } from "./interface";
import { useScrim } from "../scrim";
import { Sheet } from "./component";

export const SheetContext = createContext<SheetContextProps>({
	open: () => {},
	close: () => {},
});

export function SheetProvider (props: SheetProviderProps) {

	const scrim = useScrim();

	const onClose = useRef<Function|null>(null);

	const [ isOpen, setIsOpen ] = useState<boolean>(false);
	const [ component, setComponent ] = useState<ReactNode | null>(null);
	const [ sheet, setSheet ] = useState<SheetProps | null>(null);
	
	const open = (sheet: SheetProps) => {
		scrim.open(() => {
			setIsOpen(false);
			if (sheet.onClose) sheet.onClose(null);
		});
		setComponent(sheet.component);
		setSheet(sheet);
		if (sheet.onClose) onClose.current = sheet.onClose;
		setIsOpen(true);
	};

	const close = (data?: any | null) => {
		if (onClose.current) onClose.current(typeof data !== "undefined" ? data : null);
		scrim.close();
		setIsOpen(false);
		onClose.current = null;
		setSheet(null);
		setComponent(null);
	};

	const value: SheetContextProps = useMemo(() => {
		return {
			open,
			close,
		};
	}, []);

	return (
		<SheetContext.Provider value={value}>
			{props.children}
			<Sheet active={isOpen} title={sheet?.title || undefined}>
				{component}
			</Sheet>
		</SheetContext.Provider>
	);
}

export function useSheet() {
	return useContext(SheetContext);
}