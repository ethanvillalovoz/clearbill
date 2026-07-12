import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types";

type BubbleProps = {
  message: ChatMessage;
};

const Bubble = ({ message }: BubbleProps) => (
  <article className={`message message-${message.role}`}>
    <p className="message-role">{message.role === "user" ? "Question" : "ClearBill"}</p>
    <div className="message-content">
      <ReactMarkdown
        components={{
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  </article>
);

export default Bubble;
