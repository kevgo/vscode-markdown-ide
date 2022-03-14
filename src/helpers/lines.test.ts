import { strict as assert } from "assert"

import * as lines from "./lines"

suite("count", function() {
  const tests = {
    one: 1,
    "one\ntwo\nthree\n": 4
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give.replace(/\n/g, "\\n")} --> ${want}`, function() {
      assert.equal(lines.count(give), want)
    })
  }
})

suite("first", function() {
  test("single-line string", function() {
    assert.equal(lines.first("# Foo"), "# Foo")
  })
  test("multi-line string", function() {
    assert.equal(lines.first("# Foo\nbar"), "# Foo")
  })
  test("empty string", function() {
    assert.equal(lines.first(""), "")
  })
})

suite("removeLeadingPounds", function() {
  const tests = {
    Foo: "Foo",
    "# Foo": "Foo",
    "### Foo": "Foo",
    "###Foo": "Foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      assert.equal(lines.removeLeadingPounds(give), want)
    })
  }
})
