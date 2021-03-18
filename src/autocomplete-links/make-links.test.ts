import { strict as assert } from "assert"

import { makeImgLink, makeMdLink } from "./make-links"

suite("makeMdLink", function () {
  test("link to heading without regex", function () {
    const have = makeMdLink("foo.md", "# Foo\nthe foo is strong today", null)
    const want = "[Foo](foo.md)"
    assert.equal(have, want)
  })
  test("link to heading with normal regex", function () {
    const have = makeMdLink(
      "foo.md",
      "# Foo\nthe foo is strong today",
      /^#+ (.*)$/
    )
    const want = "[Foo](foo.md)"
    assert.equal(have, want)
  })
  test("link to heading with abbreviation regex", function () {
    const have = makeMdLink(
      "amazon-web-services.md",
      "# Amazon Web Services (AWS)\na cloud provider",
      /\(([A-Z0-9]+)\)$/
    )
    const want = "[AWS](amazon-web-services.md)"
    assert.equal(have, want)
  })
  test("File with links in heading", function () {
    const have = makeMdLink(
      "foo.md",
      "# A [Foo](foo.md) walks into a [bar](bar.md)",
      /^#+ (.*)$/
    )
    const want = "[A Foo walks into a bar](foo.md)"
    assert.equal(have, want)
  })
})

suite("makeImgLink", function () {
  test("link to image", function () {
    const have = makeImgLink("foo.png")
    const want = "[](foo.png)"
    assert.equal(have, want)
  })
})
