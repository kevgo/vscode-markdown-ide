import { strict as assert } from "assert"

import { LinkTargetReplacer } from "./link-target-replacer"

suite("LinkReplacers", function() {
  test("replacing two links", function() {
    const replacer = new LinkTargetReplacer()
    replacer.register("old1.md", "new1.md")
    replacer.register("old2.md", "new2.md")
    const give = "# Test\n\nlink to [file1](old1.md) and [file2](old2.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [file1](new1.md) and [file2](new2.md) and [another file](another.md)."
    const have = replacer.process(give)
    assert.equal(have, want)
  })
})
