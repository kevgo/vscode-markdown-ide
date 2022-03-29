import * as childProcess from "child_process"
import * as vscode from "vscode"

/** executes "tikibase check" and provides the identified issues */
export async function check(dir: string, debug: vscode.OutputChannel): Promise<Message[]> {
  const output = await exec({ argv: ["--format=json", "check"], execOpts: { cwd: dir }, debug })
  return parseOutput(output, debug)
}

export async function fix(dir: string, debug: vscode.OutputChannel): Promise<void> {
  await exec({ argv: ["fix"], execOpts: { cwd: dir }, debug })
}

/** runs the Tikibase binary and provides the output */
function exec(
  args: { argv: string[]; debug?: vscode.OutputChannel; execOpts: childProcess.ExecFileOptions }
): Promise<string> {
  // NOTE: using manual promises here for correct types
  return new Promise((resolve, reject) => {
    childProcess.execFile("tikibase", args.argv, args.execOpts, function(error, stdout, stderr) {
      if (error?.code === "ENOENT") {
        args.debug?.appendLine("Error: Tikibase is enabled but the tikibase binary is not in the path.")
        args.debug?.show()
        reject()
        return
      }
      resolve(stdout + stderr)
    })
  })
}

/** parses the given Tikibase output into TS structures */
function parseOutput(output: string, debug?: vscode.OutputChannel): Message[] {
  try {
    return JSON.parse(output) as Message[]
  } catch (e) {
    debug?.appendLine(`Cannot parse Tikibase output: ${e}`)
    debug?.show()
    return []
  }
}

/** structure of how Tikibase describes issues */
export interface Message {
  readonly end: number
  readonly file: string
  readonly line: number
  readonly start: number
  readonly text: string
}
