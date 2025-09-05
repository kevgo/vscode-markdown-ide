import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"
import * as markdownHeadings from "./markdown/headings"
import * as markdownLinks from "./markdown/links"
import * as line from "./text/lines"
import { Data } from "./tikibase/config-file"
import * as urls from "./urls/urls"

export class MarkdownDefinitionProvider implements vscode.DefinitionProvider {
  private tikiConfig: Data | undefined

  constructor(config: Data | undefined) {
    this.tikiConfig = config
  }

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Definition | vscode.DefinitionLink[]> {
    const oldFilePath = document.fileName
    const linkTarget = markdownLinks.extractTarget(document.lineAt(position.line).text, position.character)
    if (!linkTarget || urls.isWebLink(linkTarget)) {
      return []
    }
    const oldFileName = path.basename(oldFilePath)
    const [newFileName, target] = urls.splitAnchor(linkTarget)
    const newFilePath = path.resolve(path.dirname(oldFilePath), newFileName)
    const newFileContent = await fs.readFile(newFilePath, "utf-8")
    let newCursor: vscode.Position | undefined
    if (!this.tikiConfig?.bidiLinks() && target) {
      newCursor = locateAnchor({ target, text: newFileContent })
    }
    if (!newCursor) {
      newCursor = markdownLinks.locate({ target: oldFileName, text: newFileContent })
    }
    if (!newCursor) {
      newCursor = new vscode.Position(0, 0)
    }
    return new vscode.Location(vscode.Uri.file(newFilePath), newCursor)
  }
}

/** provides the line in the given text to which the given target points */
export function locateAnchor(args: { target: string; text: string }): vscode.Position | undefined {
  for (const [i, line] of args.text.split(/\r?\n/).entries()) {
    if (markdownHeadings.matchesTarget({ line, target: args.target })) {
      return new vscode.Position(i, 0)
    }
  }
}
