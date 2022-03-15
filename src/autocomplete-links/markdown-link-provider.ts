import * as vscode from "vscode"

import * as files from "../helpers/files"
import { analyzeInput, LinkType } from "./analyze-input"
import { makeImgLinks, makeMdLinks } from "./make-links"

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
    const reS = config.get<string>("autocomplete.titleRegex")
    if (reS != null && reS !== "") {
      titleRE = new RegExp(reS)
    }
    const debug = vscode.window.createOutputChannel("Markdown IDE")

    const [searchTerm, linkType] = analyzeInput(
      document.lineAt(position).text,
      position.character
    )
    let links: string[]
    if (linkType === LinkType.MD) {
      links = await makeMdLinks(
        vscode.workspace.rootPath,
        document.fileName,
        await files.markdown(vscode.workspace.rootPath),
        titleRE,
        debug
      )
    } else {
      links = makeImgLinks(
        vscode.workspace.rootPath,
        await files.images(vscode.workspace.rootPath),
        searchTerm
      )
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
