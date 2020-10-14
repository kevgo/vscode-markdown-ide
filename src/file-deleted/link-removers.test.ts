import { strict as assert } from "assert"

import { LinkRemovers } from "./link-removers"

test("LinkRemovers", function () {
  const replacers = new LinkRemovers()
  replacers.register("old1.md")
  replacers.register("old2.md")
  const give =
    "# Test\n\nlink to [file1](old1.md) and [file2](old2.md) and [another file](another.md)."
  const have = replacers.process(give)
  const want =
    "# Test\n\nlink to file1 and file2 and [another file](another.md)."
  assert.equal(have, want)
})
