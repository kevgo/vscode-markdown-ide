/** the different link types */
export enum LinkType {
  MD,
  IMG
}

/**
 * provides the link type and search term that the user is currently entering
 * into the given line at the given position.
 */
export function analyze(line: string, pos: number): { linkType: LinkType; searchTerm: string } {
  let linkText = ""
  for (let i = pos - 1; i > 0; i--) {
    const currentChar = line[i]
    if (currentChar !== "[") {
      linkText = currentChar + linkText
      continue
    }
    const modifier = i === 0 ? "" : line[i - 1]
    if (modifier === "!") {
      return { searchTerm: linkText, linkType: LinkType.IMG }
    } else {
      return { searchTerm: linkText, linkType: LinkType.MD }
    }
  }
  return { searchTerm: linkText, linkType: LinkType.MD }
}
