import { ISchedule as IRuntimeSchedule, WeekDay } from '../schedule';
import Mode from '../../common/Mode';

export interface ISchedule {
	weekdays: string[];
	mode: string;
	hour: number;
	minute: number;
}

export function convertScheduleToStorageSchedule(schedule: IRuntimeSchedule): ISchedule {
	const weekdays = schedule.weekdays.map((weekday) => WeekDay[weekday]);
	return {
		weekdays,
		mode: Mode[schedule.mode],
		hour: schedule.hour,
		minute: schedule.minute,
	};
}

export function convertStorageScheduleToSchedule(schedule: ISchedule): IRuntimeSchedule {
	const weekdays = schedule.weekdays.map((weekday) => WeekDay[weekday as keyof typeof WeekDay]);
	return {
		weekdays,
		mode: Mode[schedule.mode as keyof typeof Mode],
		hour: schedule.hour,
		minute: schedule.minute,
	};
}
