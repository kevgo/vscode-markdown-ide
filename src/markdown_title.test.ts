import { strict as assert } from "assert"

import * as markdownTitle from "./markdown-title"

suite("strings", function() {
  suite("changeMdTitle", function() {
    test("normal", function() {
      const give = `# old title\ntext\n### section 1\nmore text`
      const want = `# new title\ntext\n### section 1\nmore text`
      const have = markdownTitle.change({ eol: "\n", newTitle: "new title", oldTitle: "old title", text: give })
      assert.deepEqual(have, want)
    })
  })
})
