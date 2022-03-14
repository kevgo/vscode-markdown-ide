// helper functions for types

const imgExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", "tiff"]

/** indicates whether the given filename belongs to an image file */
export function isImage(fileName: string): boolean {
  return imgExtensions.some((ext) => fileName.endsWith(ext))
}
