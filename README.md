# Simply Update Slides

This plugin lets you edit your markdown slides in an external editor and see them update live in your Obsidian presentation.

## Set `F5` shortcut to Start Presentation Command

## How the hæck works

Look, Obsidian doesn't have an API for messing with presentations. So, I went with a full-on brute force method.

Here's the deal:

1. The plugin watches for changes to your files.
2. When a change is detected, it peeks at the presentation's HTML to see how many slides you've already passed (by counting the `.past` classes). This is how it saves your spot.
3. Then, it simulates pressing `ESC` to exit the presentation and `F5` to immediately re-enter it. This is what forces your slide content to update from the file.
4. Finally, it programmatically clicks the 'next' arrow button just enough times to get you right back to the slide you were on.

It's a total hack, but it works.
