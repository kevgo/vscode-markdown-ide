import { strict as assert } from "assert"

import * as strings from "./strings"

suite("strings", function() {
  suite("changeTitle", function() {
    test("normal", function() {
      const give = `# old title\ntext\n### section 1\nmore text`
      const want = `# new title\ntext\n### section 1\nmore text`
      const have = strings.changeTitle({ eol: "\n", newTitle: "new title", oldTitle: "old title", text: give })
      assert.deepEqual(have, want)
    })
  })
})
