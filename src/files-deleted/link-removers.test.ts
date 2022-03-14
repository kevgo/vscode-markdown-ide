import { strict as assert } from "assert"

import { removeLinkToTarget } from "./link-remover"

suite("removeLinkToTarget", function() {
  test("two matching links", function() {
    const give = "# Test\n\nlink to [file1](old.md) and [file2](old.md) and [another file](another.md)."
    const want = "# Test\n\nlink to file1 and file2 and [another file](another.md)."
    const have = removeLinkToTarget(give, "old.md")
    assert.equal(have, want)
  })
})
