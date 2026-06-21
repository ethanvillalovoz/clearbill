import PromptSuggestionButton from "./PromptSuggestionButton";

const prompts = [
    "What is this charge for?",
    "Can you explain this medical bill?",
    "Why is my insurance not covering this?",
    "How do I know if this bill is correct?",
    "Can I negotiate or reduce my bill?",
    "What is this CPT/ICD code?",
    "Is this an out-of-network charge?",
    "What should I do if I can’t afford this bill?",
];

type PromptSuggestionsRowProps = {
    onPromptClick: (prompt: string) => void;
};

const PromptSuggestionsRow = ({ onPromptClick }: PromptSuggestionsRowProps) => {
    return (
        <div className="prompt-suggestion-row">
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
