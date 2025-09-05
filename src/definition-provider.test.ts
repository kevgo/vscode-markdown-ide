import { strict as assert } from "assert"
import * as vscode from "vscode"
import * as definitionProvider from "./definition-provider"
import * as markdownLinks from "./markdown/links"
import * as urls from "./urls/urls"

suite("follow-bidi-link", function() {
  test("extractUrl", function() {
    const give = "one http://one.com two https://two.com three"
    const link2start = 23
    for (let i = 0; i < link2start; i++) {
      const have = urls.extractAt(give, i)
      assert.equal(have, "http://one.com", `pos ${i} -> ${have}`)
    }
    for (let i = link2start; i < give.length; i++) {
      const have = urls.extractAt(give, i)
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
      const have = urls.isWebLink(give)
      assert.equal(have, want, `${give} --> ${have}`)
    }
  })

  suite("isHeadingMatchingTarget", function() {
    const tests = {
      "# heading 2": true,
      "### heading 2": true,
      "# heading 1": false,
      "### heading 3": false,
      "heading 2": false
    }
    for (const [give, want] of Object.entries(tests)) {
      test(`${give} --> ${want}`, function() {
        const have = definitionProvider.isHeadingMatchingTarget({ line: give, target: "heading-2" })
        assert.equal(have, want)
      })
    }
  })

  test("locateLinkWithTarget", function() {
    const give = `# title
text
one [link](target.md) two
three`
    const want = new vscode.Position(2, 4)
    const have = definitionProvider.locateLinkWithTarget({ target: "target.md", text: give })
    assert.deepEqual(have, want)
  })
})
