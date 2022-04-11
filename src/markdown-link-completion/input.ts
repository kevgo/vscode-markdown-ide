/** describes what type of auto-completion is needed */
export enum AutocompleteType {
  /** autocomplete a markdown link */
  MD_LINK,
  /** autocomplete an image tag */
  IMG,
  /** autocomplete a markdown heading */
  HEADING,
  /** no autocompletion item found */
  NONE
}

/** determines which autocompletion is needed */
export function analyze(line: string, pos: number): AutocompleteType {
  let i
  for (i = pos - 1; i > 0; i--) {
    if (line[i] === "[") {
      break
    }
  }
  if (i === 0) {
    if (line[0] === "[") {
      return AutocompleteType.MD_LINK
    }
    if (line[0] === "#") {
      return AutocompleteType.HEADING
    }
    return AutocompleteType.NONE
  }
  if (line[i - 1] === "!") {
    return AutocompleteType.IMG
  }
  return AutocompleteType.MD_LINK
}
