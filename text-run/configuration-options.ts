import * as assertNoDiff from "assert-no-diff"
import { promises as fs } from "fs"
import * as tr from "text-runner"

export async function configurationOptions(
  action: tr.actions.Args
): Promise<void> {
  const documented = documentedOptions(action.region)
  const actual = await actualOptions()
  action.name(`${actual.length} configuration options`)
  assertNoDiff.json(documented, actual)
}

async function actualOptions(): Promise<string[]> {
  const config = JSON.parse(await fs.readFile("../package.json", "utf-8"))
  const result = []
  const props = config.contributes.configuration.properties
  for (const key of Object.keys(props)) {
    result.push(`${key.substr(12)}:`)
  }
  return result
}

function documentedOptions(nodes: tr.ast.NodeList) {
  const result = []
  const ul = nodes.nodesFor(nodes.nodeOfTypes("bullet_list_open"))
  const lis = ul.nodesOfTypes("list_item_open")
  for (const li of lis) {
    const bold = ul.nodesFor(ul.nodeOfTypes("strong_open"))
    result.push(bold.text())
  }
  return result
}
