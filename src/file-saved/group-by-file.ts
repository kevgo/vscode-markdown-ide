import { Message } from "./tikibase"

/** groups the given messages by file */
export function groupByFile(messages: Message[]): Map<string, Message[]> {
  const result: Map<string, Message[]> = new Map()
  for (const message of messages) {
    const messagesForFile = result.get(message.file)
    if (messagesForFile) {
      messagesForFile.push(message)
    } else {
      result.set(message.file, [message])
    }
  }
  return result
}
