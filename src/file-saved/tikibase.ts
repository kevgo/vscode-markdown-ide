import * as childProcess from "child_process"
import * as vscode from "vscode"

/** executes "tikibase check" and provides the identified issues */
export async function check(dir: string, debug: vscode.OutputChannel): Promise<TikiMessage[]> {
  const output = await exec({ argv: ["--format=json", "check"], execOpts: { cwd: dir }, debug })
  return parseOutput({ output })
}

export async function fix(dir: string, debug: vscode.OutputChannel): Promise<void> {
  await exec({ argv: ["fix"], execOpts: { cwd: dir }, debug })
}

/** runs the Tikibase binary and provides the output */
function exec(
  args: { argv: string[]; debug?: vscode.OutputChannel; execOpts: childProcess.ExecFileOptions }
): Promise<string> {
  // NOTE: need to do manual promises here because TypeScript
  // doesn't properly translate types when using util.promisify
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
function parseOutput(
  args: { debug?: vscode.OutputChannel; output: string }
): TikiMessage[] {
  try {
    return JSON.parse(args.output) as TikiMessage[]
  } catch (e) {
    args.debug?.appendLine(`Cannot parse Tikibase output: ${e}`)
    args.debug?.show()
    return []
  }
}

/** structure of how Tikibase describes issues */
export interface TikiMessage {
  readonly end: number
  readonly file: string
  readonly line: number
  readonly start: number
  readonly text: string
}
