import { strict as assert } from "assert"

import { firstLine } from "./first-line"

suite("firstLine", function() {
  test("single-line string", function() {
    assert.equal(firstLine("# Foo"), "# Foo")
  })
  test("multi-line string", function() {
    assert.equal(firstLine("# Foo\nbar"), "# Foo")
  })
  test("empty string", function() {
    assert.equal(firstLine(""), "")
  })
})
