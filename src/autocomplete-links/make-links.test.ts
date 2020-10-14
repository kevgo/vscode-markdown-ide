import { strict as assert } from "assert"

import { makeImgLink, makeMdLink } from "./make-links"

test("makeMdLink", function () {
  const have = makeMdLink("foo.md", "# Foo\nthe foo is strong today")
  assert.equal("[Foo](foo.md)", have)
})

test("makeImgLink", function () {
  const have = makeImgLink("foo.png")
  assert.equal("[](foo.png)", have)
})
