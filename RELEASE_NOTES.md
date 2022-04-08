# Markdown IDE Release Notes

## 0.3.2

- automatically enable Tikibase mode when tikibase.json is present
  ([#86](https://github.com/kevgo/vscode-markdown-ide/pull/86))
- compatibility with Tikibase 0.4.1

## 0.3.1

- fix bug when renaming document titles
  ([#80](https://github.com/kevgo/vscode-markdown-ide/pull/80))
- more performance optimizations
  ([#81](https://github.com/kevgo/vscode-markdown-ide/pull/81),
  [#82](https://github.com/kevgo/vscode-markdown-ide/pull/82))

## 0.3

A major release with tons of new features and improvements!

More auto-completions:

- Markdown headings
  ([#66](https://github.com/kevgo/vscode-markdown-ide/pull/66))

More refactorings:

- rename document titles
  ([#45](https://github.com/kevgo/vscode-markdown-ide/pull/45))

Better navigation within Markdown documents:

- "go to definition" for Markdown links
  ([#72](https://github.com/kevgo/vscode-markdown-ide/pull/72))

More linting and auto-fixes:

- optional integration of the [Tikibase](https://github.com/kevgo/tikibase)
  linter for advanced linting features
  - display linter errors in VSCode UI
    ([#62](https://github.com/kevgo/vscode-markdown-ide/pull/62))
  - run "tikibase fix" via a code action or the command palette
    ([#69](https://github.com/kevgo/vscode-markdown-ide/pull/69),
    [#70](https://github.com/kevgo/vscode-markdown-ide/pull/70),
    [#71](https://github.com/kevgo/vscode-markdown-ide/pull/71))

Nicer UI:

- new logo ([#73](https://github.com/kevgo/vscode-markdown-ide/pull/73))
- videos visualizing how features work
  ([#75](https://github.com/kevgo/vscode-markdown-ide/pull/75),
  [#77](https://github.com/kevgo/vscode-markdown-ide/pull/77))

Faster performance:

- performance optimizations for faster, more concurrent filesystem operations
  ([#57](https://github.com/kevgo/vscode-markdown-ide/pull/57),
  [#68](https://github.com/kevgo/vscode-markdown-ide/pull/68),
  [#57](https://github.com/kevgo/vscode-markdown-ide/pull/57))

## 0.2.1

- [fix bug on Windows](https://github.com/kevgo/vscode-markdown-ide/pull/43)

## 0.2

- [treat filesystem entries that end in `.md` automatically as Markdown files](https://github.com/kevgo/vscode-markdown-ide/commit/2ed81ac0f4ec580d6aa67ef48084cbcf290cfce9):
  this is a performance optimization for large document bases (> 1000 Markdown
  files)

## 0.1

- [Configuration option for shorter links](https://github.com/kevgo/vscode-markdown-ide/pull/32)
- [Emit more modern JS code](https://github.com/kevgo/vscode-markdown-ide/commit/c7eff999e5cc47f639c88bceb663ad7acbc5a647)

## 0.0.8

- [Remove links in autocompleted links](https://github.com/kevgo/vscode-markdown-ide/commit/7a2c16e61548a5cdeda9a7507e106137142d2eb2)

## 0.0.7

- Incomplete search matches all entries

## 0.0.5

#### new features

- [faster speed thanks to loading data in parallel](https://github.com/kevgo/vscode-markdown-ide/commit/5822fb3b00cf6075ef170464366b706be0cd1985)

#### bug fixes

- [fix wrong autocompletion in subfolders](https://github.com/kevgo/vscode-markdown-ide/issues/12)
- [auto-completes half-finished links](https://github.com/kevgo/vscode-markdown-ide/commit/a4d4d64f04f60643e03b5b28812da9d3ebccee2f)

## 0.0.4

#### New features

- [autocompletes Markdown files in subfolders](https://github.com/kevgo/vscode-markdown-ide/pull/7)

#### Internal

- [documentation tests](https://github.com/kevgo/vscode-markdown-ide/pull/8)
