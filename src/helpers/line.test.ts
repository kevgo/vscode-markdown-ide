import { strict as assert } from "assert"

import * as line from "./line"

suite("count", function() {
  const tests = {
    one: 1,
    "one\ntwo\nthree\n": 4
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give.replace(/\n/g, "\\n")} --> ${want}`, function() {
      assert.equal(line.count(give), want)
    })
  }
})

suite("first", function() {
  const tests = {
    "# Foo": "# Foo",
    "# Foo\nbar": "# Foo",
    "": ""
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give.replace(/\n/g, "\\n")} --> ${want}`, function() {
      assert.equal(line.first(give), want)
    })
  }
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
      assert.equal(line.removeLeadingPounds(give), want)
    })
  }
})
