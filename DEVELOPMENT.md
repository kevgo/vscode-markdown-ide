# Developer Guide

### setup

- clone the repo
- install [Node.js](https://nodejs.org) and [yarn](https://classic.yarnpkg.com)
  (`npm i -g yarn`)
- run <code type="make/command">make setup</code>

### test

- run tests: <code type="make/command">make test</code>
- see all dev tasks: <code type="make/command">make help</code>

### debug

Debug in VSCode:

- set breakpoints in VSCode
- open Debug view: VSCode menu: `View` > `Run`
- choose `Run Extension`
- click on the `play` icon
- open folder > choose a different folder than the current one

Local installation:

- <code type="make/command">make package</code>
- run `code --install-extension tikibase-*.vsix` in terminal
- restart VSCode

### update

- <code type="make/command">make update</code>

### release

- <code type="make/command">make publish-patch</code>
- <code type="make/command">make publish-minor</code>
- <code type="make/command">make publish-major</code>
