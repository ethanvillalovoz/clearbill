import type { SourceReference } from "../types";

type SourcePanelProps = {
  mode: "live" | "demo";
  sources: SourceReference[];
};

const SourcePanel = ({ mode, sources }: SourcePanelProps) => (
  <aside className="source-panel" aria-labelledby="source-panel-title">
    <div className="panel-heading">
      <span>Grounding</span>
      <span className="mode-indicator">{mode === "demo" ? "Demo corpus" : "Live retrieval"}</span>
    </div>

    <section className="source-section">
      <h2 id="source-panel-title">Reference context</h2>
      {sources.length ? (
        <ol className="source-list">
          {sources.map((source, index) => (
            <li key={source.url}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <a href={source.url} target="_blank" rel="noreferrer">
                <strong>{source.title}</strong>
                <small>{source.publisher}</small>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-panel-copy">Sources used for an answer will appear here.</p>
      )}
    </section>

    <section className="source-section boundary-section">
      <h2>Boundaries</h2>
      <ul>
        <li>Educational explanation only</li>
        <li>No diagnosis or coverage determination</li>
        <li>Verify charges with the provider and insurer</li>
        <li>Do not enter names, account numbers, or health details</li>
      </ul>
    </section>
  </aside>
);

export default SourcePanel;
