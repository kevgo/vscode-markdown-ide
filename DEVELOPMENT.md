# Developer Guide

### setup

- clone the repo
- run <code type="make/command">make setup</code>

### test

- run tests: <code type="make/command">make test</code>
- see all dev scripts: <code type="make/command">make help</code>

### debug

Debug in VSCode:

- set breakpoints in VSCode
- open Debug view: VSCode menu: `View` > `Run`
- choose `Run Extension`
- click on the `play` icon

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
