import { promises as fs } from "fs"

import * as files from "../helpers/filetype"

/** provides the filenames of all images in the given directory */
export async function imgFiles(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).filter(files.isImage)
}
