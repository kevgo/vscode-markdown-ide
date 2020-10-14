import { strict as assert } from "assert"

import { removeLeadingPounds } from "./remove-leading-pounds"

suite("removeLeadingPounds", function () {
  const tests = {
    Foo: "Foo",
    "# Foo": "Foo",
    "### Foo": "Foo",
    "###Foo": "Foo",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(removeLeadingPounds(give), want)
    })
  }
})
