import { strict as assert } from "assert"

import * as input from "./input"

suite("analyzeInput", function() {
  test("typing a Markdown link in the middle of a sentence", function() {
    const have = input.analyze(
      "Check out [the and here is another [one](one.md)",
      14
    )
    const want = input.LinkType.MD
    assert.deepEqual(have, want)
  })

  test("starting a Markdown link", function() {
    const have = input.analyze("[", 1)
    const want = input.LinkType.MD
    assert.deepEqual(have, want)
  })

  test("typing an image link in the middle of a sentence", function() {
    const have = input.analyze(
      "Check out ![the and here is another [one](one.md)",
      15
    )
    const want = input.LinkType.IMG
    assert.deepEqual(have, want)
  })

  test("starting an image link", function() {
    const have = input.analyze("![", 2)
    const want = input.LinkType.IMG
    assert.deepEqual(have, want)
  })
})
