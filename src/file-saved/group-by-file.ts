import { Message } from "./tikibase"

/** groups the given messages by file */
export function groupByFile(messages: Message[]): Map<string, Message[]> {
  const result: Map<string, Message[]> = new Map()
  for (const message of messages) {
    let forFile = result.get(message.file)
    if (!forFile) {
      forFile = []
      result.set(message.file, forFile)
    }
    forFile.push(message)
  }
  return result
}
