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

![autocompletion demo](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/master/documentation/autocomplete.gif)

#### autocomplete links to image files

Typing `![` triggers autocompletion for links to image files.

#### rename file ⇒ update incoming links

When you rename a file, links to this file in other Markdown files would be
broken. Markdown IDE fixes this.

#### delete file ⇒ remove incoming links

When you delete a file, links to this file in other Markdown files would be
broken. Markdown IDE fixes this.

#### configuration

To configure this extension:

- in the VSCode menu: go to `File` > `Preferences` > `Settings`
- click `Extensions` > <code type="configExtName">Markdown IDE</code>

Available configuration settings:

<a type="configurationOptions">

- **autocompleteTitleRegex:** By default, the auto-completion feature of this
  extension creates links with the full title of the linked document. You can
  provide a regular expression with one capture group to use only parts of the
  document title.

  As an example, let's say you want to link to a document with the filename
  `cpu.md` whose first line is `# Central Processing Unit (CPU)`. By default,
  auto-completed links to this file look like
  `[Central Processing Unit (CPU)](cpu.md)`. If you set this configuration
  option to `/\(([A-Z0-9]+)\)$/`, auto-completed links to this file look like
  `[CPU](cpu.md)`.

  If there is a problem with the regular expression, the extension pops up the
  VSCode's Output Console with diagnostic messages.

</a>
