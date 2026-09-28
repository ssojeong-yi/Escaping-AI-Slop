export default function NotesPanel({ variant, total }) {
  return (
    <aside className="notes">
      <div className="notes-kicker">
        {variant.no} <span>/ {String(total).padStart(2, '0')}</span>
      </div>
      <h2 className="notes-title">{variant.name}</h2>
      <p className="notes-line">{variant.line}</p>

      <div className={`conditions${variant.final ? ' final' : ''}`}>
        <div className="side-label">{variant.conditionsTitle ?? '이번 단계에서 추가된 조건'}</div>
        {variant.conditions.length ? (
          <ul>
            {variant.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="conditions-none">추가 조건 없음</p>
        )}
      </div>

      <div className="points">
        <div className="side-label">화면에서 볼 곳</div>
        <ol>
          {variant.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
