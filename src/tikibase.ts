import * as childProcess from "child_process"
import * as vscode from "vscode"

export async function run(
  args: { debug?: vscode.OutputChannel; opts: childProcess.ExecFileOptions }
): Promise<Issue[]> {
  args.debug?.appendLine("running tikibase ...")
  const output = await exec(args.opts)
  args.debug?.appendLine("TIKIBASE OUTPUT:")
  args.debug?.appendLine(output)
  return parse(output)
}

/** runs the Tikibase binary and provides the output */
function exec(opts: childProcess.ExecFileOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    childProcess.execFile("tikibase", ["c"], opts, function(error, stdout, stderr) {
      if (error?.code === "ENOENT") {
        void vscode.window.showErrorMessage(
          "Tikibase is enabled but the tikibase binary is not in the path."
        )
        reject()
        return
      }
      resolve(stdout + stderr)
    })
  })
}

export interface Issue {
  diagnostics: vscode.Diagnostic[]
  file: vscode.Uri
}

export function parse(output: string): Issue[] {
  return []
}
