import { Message } from "./tikibase"

export function organize(messages: Message[]): Map<string, Message[]> {
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
