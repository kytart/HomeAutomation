import * as http from 'http';
import * as express from 'express';
import { route } from './routes';
import Thermostat from './Thermostat';
import SettingsStorage from './SettingsStorage';

const DEFAULT_PORT = 8080;
const port = (process.env.PORT && process.env.PORT.toString()) || DEFAULT_PORT;
const _heaterIps = process.env.HEATER_IPS.split(',');
const persistSettingsPath = process.env.PERSIST_SETTINGS_PATH;

const app = express();
const httpServer = http.createServer(app);
const storage = new SettingsStorage(persistSettingsPath);
const thermostat = new Thermostat(storage);

thermostat.loadSettingsFromStorage();

route(app, thermostat);

httpServer.listen(port, () => {
	console.info('Http server listening on port ' + port);
});
