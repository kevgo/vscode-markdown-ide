# VSCode Markdown IDE

![CI badge](https://github.com/kevgo/vscode-markdown-ide/actions/workflows/main.yml/badge.svg)

This plugin for [VSCode](https://code.visualstudio.com) and
[compatible editors](https://open-vsx.org) provides IDE-grade editing and
refactoring support for Markdown files. This is most useful with large
collections of Markdown documents with lots of links between them.

This extension works best with Markdown files formatted via
[Prettier](https://prettier.io) or [dprint](https://dprint.dev). It ignores
files in the `.git`, `node_modules`, and `vendor` folders.

#### autocomplete links to Markdown documents

Typing `[` triggers autocompletion for links to Markdown files.

![autocompletion demo](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/master/documentation/autocomplete.gif)

#### autocomplete links to image files

Typing `![` triggers autocompletion for links to image files.

#### rename file --> update incoming links

When you rename a file, links to this file in other Markdown files would be
broken. Markdown IDE fixes this.

#### delete file --> remove incoming links

When you delete a file, links to this file in other Markdown files would be
broken. Markdown IDE fixes this.

#### configuration

To configure this extension:

- in the VSCode menu: go to `File` > `Preferences` > `Settings`
- click `Extensions` > <code type="configExtName">Markdown IDE</code>

Available configuration settings:

<a type="configurationOptions">

- **autocompleteTitleRegex:** By default, titles of auto-completed links are the
  titles of the linked document. To use only parts of the linked document title,
  provide a regular expression with one capture group. If the regular expression
  doesn't match anything, it falls back to the full document title.

  As an example, let's say you want to link to a document with the filename
  `cpu.md` that contains `# Central Processing Unit (CPU)`. By default, the
  auto-completed links this extension creates look like
  `[Central Processing Unit (CPU)](cpu.md)`. If you set the regular expression
  `/\(([A-Z0-9]+)\)$/`, then an auto-completed link to this file looks like
  `[CPU](cpu.md)`.

  If there is a problem with the regular expression, the extension pops up the
  VSCode's Output Console with diagnostic messages.

</a>
