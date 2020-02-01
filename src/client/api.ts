import Mode from '../common/Mode';

export async function getCurrentTemperature(room: string): Promise<number> {
	const query = `room=${room}`;
	const response = await fetch('/temperature?' + query);
	const body = await response.json();
	return body.temperature;
}

export async function getCurrentMode(): Promise<Mode> {
	const response = await fetch('/mode');
	const body = await response.json();
	return Mode[body.mode as keyof typeof Mode];
}

export async function setMode(mode: Mode) {
	await fetch('/mode', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			mode: Mode[mode],
		}),
	});
}

export async function getDesiredTemperature(mode: Mode): Promise<number> {
	const query = `mode=${Mode[mode]}`;
	const response = await fetch('/desired-temperature?' + query);
	const body = await response.json();
	return body.desiredTemperature;
}

export async function setDesiredTemperature(mode: Mode, desiredTemperature: number) {
	await fetch('/desired-temperature', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			mode: Mode[mode],
			desiredTemperature,
		}),
	});
}


