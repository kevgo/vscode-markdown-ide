import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

export interface Data {
  bidiLinks?: boolean
  sections?: string[]
  titleRegEx?: string
}

export class Config {
  private data: Data

  constructor(data: Data) {
    this.data = data
  }

  bidiLinks(): boolean {
    return this.data.bidiLinks ?? false
  }

  sections(): string[] | undefined {
    return this.data.sections
  }

  /** provides the titleRegEx setting as a proper regular expression */
  titleRegex(): RegExp | undefined {
    if (this.data.titleRegEx) {
      try {
        return new RegExp(this.data.titleRegEx)
      } catch (e) {
        void vscode.window.showErrorMessage(`error parsing the regex "${this.data.titleRegEx}": ${e}`)
      }
    }
  }
}

/** provides the Tikibase configuration */
export async function load(wsRoot: string): Promise<Config | undefined> {
  let text = ""
  try {
    text = await fs.readFile(path.join(wsRoot, "tikibase.json"), "utf8")
  } catch (e) {
    return
  }
  try {
    return new Config(JSON.parse(text) as Data)
  } catch (e) {
    await vscode.window.showErrorMessage(`file tikibase.json contains invalid JSON: ${e}`)
  }
}
