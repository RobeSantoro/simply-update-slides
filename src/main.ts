import { Plugin } from 'obsidian';
import { PresentationWatcher } from './services/presentation-watcher';
import { SimplyUpdateSlidesSettings, DEFAULT_SETTINGS } from './settings';

export default class SimplyUpdateSlidesPlugin extends Plugin {
    settings: SimplyUpdateSlidesSettings;
    watcher: PresentationWatcher;

    async onload() {
        console.log('Simply Update Slides plugin loading...');
        
        await this.loadSettings();
        
        this.watcher = new PresentationWatcher(this.app, this.settings);
        const eventRefs = this.watcher.start();
        eventRefs.forEach(ref => this.registerEvent(ref));

        console.log('Simply Update Slides plugin loaded and presentation watcher started.');
    }

    onunload() {
        if (this.watcher) {
            this.watcher.stop();
        }
        console.log('Simply Update Slides plugin unloaded.');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
