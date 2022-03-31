import { strict as assert } from "assert"

import { extractLinkTarget } from "./follow-link"

suite("extractLinkTarget", function() {
  test("beginning of line", function() {
    const give = "one [title](target.md) two"
    const have = extractLinkTarget(give, 0)
    const want = "target.md"
    assert.equal(have, want)
  })
  test("opening parentheses of target part", function() {
    const give = "one [title](target.md) two"
    const have = extractLinkTarget(give, 11)
    const want = "target.md"
    assert.equal(have, want)
  })
  test("end of link", function() {
    const give = "one [title](target.md) two"
    const have = extractLinkTarget(give, 21)
    const want = "target.md"
    assert.equal(have, want)
  })
  test("end of line", function() {
    const give = "one [title](target.md) two"
    const have = extractLinkTarget(give, 26)
    const want = "target.md"
    assert.equal(have, want)
  })
})
