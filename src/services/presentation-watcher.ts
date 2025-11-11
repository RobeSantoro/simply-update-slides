import { App, TFile, EventRef } from "obsidian";
import { SimplyUpdateSlidesSettings } from "../main";

/**
 * Watches for file changes and refreshes presentation view when files are modified externally
 */
export class PresentationWatcher {
	private app: App;
	private settings: SimplyUpdateSlidesSettings;
	private debounceTimer: number | null = null;

	constructor(app: App, settings: SimplyUpdateSlidesSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * Start watching for file changes
	 * Returns event refs that should be registered with the plugin
	 */
	public start(): EventRef[] {
		if (!this.settings.enabled) {
			return [];
		}
		console.log("[Watcher] Starting watcher.");

		// Create event handlers and return event refs
		const modifyRef = this.app.vault.on("modify", (file: TFile) => {
			this.handleFileModify(file);
		});

		return [modifyRef];
	}

	/**
	 * Stop watching for file changes
	 */
	public stop(): void {
		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
			this.debounceTimer = null;
		}
	}

	/**
	 * Handle file modification event
	 */
	private handleFileModify(file: TFile): void {
		console.log(`[Watcher] handleFileModify triggered for: ${file.path}`);
		// Only process markdown files
		if (file.extension !== "md") {
			console.log(`[Watcher] File is not markdown, skipping.`);
			return;
		}

		// Check if the modified file is the currently open file
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			console.log(`[Watcher] No active file, skipping.`);
			return;
		}
		if (activeFile.path !== file.path) {
			console.log(`[Watcher] Modified file (${file.path}) is not the active file (${activeFile.path}), skipping.`);
			return;
		}

		// Debounce the refresh to avoid excessive updates
		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
		}

		console.log(`[Watcher] Conditions met. Debouncing refresh for ${this.settings.debounceDelay}ms.`);
		this.debounceTimer = window.setTimeout(() => {
			console.log(`[Watcher] Debounce timer finished. Refreshing presentation.`);
			this.refreshPresentation();
			this.debounceTimer = null;
		}, this.settings.debounceDelay);
	}

	/**
	 * Refresh the presentation view
	 */
	private refreshPresentation(): void {
		// Check if we are in presentation mode
		const presentationContainer = document.querySelector('.slides-container .reveal');
		if (!presentationContainer) {
			console.log('[Watcher] Presentation container not found. Assuming not in presentation mode.');
			return;
		}

		const pastSlides = presentationContainer.querySelectorAll('section.past');
		const slideIndex = pastSlides.length;
		console.log(`[Watcher] Current slide index: ${slideIndex}`);


		// Simulate 'Escape' key press to exit presentation mode
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
	
		// Wait a moment for Obsidian to exit presentation mode
		setTimeout(() => {
			// Start presentation mode F5
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F5' }));

			// Wait for presentation to load before navigating
			setTimeout(() => {
				console.log(`[Watcher] Navigating to slide index ${slideIndex}.`);
				const navigateRightButton = document.querySelector('button.navigate-right') as HTMLElement;
				if (navigateRightButton) {
					for (let i = 0; i < slideIndex; i++) {
						navigateRightButton.click();
					}
				} else {
					console.log('[Watcher] Could not find the right navigation button.');
				}
			}, 500); // Delay to allow presentation to load

		}, 100); // 100ms delay
	}
}

