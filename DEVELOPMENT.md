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

- run <code type="make/command">make build-dev</code> to compile a package with
  source maps or keep <code type="make/command">make watch</code> running
  - debugging requires source maps to work
  - VSCode somehow doesn't run the compiler by itself before debugging
- set breakpoints in VSCode
- Run > Start Debugging
- in the VSCode instance that starts: open folder > choose a different folder
  than the current one

To print to the _debug console_ of the hosting VSCode instance: `console.log`

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
