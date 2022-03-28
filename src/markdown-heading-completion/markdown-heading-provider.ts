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
      debug.appendLine(`${time}ms:  loaded files: ${mdFiles.length}`)
      const headings = await getAllHeadings(mdFiles, workspacePath)
      time = new Date().getTime() - start
      debug.appendLine(`${time}ms  headings`)
      const result: vscode.CompletionItem[] = []
      for (const heading of headings) {
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

export async function getAllHeadings(
  fileNames: string[],
  wsRoot: string
): Promise<Iterable<string>> {
  // NOTE: for performance reasons, we start loading all file contents concurrently first
  // and then assemble the result as the individual file contents become available.
  const filePromises: Array<{ content: Promise<string>; fullPath: string }> = []
  for (const fileName of fileNames) {
    const fullPath = path.join(wsRoot, fileName)
    filePromises.push({
      fullPath,
      content: fs.readFile(fullPath, "utf-8")
    })
  }
  const result: Set<string> = new Set()
  for (const file of filePromises) {
    headings.inFile(await file.content, result)
  }
  return result.values()
}
