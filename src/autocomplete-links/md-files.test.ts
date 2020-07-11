import { mdFiles } from "./md-files"
import { strict as assert } from "assert"

test("mdFiles", async function () {
  const have = await mdFiles(".")
  assert.deepEqual(
    ["DEVELOPMENT.md", "README.md", "documentation/fixtures/test.md"],
    have
  )
})
