import * as assert from "assert"
import * as vscode from "vscode"

import { MarkdownRenameProvider } from "./rename-provider"

suite("MarkdownRenameProvider", () => {
  const provider = new MarkdownRenameProvider()

  test("prepareRename returns range and placeholder for first-line heading", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "# My Document Title\n\nSome content here."
    })

    const position = new vscode.Position(0, 5) // somewhere in the title text
    const result = provider.prepareRename(document, position, {} as vscode.CancellationToken)

    assert.ok(result)
    if (typeof result === "object" && "range" in result) {
      assert.equal(result.placeholder, "My Document Title")
      // Range should start after "# " and cover the title text
      assert.equal(result.range.start.line, 0)
      assert.equal(result.range.start.character, 2) // after "# "
      assert.equal(result.range.end.line, 0)
      assert.equal(result.range.end.character, 19) // end of "My Document Title"
    } else {
      assert.fail("Expected object with range and placeholder")
    }
  })

  test("prepareRename throws error for non-first-line position", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "# My Document Title\n\nSome content here."
    })

    const position = new vscode.Position(1, 0) // second line

    assert.throws(() => {
      provider.prepareRename(document, position, {} as vscode.CancellationToken)
    }, /Rename is only supported for the document title on the first line/)
  })

  test("prepareRename throws error for non-heading content", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "Just some plain text\n\nSome content here."
    })

    const position = new vscode.Position(0, 5)

    assert.throws(() => {
      provider.prepareRename(document, position, {} as vscode.CancellationToken)
    }, /Rename is only supported for headings that start with # and contain text/)
  })

  test("prepareRename handles multiple hash marks", async () => {
    const document = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: "### Sub Heading Title\n\nSome content here."
    })

    const position = new vscode.Position(0, 10)
    const result = provider.prepareRename(document, position, {} as vscode.CancellationToken)

    assert.ok(result)
    if (typeof result === "object" && "range" in result) {
      assert.equal(result.placeholder, "Sub Heading Title")
      // Range should start after "### " and cover the title text
      assert.equal(result.range.start.line, 0)
      assert.equal(result.range.start.character, 4) // after "### "
      assert.equal(result.range.end.line, 0)
      assert.equal(result.range.end.character, 21) // end of "Sub Heading Title"
    } else {
      assert.fail("Expected object with range and placeholder")
    }
  })
})
