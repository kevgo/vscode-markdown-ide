import { strict as assert } from "assert"
import * as path from "path"

import * as files from "./files"

suite("files", function() {
  test("markdown", async function() {
    const examplesPath = path.join(__dirname, "..", "..", "examples")
    const results: files.FileResult[] = []
    await files.markdown(examplesPath, results)
    const have = results.map(result => result.filePath)
    assert.deepEqual(have, ["1.md", "3.md", "two/2a.md", "two/2b.md"])
  })

  test(`isImage`, function() {
    const tests = {
      "foo.png": true,
      "foo.jpg": true,
      "foo.jpeg": true,
      "foo.gif": true,
      "foo.tif": true,
      "foo.tiff": true,
      "foo.md": false,
      "foo.text": false
    }
    for (const [give, want] of Object.entries(tests)) {
      assert.equal(files.isImage(give), want)
    }
  })

  test("images", async function() {
    const have: string[] = []
    await files.images(path.join(__dirname, "..", "..", "examples"), have)
    const want = ["foo.png", "two/two.gif"]
    assert.deepEqual(have, want)
  })
})
