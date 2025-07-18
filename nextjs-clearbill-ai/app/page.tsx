"use client"
import Image from "next/image"
import clearbill_ai_logo from "./assets/clearbill_ai_logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"

const Home = () => {
    const { input, handleInputChange, handleSubmit, messages, append, isLoading } = useChat()

    const noMessages = false

    return (
        <main>
            <Image
                src={clearbill_ai_logo}
                alt="Clearbill AI Logo"
                width={250}
            />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            Welcome to ClearBill.AI! Your personal assistant for understanding and managing medical bills. Ask any question about your healthcare charges, insurance, or billing—I'm here to help you make sense of it all.
                        </p>
                        <br />
                        {/* {<PromptSuggestionRow />} */}
                    </>
                ) : (
                    <>
                        {/* map messages onto text bubbles */}
                        {/* <LoadingBubble /> */}
                    </>
                )}
                <form onSubmit={handleSubmit}>
                    <input className="question-box" onChange={handleInputChange} value={input} placeholder="Type your question here..." />
                    <input type="submit" />
                </form>
            </section>
        </main>
    )
}

export default Home