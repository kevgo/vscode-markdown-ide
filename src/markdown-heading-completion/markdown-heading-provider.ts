import * as vscode from "vscode"

import * as files from "../helpers/files"
import * as headings from "../helpers/headings"

/** Completion provider for MarkdownLinks */
export function markdownHeadingProvider(debug: vscode.OutputChannel, wsRoot: string): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems() {
      const time = new Date().getTime()
      const mdFiles: files.FileResult[] = []
      await files.markdown(wsRoot, mdFiles)
      debug.appendLine(`${new Date().getTime() - time}ms:  created all file load promises: ${mdFiles.length}`)
      const unique: Set<string> = new Set()
      for (const mdFile of mdFiles) {
        headings.inFile(await mdFile.content, unique)
      }
      debug.appendLine(`${new Date().getTime() - time}ms  loaded and parsed headings`)
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
