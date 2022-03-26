import * as childProcess from "child_process"
import * as vscode from "vscode"

/** runs the Tikibase binary and provides {@link Issue}s found */
export async function run(
  args: { debug?: vscode.OutputChannel; opts: childProcess.ExecFileOptions }
): Promise<Message[]> {
  args.debug?.appendLine("running tikibase ...")
  const output = await exec(args.opts)
  args.debug?.appendLine("TIKIBASE OUTPUT:")
  args.debug?.appendLine(output)
  return parseOutput({ output, debug: args.debug })
}

/** runs the Tikibase binary and provides the output */
function exec(opts: childProcess.ExecFileOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    childProcess.execFile("tikibase", ["--format=json", "check"], opts, function(error, stdout, stderr) {
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

/** parses the given Tikibase output into {@link Issue}s */
function parseOutput(
  args: { debug?: vscode.OutputChannel; output: string /* wsRoot: string */ }
): Message[] {
  try {
    const parsed: Message[] = JSON.parse(args.output)
    return parsed
  } catch (e) {
    args.debug?.appendLine(`Cannot parse Tikibase output: ${e}`)
    return []
  }
}

export interface Message {
  readonly end: number
  readonly file: string
  readonly line: number
  readonly start: number
  readonly text: string
}
