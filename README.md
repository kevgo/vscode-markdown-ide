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
- click on `Extensions`
- click on <code type="configExtName">Markdown IDE</code>

There you can change these configuration settings:

<table type="configurationSettings">
  <tr>
	  <th>autocompleteTitleRegex</th>
		<td>A custom RegEx</td>
	</tr>
</table>
