build:  # compiles the extension
	@yarn compile

help:   # shows all available Make commands
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

package:  # package the extension for local installation
	@vsce package

publish-patch:  # publishes a new patch version
	vsce publish patch

publish-minor:  # publishes a new minor version
	vsce publish minor

publish-major:  # publishes a new major version
	vsce publish major

setup:  # prepare this code base for development
	@yarn install
	@yarn compile

test:  # runs all the tests
	@mocha "src/**/*.test.ts" &
	@yarn compile

test-ci:  # runs all the tests on ci
	@yarn compile
	@node_modules/.bin/mocha "src/**/*.test.ts"

unit:  # runs the unit tests
	@mocha "src/**/*.test.ts"
