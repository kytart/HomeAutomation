import Settings from './Settings';
import Mode from '../common/Mode';
import { CronJob } from 'cron';
import { ISchedule, WeekDay } from './schedule';
import * as Debug from 'debug';

const debug = Debug('HomeAutomation:server:Timer');

enum CronWeekday {
	SUNDAY = 0,
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
}

export default class Timer {

	private jobs: CronJob[] = [];

	constructor(private settings: Settings) {
		settings.onSchedulesChange(() => this.applySchedules());
	}

	public applySchedules() {
		debug('apply schedules');
		this.stopRunningJobs();
		const schedules = this.settings.getSchedules();
		for (let schedule of schedules) {
			const job = this.convertScheduleToJob(schedule);
			job.start();
			this.jobs.push(job);
		}
	}

	private stopRunningJobs() {
		for (let job of this.jobs) {
			job.stop();
		}
		this.jobs = [];
	}

	private convertScheduleToJob(schedule: ISchedule) {
		const hour = schedule.hour;
		const minute = schedule.minute;
		const weekdays = schedule.weekdays.map((weekday) => CronWeekday[WeekDay[weekday] as keyof typeof CronWeekday]);
		const mode = schedule.mode;
		const cronPattern = `00 ${minute} ${hour} * * ${weekdays.join(',')}`;
		debug(`create job: ${cronPattern}, set mode: ${Mode[mode]}`);
		return new CronJob(cronPattern, () => this.settings.setMode(mode));
	}
}
