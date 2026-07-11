type PromptSuggestionButtonProps = {
  text: string;
  onClick: () => void;
};

const PromptSuggestionButton = ({ text, onClick }: PromptSuggestionButtonProps) => (
  <button type="button" className="prompt-suggestion" onClick={onClick}>
    <span>{text}</span>
    <span aria-hidden="true">Ask</span>
  </button>
);

export default PromptSuggestionButton;
