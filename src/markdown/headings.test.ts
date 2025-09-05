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
    headings.inFile(give, have)
    assert.deepEqual(have, want)
  })
})
