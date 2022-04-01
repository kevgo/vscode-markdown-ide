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

### autocomplete headings

Typing `#` triggers autocompletion with the existing headings in all Markdown
files of the current workspace.

#### rename file ⇒ update links to this file

When you rename a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by changing the target of these links to the new
filename.

#### delete file ⇒ remove links to this file

When you delete a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by removing these links.

#### rename Markdown file title ⇒ update links containing this title

Run the "Markdown IDE: Rename document title" command to change the primary
heading of a document. Markdown IDE updates the title of matching links to that
document.

#### "go to definition" for links

Markdown IDE provides
[go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
for Markdown files. This works out of the box with the built-in ways to go to
definition like `ctrl+mouseclick` or`F12`. Following a link to another Markdown
document moves the cursor to the first backreference to the file you came from.

### Tikibase support

[Tikibase](https://github.com/kevgo/tikibase) is a linter for Markdown-based
wikis and knowledge bases. Markdown IDE can run the Tikibase binary for you,
highlight issues it identifies in VSCode, and apply auto-fixes via
[code actions](https://code.visualstudio.com/docs/editor/refactoring) or the
[command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

#### configuration

You can configure this extension via settings in the VSCode Preferences pane.

![VSCode settings example](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/settings.gif)

<a type="configurationOptions">

- **markdownIDE.autocomplete.titleRegex:** By default, the auto-completion
  feature of this extension creates links with the full title of the linked
  document. You can provide a regular expression with one capture group to use
  only parts of the document title. As an example, let's say you want to link to
  a document with the filename `cpu.md` whose first line is
  `# Central Processing Unit (CPU)`. By default, auto-completed links to this
  file look like `[Central Processing Unit (CPU)](cpu.md)`. If you set this
  configuration option to `/\(([A-Z0-9]+)\)$/`, auto-completed links to this
  file are `[CPU](cpu.md)`.

- **markdownIDE.tikibase.enabled:**
  [Tikibase](https://github.com/kevgo/tikibase) is an advanced linter for
  Markdown-based knowledge bases.

</a>
