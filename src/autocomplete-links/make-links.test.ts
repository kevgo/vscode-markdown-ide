import { makeMdLink, makeImgLink } from "./make-links"
import { strict as assert } from "assert"

test("makeMdLink", function () {
  const have = makeMdLink("foo.md", "# Foo\nthe foo is strong today")
  assert.equal("[Foo](foo.md)", have)
})

test("makeImgLink", function () {
  const have = makeImgLink("foo.png")
  assert.equal("[](foo.png)", have)
})
