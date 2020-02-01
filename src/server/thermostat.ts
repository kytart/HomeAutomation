const { Client } = require('tplink-smarthome-api');
import Settings from './Settings';
import * as Debug from 'debug';

const debug = Debug('HomeAutomation:thermostat');

export function startThermostat(settings: Settings, room: string) {
	const heaterIpsEnvKey = `${room}_heater_ips`;
	const heaterIps = process.env[heaterIpsEnvKey].split(',');
	debug(`starting thermostat; room: ${room}, heater ips: ${heaterIps.join(', ')}`);
	setInterval(() => resolveCurrentSettings(settings, room, heaterIps), 60e3);
}

async function resolveCurrentSettings(settings: Settings, room: string, heaterIps: string[]) {
	const currentTemperature = settings.getTemperature(room);
	const mode = settings.getMode();
	const desiredTemperature = settings.getDesiredTemperature(mode);
	if (currentTemperature > desiredTemperature) {
		debug(`${room}: current ${currentTemperature} > desired ${desiredTemperature}; turning heaters off`);
		await setHeatersOff(heaterIps);
	} else {
		debug(`${room}: current ${currentTemperature} < desired ${desiredTemperature}; turning heaters on`);
		await setHeatersOn(heaterIps);
	}
}

async function setHeatersOn(heaterIps: string[]) {
	await setHeatersPowerState(heaterIps, true);
}

async function setHeatersOff(heaterIps: string[]) {
	await setHeatersPowerState(heaterIps, false);
}

async function setHeatersPowerState(heaterIps: string[], powerState: boolean) {
	const tplinkClient = new Client();
	await Promise.all(
		heaterIps.map(async (ip: string) => {
			const device = await tplinkClient.getDevice({ host: ip });
			await device.setPowerState(powerState);
		}),
	);
}
