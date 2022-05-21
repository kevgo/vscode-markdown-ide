import { strict as assert } from "assert"

import { mdFileName } from "./tikibase-provider"

suite("mdFileName", function() {
  const tests = {
    "one two": "one-two.md",
    "": ""
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`"${give}" --> "${want}"`, function() {
      const have = mdFileName(give)
      assert.equal(have, want)
    })
  }
})
