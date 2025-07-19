import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * Chat bubble component for ClearBill.AI.
 * Renders a single chat message with appropriate styling and Markdown support.
 *
 * Props:
 * - message: {
 *     content: string; // The message text (may include Markdown)
 *     role: "user" | "assistant"; // Who sent the message
 *   }
 */
const Bubble = ({ message }) => {
    const { content, role } = message;

    return (
        <div className={`${role} bubble`}>
            {/* Render Markdown content for rich formatting */}
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default Bubble;