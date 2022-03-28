import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { Configuration } from "../configuration"
import * as files from "../helpers/files"
import * as headings from "../helpers/headings"

/** Completion provider for MarkdownLinks */
export function markdownHeadingProvider(debug: vscode.OutputChannel): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems() {
      const start = new Date().getTime()
      const config = new Configuration()
      const workspacePath = config.workspacePath()
      let time = new Date().getTime() - start
      if (!workspacePath) {
        return
      }
      const mdFiles = await files.markdown()
      time = new Date().getTime() - start
      debug.appendLine(`${time}ms:  found all files: ${mdFiles.length}`)
      const filePromises: Array<Promise<string>> = []
      for (const fileName of mdFiles) {
        const fullPath = path.join(workspacePath, fileName)
        filePromises.push(fs.readFile(fullPath, "utf-8"))
      }
      time = new Date().getTime() - start
      debug.appendLine(`${time}ms:  created all file load promises: ${mdFiles.length}`)
      const unique: Set<string> = new Set()
      for (const filePromise of filePromises) {
        headings.inFile(await filePromise, unique)
      }
      time = new Date().getTime() - start
      debug.appendLine(`${time}ms  have headings`)
      const result: vscode.CompletionItem[] = []
      for (const heading of unique) {
        result.push(
          new vscode.CompletionItem(
            heading.substring(1),
            vscode.CompletionItemKind.Text
          )
        )
      }
      return result
    }
  }
}
