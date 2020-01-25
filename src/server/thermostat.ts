const { Client } = require('tplink-smarthome-api');
import Settings from './Settings';

export function startThermostat(settings: Settings, heaterIps: string[]) {
	setInterval(() => resolveCurrentSettings(settings, heaterIps), 60e3);
}

async function resolveCurrentSettings(settings: Settings, heaterIps: string[]) {
	const currentTemperature = settings.getTemperature();
	const mode = settings.getMode();
	const desiredTemperature = settings.getDesiredTemperature(mode);
	if (currentTemperature > desiredTemperature) {
		await setHeatersOff(heaterIps);
	} else {
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
