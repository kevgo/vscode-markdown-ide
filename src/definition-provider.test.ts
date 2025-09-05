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
})
