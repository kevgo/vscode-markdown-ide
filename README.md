# VSCode Markdown IDE

[![CircleCI](https://circleci.com/gh/kevgo/vscode-markdown-ide.svg?style=shield)](https://circleci.com/gh/kevgo/vscode-markdown-ide)

This plugin for [VSCode](https://code.visualstudio.com) and
[compatible editors](https://open-vsx.org) provides IDE-grade editing and
refactoring support for Markdown files.

#### autocompletion

- type `[` to trigger autocompletion for entering links to other Markdown files
- type `![` to trigger autocompletion for links to local image files
- ignores files in `.git`, `node_modules`, and `vendor`

#### refactoring

- updates links when renaming files
- removes links when deleting files

This extension works best with Markdown files formatted via
[Prettier](https://prettier.io).

![autocompletion demo](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/master/documentation/autocomplete.gif)

#### configuration

To configure this extension:

- open VSCode
- go to `File` > `Preferences` > `Settings`
- click on `Extensions` > <code type="configExtName">Markdown IDE</code>

Available configuration settings:

<a type="configurationOptions">

- **autocompleteTitleRegex:** Auto-completed links use the title of the linked
  document as the link title by default. If you want to use only parts of the
  linked document title, provide a regular expression with one capture group
  that extracts the phrase to use as the link title from the linked document
  title. If the regular expression doesn't match, it uses the full document
  title.

  As an example, let's say you want to link to a document with the filename
  `cpu.md` that contains `# Central Processing Unit (CPU)`. By default, the
  created link is `[Central Processing Unit (CPU)](cpu.md)`. If you set the
  regular expression `/\(([A-Z0-9]+)\)$/`, then the created link is
  `[CPU](cpu.md)`.

</a>
