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
      const linkType = input.analyze(document.lineAt(position).text, position.character)
      debug.appendLine(`${new Date().getTime() - time}ms:  input analyzed`)
      let links: string[]
      const documentDir = path.dirname(document.fileName)
      debug.appendLine(`documentDir: ${documentDir}`)
      if (linkType === input.LinkType.MD) {
        const mdFiles: files.FileResult[] = []
        await files.markdownFast(workspacePath, mdFiles)
        links = await makeMdLinks({
          wsRoot: workspacePath,
          documentDir,
          mdFiles,
          time,
          titleRE: config.titleRegExp(),
          debug
        })
      } else if (linkType === input.LinkType.IMG) {
        const filenames: string[] = []
        await files.imagesFast(workspacePath, filenames)
        links = makeImgLinks({ filenames, wsRoot: workspacePath, documentDir })
      } else {
        throw new Error(`Unknown link type: ${linkType}`)
      }
      debug.appendLine(`${new Date().getTime() - time}ms:  ${links.length} links created`)
      const result: vscode.CompletionItem[] = []
      for (const link of links) {
        result.push(
          new vscode.CompletionItem(
            link.substring(1),
            vscode.CompletionItemKind.Text
          )
        )
      }
      return result
    }
  }
}

export async function makeMdLinks(args: {
  debug: vscode.OutputChannel
  documentDir: string
  mdFiles: files.FileResult[]
  time: number
  titleRE: RegExp | undefined
  wsRoot: string
}): Promise<string[]> {
  const result = []
  for (const mdFile of args.mdFiles) {
    const relPath = args.documentDir !== args.wsRoot
      ? path.relative(args.documentDir, path.join(args.wsRoot, mdFile.filePath))
      : mdFile.filePath
    result.push(links.markdown({
      fileName: relPath,
      fileContent: await mdFile.content,
      debug: args.debug,
      titleRE: args.titleRE
    }))
  }
  return result
}

export function makeImgLinks(args: { documentDir: string; filenames: string[]; wsRoot: string }): string[] {
  const result: string[] = []
  for (const filename of args.filenames) {
    const relPath = args.documentDir !== args.wsRoot
      ? path.relative(args.documentDir, path.join(args.wsRoot, filename))
      : filename
    result.push(links.image(relPath))
  }
  return result
}
