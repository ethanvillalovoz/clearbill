import type { ChatMessage, SourceReference } from "../types";

export const MAX_MESSAGES = 20;
export const MAX_MESSAGE_LENGTH = 2_000;

export function parseMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    throw new Error(`messages must contain between 1 and ${MAX_MESSAGES} items`);
  }

  return value.map((message) => {
    if (
      typeof message !== "object"
      || message === null
      || !("role" in message)
      || !("content" in message)
      || (message.role !== "user" && message.role !== "assistant")
      || typeof message.content !== "string"
      || !message.content.trim()
      || message.content.length > MAX_MESSAGE_LENGTH
    ) {
      throw new Error(
        `each message needs a valid role and 1-${MAX_MESSAGE_LENGTH} characters of content`,
      );
    }

    return { role: message.role, content: message.content.trim() };
  });
}

export function getLatestUserMessage(messages: ChatMessage[]): string {
  return messages.findLast((message) => message.role === "user")?.content ?? "";
}

export function publisherFromUrl(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return "Retrieved source";
  }
}

export function dedupeSources(sources: SourceReference[]): SourceReference[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (!source.url || seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

export function buildSystemPrompt(context: string): string {
  return `You explain healthcare billing terms using only the supplied source context.

Rules:
- This is educational information, not medical, legal, insurance, or financial advice.
- Never determine whether a charge is medically necessary, legal, covered, or owed.
- Never ask for names, dates of birth, member IDs, account numbers, diagnoses, or other protected health information.
- Distinguish a provider bill from an Explanation of Benefits.
- Give concrete verification steps and identify which party can confirm each fact.
- If the context is insufficient, say what cannot be confirmed. Do not fill gaps from general model knowledge.
- Keep the answer under 250 words and use concise Markdown when a list helps.

SOURCE CONTEXT
${context}
END SOURCE CONTEXT`;
}
