import * as vscode from "vscode"

import { analyzeInput, LinkType } from "./analyze-input"
import { imgFiles } from "./img-files"
import { makeImgLinks, makeMdLinks } from "./make-links"
import { mdFiles } from "./md-files"

/** Completion provider for MarkdownLinks */
export const markdownLinkCompletionProvider: vscode.CompletionItemProvider = {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    if (vscode.workspace.rootPath == null) {
      return
    }

    // load configuration
    const config = vscode.workspace.getConfiguration("markdownIDE")
    let titleRE = null
    const reS = config.get<string>("autocompleteTitleRegex")
    if (reS != null && reS !== "") {
      titleRE = new RegExp(reS)
    }
    const debug = vscode.window.createOutputChannel("Markdown IDE")

    const [searchTerm, linkType] = analyzeInput(
      document.lineAt(position).text,
      position.character
    )
    let links: string[]
    let files: string[]
    if (linkType === LinkType.MD) {
      files = await mdFiles(vscode.workspace.rootPath)
      links = await makeMdLinks(
        vscode.workspace.rootPath,
        document.fileName,
        files,
        titleRE,
        debug
      )
    } else {
      files = await imgFiles(vscode.workspace.rootPath)
      links = makeImgLinks(vscode.workspace.rootPath, files, searchTerm)
    }
    const result: vscode.CompletionItem[] = []
    for (const link of links) {
      result.push(
        new vscode.CompletionItem(
          link.substr(1),
          vscode.CompletionItemKind.Text
        )
      )
    }
    return result
  }
}
