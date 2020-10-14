import { strict as assert } from "assert"

import { lineCount } from "./line-count"

suite("lineCount", function () {
  const tests = {
    one: 1,
    "one\ntwo\nthree\n": 4,
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give.replace(/\n/g, "\\n")} --> ${want}`, function () {
      assert.equal(lineCount(give), want)
    })
  }
})
