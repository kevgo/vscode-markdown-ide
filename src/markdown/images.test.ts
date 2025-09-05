import { strict as assert } from "assert"
import * as images from "./images"

suite("image", function() {
  suite("create", function() {
    test("valid filename", function() {
      const have = images.create("foo.png")
      const want = "[](foo.png)"
      assert.equal(have, want)
    })
  })
})
