import { LinkReplacers } from "./link-replacers"
import { strict as assert } from "assert"

test("LinkReplacers", function() {
  const replacers = new LinkReplacers()
  replacers.register("old1.md", "new1.md")
  replacers.register("old2.md", "new2.md")
  const give = "# Test\n\nlink to [file1](old1.md) and [file2](old2.md) and [another file](another.md)."
  const have = replacers.process(give)
  const want = "# Test\n\nlink to [file1](new1.md) and [file2](new2.md) and [another file](another.md)."
  assert.equal(have, want)
})
