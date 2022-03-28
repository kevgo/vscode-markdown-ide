/** the different link types */
export enum LinkType {
  MD,
  IMG
}

/**
 * provides the link type and search term that the user is currently entering
 * into the given line at the given position.
 */
export function analyze(line: string, pos: number): LinkType {
  for (let i = pos - 1; i > 0; i--) {
    if (line[i] !== "[") {
      continue
    }
    const modifier = i === 0 ? "" : line[i - 1]
    if (modifier === "!") {
      return LinkType.IMG
    } else {
      return LinkType.MD
    }
  }
  return LinkType.MD
}
