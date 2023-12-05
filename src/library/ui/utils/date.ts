import { DateTime, Info } from "luxon";

export class DateTimeUtils {

	// ======================================================================================================

	// Get now datetime
	static getNow(): DateTime {
		return this.setLocaleZone(DateTime.now());
	} // ↑ getNow

	// Get today's date
	static getToday(): DateTime {
		return this.setLocaleZone(DateTime.now().startOf("day"));
	} // ↑ getToday

	// Get today's date in string
	static getTodayString(): string {
		return this.convertDateTimeToString(this.getToday());
	} // ↑ getTodayString

	// Get tomorrow's date
	static getTomorrow(input?: DateTime | string): DateTime {
		let date: DateTime;
		if (input) {
			if (typeof input === "string") date = this.convertStringToDateTime(input)!;
			else date = input;
		} else {
			date = this.getToday();
		}
		return date.plus({ days: 1 });
	} // ↑ getTomorrow

	// Get today's date in string
	static getTomorrowString(input?: DateTime | string): string {
		return this.convertDateTimeToString(this.getTomorrow(input));
	} // ↑ getTomorrowString

	// Get first date on month
	static getFirstMonthDay(input?: DateTime) {
		return this.setLocaleZone(input ? input : DateTime.now()).startOf("month");
	} // ↑ getFirstMonthDay

	// Get weekdays
	static getWeekdays(length: ("narrow" | "short" | "long") = "short", locale = "id-ID"): string[] {
		return Info.weekdays(length, { locale });
	} // ↑ getFirstMonthDay

	// Get calendar dates in month
	static getDatesInMonth(input: DateTime): DateTime[] {
		const firstDate = input.startOf("month");
		const lastDate = input.endOf("month");
		const currentMonthDays = input.daysInMonth || 0;
		const currentMonthDates: DateTime[] = [];

		for (let i = 0; i < currentMonthDays; i++) {
			currentMonthDates.push(firstDate.plus({ days: i }));
		}

		const daysBefore = firstDate.weekday > 0 ? firstDate.weekday - 1 : 0;
		const firstPrevMonthDate = firstDate.plus({ days: daysBefore * -1 });
		const prevMonthDates: DateTime[] = [];

		for (let i = 0; i < daysBefore; i++) {
			prevMonthDates.push(firstPrevMonthDate.plus({ days: i }));
		}

		const daysAfter = lastDate.weekday < 7 ? 7 - lastDate.weekday : 0;
		const firstNextMonthDate = lastDate.plus({ days: 1 });
		const nextMonthDates: DateTime[] = [];

		for (let i = 0; i < daysAfter; i++) {
			nextMonthDates.push(firstNextMonthDate.plus({ days: i }));
		}

		return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
	} // ↑ getDatesInMonth

	static getDatesInMonthString (month: number, year: number): string[] {
		const list = this.getDatesInMonth(this.getNow().set({ month, year, day: 1 }))
		return list.map(date => this.convertDateTimeToString(date));
	}

	// ======================================================================================================

	// Set DateTime locale and timezone to default
	static setLocaleZone(input: DateTime): DateTime {
		let result = input.setZone("UTC+7");
		result = result.setLocale("id-ID");
		return result;
	}

	// Convert ISO date string to DateTime
	static convertStringToDateTime(input: string | null): DateTime | null {
		if (!input) return null;
		let date = this.setLocaleZone(DateTime.fromISO(input));
		return date;
	} // ↑ convertStringToDateTime

	// Convert SQL date string to DateTime
	static convertSQLStringToDateTime(input: string | null): DateTime | null {
		if (!input) return null;
		let date = this.setLocaleZone(DateTime.fromSQL(input));
		return date;
	} // ↑ convertSQLStringToDateTime

	// Convert array of ISO date string to array of DateTime
	static convertStringArrayToDateTimeArray(input: (string | DateTime | null)[]): (DateTime)[] {
		const result: DateTime[] = [];
		for (let item of input) {
			if (item) {
				const date = typeof item === "string" ? this.convertStringToDateTime(item) : item;
				if (date && date.isValid) result.push(date);
			}
		}
		return result;
	} // ↑ convertStringArrayToDateTimeArray

	// Convert DateTime to ISO date string
	static convertDateTimeToString(input: DateTime): string {
		return String(input.toFormat("yyyy-MM-dd"));
	} // ↑ convertDateTimeToString

	// Convert array of DateTime to array of ISO date string
	static convertDateTimeArrayToStringArray(input: (DateTime | null)[]): (string | null)[] {
		const result: (string | null)[] = [];
		for (let item of input) {
			result.push(item ? this.convertDateTimeToString(item) : null);
		}
		return result;
	} // ↑ convertDateTimeArrayToStringArray

	// ======================================================================================================

	// Check whether two dates are in a same day
	static datesInSameDay(current: DateTime, compare: DateTime): boolean {
		const sameDay = current.day === compare.day;
		const sameMonth = current.month === compare.month;
		const sameYear = current.year === compare.year;
		return sameDay && sameMonth && sameYear;
	} // ↑ datesInSameDay

	// Check whether two dates are in a same month
	static datesInSameMonth(current: DateTime, compare: DateTime): boolean {
		return (current.month === compare.month) && (current.year === compare.year);
	} // ↑ datesInSameMonth

	// Check whether the date is today
	static isDateToday(input: DateTime): boolean {
		const today = DateTime.now();
		return (today.day === input.day) && (today.month === input.month) && (today.year === input.year);
	} // ↑ isDateToday

	// Check whether the date is inside a range
	static isDateInsideRange(input: DateTime, min?: DateTime | null, max?: DateTime | null): boolean {
		if (!min && !max) return true;
		let result: boolean = false;
		if (min) result = (input >= min);
		if (max) result = result && (input <= max);
		return result;
	} // ↑ isDateInsideRange

	// Check whether the date is between a range
	static isDateBetweenRange(input: DateTime, min?: DateTime | null, max?: DateTime | null): boolean {
		if (!min || !max) return false;
		let result: boolean = false;
		if (min) result = (input > min);
		if (max) result = result && (input < max);
		return result;
	} // ↑ isDateBetweenRange

	// Check whether the date is included inside array
	static isDateInArray(input: DateTime, list: (DateTime | null)[]): boolean {
		if (list.length === 0) return false;
		const filtered = list.filter(item => item ? this.datesInSameDay(item, input) : false);
		return filtered.length > 0;
	} // ↑ isDateInArray

	// Check whether the date is weekend
	static isDateWeekend(input: DateTime | string): boolean {
		const date = typeof input === "string" ? this.convertStringToDateTime(input) : input;
		if (!date || !date.isValid) return false;
		const weekday = date?.weekday;
		return weekday === 5 || weekday === 6;
	}

	// ======================================================================================================

	// Get duration in days between 2 dates
	static getDaysBetween(from: string | DateTime, to: string | DateTime): number {
		const fromDate = typeof from === "string" ? this.convertStringToDateTime(from) : from;
		const toDate = typeof to === "string" ? this.convertStringToDateTime(to) : to;
		if (fromDate && toDate && fromDate.isValid && toDate.isValid) {
			return Math.abs(fromDate.diff(toDate, ["days"]).days);
		}
		return 0;
	}

	static reduceDateRanges(input: DateTime[] | string[]): string[] {
		const dateRanges: string[] = [];
		const dates: DateTime[] = this.convertStringArrayToDateTimeArray(input);
		let start: DateTime | null = null;
		let end: DateTime | null = null;

		for (let i = 0; i < dates.length; i++) {
			if (!start) {
				start = dates[i];
				end = dates[i];
			} else if (dates[i].diff(end!, 'days').days === 1) {
				end = dates[i];
			} else {
				dateRanges.push(this.formatDateRange(start, end!));
				start = dates[i];
				end = dates[i];
			}
		}

		if (start && end) {
			dateRanges.push(this.formatDateRange(start, end));
		}

		return dateRanges;
	}

	static formatDateRange(start: DateTime, end: DateTime): string {
		if (start.equals(end)) {
			return start.toLocaleString({ day: "numeric", month: "short" });
		} else if (start.month === end.month) {
			return `${start.toLocaleString({ day: "numeric" })}-${end.toLocaleString({ day: "numeric", month: "short" })}`;
		} else {
			return `${start.toLocaleString({ day: "numeric", month: "short" })} - ${end.toLocaleString({ day: "numeric", month: "short" })}`;
		}
	}

} // ↑ class DateTimeUtils