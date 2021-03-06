import * as Debug from 'debug';
import { EventEmitter } from 'events';
import Mode from '../common/Mode';
import SettingsStorage from './SettingsStorage';
import { ISchedule, convertScheduleToLoggableObject, areSchedulesEqual } from './schedule';

const debug = Debug('HomeAutomation:Settings');

interface TemperatureRecord {
	temperature: number;
	recordedAt: Date;
}

export default class Settings {

	private temperatures: { [room: string]: TemperatureRecord } = {};
	private currentMode: Mode = Mode.DAY;
	private eventEmitter: EventEmitter;

	constructor(
		private storage: SettingsStorage,
		private desiredDayTemperature: number,
		private desiredNightTemperature: number,
		private schedules: ISchedule[],
	) {
		this.eventEmitter = new EventEmitter();
	}

	public getTemperature(room: string): TemperatureRecord {
		const DEFAULT_TEMPERATURE: TemperatureRecord = {
			temperature: 20,
			recordedAt: new Date(0),
		};
		const temperature = this.temperatures[room];
		return typeof temperature !== 'undefined' ? temperature : DEFAULT_TEMPERATURE;
	}

	public setTemperature(room: string, temperature: number) {
		this.temperatures[room] = {
			temperature,
			recordedAt: new Date(),
		};
		debug(`set temperature ${temperature} in ${room}`);
		this.eventEmitter.emit('room_settings_changed', room);
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

	public async setDesiredDayTemperature(mode: Mode, desiredTemperature: number) {
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
		await this.persistSettings();
		this.eventEmitter.emit('settings_changed');
	}

	public getMode() {
		return this.currentMode;
	}

	public setMode(mode: Mode) {
		debug(`set mode: ${Mode[mode]}`);
		this.currentMode = mode;
		this.eventEmitter.emit('settings_changed');
	}

	public getSchedules() {
		return this.schedules;
	}

	public async addSchedule(schedule: ISchedule) {
		debug('add schedule', convertScheduleToLoggableObject(schedule));
		this.schedules.push(schedule);
		await this.persistSettings();
		this.eventEmitter.emit('schedules_changed');
	}

	public async removeSchedule(schedule: ISchedule) {
		this.schedules = this.schedules.filter((item) => !areSchedulesEqual(item, schedule));
		await this.persistSettings();
		this.eventEmitter.emit('schedules_changed');
	}

	public onSettingsChange(listener: () => void) {
		this.eventEmitter.addListener('settings_changed', listener);
	}

	public onRoomSettingsChange(listener: (room: string) => void) {
		this.eventEmitter.addListener('room_settings_changed', listener);
	}

	public onSchedulesChange(listener: () => void) {
		this.eventEmitter.addListener('schedules_changed', listener);
	}

	private async persistSettings() {
		await this.storage.persistSettings(
			this.desiredDayTemperature,
			this.desiredNightTemperature,
			this.schedules,
		);
	}
}
