import * as express from 'express';
import * as bodyParser from 'body-parser';
import Thermostat from './Thermostat';
import Mode from '../common/Mode';

export function route(
	app: express.Application,
	thermostat: Thermostat,
) {
	app.use('/client', express.static('dist/client'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/temperature', (request: express.Request, response: express.Response) => {
		const temperature = thermostat.getTemperature();
		response.send({ temperature });
	});

	app.post('/temperature', (request: express.Request, response: express.Response) => {
		const { temperature } = request.body;
		if (typeof temperature === 'undefined') {
			response.sendStatus(400);
		} else {
			thermostat.setTemperature(temperature);
			response.sendStatus(200);
		}
	});

	app.get('/mode', (request: express.Request, response: express.Response) => {
		const mode = thermostat.getMode();
		response.send({ mode: Mode[mode] });
	});

	app.post('/mode', (request: express.Request, response: express.Response) => {
		const { mode: modeKey } = request.body;
		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			thermostat.setMode(mode);
			response.sendStatus(200);
		}
	});

	app.get('/desired-temperature', (request: express.Request, response: express.Response) => {
		const { mode: modeKey } = request.query;
		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			const desiredTemperature = thermostat.getDesiredTemperature(mode);
			response.send({ desiredTemperature });
		}
	});

	app.post('/desired-temperature', (request: express.Request, response: express.Response) => {
		const { mode: modeKey, desiredTemperature } = request.body;
		const mode = Mode[modeKey as keyof typeof Mode];
		if (typeof mode === 'undefined') {
			response.sendStatus(400);
		} else {
			thermostat.setDesiredDayTemperature(mode, desiredTemperature);
			response.sendStatus(200);
		}
	});
}
