import * as Debug from 'debug';

const debug = Debug('HomeAutomation:Thermostat');

export default class Thermostat {

	private temperature: number = 20;

	public setTemperature(temperature: number) {
		this.temperature = temperature;
		debug('set temperature: ' + temperature);
	}
}
