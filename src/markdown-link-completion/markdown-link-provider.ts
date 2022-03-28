import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { Configuration } from "../configuration"
import * as files from "../helpers/files"
import * as links from "../helpers/links"
import * as input from "./input"

/** Completion provider for MarkdownLinks */
export function markdownLinkCompletionProvider(debug: vscode.OutputChannel): vscode.CompletionItemProvider {
  return {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const time = new Date().getTime()
      const config = new Configuration()
      const workspacePath = config.workspacePath()
      if (!workspacePath) {
        return
      }
      const { searchTerm, linkType } = input.analyze(document.lineAt(position).text, position.character)
      debug.appendLine(`${new Date().getTime() - time}ms:  input analyzed`)
      let links: string[]
      if (linkType === input.LinkType.MD) {
        const mdFiles: files.FileResult[] = []
        await files.markdownFast(workspacePath, mdFiles)
        links = await makeMdLinks({
          wsRoot: workspacePath,
          document: document.fileName,
          mdFiles,
          time,
          titleRE: config.titleRegExp(),
          debug
        })
      } else if (linkType === input.LinkType.IMG) {
        const filenames: string[] = []
        await files.imagesFast(workspacePath, filenames)
        links = makeImgLinks({ filenames, searchTerm })
      } else {
        throw new Error(`Unknown link type: ${linkType}`)
      }
      debug.appendLine(`${new Date().getTime() - time}ms:  links created`)
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
  document: string
  mdFiles: files.FileResult[]
  time: number
  titleRE: RegExp | undefined
  wsRoot: string
}): Promise<string[]> {
  // NOTE: for performance reasons, we start loading all file contents concurrently first
  // and then assemble the result as the individual file contents become available.
  const filePromises: Array<{ content: Promise<string>; fullPath: string }> = []
  args.debug.appendLine(`${new Date().getTime() - args.time}ms:  file promises created`)
  const documentDir = path.dirname(args.document)
  const result = []
  for (const file of filePromises) {
    result.push(links.markdown({
      fileName: path.relative(documentDir, file.fullPath),
      fileContent: await file.content,
      debug: args.debug,
      titleRE: args.titleRE
    }))
  }
  return result
}

export function makeImgLinks(args: { filenames: string[]; searchTerm: string }): string[] {
  const result: string[] = []
  for (const filename of args.filenames) {
    if (filename.startsWith(args.searchTerm)) {
      result.push(links.image(filename))
    }
  }
  return result
}
