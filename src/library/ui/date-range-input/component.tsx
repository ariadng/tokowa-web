"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Icon } from "../icon";
import { usePopper } from 'react-popper';

import classNames from "classnames";
import styles from "./style.module.scss";
import { DateSelector } from "../date-selector";
import { DateTimeUtils } from "../utils";

interface Props {
	from?: string | null;
	to?: string | null;
	min?: string;
	fromLabel?: string;
	toLabel?: string;
	alwaysOpen?: boolean;
	disabledDates?: string[];
	onSelect?: (value: (string|null)[]) => void;
	onFromSelect?: (value: string|null) => void;
	onToSelect?: (value: string|null) => void;
}

export function DateRangeInput ({
	fromLabel = "Awal",
	toLabel = "Akhir",
	disabledDates = [],
	...props
}: Props) {

	const [ activeInput, setActiveInput ] = useState<"from" | "to" | null>(props.alwaysOpen ? "from" : null);
	
	const [ containerElement, setContainerElement ] = useState<HTMLDivElement | null>(null);
	const [ referenceElement, setReferenceElement ] = useState<HTMLDivElement | null>(null);
	const [ popperElement, setPopperElement ] = useState<HTMLDivElement | null>(null);
	const { attributes, styles: popperStyles, state } = usePopper(referenceElement, popperElement, {
		placement: "bottom",
		modifiers: [
			{
				name: "offset",
				options: { offset: [0, 4] }
			},
			{
				name: 'preventOverflow',
				options: {
					altAxis: true,
					rootBoundary: "viewport",
					altBoundary: true
				},
			},
		]
	});

	const handleFromClick = () => {
		if (activeInput !== "from") {
			setActiveInput("from");
		} else {
			setActiveInput(null);
		}
	};

	const handleToClick = () => {
		if (activeInput !== "to") {
			setActiveInput("to");
		} else {
			setActiveInput(null);
		}
	};
	
	const handleValuesChange = (values: (string | null)[]) => {
		if (activeInput === "from") setActiveInput("to");
		else setActiveInput(null);
		if (props.onSelect) props.onSelect(values);
	};

	const formatDisplay = (date: string): string => {
		return DateTime.fromSQL(date).setLocale("id-ID").toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
	};

	useEffect(() => {
		function handleClickOutside(e: any) {
			const target = e.target as Node;
			if (containerElement) {
				if (!containerElement.contains(target)) setActiveInput(null);
			}
		}
		if (containerElement) document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [containerElement])

	return (
		<div ref={setContainerElement} className={styles.DateRangeInputContainer}>

			<div ref={setReferenceElement} className={classNames(styles.DateRangeInput)}>
				<div className={classNames(styles.DateInput, { [styles.Active]: activeInput === "from" })} onClick={() => handleFromClick()}>
					<div className={styles.Label}>{fromLabel}</div>
					<div className={styles.Value}>{props.from ? formatDisplay(props.from) : "-"}</div>
				</div>
				<div className={classNames(styles.Separator, { [styles.Active]: activeInput })}>
					<Icon className={styles.Icon} name="arrow_forward" />
				</div>
				<div className={classNames(styles.DateInput, { [styles.Active]: activeInput === "to" })} onClick={() => handleToClick()}>
					<div className={styles.Label}>{toLabel}</div>
					<div className={styles.Value}>{props.to ? formatDisplay(props.to) : "-"}</div>
				</div>
			</div>

			{(activeInput !== null) && (
				<div ref={setPopperElement} style={{
					...popperStyles.popper,
					zIndex: 4000,
				}} {...attributes.popper}>
					<DateSelector
						className={styles.DateSelector}
						values={[props.from || null, props.to || null]}
						ranged={true}
						min={DateTimeUtils.getTodayString()}
						disabledDates={disabledDates}
						selectDateIndex={["from", "to"].indexOf(activeInput) >= 0 ? ["from", "to"].indexOf(activeInput) : 0}
						onChange={handleValuesChange}
					/>
				</div>
			)}


		</div>
	);

}