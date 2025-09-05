import { strict as assert } from "assert"

import * as markdownFootnotes from "./markdown-footnotes"

test("footnotes", function() {
  test("text with footnotes", function() {
    const give = `# title
text
### caption 1
text
### links
[^footnote1]: https://footnotes.com/1
[^footnote2]: https://footnotes.com/2
`
    const want = ["^footnote1]", "^footnote2]"]
    const have = markdownFootnotes.footnotes(give)
    assert.deepEqual(have, want)
  })

  test("text without footnotes", function() {
    const give = `# title
text
### caption 1
text
`
    const want: string[] = []
    const have = markdownFootnotes.footnotes(give)
    assert.deepEqual(have, want)
  })

  test("empty text", function() {
    const give = ``
    const want: string[] = []
    const have = markdownFootnotes.footnotes(give)
    assert.deepEqual(have, want)
  })
})
