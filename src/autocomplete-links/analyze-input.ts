/** the different link types */
export enum LinkType {
  MD,
  IMG,
}

/**
 * provides the link type and search term that the user is currently entering
 * into the given line at the given position.
 */
export function analyzeInput(line: string, pos: number): [string, LinkType] {
  let linkText = ""
  for (let i = pos - 1; i > 0; i--) {
    if (line[i] !== "[") {
      linkText = line[i] + linkText
      continue
    }
    const modifier = i === 0 ? "" : line[i - 1]
    if (modifier === "!") {
      return [linkText, LinkType.IMG]
    } else {
      return [linkText, LinkType.MD]
    }
  }
  return [linkText, LinkType.MD]
}
