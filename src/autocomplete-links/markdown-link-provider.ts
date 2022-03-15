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
    const debug = vscode.window.createOutputChannel("Markdown IDE")
    const currentFilePath = vscode.window.activeTextEditor?.document.uri.fsPath
    if (!currentFilePath) {
      return
    }
    let wsRoot = ""
    for (const wsFolder of vscode.workspace.workspaceFolders || []) {
      const wsPath = wsFolder.uri.fsPath
      if (currentFilePath.startsWith(wsPath)) {
        wsRoot = wsPath
        break
      }
    }
    if (wsRoot === "") {
      return
    }

    // load configuration
    const config = vscode.workspace.getConfiguration("markdownIDE")
    let titleRE = null
    const reS = config.get<string>("autocomplete.titleRegex")
    if (reS != null && reS !== "") {
      titleRE = new RegExp(reS)
    }

    const [searchTerm, linkType] = analyzeInput(
      document.lineAt(position).text,
      position.character
    )
    let links: string[]
    if (linkType === LinkType.MD) {
      links = await makeMdLinks({
        wsRoot,
        document: document.fileName,
        relativeFilePaths: await files.markdown(),
        titleRE,
        debug
      })
    } else {
      links = makeImgLinks({
        filenames: await files.images(),
        searchTerm
      })
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
