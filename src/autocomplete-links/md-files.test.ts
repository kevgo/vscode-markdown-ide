import { mdFiles } from "./md-files"
import { strict as assert } from "assert"

test("mdFiles", async function () {
  const have = await mdFiles(".")
  assert.deepEqual(
    [
      "DEVELOPMENT.md",
      "README.md",
      "RELEASE_NOTES.md",
      "documentation/fixtures/test.md",
    ],
    have
  )
})
