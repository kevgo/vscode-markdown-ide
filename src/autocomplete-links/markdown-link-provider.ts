import * as vscode from "vscode"

import * as files from "../helpers/files"
import { analyzeInput, LinkType } from "./analyze-input"
import { makeImgLinks, makeMdLinks } from "./make-links"

/** Completion provider for MarkdownLinks */
export const markdownLinkCompletionProvider: vscode.CompletionItemProvider = {
  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const debug = vscode.window.createOutputChannel("Markdown IDE")
    const workspaceDir = getWorkspace()
    if (!workspaceDir) {
      return
    }
    const titleRE = loadTitleRE()
    const { searchTerm, linkType } = analyzeInput(document.lineAt(position).text, position.character)
    let links: string[]
    switch (linkType) {
      case LinkType.MD:
        links = await makeMdLinks({
          wsRoot: workspaceDir,
          document: document.fileName,
          relativeFilePaths: await files.markdown(),
          titleRE,
          debug
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

/** provides the active VSCode workspace path */
function getWorkspace(): string | undefined {
  const currentFilePath = vscode.window.activeTextEditor?.document.uri.fsPath
  if (!currentFilePath) {
    return
  }
  for (const wsFolder of vscode.workspace.workspaceFolders || []) {
    const wsPath = wsFolder.uri.fsPath
    if (currentFilePath.startsWith(wsPath)) {
      return wsPath
    }
  }
}

/** provides the titleRegex configuration setting */
function loadTitleRE(): RegExp | undefined {
  const config = vscode.workspace.getConfiguration("markdownIDE")
  const setting = config.get<string>("autocomplete.titleRegex")
  if (setting && setting.length > 0) {
    return new RegExp(setting)
  }
}
