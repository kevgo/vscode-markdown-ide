import { strict as assert } from "assert"

import { makeImgLink, makeMdLink } from "./make-links"

suite("makeMdLink", function () {
  const have = makeMdLink("foo.md", "# Foo\nthe foo is strong today")
  const want = "[Foo](foo.md)"
  assert.equal(have, want)
})

test("makeImgLink", function () {
  const have = makeImgLink("foo.png")
  const want = "[](foo.png)"
  assert.equal(have, want)
})
