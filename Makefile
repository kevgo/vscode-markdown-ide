build:  # builds the extension in production mode
	${CURDIR}/node_modules/.bin/esbuild ./src/extension.ts --bundle --outfile=dist/main.js --external:vscode --format=cjs --platform=node --minify

build-dev:  # builds the extension in dev mode
	${CURDIR}/node_modules/.bin/esbuild ./src/extension.ts --bundle --outfile=dist/main.js --external:vscode --format=cjs --platform=node --sourcemap

compile: clean  # compiles the extension
	echo "compiling ..."
	${CURDIR}/node_modules/.bin/tsc -p .

clean:  # removes all build artifacts
	rm -rf out dist

doc:  # runs the documentation tests
	${CURDIR}/node_modules/.bin/text-run --format=dot

fix:  # auto-corrects all formatting issues
	${CURDIR}/node_modules/.bin/eslint . --fix --ext .ts
	dprint fmt
	${CURDIR}/node_modules/.bin/sort-package-json

help:   # shows all available Make commands
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v '.SILENT' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # runs all linters
	${CURDIR}/node_modules/.bin/eslint . --ext .ts & \
	${CURDIR}/node_modules/.bin/sort-package-json & \
	dprint check & \
	git diff --check & \
	wait

list-shipped-files:  # lists all the files that will get shipped in the compiled extension, edit .vscodeignore to change
	vsce ls

package: build  # package the extension for local installation
	vsce package

publish-patch:  # publishes a new patch version
	vsce publish patch --no-yarn

publish-minor:  # publishes a new minor version
	vsce publish minor --no-yarn

publish-major:  # publishes a new major version
	vsce publish major --no-yarn

setup:  # prepare this code base for development
	yarn install
	make --no-print-directory build

test:  # runs all the tests
	make --no-print-directory build & \
	make --no-print-directory doc & \
	make --no-print-directory lint & \
	make --no-print-directory unit & \
	wait

test-ci: build lint unit doc  # runs all the tests on ci

unit: compile  # runs the unit tests
	echo "testing ..."
	node out/test/main.js

update:  # updates all dependencies
	yarn upgrade-interactive --latest

watch:  # continuously compiles the source code into a debuggable package
	${CURDIR}/node_modules/.bin/esbuild ./src/extension.ts --bundle --outfile=dist/main.js --external:vscode --format=cjs --platform=node --sourcemap --watch


.DEFAULT_GOAL := help
.SILENT:
