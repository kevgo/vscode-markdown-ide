import { strict as assert } from "assert"

import * as files from "./files"

suite("isImageFile", function() {
  const tests = {
    "foo.jpg": true,
    "foo.jpeg": true,
    "foo.png": true,
    "foo.gif": true,
    "foo.tif": true,
    "foo.tiff": true,
    "foo.md": false,
    "foo.yml": false
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      assert.equal(files.isImage(give), want, give)
    })
  }
})