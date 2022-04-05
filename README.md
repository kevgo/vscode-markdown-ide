<center>
<img src="documentation/logo_800.png" width="800" height="175">
</center>

This extension for [VSCode](https://code.visualstudio.com) and
[compatible editors](https://open-vsx.org) provides IDE-grade editing and
refactoring support for Markdown files. This is most useful for large
collections of Markdown documents containing lots of links between them.

This extension works best with Markdown files formatted via
[Prettier](https://prettier.io) or [dprint](https://dprint.dev). It ignores
files in the `.git`, `node_modules`, and `vendor` folders. If you have any
feedback or requests, please
[open a ticket](https://github.com/kevgo/vscode-markdown-ide/issues).

![CI badge](https://github.com/kevgo/vscode-markdown-ide/actions/workflows/main.yml/badge.svg)

## autocomplete links to Markdown documents

Typing `[` triggers autocompletion for links to Markdown files. The link title
is the first heading in the linked file.

![demo of the "autocomplete links" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-link.gif)

## autocomplete image tags

Typing `![` triggers autocompletion for image tags.

![demo of the "autocomplete image tag" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-image-link.gif)

## autocomplete headings

Typing `#` triggers autocompletion with the existing headings in all Markdown
files of the current workspace.

![demo of the "autocomplete headings" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-heading.gif)

## rename file ⇒ update links to this file

When you rename a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by changing the target of these links to the new
filename.

![demo of the "rename file" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-file.gif)

## delete file ⇒ remove links to this file

When you delete a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by removing these links.

![demo of the "delete file" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/delete-file.gif)

## rename Markdown file title ⇒ update links containing this title

Run the "Markdown IDE: Rename document title" command to change the primary
heading of a document. Markdown IDE updates the title of matching links to that
document.

![demo of the "rename document title" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-document-title.gif)

## "go to definition" for links

Markdown IDE provides
[go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
for Markdown files. This works out of the box with the built-in ways to go to
definition like `ctrl+mouseclick` or`F12`. Following a link to another Markdown
document moves the cursor to the first backreference to the file you came from.

![demo of the "go to definition" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/go-to-definition.gif)

## Tikibase support

[Tikibase](https://github.com/kevgo/tikibase) is a linter for Markdown-based
wikis and knowledge bases. Markdown IDE can run the Tikibase binary for you,
highlight issues it identifies in VSCode, and apply auto-fixes via
[code actions](https://code.visualstudio.com/docs/editor/refactoring) or the
[command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

## configuration

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
