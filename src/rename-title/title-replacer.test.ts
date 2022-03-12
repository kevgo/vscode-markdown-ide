import { strict as assert } from "assert"

import * as titleReplacer from "./title-replacer"

suite("TitleReplacer", function() {
  test("multiple matches", function() {
    const replacer = titleReplacer.create("oldTitle", "file.md", "newTitle")
    const give = "# Test\n\nlink to [oldTitle](file.md) and [oldTitle](file.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [newTitle](file.md) and [newTitle](file.md) and [another file](another.md)."
    const have = replacer(give)
    assert.equal(have, want)
  })
  test("mismatching target", function() {
    const replacer = titleReplacer.create("oldTitle", "file.md", "newTitle")
    const give = "# Test\n\nlink to [oldTitle](other_file.md)"
    const want = "# Test\n\nlink to [oldTitle](other_file.md)"
    const have = replacer(give)
    assert.equal(have, want)
  })
  test("mismatching title", function() {
    const replacer = titleReplacer.create("oldTitle", "file.md", "newTitle")
    const give = "# Test\n\nlink to [otherTitle](file.md)"
    const want = "# Test\n\nlink to [otherTitle](file.md)"
    const have = replacer(give)
    assert.equal(have, want)
  })
})
