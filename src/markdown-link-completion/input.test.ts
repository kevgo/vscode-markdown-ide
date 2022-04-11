import { strict as assert } from "assert"

import * as input from "./input"

suite("analyzeInput", function() {
  suite("markdown link", function() {
    test("middle of sentence", function() {
      const have = input.analyze(
        "Check out [the new and here is another [one](one.md)",
        18
      )
      const want = input.AutocompleteType.MD_LINK
      assert.deepEqual(have, want)
    })

    test("starting", function() {
      const have = input.analyze("[", 1)
      const want = input.AutocompleteType.MD_LINK
      assert.deepEqual(have, want)
    })
  })

  suite("image tag", function() {
    test("middle of sentence", function() {
      const have = input.analyze(
        "Check out ![the and here is another [one](one.md)",
        15
      )
      const want = input.AutocompleteType.IMG
      assert.deepEqual(have, want)
    })

    test("starting", function() {
      const have = input.analyze("![", 2)
      const want = input.AutocompleteType.IMG
      assert.deepEqual(have, want)
    })
  })

  suite("heading", function() {
    test("middle of sentence", function() {
      const have = input.analyze(
        "Check out #the and here is another [one](one.md)",
        14
      )
      const want = input.AutocompleteType.NONE
      assert.deepEqual(have, want)
    })

    test("starting", function() {
      const have = input.analyze("#", 1)
      const want = input.AutocompleteType.HEADING
      assert.deepEqual(have, want)
    })
  })
})
