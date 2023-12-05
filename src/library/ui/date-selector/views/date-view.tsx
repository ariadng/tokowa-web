"use client";

import { useDateSelector } from "../context";

import classNames from "classnames";
import styles from "../styles/style.module.scss";
import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { DateTimeUtils } from "../../utils";

export function DateView (props: {
	offsetMonth: number;
}) {

	const context = useDateSelector();
	const date = useMemo(() => context.displayDate.plus({ months: props.offsetMonth }), [props.offsetMonth]);
	const title = `${date.monthLong} ${date.year}`;

	const dates = useMemo(() => DateTimeUtils.getDatesInMonth(date), [date]);

	const min = useMemo(() => {
		if (context.selectDateIndex === 0) return context.min;
		const previousDate = context.values[context.selectDateIndex - 1];
		return previousDate || context.min;
	}, [context.min, context.selectDateIndex]);

	const max = useMemo(() => {
		if (context.selectDateIndex === 0) return context.max;
		const previousValue = context.values[context.selectDateIndex - 1];
		if (!previousValue) return context.max;
		let disabledDates = context.disabledDates.filter(item => item && item.toMillis() > previousValue.toMillis());
		disabledDates = disabledDates.sort((a, b) => (a && b) ? a.toMillis() - b.toMillis() : 0)
		if (disabledDates[0]) return disabledDates[0];
		return context.max;
	}, [context.max, context.selectDateIndex]);

	const isSelected = (item: DateTime) => DateTimeUtils.isDateInArray(item, context.values);
	const isSelectedFirst = (item: DateTime) => context.ranged && context.values.findIndex(value => value && DateTimeUtils.datesInSameDay(value, item)) === 0;
	const isSelectedLast = (item: DateTime) => context.ranged && context.values.findIndex(value => value && DateTimeUtils.datesInSameDay(value, item)) === (context.numberOfDates - 1);
	const isDifferentMonth = (item: DateTime) => !DateTimeUtils.datesInSameMonth(date, item);
	const isToday = (item: DateTime) => DateTimeUtils.isDateToday(item);
	const isOutOfRange = (item: DateTime) => !DateTimeUtils.isDateInsideRange(item, min, max);
	const isDisabled = (item: DateTime) => {
		if (context.selectDateIndex === 0) return DateTimeUtils.isDateInArray(item, context.disabledDates);
		return (DateTimeUtils.isDateInArray(item, context.disabledDates) && (max ? !DateTimeUtils.datesInSameDay(item, max) : true));
	};
	const isHighlighted = (item: DateTime) => DateTimeUtils.isDateBetweenRange(item, context.values[0], context.values[context.numberOfDates - 1]);

	const selectDate = (index: number, selectedDate: DateTime) => {
		if (
			!isDifferentMonth(selectedDate)
			&& !isOutOfRange(selectedDate)
			&& (!isDisabled(selectedDate) || (max ? DateTimeUtils.datesInSameDay(selectedDate, max) : false))
		) {
			let updated = context.values;
			// Reset values if index is zero
			if (index === 0) updated = [];

			// Selected date must not be disabled
			if (isDisabled(selectedDate) && (max ? !DateTimeUtils.datesInSameDay(selectedDate, max) : true)) return;
			// Selected date must not be out of range
			if (isOutOfRange(selectedDate)) return;
			
			// Selected date must be greater than previous values
			const previousValues = index > 0 ? context.values.slice(0, index) : [];
			if (previousValues.findIndex(item => item && item.toMillis() >= selectedDate.toMillis()) >= 0) return;

			// Set updated date
			updated[index] = selectedDate;
			
			// Remove next value if it is smaller
			const nextValue = context.values[index + 1];
			if (context.ranged && nextValue && nextValue.toMillis() <= selectedDate.toMillis()) {
				updated[index + 1] = null;
			}
			
			context.updateValues(updated);
			
			// Check if this is a ranged input
			if (context.ranged && context.selectDateIndex < (context.numberOfDates - 1)) {
				context.setSelectDateIndex(context.selectDateIndex + 1);
			} else {
				context.setSelectDateIndex(0);
			}
		}
	};

	return (
		<div className={classNames(styles.DateView, "date-view")}>

			<div className={styles.Header}>
				{title}
			</div>

			<div className={styles.Dates}>

				{dates.map(item => (
					<button
						key={item.toMillis()}
						className={classNames(styles.Cell, {
							[styles.DifferentMonth]: isDifferentMonth(item),
							[styles.Today]: isToday(item),
							[styles.OutOfRange]: isOutOfRange(item),
							[styles.Disabled]: isDisabled(item),
							[styles.Selected]: isSelected(item),
							[styles.SelectedFirst]: isSelectedFirst(item),
							[styles.SelectedLast]: isSelectedLast(item),
							[styles.Highlighted]: isHighlighted(item),
						})}
						onClick={() => selectDate(context.selectDateIndex, item)}
					>
						{item.day}
					</button>
				))}
				
			</div>

		</div>
	);

}