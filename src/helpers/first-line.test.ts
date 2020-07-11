import { strict as assert } from "assert"
import { firstLine } from "./first-line"

test("firstLine", function () {
  assert.equal(firstLine("# Foo\nbar"), "# Foo")
})
