import * as http from 'http';
import * as express from 'express';
import { route } from './routes';
import Thermostat from './Thermostat';

const DEFAULT_PORT = 8080;
const port = (process.env.PORT && process.env.PORT.toString()) || DEFAULT_PORT;
const _heaterIps = process.env.HEATER_IPS.split(',');

const app = express();
const httpServer = http.createServer(app);
const thermostat = new Thermostat();

route(app, thermostat);

httpServer.listen(port, () => {
	console.info('Http server listening on port ' + port);
});
