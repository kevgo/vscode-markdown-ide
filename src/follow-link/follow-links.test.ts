import { strict as assert } from "assert"

import { extractLinkTarget } from "./follow-link"

suite("extractLinkTarget", function() {
  test("all positions", function() {
    const give = "one [title1](target1.md) two [title2](target2.md) three"
    for (let i = 0; i < 37; i++) {
      const have = extractLinkTarget(give, i)
      assert.equal(have, "target1.md", `pos ${i} -> ${have}`)
    }
    for (let i = 37; i < give.length; i++) {
      const have = extractLinkTarget(give, i)
      assert.equal(have, "target2.md", `pos ${i} -> ${have}`)
    }
  })
})
