"use client";

import React, { useState } from "react";
import Image from "next/image";
import clearbill_ai_logo from "./assets/clearbill_ai_logo.png";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

/**
 * Home page component for ClearBill.AI.
 * Displays the logo, welcome message, chat interface, and handles user input.
 */
const Home = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => setInput(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [...messages, userMessage] }),
        });
        const data = await res.json();
        const assistantMessage = {
            role: "assistant",
            content: data.choices?.[0]?.message?.content || "",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setInput("");
        setIsLoading(false);
    };

    const handlePrompt = (promptText) => {
        setInput(promptText);
    };

    const noMessages = messages.length === 0;

    return (
        <main>
            {/* Header section with logo and intro text */}
            <div className="header">
                <Image
                    src={clearbill_ai_logo}
                    alt="ClearBill AI Logo"
                    width={250}
                />
            </div>

            {/* Main chat section */}
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    // Shown when there are no messages yet
                    <>
                        <p className="starter-text">
                            Welcome to ClearBill.AI! Your personal assistant for understanding and managing medical bills.<br />
                            Ask any question about your healthcare charges, insurance, or billing—I'm here to help you make sense of it all.
                        </p>
                        <br />
                        {/* Prompt suggestions for quick start */}
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    // Shown when there are chat messages
                    <>
                        {/* Render chat messages as bubbles */}
                        {messages.map((message, index) => (
                            <Bubble
                                key={`message-${index}`}
                                message={message}
                            />
                        ))}
                        {/* Show loading indicator while waiting for response */}
                        {isLoading && <LoadingBubble />}
                    </>
                )}
            </section>

            {/* Chat input form */}
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