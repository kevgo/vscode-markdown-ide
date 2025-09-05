import * as path from "path"
import * as vscode from "vscode"
import * as files from "./helpers/files"
import * as workspace from "./helpers/workspace"
import * as configuration from "./tikibase/config-file"

/**
 * VSCode ReferenceProvider implementation for Markdown files
 * Integrates with native "Find All References" (Ctrl+Shift+F12)
 */
export class MarkdownReferenceProvider implements vscode.ReferenceProvider {
  async provideReferences(
    document: vscode.TextDocument,
    _position: vscode.Position,
    _reference: vscode.ReferenceContext,
    _token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    const workspacePath = workspace.path()
    if (!workspacePath) {
      return []
    }
    const currentFilePath = vscode.workspace.asRelativePath(document.uri)
    const references = await findReferencesToFile(workspacePath, currentFilePath)
    const locations: vscode.Location[] = []
    for (const reference of references) {
      const uri = vscode.Uri.file(reference.fileAbsolutePath)
      const startPosition = new vscode.Position(reference.line, reference.columnStart)
      const endPosition = new vscode.Position(reference.line, reference.columnEnd)
      const range = new vscode.Range(startPosition, endPosition)
      locations.push(new vscode.Location(uri, range))
    }
    return locations
  }
}

export interface ReferenceResult {
  fileAbsolutePath: string
  line: number
  columnStart: number
  columnEnd: number
}

/**
 * Finds all files that contain markdown links to the target file
 */
export async function findReferencesToFile(workspacePath: string, targetFilePath: string): Promise<ReferenceResult[]> {
  const references: ReferenceResult[] = []
  const mdFiles = await files.markdown(workspacePath)
  const targetFileAbsolutePath = path.join(workspacePath, targetFilePath)
  const linkRegex = /\[[^\]]*\]\(([^)]*)\)/g
  for (const mdFile of mdFiles) {
    const content = await mdFile.content
    const lines = content.split("\n")
    lines.forEach((lineText, index) => {
      const matches = lineText.matchAll(linkRegex)
      for (const match of matches) {
        const [fullMatch, linkTarget] = match
        const fileAbsolutePath = path.join(workspacePath, mdFile.filePath)
        const fileAbsoluteDir = path.dirname(fileAbsolutePath)
        const linkTargetAbsolutePath = path.resolve(fileAbsoluteDir, linkTarget)
        if (linkTargetAbsolutePath === targetFileAbsolutePath) {
          references.push({
            fileAbsolutePath: fileAbsolutePath,
            line: index,
            columnStart: match.index,
            columnEnd: match.index + fullMatch.length
          })
        }
      }
    })
  }
  return references
}
