import { strict as assert } from "assert"
import { lineCount } from "./line-count"

test("lineCount", function () {
  const tests = {
    one: 1,
    "one\ntwo\nthree\n": 4,
  }
  for (const [give, want] of Object.entries(tests)) {
    assert.equal(want, lineCount(give))
  }
})
