import { strict as assert } from "assert"

import { extractLinkTarget } from "./follow-link"

suite("extractLinkTarget", function() {
  test("beginning of link", function() {
    const give = "one [title](target.md) two"
    const have = extractLinkTarget(give, 4)
    const want = "target.md"
    assert.equal(have, want)
  })
  // test("middle of link", function() {
  //   const give = "one [title](target.md) two"
  //   const have = extractLink(give, 11)
  //   const want = "[title](target.md)"
  //   assert.equal(have, want)
  // })
  // test("end of link", function() {
  //   const give = "one [title](target.md) two"
  //   const have = extractLink(give, 21)
  //   const want = "[title](target.md)"
  //   assert.equal(have, want)
  // })
})
