const imgExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", "tiff"]

/** indicates whether the given filename belongs to an image file */
export function isImageFile(fileName: string): boolean {
  for (const ext of imgExtensions) {
    if (fileName.endsWith(ext)) {
      return true
    }
  }
  return false
}
