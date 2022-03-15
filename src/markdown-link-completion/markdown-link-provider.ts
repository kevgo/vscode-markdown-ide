import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { Configuration } from "../configuration"
import * as files from "../helpers/files"
import * as links from "../helpers/links"
import * as input from "./input"

/** Completion provider for MarkdownLinks */
export const markdownLinkCompletionProvider: vscode.CompletionItemProvider = {
  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const config = new Configuration()
    const workspacePath = config.workspacePath()
    if (!workspacePath) {
      return
    }
    const { searchTerm, linkType } = input.analyze(document.lineAt(position).text, position.character)
    let links: string[]
    switch (linkType) {
      case input.LinkType.MD:
        links = await makeMdLinks({
          wsRoot: workspacePath,
          document: document.fileName,
          relativeFilePaths: await files.markdown(),
          titleRE: config.titleRegExp(),
          debug: vscode.window.createOutputChannel("Markdown IDE")
        })
        break
      case input.LinkType.IMG:
        links = makeImgLinks({
          filenames: await files.images(),
          searchTerm
        })
        break
      default:
        throw new Error(`Unknown link type: ${linkType}`)
    }
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

export async function makeMdLinks(args: {
  debug: vscode.OutputChannel
  document: string
  relativeFilePaths: string[]
  titleRE: RegExp | undefined
  wsRoot: string
}): Promise<string[]> {
  // NOTE: for performance reasons, we start loading all file contents concurrently first
  // and then assemble the result as the individual file contents become available.
  const filePromises: Array<{ content: Promise<string>; fullPath: string }> = []
  for (const relativeFilePath of args.relativeFilePaths) {
    const fullPath = path.join(args.wsRoot, relativeFilePath)
    filePromises.push({
      fullPath,
      content: fs.readFile(fullPath, "utf-8")
    })
  }
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
