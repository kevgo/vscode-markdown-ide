import { strict as assert } from "assert"

import * as headings from "./headings"

suite("headings", function() {
  test("inFile", function() {
    const give = `# title
text
### caption 1
text
### caption 2
text`
    const want = new Set()
    want.add("### caption 1")
    want.add("### caption 2")
    const have: Set<string> = new Set()
    headings.find(give, have)
    assert.deepEqual(have, want)
  })

  suite("matchesTarget", function() {
    const tests = {
      "# heading 2": true,
      "### heading 2": true,
      "# heading 1": false,
      "### heading 3": false,
      "heading 2": false
    }
    for (const [give, want] of Object.entries(tests)) {
      test(`${give} --> ${want}`, function() {
        const have = headings.matchesTarget({ line: give, target: "heading-2" })
        assert.equal(have, want)
      })
    }
  })
})
