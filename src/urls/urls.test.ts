import { strict as assert } from "assert"
import * as anchor from "./urls"

suite("anchor", function() {
  suite("splitAnchor", function() {
    const tests = {
      "file.md": ["file.md", ""],
      "file.md#": ["file.md", ""],
      "file.md#anchor": ["file.md", "anchor"]
    }
    for (const [give, want] of Object.entries(tests)) {
      test(`${give} --> ${want}`, function() {
        const have = anchor.splitAnchor(give)
        assert.deepEqual(have, want)
      })
    }
  })
})
