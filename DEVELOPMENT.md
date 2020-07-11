# Developer Guide

### setup

- clone the repo
- run <code textrun="make-target">make setup</code>

### test

- run tests: <code textrun="make-target">make test</code>
- see all dev scripts: <code textrun="make-target">make help</code>

### debug

Debug in VSCode:

- set breakpoints in VSCode
- open Debug view: VSCode menu: `View` > `Run`
- choose `Run Extension`
- click on the `play` icon

Local installation:

- <code textrun="make-target">make package</code>
- run `code --install-extension tikibase-*.vsix` in terminal
- restart VSCode

### update

- <code textrun="make-target">make update</code>

### release

- <code textrun="make-target">make publish-patch</code>
- <code textrun="make-target">make publish-minor</code>
- <code textrun="make-target">make publish-major</code>
