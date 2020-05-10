import { strict as assert } from "assert"
import { analyzeInput, LinkTypes } from "./analyze-input"

test("analyzeInput", function() {
  const tests = [
    {
      give: ["Check out [the and here is another [one](one.md)", 14],
      want: ["the", LinkTypes.md]
    },
    {
      give: ["[", 1],
      want: ["", LinkTypes.md]
    },
    {
      give: ["Check out ![the and here is another [one](one.md)", 15],
      want: ["the", LinkTypes.img]
    },
    {
      give: ["![", 2],
      want: ["", LinkTypes.img]
    }
  ]
  for (const test of tests) {
    // @ts-ignore TypeScript is too dumb to understand that the types are correct here
    let have = analyzeInput(test.give[0], test.give[1])
    assert.deepEqual(have, test.want)
  }
})
