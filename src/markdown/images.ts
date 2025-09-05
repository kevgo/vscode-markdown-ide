/** creates a Markdown link to the given image */
export function createImage(fileName: string): string {
  return `[](${fileName})`
}
