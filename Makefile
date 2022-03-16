.DEFAULT_GOAL := help

build:  # compiles the extension
	${CURDIR}/node_modules/.bin/tsc -p .

clean:  # removes all build artifacts
	rm -rf out

doc:  # runs the documentation tests
	${CURDIR}/node_modules/.bin/text-run --format=dot

fix:  # auto-corrects all formatting issues
	${CURDIR}/node_modules/.bin/eslint . --fix --ext .ts
	dprint fmt

help:   # shows all available Make commands
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # runs all linters
	${CURDIR}/node_modules/.bin/eslint . --ext .ts & \
	dprint check & \
	git diff --check & \
	wait

package:  # package the extension for local installation
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

unit: build  # runs the unit tests
	node out/run_tests.js

update:  # updates all dependencies
	yarn upgrade --latest

.SILENT:
