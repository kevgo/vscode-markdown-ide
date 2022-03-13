import { strict as assert } from "assert"

import { replaceLinkTitle } from "./replace-link-title"

suite("replaceTitle", function() {
  test("multiple matches", function() {
    const give = "# Test\n\nlink to [oldTitle](file.md) and [oldTitle](file.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [newTitle](file.md) and [newTitle](file.md) and [another file](another.md)."
    const have = replaceLinkTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
  test("mismatching target", function() {
    const give = "# Test\n\nlink to [oldTitle](other_file.md)"
    const want = "# Test\n\nlink to [oldTitle](other_file.md)"
    const have = replaceLinkTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
  test("mismatching title", function() {
    const give = "# Test\n\nlink to [otherTitle](file.md)"
    const want = "# Test\n\nlink to [otherTitle](file.md)"
    const have = replaceLinkTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
})
