import * as express from 'express';
import * as bodyParser from 'body-parser';
import Settings from './Settings';
import Mode from '../common/Mode';

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
			response.send({ temperature });
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
}
