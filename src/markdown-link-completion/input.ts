/** describes what type of auto-completion is needed */
export enum AutocompleteType {
  /** autocomplete a markdown link */
  MD_LINK,
  /** autocomplete an image tag */
  IMG,
  /** autocomplete a markdown heading */
  HEADING
}

/** determines which autocompletion is needed */
export function analyze(line: string, pos: number): AutocompleteType {
  let i
  let c
  for (i = pos - 1; i > 0; i--) {
    c = line[i]
    if (c === "[" || c === "#") {
      break
    }
  }
  if (c === "#") {
    return AutocompleteType.HEADING
  }
  if (i === 0) {
    return AutocompleteType.MD_LINK
  }
  if (line[i - 1] === "!") {
    return AutocompleteType.IMG
  }
  return AutocompleteType.MD_LINK
}
