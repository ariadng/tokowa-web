"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { DateSelectorContextProps, DateSelectorContextPropsDefaults, DateSelectorProps, DateSelectorView } from "./interface";
import { DateSelectorComponent } from "./component";
import { DateTimeUtils } from "../utils";

// Create React.js context for DateSelector
export const DateSelectorContext = createContext<DateSelectorContextProps>(DateSelectorContextPropsDefaults);

// Context provider
export function DateSelector (props: DateSelectorProps) {

	// Values
	const values = useMemo(() => props.values ? DateTimeUtils.convertStringArrayToDateTimeArray(props.values) : [], [props.values]);
	const updateValues = (newValues: (DateTime | null)[]) => {
		if (props.onChange) props.onChange(DateTimeUtils.convertDateTimeArrayToStringArray(newValues));
	};

	// View
	const [ currentView, setCurrentView ] = useState<DateSelectorView>("date");
	const goToView = (targetView: DateSelectorView) => {
		setCurrentView(targetView);
	};

	// Display Date
	const [ displayDate, setDisplayDate ] = useState<DateTime>(
		props.values ? (DateTimeUtils.convertStringToDateTime(props.values[0]) || DateTimeUtils.getFirstMonthDay()) : DateTimeUtils.getFirstMonthDay()
	);
	const updateDisplayDate = (newValue: DateTime) => {
		setDisplayDate(newValue);
	};

	// Date selection
	const [ selectDateIndex, setSelectDateIndex ] = useState<number>(props.selectDateIndex || 0);

	// Constraints
	const ranged = useMemo(() => props.ranged || false, [props.ranged]);
	const numberOfDates = useMemo(() => props.numberOfDates || 2, [props.numberOfDates]);
	const disabledDates = useMemo(() => props.disabledDates ? DateTimeUtils.convertStringArrayToDateTimeArray(props.disabledDates) : [], [props.disabledDates]);
	const min = props.min ? DateTimeUtils.convertStringToDateTime(props.min) : undefined;
	const max = props.max ? DateTimeUtils.convertStringToDateTime(props.max) : undefined;

	// Context provider value
	const value: DateSelectorContextProps = {
		...DateSelectorContextPropsDefaults,
		values, updateValues,
		currentView, goToView,
		displayDate,
		disabledDates, updateDisplayDate,
		min, max,
		ranged, numberOfDates,
		selectDateIndex, setSelectDateIndex,
	};

	// Select date index change
	useEffect(() => {
		setSelectDateIndex(props.selectDateIndex || 0);
	}, [props.selectDateIndex]);

	return (
		<DateSelectorContext.Provider value={value}>
			<DateSelectorComponent className={props.className} />
		</DateSelectorContext.Provider>
	);

} // ↑ Context provider value

// React custom hook
export function useDateSelector () {
	return useContext(DateSelectorContext);
} // ↑ React custom hook