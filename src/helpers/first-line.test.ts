import { strict as assert } from "assert"

import { firstLine } from "./first-line"

suite("firstLine", function () {
  test("multi-line string", function () {
    assert.equal(firstLine("# Foo\nbar"), "# Foo")
  })
})
