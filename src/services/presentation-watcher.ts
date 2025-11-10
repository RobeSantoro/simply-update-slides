import { App, TFile, MarkdownView, WorkspaceLeaf, EventRef } from "obsidian";
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

		// Create event handlers and return event refs
		const modifyRef = this.app.vault.on("modify", (file: TFile) => {
			this.handleFileModify(file);
		});

		const fileOpenRef = this.app.workspace.on("file-open", (file: TFile | null) => {
			if (file) {
				this.watchedFile = file;
			}
		});

		return [modifyRef, fileOpenRef];
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
		// Only process markdown files
		if (file.extension !== "md") {
			return;
		}

		// Check if we're in presentation mode
		if (!this.isInPresentationMode()) {
			return;
		}

		// Check if the modified file is the currently open file
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile || activeFile.path !== file.path) {
			return;
		}

		// Debounce the refresh to avoid excessive updates
		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = window.setTimeout(() => {
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
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView || !activeView.previewMode) {
			return;
		}

		try {
			// Force a re-render of the preview mode
			// This will update the presentation with the latest file content
			activeView.previewMode.rerender(true);
		} catch (error) {
			console.error("Error refreshing presentation:", error);
			// Fallback: try refreshing the leaf
			this.refreshLeaf(activeView.leaf);
		}
	}

	/**
	 * Refresh a specific leaf (fallback method)
	 */
	private refreshLeaf(leaf: WorkspaceLeaf): void {
		try {
			// Get the current view state
			const viewState = leaf.getViewState();
			
			// Re-set the view state to trigger a refresh
			// This forces Obsidian to re-render the view with updated content
			leaf.setViewState(viewState, { focus: false });
		} catch (error) {
			console.error("Error refreshing presentation leaf:", error);
		}
	}
}

