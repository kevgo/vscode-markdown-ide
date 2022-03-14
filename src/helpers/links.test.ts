import { strict as assert } from "assert"

import * as links from "./links"

suite("removeLinkToTarget", function() {
  test("two matching links", function() {
    const give = "# Test\n\nlink to [file1](old.md) and [file2](old.md) and [another file](another.md)."
    const want = "# Test\n\nlink to file1 and file2 and [another file](another.md)."
    const have = links.removeToTarget({ text: give, target: "old.md" })
    assert.equal(have, want)
  })
})

suite("replaceLinkTarget", function() {
  test("multiple matching links", function() {
    const give = "# Test\n\nlink to [file1](old.md) and [file1 again](old.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [file1](new.md) and [file1 again](new.md) and [another file](another.md)."
    const have = links.replaceTarget({ text: give, oldTarget: "old.md", newTarget: "new.md" })
    assert.equal(have, want)
  })
})

suite("replaceTitle", function() {
  test("multiple matches", function() {
    const give = "# Test\n\nlink to [oldTitle](file.md) and [oldTitle](file.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [newTitle](file.md) and [newTitle](file.md) and [another file](another.md)."
    const have = links.replaceTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
  test("mismatching target", function() {
    const give = "# Test\n\nlink to [oldTitle](other_file.md)"
    const want = "# Test\n\nlink to [oldTitle](other_file.md)"
    const have = links.replaceTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
  test("mismatching title", function() {
    const give = "# Test\n\nlink to [otherTitle](file.md)"
    const want = "# Test\n\nlink to [otherTitle](file.md)"
    const have = links.replaceTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
})
