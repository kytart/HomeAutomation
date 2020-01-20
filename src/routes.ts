import * as express from 'express';
import * as bodyParser from 'body-parser';
import Thermostat from './Thermostat';

export function route(
	app: express.Application,
	thermostat: Thermostat,
) {
	app.use('/client', express.static('dist/client'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/temperature', (request: express.Request, response: express.Response) => {
		const { temperature } = request.body;
		if (typeof temperature === 'undefined') {
			response.sendStatus(400);
		} else {
			thermostat.setTemperature(temperature);
			response.sendStatus(200);
		}
	});
}
