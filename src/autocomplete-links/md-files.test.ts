import { strict as assert } from "assert"

import { mdFiles } from "./md-files"

suite("mdFiles", function() {
  test("with subdirectories", async function() {
    const have = await mdFiles(".")
    const want = [
      "DEVELOPMENT.md",
      "README.md",
      "RELEASE_NOTES.md",
      "documentation/fixtures/test.md"
    ]
    assert.deepEqual(have, want)
  })
})
