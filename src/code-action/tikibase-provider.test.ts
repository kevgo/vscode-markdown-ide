import { strict as assert } from "assert"

import { mdFileName } from "./tikibase-provider"

suite("mdFileName", function() {
  const tests = {
    "one two": "one-two.md",
    "": ""
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`"${give}" --> "${want}"`, function() {
      const give = "one two"
      const want = "one-two.md"
      const have = mdFileName(give)
      assert.equal(have, want)
    })
  }
})
