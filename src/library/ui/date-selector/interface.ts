import { DateTime } from "luxon";

// DateSelectorView data type
export type DateSelectorView = "date" | "month" | "year";

// DateSelector context interface
export interface DateSelectorContextProps {
	// DateTime values
	values: (DateTime | null)[];
	updateValues: (newValues: (DateTime | null)[]) => void;
	ranged?: boolean;
	selectDateIndex: number;
	setSelectDateIndex: (newIndex: number) => void;
	numberOfDates: number;
	// Constraints
	disabledDates: (DateTime | null)[];
	min?: DateTime | null;
	max?: DateTime | null;
	// Component states
	displayDate: DateTime;
	updateDisplayDate: (newValue: DateTime) => void;
	currentView: DateSelectorView;
	goToView: (targetView: DateSelectorView) => void;
} // ↑ interface DateSelectorContextProps

// DateSelectorContextProps default values
export const DateSelectorContextPropsDefaults: DateSelectorContextProps = {
	values: [],
	updateValues: function (): void {
		throw new Error("Function not implemented.");
	},
	ranged: false,
	numberOfDates: 2,
	selectDateIndex: 0,
	setSelectDateIndex: function (): void {
		throw new Error("Function not implemented.");
	},
	disabledDates: [],
	displayDate: DateTime.now(),
	updateDisplayDate() {
		throw new Error("Function not implemented.");
	},
	currentView: "date",
	goToView: function (): void {
		throw new Error("Function not implemented.");
	},
}; // ↑ DateSelectorContextProps default values

// DateSelector props interface
export interface DateSelectorProps {
	className?: string;
	values?: (string | null)[];
	onChange?: (newValues: (string|null)[]) => void;
	ranged?: boolean;
	numberOfDates?: number;
	disabledDates?: string[];
	min?: string;
	max?: string;
	selectDateIndex?: number;
} // ↑ DateSelector props interface 