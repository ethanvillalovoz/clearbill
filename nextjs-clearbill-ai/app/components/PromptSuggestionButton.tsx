/**
 * PromptSuggestionButton component.
 * Renders a button for a suggested prompt.
 *
 * @param text - The prompt text to display on the button.
 * @param onClick - Handler function to call when the button is clicked.
 */
const PromptSuggestionButton = ({ text, onClick }) => {
    return (
        <button 
            className="prompt-suggestion-button"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default PromptSuggestionButton;