"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clearbill_ai_logo from "./assets/clearbill_ai_logo.png";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import type { ChatMessage } from "./types";

const Home = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        const data = await response.json();
        const assistantMessage: ChatMessage = {
            role: "assistant",
            content: data.choices?.[0]?.message?.content || "",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setInput("");
        setIsLoading(false);
    };

    const handlePrompt = (promptText: string) => {
        setInput(promptText);
    };

    const noMessages = messages.length === 0;

    return (
        <main>
            <div className="header">
                <Image
                    src={clearbill_ai_logo}
                    alt="ClearBill AI Logo"
                    width={250}
                />
            </div>

            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            Welcome to ClearBill.AI! Your personal assistant for understanding and managing medical bills.<br />
                            Ask any question about your healthcare charges, insurance, or billing—I&apos;m here to help you make sense of it all.
                        </p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    <div className="messages-wrapper">
                        {messages.map((message, index) => (
                            <Bubble
                                key={`message-${index}`}
                                message={message}
                            />
                        ))}
                        {isLoading && <LoadingBubble />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </section>

            <form onSubmit={handleSubmit}>
                <input
                    className="question-box"
                    onChange={handleInputChange}
                    value={input}
                    placeholder="Type your question here..."
                    disabled={isLoading}
                />
                <input
                    type="submit"
                    value="Send"
                    disabled={isLoading}
                />
            </form>
        </main>
    );
};

export default Home;
