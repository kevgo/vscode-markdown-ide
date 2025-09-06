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
`titleRegEx` setting in [tikibase.json](https://github.com/kevgo/tikibase) to
abbreviate the titles of auto-completed links.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-link-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-link-dark.gif">
  <img alt="demo of the autocomplete-links feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-link-light.gif">
</picture>

## autocomplete image tags

Typing `![` triggers autocompletion for image tags.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-image-link-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-image-link-dark.gif">
  <img alt="demo of the autocomplete-image-link feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-image-link-light.gif">
</picture>

## autocomplete headings

Typing `#` triggers autocompletion with the existing headings in all Markdown
files of the current workspace.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-heading-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-heading-dark.gif">
  <img alt="demo of the autocomplete-headings feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-heading-light.gif">
</picture>

## autocomplete footnotes

Typing `[^` triggers autocompletion for footnotes.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-footnote-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-footnote-dark.gif">
  <img alt="demo of the autocomplete-headings feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/autocomplete-footnote-light.gif">
</picture>

## rename file ⇒ update links to this file

When you rename a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by changing the target of these links to the new
filename.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-file-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-file-dark.gif">
  <img alt="demo of the rename-file feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-file-light.gif">
</picture>

## delete file ⇒ remove links to this file

When you delete a file, all links to this file in other Markdown files would be
broken. Markdown IDE fixes this by removing these links.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/delete-file-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/delete-file-dark.gif">
  <img alt="demo of the delete-file feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/delete-file-light.gif">
</picture>

## rename Markdown file title ⇒ update links containing this title

When you update the primary heading of a document (its top-most H1), Markdown
IDE can update the matching title of links pointing to this document. To use
this feature:

- put the cursor into the top-most H1 heading and run VSCode's `rename symbol`
  refactor (press F2)
- alternatively, run the `Markdown IDE: Rename document title` command

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-document-title-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-document-title-dark.gif">
  <img alt="demo of the rename-document-title feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/rename-document-title-light.gif">
</picture>

## go to definition

Markdown IDE supports the
[go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
movements (`ctrl+mouseclick` or`F12`) for links in Markdown files. If
bi-directional links are activated, following a link to another Markdown
document always moves the cursor to the first backreference to the file you came
from. If bi-directional links are not activated, it jumps to the linked heading
within the target document.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/go-to-definition-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/go-to-definition-dark.gif">
  <img alt="demo of the go-to-definition feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/go-to-definition-light.gif">
</picture>

## find all references

When you highlight a Markdown note title (the top-level heading in a Markdown
file) and activate VSCode's `find all references` feature (by choosing it from
the context menu or hitting `ctrl-shift-F12`, Markdown IDE will locate every
link across your workspace that points to the current file.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/find-all-references-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/find-all-references-dark.gif">
  <img alt="demo of the find-all-references feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/find-all-references-light.gif">
</picture>

## extract new file with selected title

When the selection highlights a single line, Markdown IDE provides an "extract
file with this title" refactor. It creates a new file with the selected text as
its title and replaces the selection with a link to this new file.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/extract-file-with-title-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/extract-file-with-title-dark.gif">
  <img alt="demo of the find-all-references feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/extract-file-with-title-light.gif">
</picture>

## extract new file with selected content

When the selection highlights multiple lines, Markdown IDE provides an "extract
file with this content" refactor. It asks the user for a title, creates a new
file with the given title and the selected text as its content, and replaces the
selection with a link to this new file.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/extract-file-with-body-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/extract-file-with-body-dark.gif">
  <img alt="demo of the find-all-references feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/extract-file-with-body-light.gif">
</picture>

## "link to note" refactor

When selecting text that is also the title of an existing note, Markdown IDE
offers a code action that replaces the selection with a link to the respective
note.

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/link-to-note-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/link-to-note-dark.gif">
  <img alt="demo of the find-all-references feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/link-to-note-light.gif">
</picture>

## Tikibase integration

[Tikibase](https://github.com/kevgo/tikibase) is a linter for Markdown-based
wikis and knowledge bases. If you have a
[Tikibase configuration file](https://github.com/kevgo/tikibase?tab=readme-ov-file#configuration)
file in your document repo and the Tikibase linter is installed, Markdown IDE
integrates with it.

### Run linters and auto-fixes

Markdown-IDE runs `tikibase check` when you save files, and it highlights the
identified issues in VSCode. You also get
[code actions](https://code.visualstudio.com/docs/editor/refactoring) to fix
identified issues. You can also trigger `tikibase fix` via the
[command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/tikibase-fix-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/tikibase-fix-dark.gif">
  <img alt="demo of the find-all-references feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/tikibase-fix-light.gif">
</picture>

### TitleRegex

If present, Markdown IDE uses the `titleRegEx` setting in `tikibase.json` to
shorten auto-completed link texts.

For example, say we want to link to the note titled:

```md
# Gross Domestic Product (GDP)
```

By default, an auto-completed link looks like this:

```md
Consider the [Gross Domestic Product (GDP)](gross-domestic-product.md)
```

That's verbose and repetitive. Instead, let's just use the abbreviation `GDP` as
the link title. To make this happen, add the following to **tikibase.json**:

```json
{
  "titleRegEx": "\\(([^)]+)\\)$"
}
```

This `titleRegEx` extracts the last word in the note title if it’s wrapped in
parentheses. With this setting in place, auto-completed links now look like:

```md
Consider the [GDP](gross-domestic-product.md)
```

Here’s an animation showing the feature in action:

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/tikibase-fix-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/tikibase-fix-dark.gif">
  <img alt="demo of the find-all-references feature" src="https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/main/documentation/tikibase-fix-light.gif">
</picture>
