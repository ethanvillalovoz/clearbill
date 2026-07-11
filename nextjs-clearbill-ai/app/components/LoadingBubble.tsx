const LoadingBubble = () => (
  <div className="analysis-progress" role="status" aria-label="Reviewing billing sources">
    <span className="pulse-dot" aria-hidden="true" />
    <span>Reviewing billing guidance and source context</span>
  </div>
);

export default LoadingBubble;
