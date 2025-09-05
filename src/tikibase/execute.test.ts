import { strict as assert } from "assert"

import * as tikiExec from "./execute"

suite("groupByFile", function() {
  test("works", function() {
    const give: tikiExec.Message[] = [{
      file: "1.md",
      text: "issue 1",
      line: 2,
      start: 3,
      end: 4,
      fixable: false
    }, {
      file: "1.md",
      text: "issue 2",
      line: 10,
      start: 11,
      end: 12,
      fixable: false
    }, {
      file: "2.md",
      text: "issue 3",
      line: 20,
      start: 21,
      end: 22,
      fixable: false
    }]
    const have = tikiExec.groupByFile(give)
    const want = new Map()
    want.set("1.md", [{
      file: "1.md",
      text: "issue 1",
      line: 2,
      start: 3,
      end: 4,
      fixable: false
    }, {
      file: "1.md",
      text: "issue 2",
      line: 10,
      start: 11,
      end: 12,
      fixable: false
    }])
    want.set("2.md", [{
      file: "2.md",
      text: "issue 3",
      line: 20,
      start: 21,
      end: 22,
      fixable: false
    }])
    assert.deepEqual(have, want)
  })
})
