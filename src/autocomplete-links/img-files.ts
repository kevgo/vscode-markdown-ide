import { promises as fs } from "fs"

import * as files from "../helpers/files"

/** provides the filenames of all images in the given directory */
export async function imgFiles(dir: string): Promise<string[]> {
  const result: string[] = []
  for (const file of await fs.readdir(dir)) {
    if (files.isImage(file)) {
      result.push(file)
    }
  }
  return result
}
