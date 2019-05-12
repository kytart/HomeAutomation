const { Client } = require('tplink-smarthome-api');

export type ResolveTemperatureCallback = (
	currentTemperature: number,
	desiredTemperature: number,
) => Promise<void>;

export function createTemperatureResolver(heaterIps: string[]): ResolveTemperatureCallback {
	return async (
		currentTemperature: number,
		desiredTemperature: number,
	) => {
		if (currentTemperature > desiredTemperature) {
			await setHeatersOff(heaterIps);
		} else {
			await setHeatersOn(heaterIps);
		}
	};
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
