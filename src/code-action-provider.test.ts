import { strict as assert } from "assert"

import * as files from "./files"

suite("mdFileName", function() {
  test("normal", function() {
    const give = "one two"
    const want = "one-two.md"
    const have = files.mdFileName(give)
    assert.equal(have, want)
  })
})
