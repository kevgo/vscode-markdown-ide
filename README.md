# VSCode Markdown IDE

![CI badge](https://github.com/kevgo/vscode-markdown-ide/actions/workflows/main.yml/badge.svg)

This plugin for [VSCode](https://code.visualstudio.com) and
[compatible editors](https://open-vsx.org) provides a bit of IDE-grade editing
and refactoring support for Markdown files. This is most useful for large
collections of Markdown documents containing lots of links between them.

This extension works best with Markdown files formatted via
[Prettier](https://prettier.io) or [dprint](https://dprint.dev). It ignores
files in the `.git`, `node_modules`, and `vendor` folders.

#### autocomplete links to Markdown documents

Typing `[` triggers autocompletion for links to Markdown files.

![autocompletion demo](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete.gif)

#### autocomplete links to image files

Typing `![` triggers autocompletion for links to image files.

#### rename file ⇒ update incoming links

When you rename a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by changing the target of these links to the new
filename.

#### delete file ⇒ remove incoming links

When you delete a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by removing these links.

#### rename Markdown file title ⇒ update incoming links

Run the "Markdown IDE: Rename document title" command to change the primary
heading of a document. Markdown IDE updates the title of matching links to that
document.

#### configuration

You can configure this extension via settings in the VSCode Preferences pane.

![VSCode settings example](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/settings.gif)

<a type="configurationOptions">

- **autocomplete.titleRegex:** By default, the auto-completion feature of this
  extension creates links with the full title of the linked document. You can
  provide a regular expression with one capture group to use only parts of the
  document title. As an example, let's say you want to link to a document with
  the filename `cpu.md` whose first line is `# Central Processing Unit (CPU)`.
  By default, auto-completed links to this file look like
  `[Central Processing Unit (CPU)](cpu.md)`. If you set this configuration
  option to `/\(([A-Z0-9]+)\)$/`, auto-completed links to this file are
  `[CPU](cpu.md)`.

</a>
