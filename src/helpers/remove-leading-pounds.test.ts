import { strict as assert } from "assert"

import { removeLeadingPounds } from "./remove-leading-pounds"

test("removeLeadingPounds", function () {
  const tests = {
    Foo: "Foo",
    "# Foo": "Foo",
    "### Foo": "Foo",
    "###Foo": "Foo",
  }
  for (const [give, want] of Object.entries(tests)) {
    assert.equal(removeLeadingPounds(give), want)
  }
})
