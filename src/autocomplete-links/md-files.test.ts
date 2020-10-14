import { strict as assert } from "assert"

import { mdFiles } from "./md-files"

test("mdFiles", async function () {
  const have = await mdFiles(".")
  const want = [
    "DEVELOPMENT.md",
    "README.md",
    "RELEASE_NOTES.md",
    "documentation/fixtures/test.md",
  ]
  assert.deepEqual(have, want)
})
