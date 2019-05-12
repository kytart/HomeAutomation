import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ResolveTemperatureCallback } from './temperature';

export function route(
	app: express.Application,
	resolveTemperature: ResolveTemperatureCallback,
) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/temperature', async (request: express.Request, response: express.Response) => {
		const { current, desired } = request.body;
		if (typeof current === 'undefined' || typeof desired === 'undefined') {
			response.sendStatus(400);
		} else {
			try {
				await resolveTemperature(current, desired);
				response.sendStatus(200);
			} catch (error) {
				console.error('Resolve temperature failed', error);
				response.sendStatus(500);
			}
		}
	});
}
