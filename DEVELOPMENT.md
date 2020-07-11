# Developer Guide

### setup

- clone the repo
- run `make setup`

### test

- run tests: `make test`
- see all dev scripts: `make help`

### debug

Debug in VSCode:

- set breakpoints in VSCode
- open Debug view: VSCode menu: `View` > `Run`
- choose `Run Extension`
- click on the `play` icon

Local installation:

- `make package`
- run `code --install-extension tikibase-*.vsix` in terminal
- restart VSCode

### update

- `make update`

### release

- `make publish-patch`
- `make publish-minor`
- `make publish-major`
