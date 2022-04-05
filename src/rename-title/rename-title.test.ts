import { strict as assert } from "assert"

import { changeTitle } from "./rename-title"

suite("renameTitle", function() {
  test("changeTitle", function() {
    const give = `# old title\ntext\n### section 1\nmore text`
    const want = [`# new title\ntext\n### section 1\nmore text`, 4]
    const have = changeTitle({ eol: "\n", newTitle: "new title", oldTitle: "old title", text: give })
    assert.deepEqual(have, want)
  })
})
