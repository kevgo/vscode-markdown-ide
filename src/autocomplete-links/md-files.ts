import { promises as fs, readdirSync, statSync } from "fs";

// getFiles provides
export async function mdFiles(dir: string, folders = []): Promise<string[]> {
  const result: string[] = [];
  for (const file of await fs.readdir(dir)) {
    if (file.endsWith(".md")) {
      result.push(file);
    }
  }
  return result;
}

getAllSubFolders = (baseFolder, folderList = []) => {
  let folders: string[] = readdirSync(baseFolder).filter((file) =>
    statSync(path.join(baseFolder, file)).isDirectory()
  );
  folders.forEach((folder) => {
    folderList.push(path.join(baseFolder, folder));
    this.getAllSubFolders(path.join(baseFolder, folder), folderList);
  });
};
