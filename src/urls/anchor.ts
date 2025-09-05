/** splits off the anchor portion from the given link */
export function split(link: string): [string, string] {
  const pos = link.indexOf("#")
  if (pos === -1) {
    return [link, ""]
  }
  return [link.substring(0, pos), link.substring(pos + 1, link.length)]
}
