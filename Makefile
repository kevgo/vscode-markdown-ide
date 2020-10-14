build:  # compiles the extension
	@tsc -p .

clean:  # removes all build artifacts
	@rm -rf out

fix:  # auto-corrects all formatting issues
	@prettier --write .

help:   # shows all available Make commands
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # runs all linters
	@tslint -p .

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
	@text-run --offline --format=dot &
	@yarn compile

test-ci:  # runs all the tests on ci
	@yarn compile
	@node_modules/.bin/mocha "src/**/*.test.ts"

unit:  # runs the unit tests
	@mocha "src/**/*.test.ts"

update:  # updates all dependencies
	@yarn upgrade --latest
