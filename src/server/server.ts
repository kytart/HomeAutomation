import * as http from 'http';
import * as express from 'express';
import { route } from './routes';
import SettingsStorage from './SettingsStorage';
import { startThermostat } from './thermostat';
import Timer from './Timer';
import rooms from '../common/rooms';

process.on('uncaughtException', (error: any) => console.error(error && error.stack ? error.stack : error));
process.on('unhandledRejection', (error: Error) => {
	throw error;
});

const DEFAULT_PORT = 8080;
const port = (process.env.PORT && process.env.PORT.toString()) || DEFAULT_PORT;
const persistSettingsPath = process.env.PERSIST_SETTINGS_PATH;

(async () => {
	const app = express();
	const httpServer = http.createServer(app);
	const storage = new SettingsStorage(persistSettingsPath);
	const settings = await storage.getSettings();
	const timer = new Timer(settings);

	route(app, settings);

	httpServer.listen(port, () => {
		console.info('Http server listening on port ' + port);
	});

	for (let room of rooms) {
		startThermostat(settings, room.key);
	}
	timer.applySchedules();
})();
