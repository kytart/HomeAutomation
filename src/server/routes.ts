import * as express from 'express';
import * as bodyParser from 'body-parser';
import Settings from './Settings';
import Mode from '../common/Mode';
import { WeekDay } from './schedule';

export function route(
	app: express.Application,
	settings: Settings,
) {
	app.use('/client', express.static('dist/client'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/temperature', (request: express.Request, response: express.Response) => {
		const { room } = request.query;
		if (typeof room === 'undefined') {
			response.sendStatus(400);
		} else {
			const temperature = settings.getTemperature(room);
			response.send({
				temperature: temperature.temperature,
				recordedAt: temperature.recordedAt.valueOf(),
			});
		}
	});

	app.post('/temperature', (request: express.Request, response: express.Response) => {
		const { room, temperature } = request.body;
		if (typeof room === 'undefined' || typeof temperature === 'undefined') {
			response.sendStatus(400);
		} else {
			settings.setTemperature(room, temperature);
			response.sendStatus(200);
		}
	});

	app.get('/mode', (request: express.Request, response: express.Response) => {
		const mode = settings.getMode();
		response.send({ mode: Mode[mode] });
	});

	app.post('/mode', (request: express.Request, response: express.Response) => {
		const { mode: modeKey } = request.body;
		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			settings.setMode(mode);
			response.sendStatus(200);
		}
	});

	app.get('/desired-temperature', (request: express.Request, response: express.Response) => {
		const { mode: modeKey } = request.query;
		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			const desiredTemperature = settings.getDesiredTemperature(mode);
			response.send({ desiredTemperature });
		}
	});

	app.post('/desired-temperature', async (request: express.Request, response: express.Response) => {
		const { mode: modeKey, desiredTemperature } = request.body;
		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			await settings.setDesiredDayTemperature(mode, desiredTemperature);
			response.sendStatus(200);
		}
	});

	app.get('/schedule', (request: express.Request, response: express.Response) => {
		const schedules = settings.getSchedules();
		const schedulesWithStringifiedEnums = schedules.map((schedule) => ({
			weekdays: schedule.weekdays.map((weekday) => WeekDay[weekday]),
			mode: Mode[schedule.mode],
			hour: schedule.hour,
			minute: schedule.minute,
		}));
		response.send(schedulesWithStringifiedEnums);
	});

	app.post('/schedule', async (request: express.Request, response: express.Response) => {
		const { weekdays: weekdayKeys, mode: modeKey, hour, minute } = request.body;
		if (!Array.isArray(weekdayKeys) ||
			typeof modeKey === 'undefined' ||
			typeof hour !== 'number' || hour < 0 || hour > 23 ||
			typeof minute !== 'number' || minute < 0 || minute > 59
		) {
			response.sendStatus(400);
			return;
		}

		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			const schedule = {
				weekdays: weekdayKeys.map((key) => WeekDay[key as keyof typeof WeekDay]),
				mode,
				hour,
				minute,
			};
			await settings.addSchedule(schedule);
			response.sendStatus(200);
		}
	});

	// TODO obviously this is not a nice solution, it would be nicer to have an id but for that I'd first need a db as a storage
	app.delete('/schedule', async (request: express.Request, response: express.Response) => {
		const { weekdays: weekdayKeys, mode: modeKey, hour, minute } = request.body;
		if (!Array.isArray(weekdayKeys) ||
			typeof modeKey === 'undefined' ||
			typeof hour !== 'number' || hour < 0 || hour > 23 ||
			typeof minute !== 'number' || minute < 0 || minute > 59
		) {
			response.sendStatus(400);
			return;
		}

		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			const schedule = {
				weekdays: weekdayKeys.map((key) => WeekDay[key as keyof typeof WeekDay]),
				mode,
				hour,
				minute,
			};
			await settings.removeSchedule(schedule);
			response.sendStatus(204);
		}
	});
}
