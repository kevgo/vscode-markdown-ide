import { mdFiles } from "./md-files"
import { strict as assert } from "assert"

test("mdFiles", async function () {
  const have = await mdFiles(".")
  assert.deepEqual(
    ["DEVELOPMENT.md", "README.md", "documentation/test.md"],
    have
  )
})
