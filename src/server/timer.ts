import Settings from './Settings';
import Mode from '../common/Mode';
import { CronJob } from 'cron';

export function startTimer(settings: Settings) {
	const setDayMode = () => settings.setMode(Mode.DAY);
	const setNightMode = () => settings.setMode(Mode.NIGHT);

	const job1 = new CronJob('00 00 6 * * *', setDayMode); // set day mode every day at 7:00
	const job2 = new CronJob('00 00 22 * * *', setNightMode); // set night mode every day at 22:00
	const job3 = new CronJob('00 00 9 * * 1-5', setNightMode); // set night mode every workday at 9:00
	const job4 = new CronJob('00 00 18 * * 1-5', setDayMode); // set day mode every workday at 18:00

	job1.start();
	job2.start();
	job3.start();
	job4.start();
}
