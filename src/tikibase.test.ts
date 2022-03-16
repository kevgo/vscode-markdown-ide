import { strict as assert } from "assert"
import * as vscode from "vscode"

import * as tikibase from "./tikibase"

suite("parse", function() {
  test("unknown section", function() {
    const give = `foo.md:8  unknown section "functional", allowed sections:
  - what is it
  - context
  - functionality
  - how it works
  - benefits
  - challenges
  - best practices
  - anti-patterns
  - causes
  - metrics
  - examples
  - solutions
  - users
  - related
  - links
`
    const range = new vscode.Range(8, 0, 8, 0)
    const diagnostic = new vscode.Diagnostic(
      range,
      `unknown section "functional", allowed sections:
  - what is it
  - context
  - functionality
  - how it works
  - benefits
  - challenges
  - best practices
  - anti-patterns
  - causes
  - metrics
  - examples
  - solutions
  - users
  - related
  - links`
    )
    const want: tikibase.Issue[] = [{ file: vscode.Uri.file("foo.md"), diagnostics: [diagnostic] }]
    const have = tikibase.parse(give)
    assert.equal(have, want)
  })
})
