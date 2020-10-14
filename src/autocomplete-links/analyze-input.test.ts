import { strict as assert } from "assert"

import { analyzeInput, LinkType } from "./analyze-input"

test("analyzeInput", function () {
  const tests = [
    {
      give: ["Check out [the and here is another [one](one.md)", 14],
      want: ["the", LinkType.MD],
    },
    {
      give: ["[", 1],
      want: ["", LinkType.MD],
    },
    {
      give: ["Check out ![the and here is another [one](one.md)", 15],
      want: ["the", LinkType.IMG],
    },
    {
      give: ["![", 2],
      want: ["", LinkType.IMG],
    },
  ]
  for (const test of tests) {
    // @ts-ignore TypeScript is too dumb to understand that the types are correct here
    const have = analyzeInput(test.give[0], test.give[1])
    assert.deepEqual(have, test.want)
  }
})
