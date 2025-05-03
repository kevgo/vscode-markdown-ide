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
is the first heading in the linked file. If present, Markdown IDE uses the
`titleRegEx` setting in `tikibase.json` to abbreviate the titles of
auto-completed links.

![demo of the "autocomplete links" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-link.gif)

## autocomplete image tags

Typing `![` triggers autocompletion for image tags.

![demo of the "autocomplete image tag" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-image-link.gif)

## autocomplete headings

Typing `#` triggers autocompletion with the existing headings in all Markdown
files of the current workspace.

![demo of the "autocomplete headings" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-heading.gif)

## autocomplete footnotes

Typing `[^` triggers autocompletion for footnotes.

## rename Markdown file title ⇒ update links containing this title

Run the "Markdown IDE: Rename document title" command to change the primary
heading of a document. Markdown IDE updates the title of matching links to that
document.

![demo of the "rename document title" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-document-title.gif)

## update links after file was renamed or deleted

This is now
[available](vscode://settings/markdown.updateLinksOnFileMove.enabled) in VSCode.

## "go to definition" for links

Markdown IDE supports the
[go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
movements (`ctrl+mouseclick` or`F12`) for links in Markdown files. If
bi-directional links are activated, following a link to another Markdown
document always moves the cursor to the first backreference to the file you came
from. If bi-directional links are not activated, it jumps to the linked heading
within the target document.

![demo of the "go to definition" feature](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/go-to-definition.gif)

## extract new file with selected title

When the selection highlights a single line, Markdown IDE provides an "extract
file with this title" refactor. It creates a new file with the selected text as
its title and replaces the selection with a link to this new file.

## extract new file with selected content

When the selection highlights multiple lines, Markdown IDE provides an "extract
file with this content" refactor. It asks the user for a title, creates a new
file with the given title and the selected text as its content, and replaces the
selection with a link to this new file.

## "link to note" refactor

When selecting text that is also the title of an existing note, Markdown IDE
offers a code action that replaces the selection with a link to the respective
note.

## Tikibase support

[Tikibase](https://github.com/kevgo/tikibase) is a linter for Markdown-based
wikis and knowledge bases. If you have a `tikibase.json` file in your document
repo and the Tikibase linter installed, Markdown IDE runs it for you, highlights
the identified issues in VSCode, and applies auto-fixes via
[code actions](https://code.visualstudio.com/docs/editor/refactoring) or the
[command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

## configuration

If present, Markdown IDE uses the `titleRegEx` setting in `tikibase.json` to
abbreviate auto-completed links.
