"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ScrimContextProps, ScrimProviderProps } from "./interface";
import { Scrim } from "./component";

export const ScrimContext = createContext<ScrimContextProps>({
	open: () => {},
	close: () => {},
});

export function ScrimProvider (props: ScrimProviderProps) {

	const [ active, setActive ] = useState<boolean>(false);
	const [ onClose, setOnClose ] = useState<Function | null>(null);

	const open = (onClose?: () => void) => {
		setActive(true);
		setOnClose(() => onClose);
	};

	const close = () => {
		setActive(false);
	};
	
	const handleScrimClose = () => {
		if (onClose) onClose();
		setActive(false);
	};

	const value: ScrimContextProps = useMemo(() => {
		return {
			open,
			close,
		};
	}, [])

	return (
		<ScrimContext.Provider value={value}>
			{props.children}
			<Scrim
				active={active}
				onClose={handleScrimClose}
			/>
		</ScrimContext.Provider>
	);
}

export function useScrim() {
	return useContext(ScrimContext);
}