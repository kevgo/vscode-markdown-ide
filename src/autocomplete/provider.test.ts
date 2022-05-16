import { strict as assert } from "assert"

import * as provider from "./provider"

suite("analyzeInput", function() {
  suite("markdown link", function() {
    test("middle of sentence", function() {
      const have = provider.determineType(
        "Check out [the new and here is another [one](one.md)",
        18
      )
      const want = provider.AutocompleteType.MD_LINK
      assert.deepEqual(have, want)
    })

    test("starting", function() {
      const have = provider.determineType("[", 1)
      const want = provider.AutocompleteType.MD_LINK
      assert.deepEqual(have, want)
    })
  })

  suite("image tag", function() {
    test("middle of sentence", function() {
      const have = provider.determineType(
        "Check out ![the and here is another [one](one.md)",
        15
      )
      const want = provider.AutocompleteType.IMG
      assert.deepEqual(have, want)
    })

    test("starting", function() {
      const have = provider.determineType("![", 2)
      const want = provider.AutocompleteType.IMG
      assert.deepEqual(have, want)
    })
  })

  suite("heading", function() {
    test("middle of sentence", function() {
      const have = provider.determineType(
        "Check out #the and here is another [one](one.md)",
        14
      )
      const want = provider.AutocompleteType.NONE
      assert.deepEqual(have, want)
    })

    test("starting", function() {
      const have = provider.determineType("#", 1)
      const want = provider.AutocompleteType.HEADING
      assert.deepEqual(have, want)
    })
  })

  suite("parentDirs", function() {
    test("normal", function() {
      const give = "/one/two/three"
      const generator = provider.parentDirs(give)
      let item = generator.next()
      assert.equal(item.done, false, "first")
      assert.equal(item.value, "/one/two/three")
      item = generator.next()
      assert.equal(item.done, false, "second")
      assert.equal(item.value, "/one/two")
      item = generator.next()
      assert.equal(item.done, false, "third")
      assert.equal(item.value, "/one")
      item = generator.next()
      assert.equal(item.done, true, "finally done")
    })
  })

  suite("removeFirstChars", function() {
    test("normal", function() {
      const give = ["### one", "### two"]
      const want = ["## one", "## two"]
      const have = provider.removeFirstChars(give)
      assert.deepEqual(have, want)
    })

    test("empty", function() {
      const give: string[] = []
      const want: string[] = []
      const have = provider.removeFirstChars(give)
      assert.deepEqual(have, want)
    })
  })
})
