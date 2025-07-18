"use client"

import Image from "next/image"
import clearbill_ai_logo from "./assets/clearbill_ai_logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"

/**
 * Home page component for ClearBill.AI.
 * Displays the logo, welcome message, chat interface, and handles user input.
 */
const Home = () => {
    // Chat state and handlers from the ai/react hook
    const { input, handleInputChange, handleSubmit, messages, append, isLoading } = useChat()

    // Determines if there are any chat messages yet
    const noMessages = !messages || messages.length === 0

    /**
     * Handles when a prompt suggestion is clicked.
     * Appends the prompt as a user message to the chat.
     * @param promptText - The suggested prompt text
     */
    const handlePrompt = (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user",
        }
        append(msg)
    }

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
    )
}

export default Home