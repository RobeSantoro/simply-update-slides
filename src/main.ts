import { Plugin } from "obsidian";
import { SimplyUpdateSlidesSettings, DEFAULT_SETTINGS } from "./settings";
import { PresentationWatcher } from "./services/presentation-watcher";

export default class SimplyUpdateSlidesPlugin extends Plugin {
	settings: SimplyUpdateSlidesSettings;
	private watcher: PresentationWatcher | null = null;

	async onload() {
		// Load settings
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		// Initialize and start the presentation watcher
		this.watcher = new PresentationWatcher(this.app, this.settings);
		
		// Register event handlers for proper cleanup
		const eventRefs = this.watcher.start();
		for (const eventRef of eventRefs) {
			this.registerEvent(eventRef);
		}
	}

	onunload() {
		// Clean up the watcher
		if (this.watcher) {
			this.watcher.stop();
			this.watcher = null;
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		// Update watcher settings if it exists
		if (this.watcher) {
			this.watcher.updateSettings(this.settings);
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

