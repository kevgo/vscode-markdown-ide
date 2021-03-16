import { strict as assert } from "assert"

import { removeLink } from "./remove-link"

suite("removeLink", function () {
  const tests = {
    Foo: "Foo",
    "A [Foo](foo.md) bar": "A Foo bar",
    "A [Foo](foo.md) and a [bar](bar.md)": "A Foo and a bar",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(removeLink(give), want)
    })
  }
})
