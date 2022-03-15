import * as vscode from "vscode"

import { Configuration } from "../configuration"
import * as files from "../helpers/files"
import { analyzeInput, LinkType } from "./analyze-input"
import { makeImgLinks, makeMdLinks } from "./make-links"

/** Completion provider for MarkdownLinks */
export const markdownLinkCompletionProvider: vscode.CompletionItemProvider = {
  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const config = new Configuration()
    const workspacePath = config.workspacePath()
    if (!workspacePath) {
      return
    }
    const { searchTerm, linkType } = analyzeInput(document.lineAt(position).text, position.character)
    let links: string[]
    switch (linkType) {
      case LinkType.MD:
        links = await makeMdLinks({
          wsRoot: workspacePath,
          document: document.fileName,
          relativeFilePaths: await files.markdown(),
          titleRE: config.titleRegExp(),
          debug: vscode.window.createOutputChannel("Markdown IDE")
        })
        break
      case LinkType.IMG:
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
