import * as http from 'http';
import * as express from 'express';
import { route } from './routes';
import SettingsStorage from './SettingsStorage';
import { startThermostat } from './thermostat';

const DEFAULT_PORT = 8080;
const port = (process.env.PORT && process.env.PORT.toString()) || DEFAULT_PORT;
const heaterIps = process.env.HEATER_IPS.split(',');
const persistSettingsPath = process.env.PERSIST_SETTINGS_PATH;

(async () => {
	const app = express();
	const httpServer = http.createServer(app);
	const storage = new SettingsStorage(persistSettingsPath);
	const settings = await storage.getSettings();

	route(app, settings);

	httpServer.listen(port, () => {
		console.info('Http server listening on port ' + port);
	});

	startThermostat(settings, heaterIps);
})();
