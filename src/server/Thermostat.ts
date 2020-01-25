import * as Debug from 'debug';
import Mode from '../common/Mode';

const debug = Debug('HomeAutomation:Thermostat');

export default class Thermostat {

	private temperature: number = 20;
	private desiredDayTemperature: number = 20;
	private desiredNightTemperature: number = 20;
	private currentMode: Mode = Mode.DAY;

	public getTemperature() {
		return this.temperature;
	}

	public setTemperature(temperature: number) {
		this.temperature = temperature;
		debug('set temperature: ' + temperature);
	}

	public getDesiredTemperature(mode: Mode) {
		switch (mode) {
			case Mode.DAY:
				return this.desiredDayTemperature;
			case Mode.NIGHT:
				return this.desiredNightTemperature;
			default:
				throw new Error('invalid mode');
		}
	}

	public setDesiredDayTemperature(mode: Mode, desiredTemperature: number) {
		debug(`set desured day temperature; mode: ${Mode[mode]}, desiredTemperature: ${desiredTemperature}`);
		switch (mode) {
			case Mode.DAY:
				this.desiredDayTemperature = desiredTemperature;
				break;
			case Mode.NIGHT:
				this.desiredNightTemperature = desiredTemperature;
				break;
			default:
				throw new Error('invalid mode');
		}
	}

	public getMode() {
		return this.currentMode;
	}

	public setMode(mode: Mode) {
		debug(`set mode: ${Mode[mode]}`);
		this.currentMode = mode;
	}
}
