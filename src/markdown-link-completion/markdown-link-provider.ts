import * as path from "path"
import * as vscode from "vscode"

import { Configuration } from "../configuration"
import * as files from "../helpers/files"
import * as links from "../helpers/links"
import * as input from "./input"

/** Completion provider for MarkdownLinks */
export function markdownLinkCompletionProvider(
  debug: vscode.OutputChannel,
  workspacePath: string
): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const time = new Date().getTime()
      const config = new Configuration()
      debug.appendLine(`${new Date().getTime() - time}ms:  input analyzed`)
      const documentDir = path.dirname(document.fileName)
      debug.appendLine(`documentDir: ${documentDir}`)
      switch (input.analyze(document.lineAt(position).text, position.character)) {
        case input.LinkType.MD:
          return mdCompletionItems({
            wsRoot: workspacePath,
            documentDir,
            time,
            titleRE: config.titleRegExp(),
            debug
          })
        case input.LinkType.IMG:
          return imgCompletionItems({ debug, time, wsRoot: workspacePath, documentDir })
        default:
          throw new Error(`Unknown link type`)
      }
    }
  }
}

async function mdCompletionItems(args: {
  debug: vscode.OutputChannel
  documentDir: string
  time: number
  titleRE: RegExp | undefined
  wsRoot: string
}): Promise<vscode.CompletionItem[]> {
  const mdFilesAcc: files.FileResult[] = []
  await files.markdown(args.wsRoot, mdFilesAcc)
  const result = []
  for (const mdFile of mdFilesAcc) {
    const relPath = args.documentDir !== args.wsRoot
      ? path.relative(args.documentDir, path.join(args.wsRoot, mdFile.filePath))
      : mdFile.filePath
    const link = links.markdown({
      fileName: relPath,
      fileContent: await mdFile.content,
      debug: args.debug,
      titleRE: args.titleRE
    })
    result.push(
      new vscode.CompletionItem(
        link.substring(1),
        vscode.CompletionItemKind.Text
      )
    )
  }
  args.debug.appendLine(`${new Date().getTime() - args.time}ms:  ${result.length} links created`)
  return result
}

async function imgCompletionItems(args: {
  debug: vscode.OutputChannel
  documentDir: string
  time: number
  wsRoot: string
}): Promise<vscode.CompletionItem[]> {
  const filenamesAcc: string[] = []
  await files.images(args.wsRoot, filenamesAcc)
  const result: vscode.CompletionItem[] = []
  for (const filename of filenamesAcc) {
    const relPath = args.documentDir !== args.wsRoot
      ? path.relative(args.documentDir, path.join(args.wsRoot, filename))
      : filename
    const image = links.image(relPath)
    result.push(
      new vscode.CompletionItem(
        image.substring(1),
        vscode.CompletionItemKind.Text
      )
    )
  }
  args.debug.appendLine(`${new Date().getTime() - args.time}ms:  ${result.length} links created`)
  return result
}
