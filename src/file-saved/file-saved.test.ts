import { strict as assert } from "assert"

import { groupByFile } from "./file-saved"
import { Message } from "./tikibase"

suite("groupByFile", function() {
  test("works", function() {
    const give: Message[] = [{
      file: "1.md",
      text: "issue 1",
      line: 2,
      start: 3,
      end: 4
    }, {
      file: "1.md",
      text: "issue 2",
      line: 10,
      start: 11,
      end: 12
    }, {
      file: "2.md",
      text: "issue 3",
      line: 20,
      start: 21,
      end: 22
    }]
    const have = groupByFile(give)
    const want = new Map()
    want.set("1.md", [{
      file: "1.md",
      text: "issue 1",
      line: 2,
      start: 3,
      end: 4
    }, {
      file: "1.md",
      text: "issue 2",
      line: 10,
      start: 11,
      end: 12
    }])
    want.set("2.md", [{
      file: "2.md",
      text: "issue 3",
      line: 20,
      start: 21,
      end: 22
    }])
    assert.deepEqual(have, want)
  })
})
