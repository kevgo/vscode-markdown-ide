import * as assertNoDiff from "assert-no-diff"
import { promises as fs } from "fs"
import * as tr from "text-runner"

export async function configExtName(action: tr.actions.Args): Promise<void> {
  const config = JSON.parse(await fs.readFile("../package.json", "utf-8"))
  const actual = config.contributes.configuration.title
  action.name(`configuration region name is "${actual}"`)
  const documented = action.region.text()
  assertNoDiff.chars(documented, actual)
}
