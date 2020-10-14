import { promises as fs } from "fs"

import { isImageFile } from "../helpers/is-image-file"

// imgFiles provides the filenames of all images in the given directory.
export async function imgFiles(dir: string): Promise<string[]> {
  const result: string[] = []
  for (const file of await fs.readdir(dir)) {
    if (isImageFile(file)) {
      result.push(file)
    }
  }
  return result
}
