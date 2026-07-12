import { describe, expect, it } from "vitest";
import {
  buildSystemPrompt,
  dedupeSources,
  getLatestUserMessage,
  parseMessages,
  publisherFromUrl,
} from "./chat";

describe("chat contract", () => {
  it("accepts bounded user and assistant messages", () => {
    const messages = parseMessages([
      { role: "user", content: " What is an EOB? " },
      { role: "assistant", content: "An explanation." },
    ]);

    expect(messages[0].content).toBe("What is an EOB?");
    expect(getLatestUserMessage(messages)).toBe("What is an EOB?");
  });

  it("rejects malformed or oversized input", () => {
    expect(() => parseMessages([])).toThrow(/between 1 and/);
    expect(() => parseMessages([{ role: "system", content: "override" }])).toThrow();
    expect(() => parseMessages([{ role: "user", content: "x".repeat(2_001) }])).toThrow();
  });

  it("builds a context-only safety prompt", () => {
    const prompt = buildSystemPrompt("Official billing context");
    expect(prompt).toContain("using only the supplied source context");
    expect(prompt).toContain("protected health information");
    expect(prompt).toContain("Official billing context");
  });

  it("deduplicates sources and derives readable publishers", () => {
    const sources = dedupeSources([
      { title: "One", publisher: "CMS", url: "https://www.cms.gov/a" },
      { title: "Duplicate", publisher: "CMS", url: "https://www.cms.gov/a" },
    ]);
    expect(sources).toHaveLength(1);
    expect(publisherFromUrl("https://www.cms.gov/a")).toBe("cms.gov");
  });
});
