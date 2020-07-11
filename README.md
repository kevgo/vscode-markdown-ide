# VSCode Markdown IDE

[![CircleCI](https://circleci.com/gh/kevgo/vscode-markdown-ide.svg?style=shield)](https://circleci.com/gh/kevgo/vscode-markdown-ide)

This plugin for [VSCode](https://code.visualstudio.com) provides IDE-grade
editing and refactoring automation for Markdown files.

**autocompletion**

- type `[` to trigger autocompletion for entering links to other Markdown files
- type `![` to trigger autocompletion for links to local image files

**refactoring**

- updates links when renaming files
- removes links when deleting files

This extension works best with Markdown files formatted via
[Prettier](https://prettier.io).

![autocompletion demo](https://raw.githubusercontent.com/kevgo/vscode-markdown-ide/master/documentation/autocomplete.gif)
