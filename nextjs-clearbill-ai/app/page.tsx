"use client"

import Image from "next/image"
import clearbill_ai_logo from "./assets/clearbill_ai_logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"

/**
 * Home page component for ClearBill.AI.
 * Displays the logo, welcome message, chat interface, and handles user input.
 */
const Home = () => {
    // Chat state and handlers from the ai/react hook
    const { input, handleInputChange, handleSubmit, messages, append, isLoading } = useChat()

    // Determines if there are any chat messages yet
    const noMessages = messages.length === 0

    return (
        <main>
            {/* App logo */}
            <Image
                src={clearbill_ai_logo}
                alt="ClearBill AI Logo"
                width={250}
            />

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
                        {/* You can add prompt suggestions here */}
                        {/* <PromptSuggestionRow /> */}
                    </>
                ) : (
                    // Shown when there are chat messages
                    <>
                        {/* Render chat messages as bubbles */}
                        {/* {messages.map((msg: Message) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))} */}
                        {/* Show loading indicator while waiting for response */}
                        {/* <LoadingBubble /> */}
                    </>
                )}

                {/* Chat input form */}
                <form onSubmit={handleSubmit}>
                    <input
                        className="question-box"
                        onChange={handleInputChange}
                        value={input}
                        placeholder="Type your question here..."
                        disabled={isLoading}
                    />
                    <input type="submit" value="Send" disabled={isLoading} />
                </form>
            </section>
        </main>
    )
}

export default Home