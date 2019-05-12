import * as http from 'http';
import * as express from 'express';
import { route } from './routes';
import { createTemperatureResolver } from './temperature';

const DEFAULT_PORT = 8080;
const port = (process.env.PORT && process.env.PORT.toString()) || DEFAULT_PORT;
const heaterIps = process.env.HEATER_IPS.split(',');

const app = express();
const httpServer = http.createServer(app);
const resolveTemperatureCallback = createTemperatureResolver(heaterIps);

route(app, resolveTemperatureCallback);

httpServer.listen(port, () => {
	console.info('Http server listening on port ' + port);
});
