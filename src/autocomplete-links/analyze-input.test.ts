import { strict as assert } from "assert"

import { analyzeInput } from "./analyze-input"

test("analyzeInput", function () {
  const tests = [
    {
      give: ["Check out [the and here is another [one](one.md)", 14],
      want: ["the", "md"],
    },
    {
      give: ["[", 1],
      want: ["", "md"],
    },
    {
      give: ["Check out ![the and here is another [one](one.md)", 15],
      want: ["the", "img"],
    },
    {
      give: ["![", 2],
      want: ["", "img"],
    },
  ]
  for (const test of tests) {
    // @ts-ignore TypeScript is too dumb to understand that the types are correct here
    const have = analyzeInput(test.give[0], test.give[1])
    assert.deepEqual(have, test.want)
  }
})
