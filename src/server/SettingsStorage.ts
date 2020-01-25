import { readFile, writeFile } from 'fs-extra';
import * as path from 'path';
import Settings from './Settings';

export default class SettingsStorage {

	constructor(private persistPath: string) {}

	public async getSettings(): Promise<Settings> {
		try {
			const filePath = this.getSettingsFilePath();
			const contents = await readFile(filePath);
			const settings = JSON.parse(contents.toString());
			return new Settings(this, settings.desiredDayTemperature, settings.desiredNightTemperature);
		} catch (error) {
			const DEFAULT_TEMPERATURE = 20;
			return new Settings(this, DEFAULT_TEMPERATURE, DEFAULT_TEMPERATURE);
		}
	}

	public async persistSettings(
		desiredDayTemperature: number,
		desiredNightTemperature: number,
	) {
		const filePath = this.getSettingsFilePath();
		const settings = { desiredDayTemperature, desiredNightTemperature };
		await writeFile(filePath, JSON.stringify(settings));
	}

	private getSettingsFilePath() {
		const FILENAME = 'settings.json';
		return path.join(this.persistPath, FILENAME);
	}
}
