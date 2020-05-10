import * as vscode from "vscode"
import { analyzeInput, LinkTypes } from "./analyze-input"
import { mdFiles } from "./md-files"
import { makeMdLinks, makeImgLinks } from "./make-links"
import { imgFiles } from "./img-files"

// Completion provider for MarkdownLinks
export const markdownLinkCompletionProvider: vscode.CompletionItemProvider = {
  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    if (vscode.workspace.rootPath == null) {
      return
    }
    const [searchTerm, linkType] = analyzeInput(document.lineAt(position).text, position.character)
    let links: string[]
    let files: string[]
    if (linkType === LinkTypes.md) {
      files = await mdFiles(vscode.workspace.rootPath)
      links = await makeMdLinks(vscode.workspace.rootPath, files, searchTerm)
    } else {
      files = await imgFiles(vscode.workspace.rootPath)
      links = await makeImgLinks(vscode.workspace.rootPath, files, searchTerm)
    }
    const result: vscode.CompletionItem[] = []
    for (const link of links) {
      result.push(new vscode.CompletionItem(link.substr(1), vscode.CompletionItemKind.Text))
    }
    return result
  }
}
