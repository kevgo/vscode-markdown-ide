import { strict as assert } from "assert"

import { replaceLinkTarget } from "./link-target-replacer"

suite("replaceLinkTarget", function() {
  test("multiple matching links", function() {
    const give = "# Test\n\nlink to [file1](old.md) and [file1 again](old.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [file1](new.md) and [file1 again](new.md) and [another file](another.md)."
    const have = replaceLinkTarget(give, "old.md", "new.md")
    assert.equal(have, want)
  })
})
