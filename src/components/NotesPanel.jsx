import { traitLabels } from '../data/variants.js';

function Meter({ value, base, showBase }) {
  return (
    <span className="meter" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={`${n <= value ? 'on' : ''}${showBase && n === base ? ' base' : ''}`} />
      ))}
    </span>
  );
}

export default function NotesPanel({ variant, baseline }) {
  const isBaseline = variant.id === baseline.id;
  return (
    <aside className="notes">
      <div className="notes-kicker">
        상태 {variant.no} <span>/ 05</span>
      </div>
      <h2 className="notes-title">{variant.name}</h2>
      <p className="notes-summary">{variant.summary}</p>

      <div className="notes-block">
        <div className="side-label">AI에게 준 제약</div>
        <blockquote className="prompt">{variant.prompt}</blockquote>
      </div>

      <div className="notes-block">
        <div className="side-label">디자인 원칙</div>
        <ul className="bullets">
          {variant.principles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="notes-block">
        <div className="side-label">{variant.changesTitle}</div>
        <ol className="changes">
          {variant.changes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </div>

      <div className="notes-block">
        <div className="side-label">
          특성 비교
          {!isBaseline && (
            <span className="legend">
              <i /> 기본안 위치
            </span>
          )}
        </div>
        <div className="traits">
          {traitLabels.map((t) => (
            <div key={t.key} className="trait">
              <span>{t.label}</span>
              <Meter value={variant.traits[t.key]} base={baseline.traits[t.key]} showBase={!isBaseline} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
