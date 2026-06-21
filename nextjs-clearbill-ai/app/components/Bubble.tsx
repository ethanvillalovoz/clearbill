import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types";

type BubbleProps = {
    message: ChatMessage;
};

const Bubble = ({ message }: BubbleProps) => {
    const { content, role } = message;

    return (
        <div className={`${role} bubble`}>
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default Bubble;
