import { readFile, writeFile } from 'fs-extra';
import * as path from 'path';

export interface ISettings {
	desiredDayTemperature: number;
	desiredNightTemperature: number;
}

export default class SettingsStorage {

	constructor(private persistPath: string) {}

	public async getSettings(): Promise<ISettings> {
		const filePath = this.getSettingsFilePath();
		const contents = await readFile(filePath);
		return JSON.parse(contents.toString());
	}

	public async persistSettings(settings: ISettings) {
		const filePath = this.getSettingsFilePath();
		await writeFile(filePath, JSON.stringify(settings));
	}

	private getSettingsFilePath() {
		const FILENAME = 'settings.json';
		return path.join(this.persistPath, FILENAME);
	}
}
