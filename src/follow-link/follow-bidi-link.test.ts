import { strict as assert } from "assert"
import * as vscode from "vscode"

import { extractLinkTarget, extractUrl, isWebLink, locateLinkWithTarget } from "./follow-bidi-link"

suite("followBiDiLink", function() {
  test("extractLinkTarget", function() {
    const give = "one [title1](target1.md) two [title2](target2.md) three"
    const link2start = 29
    for (let i = 0; i < link2start; i++) {
      const have = extractLinkTarget(give, i)
      assert.equal(have, "target1.md", `pos ${i} -> ${have}`)
    }
    for (let i = link2start; i < give.length; i++) {
      const have = extractLinkTarget(give, i)
      assert.equal(have, "target2.md", `pos ${i} -> ${have}`)
    }
  })
  test("e", function() {
    //
  })
  test("extractUrl", function() {
    const give = "one http://one.com two https://two.com three"
    const link2start = 23
    for (let i = 0; i < link2start; i++) {
      const have = extractUrl(give, i)
      assert.equal(have, "http://one.com", `pos ${i} -> ${have}`)
    }
    for (let i = link2start; i < give.length; i++) {
      const have = extractUrl(give, i)
      assert.equal(have, "https://two.com", `pos ${i} -> ${have}`)
    }
  })
  test("isWebLink", function() {
    const tests = {
      "http://acme.com": true,
      "https://acme.com": true,
      "filename.md": false,
      "httpfile.md": false,
      "httpsfile.md": false
    }
    for (const [give, want] of Object.entries(tests)) {
      const have = isWebLink(give)
      assert.equal(have, want, `${give} --> ${have}`)
    }
  })
  test("locateLinkWithTarget", function() {
    const give = `# title
text
one [link](target.md) two
three`
    const want = new vscode.Position(2, 4)
    const have = locateLinkWithTarget({ target: "target.md", text: give })
    assert.deepEqual(have, want)
  })
})
