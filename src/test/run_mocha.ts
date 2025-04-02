import { glob } from "glob"
import Mocha from "mocha"
import * as path from "path"

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: "tdd", color: true })
  const testsRoot = path.resolve(__dirname, "..")
  const files = await glob("**/*.test.js", { cwd: testsRoot })
  return new Promise((resolve, reject) => {
    files.forEach(file => mocha.addFile(path.resolve(testsRoot, file)))
    try {
      mocha.run(failures => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed`))
        } else {
          resolve()
        }
      })
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}
