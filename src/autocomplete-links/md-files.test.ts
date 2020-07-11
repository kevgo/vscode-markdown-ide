import { mdFiles } from "./md-files"
import { strict as assert, equal } from "assert"

test("mdFiles", async function () {
  const have = await mdFiles(".")
  assert.deepEqual(["DEVELOPMENT.md", "README.md"], have)
})
