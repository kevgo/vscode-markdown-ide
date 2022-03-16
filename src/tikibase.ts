import * as childProcess from "child_process"
import * as util from "util"
import * as vscode from "vscode"
const execFile = util.promisify(childProcess.execFile)

export async function run(
  args: { debug?: vscode.OutputChannel; opts: childProcess.ExecFileOptions }
): Promise<Issue[]> {
  args.debug?.appendLine("running tikibase ...")
  const output = await exec(args.opts)
  args.debug?.appendLine("TIKIBASE OUTPUT:")
  args.debug?.appendLine(output)
  return parse(await exec(args.opts))
}

/** runs the Tikibase binary and provides the output */
async function exec(opts: childProcess.ExecFileOptions): Promise<string> {
  const { stdout, stderr } = await execFile("tikibase", opts)
  return stdout + stderr
}

export interface Issue {
  diagnostics: vscode.Diagnostic[]
  file: vscode.Uri
}

export function parse(output: string): Issue[] {
  return []
}
