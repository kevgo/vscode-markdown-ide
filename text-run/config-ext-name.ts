import * as tr from "text-runner"
import * as assertNoDiff from "assert-no-diff"

export function configExtName(action: tr.actions.Args) {
  const config = require("../package.json")
  const actual = config.contributes.configuration.title
  action.name(`configuration region name is "${actual}"`)
  const documented = action.region.text()
  assertNoDiff.chars(documented, actual)
}
