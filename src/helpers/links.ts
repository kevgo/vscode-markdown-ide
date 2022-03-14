// helper functions for Markdown links

/** removes all links in the given Markdown text*/
export function remove(text: string): string {
  for (const match of text.match(linkRE) || []) {
    text = text.replace(match, titleRE.exec(match)?.[1] || "")
  }
  return text
}
const linkRE = /\[[^\]]*\]\([^)]*\)/g
const titleRE = /\[([^\]]*)\]/

/** removes all links to the given target from the given text */
export function removeWithTarget(args: { target: string; text: string }): string {
  return args.text.replace(new RegExp(`\\[(.*?)\\]\\(${args.target}\\)`, "g"), "$1")
}

/** replaces the given oldTarget in all Markdown links of the given text with the newTarget */
export function replaceTarget(args: { newTarget: string; oldTarget: string; text: string }): string {
  const regex = new RegExp(`\\[(.*?)\\]\\(${args.oldTarget}\\)`, "g")
  const replacement = `[$1](${args.newTarget})`
  return args.text.replace(regex, replacement)
}

/** replaces the given oldTitle in all links with the given oldTitle and target in the given text with the given newTitle */
export function replaceTitle(
  args: { newTitle: string; oldTitle: string; target: string; text: string }
): string {
  const re = new RegExp(`\\[${args.oldTitle}\\]\\(${args.target}\\)`, "g")
  const replacement = `[${args.newTitle}](${args.target})`
  return args.text.replace(re, replacement)
}
