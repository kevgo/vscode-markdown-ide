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
