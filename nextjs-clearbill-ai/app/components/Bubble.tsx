import React from "react"
import ReactMarkdown from "react-markdown"

/**
 * Chat bubble component.
 * Renders a single chat message with appropriate styling based on the sender's role.
 *
 * @param message - The message object containing content and role ("user" or "assistant")
 */
const Bubble = ({ message }) => {
    const { content, role } = message

    return (
        <div className={`${role} bubble`}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    )
}

export default Bubble;