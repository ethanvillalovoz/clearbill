import PromptSuggestionButton from "./PromptSuggestionButton"

/**
 * PromptSuggestionsRow component.
 * Renders a horizontal row of suggested prompt buttons for quick user input.
 *
 * @param onPromptClick - Handler function to call when a prompt is selected.
 */
const PromptSuggestionsRow = ({ onPromptClick }) => {
    // List of suggested prompts for the user
    const prompts = [
        "What is this charge for?",
        "Can you explain this medical bill?",
        "Why is my insurance not covering this?",
        "How do I know if this bill is correct?",
        "Can I negotiate or reduce my bill?",
        "What is this CPT/ICD code?",
        "Is this an out-of-network charge?",
        "What should I do if I can’t afford this bill?",
    ]

    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => (
                <PromptSuggestionButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />
            ))}
        </div>
    )
}

export default PromptSuggestionsRow