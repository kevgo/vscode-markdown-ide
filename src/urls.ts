/** provides the URL at the given cursor position in the given text */
export function extractAt(lineText: string, cursorColumn: number): string | undefined {
  // go left from the cursor until we find the beginning of the URL
  let start = cursorColumn
  while (start >= 0 && lineText.substring(start, start + 4) !== "http") {
    start--
  }
  if (start === -1) {
    // didn't find the URL beginning to the left --> search to the right
    start = cursorColumn
    while (start < lineText.length && lineText.substring(start, start + 4) !== "http") {
      start++
    }
    if (start === lineText.length) {
      return
    }
  }
  // find the end of the URL
  let end = start
  while (end < lineText.length && !urlEnds.includes(lineText[end])) {
    end++
  }
  return lineText.substring(start, end)
}
/** characters that mark the end of a URL */
const urlEnds = [" ", "\n"]

/** indicates whether the given */
export function isWebLink(text: string): boolean {
  return text.startsWith("https://") || text.startsWith("http://")
}

/** splits off the anchor portion from the given link */
export function splitAnchor(link: string): [string, string] {
  const pos = link.indexOf("#")
  if (pos === -1) {
    return [link, ""]
  }
  return [link.substring(0, pos), link.substring(pos + 1, link.length)]
}
