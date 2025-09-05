import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

/** the data as it is stored in the configuration file */
export interface Raw {
  bidiLinks?: boolean
  sections?: string[]
  titleRegEx?: string
}

/** provides high-level access to Tikibase configuration data */
export class Data {
  private raw: Raw

  constructor(raw: Raw) {
    this.raw = raw
  }

  bidiLinks(): boolean {
    return this.raw.bidiLinks ?? false
  }

  sections(): string[] | undefined {
    return this.raw.sections
  }

  /** provides the titleRegEx setting as a proper regular expression */
  titleRegex(): RegExp | undefined {
    if (this.raw.titleRegEx) {
      try {
        return new RegExp(this.raw.titleRegEx)
      } catch (e) {
        void vscode.window.showErrorMessage(`error parsing the regex "${this.raw.titleRegEx}": ${e}`)
      }
    }
  }
}

/** provides the Tikibase configuration */
export async function load(wsRoot: string): Promise<Data | undefined> {
  let text = ""
  try {
    text = await fs.readFile(path.join(wsRoot, "tikibase.json"), "utf8")
  } catch (e) {
    return
  }
  try {
    return new Data(JSON.parse(text) as Raw)
  } catch (e) {
    await vscode.window.showErrorMessage(`file tikibase.json contains invalid JSON: ${e}`)
  }
}
