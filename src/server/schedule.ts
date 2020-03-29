import Mode from '../common/Mode';

export enum WeekDay {
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
	SUNDAY,
}

export interface ISchedule {
	weekdays: WeekDay[];
	mode: Mode;
	hour: number;
	minute: number;
}

export function areSchedulesEqual(first: ISchedule, second: ISchedule) {
	const firstSortedWeekdays = first.weekdays.sort((a, b) => a - b);
	const secondSortedWeekdays = second.weekdays.sort((a, b) => a - b);
	return first.mode === second.mode &&
		first.hour === second.hour &&
		first.minute === second.minute &&
		firstSortedWeekdays.toString() === secondSortedWeekdays.toString();
}

export function convertScheduleToLoggableObject(schedule: ISchedule): {
	weekdays: string[];
	mode: string;
	hour: number;
	minute: number;
} {
	const weekdays = schedule.weekdays.map((weekday) => WeekDay[weekday].toLowerCase());
	return {
		weekdays,
		mode: Mode[schedule.mode],
		hour: schedule.hour,
		minute: schedule.minute,
	};
}
