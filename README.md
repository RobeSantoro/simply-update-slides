# Simply Update Slides

An Obsidian plugin that enables live updates to your presentation slides while in Presentation mode. Edit your markdown files using VS Code or any other external editor, and see your changes reflected in real-time during your presentation.

## Features

- **Live Slide Updates**: Automatically refreshes slide content when the underlying markdown file is modified
- **External Editor Support**: Use your favorite markdown editor (VS Code, Sublime Text, etc.) while presenting in Obsidian
- **Seamless Integration**: Works with Obsidian's native Presentation mode
- **Non-Intrusive**: Lightweight plugin that runs in the background without disrupting your presentation flow

## Use Cases

- Edit and refine slides during a live presentation
- Collaborate with others who update the markdown file while you present
- Make quick fixes or additions without exiting Presentation mode
- Test and iterate on presentation content in real-time

## How to Use

1. **Install the plugin** from Obsidian's Community Plugins, or manually install it (see below)
2. **Enable the plugin** in Settings → Community plugins
3. **Open a markdown file** with slide content (use `---` to separate slides)
4. **Enter Presentation mode** (default shortcut or via command palette)
5. **Edit your markdown file** using VS Code or any external editor
6. **Watch your slides update** automatically in the presentation view

The plugin works silently in the background—no additional configuration needed!

## Manual Installation

1. Download the latest release (`main.js`, `manifest.json`, and `styles.css`)
2. Create a folder named `simply-update-slides` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into this folder
4. Reload Obsidian and enable the plugin in Settings

---

## For Developers

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## Development Setup

- Clone this repo
- Make sure your NodeJS is at least v16 (`node --version`)
- Run `npm i` to install dependencies
- Run `npm run dev` to start compilation in watch mode
- The build outputs to `dist/` folder containing `main.js`, `manifest.json`, and `styles.css`
- Create a symlink from your vault's plugin folder to the `dist` folder:
  ```bash
  ln -s /path/to/simply-update-slides/dist /path/to/vault/.obsidian/plugins/simply-update-slides
  ```
  Or manually copy the files from `dist/` to `VaultFolder/.obsidian/plugins/simply-update-slides/`

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint ./src/`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
