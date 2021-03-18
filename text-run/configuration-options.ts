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
    result.push(`${key.substr(12)}: ${props[key].description}`)
  }
  return result
}

function documentedOptions(nodes: tr.ast.NodeList) {
  const result = []
  for (const node of nodes.nodesOfTypes("tr_open")) {
    const row = nodes.nodesFor(node)
    const command = row.nodesFor(row.nodeOfTypes("th")).text()
    const desc = row.nodesFor(row.nodeOfTypes("td")).text()
    result.push(`${command}: ${desc}`)
  }
  return result
}
