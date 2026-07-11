"use client";

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import SourcePanel from "./components/SourcePanel";
import { DEMO_SOURCES, getDemoResponse } from "./data/demo";
import type { ChatMessage, ChatResponse, SourceReference } from "./types";

const mode = process.env.NEXT_PUBLIC_CLEARBILL_MODE === "live" ? "live" : "demo";

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sources, setSources] = useState<SourceReference[]>(
    mode === "demo" ? DEMO_SOURCES : [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const requestAnswer = async (nextMessages: ChatMessage[]): Promise<ChatResponse> => {
    if (mode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 650));
      return getDemoResponse(nextMessages.at(-1)?.content ?? "");
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: nextMessages }),
      signal: AbortSignal.timeout(30_000),
    });
    const data = (await response.json().catch(() => ({}))) as Partial<ChatResponse> & {
      error?: string;
    };

    if (!response.ok || !data.answer) {
      throw new Error(data.error || "ClearBill could not complete that request.");
    }

    return {
      answer: data.answer,
      mode: "live",
      sources: data.sources ?? [],
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const result = await requestAnswer(nextMessages);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.answer, sources: result.sources },
      ]);
      setSources(result.sources);
    } catch (requestError) {
      const message = requestError instanceof Error
        ? requestError.message
        : "ClearBill could not complete that request.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const noMessages = messages.length === 0;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="ClearBill home">
          <span className="brand-mark" aria-hidden="true">CB</span>
          <span>
            <strong>ClearBill</strong>
            <small>Healthcare cost explainer</small>
          </span>
        </Link>
        <div className="topbar-meta">
          <span className="status-dot" aria-hidden="true" />
          <span>{mode === "demo" ? "Demo corpus" : "Live retrieval"}</span>
          <a href="https://github.com/ethanvillalovoz/clearbill-ai" target="_blank" rel="noreferrer">
            Repository
          </a>
        </div>
      </header>

      <main className="workspace">
        <section className="conversation" aria-label="Billing conversation">
          <div className="conversation-scroll">
            {noMessages ? (
              <div className="welcome-state">
                <p className="eyebrow">01 / Billing workspace</p>
                <h1>Understand the line item before you act.</h1>
                <p className="welcome-copy">
                  Ask about an Explanation of Benefits, insurance adjustment, billing code,
                  or patient-responsibility amount. ClearBill responds with source-backed
                  educational guidance.
                </p>
                <PromptSuggestionsRow onPromptClick={handlePrompt} />
              </div>
            ) : (
              <div className="message-list" aria-live="polite">
                {messages.map((message, index) => (
                  <Bubble key={`${message.role}-${index}`} message={message} />
                ))}
                {isLoading ? <LoadingBubble /> : null}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <label htmlFor="billing-question">Ask a billing question</label>
            <div className="composer-row">
              <textarea
                ref={inputRef}
                id="billing-question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Example: Why is the allowed amount lower than the amount billed?"
                maxLength={2_000}
                rows={2}
                disabled={isLoading}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? "Reviewing" : "Ask"}
              </button>
            </div>
            <div className="composer-meta">
              <span>{input.length} / 2,000</span>
            </div>
            {error ? <p className="error-message" role="alert">{error}</p> : null}
          </form>
        </section>

        <SourcePanel mode={mode} sources={sources} />
      </main>

      <footer className="privacy-note">
        <strong>Do not enter protected health information.</strong>
        <span>ClearBill is educational and does not determine coverage, diagnose conditions, or replace professional advice.</span>
      </footer>
    </div>
  );
};

export default Home;
