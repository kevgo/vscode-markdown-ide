import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { Configuration } from "../configuration"
import * as files from "../helpers/files"
import * as headings from "../helpers/headings"

/** Completion provider for MarkdownLinks */
export function markdownHeadingProvider(debug: vscode.OutputChannel): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      debug.appendLine("completing heading")
      const config = new Configuration()
      const workspacePath = config.workspacePath()
      debug.appendLine(`wsPath: ${workspacePath}`)
      if (!workspacePath) {
        return
      }
      const mdFiles = await files.markdown()
      debug.appendLine(`files: ${mdFiles.length}`)
      const headings = await getAllHeadings(mdFiles, workspacePath, debug)
      debug.appendLine(`headings: ${headings}`)
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
  wsRoot: string,
  debug: vscode.OutputChannel
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
  debug.appendLine(`filePromises: ${filePromises.length}`)
  const result: Set<string> = new Set()
  for (const file of filePromises) {
    headings.inFile(await file.content, result)
  }
  return result.values()
}
