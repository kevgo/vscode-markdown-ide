import { strict as assert } from "assert"
import * as markdown from "../markdown"

suite("image", function() {
  test("valid filename", function() {
    const have = markdown.createImage("foo.png")
    const want = "[](foo.png)"
    assert.equal(have, want)
  })
})
