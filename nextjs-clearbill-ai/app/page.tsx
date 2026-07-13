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

const claimRows = [
  {
    id: "submitted",
    code: "99214",
    label: "Office visit, established patient",
    billed: "$425.00",
    plan: "$235.00",
    responsibility: "$40.00",
    prompt: "How do I check whether this office-visit charge is correct?",
  },
  {
    id: "lab",
    code: "80053",
    label: "Comprehensive metabolic panel",
    billed: "$168.00",
    plan: "$76.00",
    responsibility: "$20.00",
    prompt: "Why is the allowed amount lower than the amount billed?",
  },
  {
    id: "adjustment",
    code: "ADJ",
    label: "Network discount and plan payment",
    billed: "-$282.00",
    plan: "Applied",
    responsibility: "$0.00",
    prompt: "What does the insurance adjustment on an EOB mean?",
  },
];

const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sources, setSources] = useState<SourceReference[]>(
    mode === "demo" ? DEMO_SOURCES : [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLine, setSelectedLine] = useState("lab");
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

  const handlePrompt = (prompt: string, lineId?: string) => {
    setSelectedLine(lineId ?? "");
    setInput(prompt);
    inputRef.current?.focus();
  };

  const noMessages = messages.length === 0;
  const selectedClaim = claimRows.find((row) => row.id === selectedLine);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="ClearBill home">
          <span>
            <strong>ClearBill</strong>
            <small>Source-backed billing guide</small>
          </span>
        </Link>
        <div className="topbar-meta">
          <span className="status-pill">{mode === "demo" ? "Synthetic statement" : "Live retrieval"}</span>
          <a href="https://github.com/ethanvillalovoz/clearbill" target="_blank" rel="noreferrer">
            Repository
          </a>
        </div>
      </header>

      <main className="workspace">
        <section className="bill-pane" aria-labelledby="statement-title">
          <div className="statement-heading">
            <div>
              <p>Explanation of Benefits</p>
              <h1 id="statement-title">Claim 04-2719</h1>
            </div>
            <dl>
              <div><dt>Patient</dt><dd>Sample member</dd></div>
              <div><dt>Date processed</dt><dd>Apr 18, 2026</dd></div>
              <div><dt>Status</dt><dd>Finalized</dd></div>
            </dl>
          </div>

          <div className="statement-summary" aria-label="Claim summary">
            <div><span>Provider billed</span><strong>$593.00</strong></div>
            <div><span>Plan discounts</span><strong>-$282.00</strong></div>
            <div><span>Plan paid</span><strong>-$251.00</strong></div>
            <div className="amount-due"><span>You may owe</span><strong>$60.00</strong></div>
          </div>

          <div className="line-items">
            <div className="line-items-heading">
              <div>
                <span>Service details</span>
                <small>Select a line to prepare a question</small>
              </div>
              <div className="column-labels" aria-hidden="true">
                <span>Billed</span><span>Allowed</span><span>You owe</span>
              </div>
            </div>
            {claimRows.map((row) => (
              <button
                key={row.id}
                type="button"
                className={`claim-row${selectedLine === row.id ? " is-selected" : ""}`}
                aria-pressed={selectedLine === row.id}
                onClick={() => handlePrompt(row.prompt, row.id)}
              >
                <span className="claim-description"><small>{row.code}</small><strong>{row.label}</strong></span>
                <span>{row.billed}</span>
                <span>{row.plan}</span>
                <span>{row.responsibility}</span>
              </button>
            ))}
          </div>

          <div className="statement-note">
            <span>Not a bill</span>
            <p>Compare this statement with the provider invoice before paying. Amounts and identities shown here are synthetic.</p>
          </div>
        </section>

        <div className="review-rail">
          <section className="conversation" aria-label="Billing conversation">
            <div className="conversation-scroll">
            {noMessages ? (
              <div className="review-intro">
                <h2>Ask about this statement</h2>
                <p>Select a service on the left or begin with a common billing question.</p>
                {selectedClaim ? (
                  <div className="selected-claim" aria-label="Selected claim line">
                    <span>Selected line</span>
                    <strong>{selectedClaim.code} · {selectedClaim.label}</strong>
                    <small>{selectedClaim.responsibility} patient responsibility</small>
                  </div>
                ) : null}
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
              <label htmlFor="billing-question">Question for this statement</label>
              <div className="composer-row">
                <textarea
                  ref={inputRef}
                  id="billing-question"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask what changed, what you owe, or what to verify next."
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
                  {isLoading ? "Reviewing" : "Review"}
                </button>
              </div>
              <div className="composer-meta"><span>{input.length} / 2,000</span></div>
              {error ? <p className="error-message" role="alert">{error}</p> : null}
            </form>
          </section>

          <SourcePanel mode={mode} sources={sources} />
        </div>
      </main>

      <footer className="privacy-note">
        <strong>Do not enter protected health information.</strong>
        <span>ClearBill is educational and does not determine coverage, diagnose conditions, or replace professional advice.</span>
      </footer>
    </div>
  );
};

export default Home;
