import { strict as assert } from "assert"

import { isImageFile } from "./is-image-file"

test("isImageFile", function () {
  const tests = {
    "foo.jpg": true,
    "foo.jpeg": true,
    "foo.png": true,
    "foo.gif": true,
    "foo.tif": true,
    "foo.tiff": true,
    "foo.md": false,
    "foo.yml": false,
  }
  for (const [give, want] of Object.entries(tests)) {
    assert.equal(isImageFile(give), want, give)
  }
})
