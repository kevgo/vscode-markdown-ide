import { strict as assert } from "assert"

import * as links from "./links"

suite("image", function() {
  test("valid filename", function() {
    const have = links.image("foo.png")
    const want = "[](foo.png)"
    assert.equal(have, want)
  })
})

suite("markdown", function() {
  test("link to heading without regex", function() {
    const have = links.markdown({
      filePath: "foo.md",
      fileContent: "# Foo\nthe foo is strong today"
    })
    const want = "[Foo](foo.md)"
    assert.equal(have, want)
  })
  test("link to heading with normal regex", function() {
    const have = links.markdown({
      filePath: "foo.md",
      fileContent: "# Foo\nthe foo is strong today",
      titleRE: /^#+ (.*)$/
    })
    const want = "[Foo](foo.md)"
    assert.equal(have, want)
  })
  test("link to heading with full-cap abbreviation regex", function() {
    const have = links.markdown({
      filePath: "amazon-web-services.md",
      fileContent: "# Amazon Web Services (AWS)\na cloud provider",
      titleRE: /\(([A-Z0-9]+)\)$/
    })
    const want = "[AWS](amazon-web-services.md)"
    assert.equal(have, want)
  })
  test("link to heading with mixed-cap abbreviation regex", function() {
    const have = links.markdown({
      filePath: "software-as-a-service.md",
      fileContent: "# Software-as-a-Service (SaaS)\na software distribution model",
      titleRE: /\(([A-Z][A-Z0-9a-z]+[A-Z0-9])\)$/
    })
    const want = "[SaaS](software-as-a-service.md)"
    assert.equal(have, want)
  })
  test("File with links in heading", function() {
    const have = links.markdown({
      filePath: "foo.md",
      fileContent: "# A [Foo](foo.md) walks into a [bar](bar.md)",
      titleRE: /^#+ (.*)$/
    })
    const want = "[A Foo walks into a bar](foo.md)"
    assert.equal(have, want)
  })
})

suite("remove", function() {
  const tests = {
    "": "",
    Foo: "Foo",
    "A [Foo](foo.md) bar": "A Foo bar",
    "A [Foo](foo.md) and a [Bar](bar.md)": "A Foo and a Bar"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      assert.equal(links.remove(give), want)
    })
  }
})

suite("removeWithTarget", function() {
  test("two matching links", function() {
    const give = "# Test\n\nlink to [file1](old.md) and [file2](old.md) and [another file](another.md)."
    const want = "# Test\n\nlink to file1 and file2 and [another file](another.md)."
    const have = links.removeWithTarget({ text: give, target: "old.md" })
    assert.equal(have, want)
  })
})

suite("replaceTarget", function() {
  test("multiple matching links", function() {
    const give = "# Test\n\nlink to [file1](old.md) and [file1 again](old.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [file1](new.md) and [file1 again](new.md) and [another file](another.md)."
    const have = links.replaceTarget({ text: give, oldTarget: "old.md", newTarget: "new.md" })
    assert.equal(have, want)
  })
})

suite("replaceTitle", function() {
  test("multiple matches", function() {
    const give = "# Test\n\nlink to [oldTitle](file.md) and [oldTitle](file.md) and [another file](another.md)."
    const want = "# Test\n\nlink to [newTitle](file.md) and [newTitle](file.md) and [another file](another.md)."
    const have = links.replaceTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
  test("mismatching target", function() {
    const give = "# Test\n\nlink to [oldTitle](other_file.md)"
    const want = "# Test\n\nlink to [oldTitle](other_file.md)"
    const have = links.replaceTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
  test("mismatching title", function() {
    const give = "# Test\n\nlink to [otherTitle](file.md)"
    const want = "# Test\n\nlink to [otherTitle](file.md)"
    const have = links.replaceTitle({ text: give, oldTitle: "oldTitle", target: "file.md", newTitle: "newTitle" })
    assert.equal(have, want)
  })
})
