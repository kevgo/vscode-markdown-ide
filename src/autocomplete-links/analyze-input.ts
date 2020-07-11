// findSearchTerm provides the search item and link type,

// LinkTypes defines the different link types.
export enum LinkTypes {
  md,
  img,
}

// analyzeSearch provides the link type and search term
// that the user is currently entering into the given line at the given position.
export function analyzeInput(line: string, pos: number): [string, LinkTypes] {
  let linkText = ""
  for (let i = pos - 1; i > 0; i--) {
    if (line[i] !== "[") {
      linkText = line[i] + linkText
      continue
    }
    const modifier = i === 0 ? "" : line[i - 1]
    if (modifier === "!") {
      return [linkText, LinkTypes.img]
    } else {
      return [linkText, LinkTypes.md]
    }
  }
  return [linkText, LinkTypes.md]
}
