import { strict as assert } from "assert"

import { analyzeInput, LinkType } from "./analyze-input"

suite("analyzeInput", function () {
  test("typing a Markdown link in the middle of a sentence", function () {
    const have = analyzeInput(
      "Check out [the and here is another [one](one.md)",
      14
    )
    const want = ["the", LinkType.MD]
    assert.deepEqual(have, want)
  })

  test("starting a Markdown link", function () {
    const have = analyzeInput("[", 1)
    const want = ["", LinkType.MD]
    assert.deepEqual(have, want)
  })

  test("typing an image link in the middle of a sentence", function () {
    const have = analyzeInput(
      "Check out ![the and here is another [one](one.md)",
      15
    )
    const want = ["the", LinkType.IMG]
    assert.deepEqual(have, want)
  })

  test("starting an image link", function () {
    const have = analyzeInput("![", 2)
    const want = ["", LinkType.IMG]
    assert.deepEqual(have, want)
  })
})
