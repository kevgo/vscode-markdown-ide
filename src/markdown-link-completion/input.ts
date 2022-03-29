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
  let i
  for (i = pos - 1; i > 0; i--) {
    if (line[i] === "[") {
      break
    }
  }
  if (i === 0) {
    return LinkType.MD
  }
  if (line[i - 1] === "!") {
    return LinkType.IMG
  }
  return LinkType.MD
}
