import * as assert from "assert"
import * as vscode from "vscode"

import { MarkdownRenameSymbolProvider } from "./rename-symbol-provider"

suite("MarkdownRenameSymbolProvider", () => {
  const provider = new MarkdownRenameSymbolProvider()

  test("provides refactor action for first heading", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "# My Heading\n\nSome content here."
    })

    const range = new vscode.Range(0, 0, 0, 0)
    const context: vscode.CodeActionContext = {
      diagnostics: [],
      triggerKind: vscode.CodeActionTriggerKind.Invoke,
      only: undefined
    }

    const actions = provider.provideCodeActions(document, range, context, {} as vscode.CancellationToken)

    assert.ok(Array.isArray(actions))
    assert.equal(actions.length, 1)
    const action = actions[0] as vscode.CodeAction
    assert.equal(action.title, "Rename heading")
    assert.equal(action.kind, vscode.CodeActionKind.Refactor)
  })

  test("does not provide action for non-heading lines", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "# My Heading\n\nSome content here."
    })

    const range = new vscode.Range(1, 0, 1, 0) // second line
    const context: vscode.CodeActionContext = {
      diagnostics: [],
      triggerKind: vscode.CodeActionTriggerKind.Invoke,
      only: undefined
    }

    const actions = provider.provideCodeActions(document, range, context, {} as vscode.CancellationToken)

    assert.ok(Array.isArray(actions))
    assert.equal(actions.length, 0)
  })

  test("does not provide action for non-first-line headings", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "# First Heading\n\n## Second Heading"
    })

    const range = new vscode.Range(2, 0, 2, 0) // third line with second heading
    const context: vscode.CodeActionContext = {
      diagnostics: [],
      triggerKind: vscode.CodeActionTriggerKind.Invoke,
      only: undefined
    }

    const actions = provider.provideCodeActions(document, range, context, {} as vscode.CancellationToken)

    assert.ok(Array.isArray(actions))
    assert.equal(actions.length, 0)
  })
})
