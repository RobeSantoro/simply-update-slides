export interface SimplyUpdateSlidesSettings {
	enabled: boolean;
	debounceDelay: number; // milliseconds to wait before refreshing after file change
}

export const DEFAULT_SETTINGS: SimplyUpdateSlidesSettings = {
	enabled: true,
	debounceDelay: 300, // 300ms debounce to avoid excessive refreshes
};

