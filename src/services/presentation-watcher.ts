import { App, TFile, MarkdownView, EventRef } from "obsidian";
import { SimplyUpdateSlidesSettings } from "../settings";

/**
 * Watches for file changes and refreshes presentation view when files are modified externally
 */
export class PresentationWatcher {
	private app: App;
	private settings: SimplyUpdateSlidesSettings;
	private debounceTimer: number | null = null;
	private watchedFile: TFile | null = null;

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

		const fileOpenRef = this.app.workspace.on("file-open", (file: TFile | null) => {
			if (file) {
				console.log(`[Watcher] Watched file changed to: ${file.path}`);
				this.watchedFile = file;
			}
		});

		let lastKnownPresentationState = this.isInPresentationMode();
		const layoutChangeRef = this.app.workspace.on("layout-change", () => {
			const currentPresentationState = this.isInPresentationMode();
			if (currentPresentationState !== lastKnownPresentationState) {
				console.log(`[Watcher] Presentation mode state changed to: ${currentPresentationState}`);
				lastKnownPresentationState = currentPresentationState;
			}
		});

		return [modifyRef, fileOpenRef, layoutChangeRef];
	}

	/**
	 * Stop watching for file changes
	 */
	public stop(): void {
		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
			this.debounceTimer = null;
		}
		this.watchedFile = null;
	}

	/**
	 * Update settings
	 */
	public updateSettings(settings: SimplyUpdateSlidesSettings): void {
		this.settings = settings;
		if (!this.settings.enabled) {
			this.stop();
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
	 * Check if Obsidian is currently in presentation mode
	 */
	private isInPresentationMode(): boolean {
		// Get the active markdown view
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			return false;
		}

		// Check if the view is in preview mode (presentation mode uses preview)
		if (!activeView.previewMode) {
			return false;
		}

		// Check if presentation mode is active by looking for reveal.js container
		// Presentation mode uses reveal.js which adds specific DOM elements
		const container = activeView.containerEl;
		if (this.hasPresentationClass(container)) {
			return true;
		}

		// Also check the preview mode container
		const previewContainer = container.querySelector(".markdown-preview-view");
		if (previewContainer && this.hasPresentationClass(previewContainer as HTMLElement)) {
			return true;
		}

		return false;
	}

	/**
	 * Check if an element has presentation-related classes or is inside a presentation container
	 */
	private hasPresentationClass(element: HTMLElement): boolean {
		// Check for reveal.js presentation mode indicators
		// Obsidian's presentation mode uses reveal.js which adds specific DOM structure
		const revealContainer = element.closest(".reveal");
		if (revealContainer) {
			return true;
		}

		// Check for presentation mode data attributes
		if (element.hasAttribute("data-presentation-mode")) {
			return true;
		}

		// Check if the element is inside a presentation viewport
		const presentationViewport = element.closest(".reveal-viewport");
		if (presentationViewport) {
			return true;
		}

		// Check for reveal.js slides container
		const slidesContainer = element.closest(".reveal .slides");
		if (slidesContainer) {
			return true;
		}

		return false;
	}

	/**
	 * Refresh the presentation view
	 */
	private refreshPresentation(): void {
		// Simulate 'Escape' key press to exit presentation mode
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
	
		// Wait a moment for Obsidian to exit presentation mode
		setTimeout(() => {
			// Start presentation mode F5
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F5' }));
		}, 100); // 100ms delay
	}
}

