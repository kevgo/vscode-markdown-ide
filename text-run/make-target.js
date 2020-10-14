const fs = require("fs").promises
const os = require("os")
const path = require("path")

module.exports = async function (activity) {
  const have = activity.nodes.text().replace("make", "").trim()
  activity.name(`make target "${have}" exists`)
  const want = await existingMakeTasks(activity)
  if (!want.includes(have)) {
    throw new Error(`Make target "${have}" not found in [${want.join(", ")}]`)
  }
}

/** provides all tasks in the Makefile in the current folder */
async function existingMakeTasks(activity) {
  const makefilePath = path.join(activity.configuration.sourceDir, "Makefile")
  const makefileContent = await fs.readFile(makefilePath, "utf8")
  const results = []
  for (const line of makefileContent.split(os.EOL)) {
    if (lineDefinesMakeCommand(line)) {
      results.push(extractMakeCommand(line))
    }
  }
  return results
}

/** indicates whether the given line from a Makefile defines a Make command */
function lineDefinesMakeCommand(line) {
  return makeCommandRE.test(line) && !line.startsWith(".PHONY")
}
const makeCommandRE = /^[^ ]+:/

/** returns the defined command name from a Makefile line that defines a Make command */
function extractMakeCommand(line) {
  return line.split(":")[0]
}
