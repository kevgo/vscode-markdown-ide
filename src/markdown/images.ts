/** creates a Markdown link to the given image */
export function create(fileName: string): string {
  return `[](${fileName})`
}
