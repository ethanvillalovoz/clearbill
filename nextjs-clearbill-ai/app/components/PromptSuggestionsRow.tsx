import PromptSuggestionButton from "./PromptSuggestionButton";

const prompts = [
    "What is an Explanation of Benefits?",
    "Why does this say out of network?",
    "How do I check whether a charge is correct?",
];

type PromptSuggestionsRowProps = {
    onPromptClick: (prompt: string) => void;
};

const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
    return (
        <div className="prompt-suggestions" aria-label="Example billing questions">
            {prompts.map((prompt) => (
                <PromptSuggestionButton
                    key={prompt}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />
            ))}
        </div>
    );
};

export default PromptSuggestionsRow;
