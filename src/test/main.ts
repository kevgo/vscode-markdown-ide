import * as vscodeTestElectron from "@vscode/test-electron"
import * as path from "path"

// runs the unit tests inside VSCode's Extension Development Host
// so that the "vscode" module is available

async function main() {
  try {
    await vscodeTestElectron.runTests({
      extensionDevelopmentPath: path.resolve(__dirname, "../../"),
      extensionTestsPath: path.resolve(__dirname, "run_mocha")
    })
  } catch (err) {
    console.error("Failed to run tests")
    process.exit(1)
  }
}

void main()
