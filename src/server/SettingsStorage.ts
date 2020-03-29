import { readFile, writeFile } from 'fs-extra';
import * as path from 'path';
import Settings from './Settings';
import { ISchedule } from './schedule';
import {
	ISchedule as IStorageSchedule,
	convertScheduleToStorageSchedule,
	convertStorageScheduleToSchedule,
} from './storage/schedule';

export default class SettingsStorage {

	constructor(private persistPath: string) {}

	public async getSettings(): Promise<Settings> {
		try {
			const filePath = this.getSettingsFilePath();
			const contents = await readFile(filePath);
			const {
				desiredDayTemperature,
				desiredNightTemperature,
				schedules: storageSchedules,
			} = JSON.parse(contents.toString());
			const schedules = storageSchedules.map((schedule: IStorageSchedule) => convertStorageScheduleToSchedule(schedule));
			return new Settings(this, desiredDayTemperature, desiredNightTemperature, schedules);
		} catch (error) {
			const DEFAULT_TEMPERATURE = 20;
			return new Settings(this, DEFAULT_TEMPERATURE, DEFAULT_TEMPERATURE, []);
		}
	}

	public async persistSettings(
		desiredDayTemperature: number,
		desiredNightTemperature: number,
		schedules: ISchedule[],
	) {
		const filePath = this.getSettingsFilePath();
		const storageSchedules = schedules.map((schedule) => convertScheduleToStorageSchedule(schedule));
		const settings = { desiredDayTemperature, desiredNightTemperature, schedules: storageSchedules };
		await writeFile(filePath, JSON.stringify(settings));
	}

	private getSettingsFilePath() {
		const FILENAME = 'settings.json';
		return path.join(this.persistPath, FILENAME);
	}
}
