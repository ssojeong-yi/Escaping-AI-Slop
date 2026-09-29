import { designModes } from '../config/designModes.js';
import { validateSchema } from '../services/mockLayoutGenerator.js';
import { describeSchema } from '../lib/describeSchema.js';

function Generation({ variant, generation }) {
  const { schema, previous, rejected, count } = generation;
  const failed = validateSchema(schema);
  const rules = designModes[variant.modeKey].rules;
  const rows = describeSchema(schema);
  const before = previous ? Object.fromEntries(describeSchema(previous).map((r) => [r.key, r.value])) : null;
  const retried = rejected.similar + rejected.invalid;

  return (
    <div className="gen-info">
      <div className="gen-head">
        <span className="side-label">생성 결과 #{count}</span>
        <span className="gen-seed">seed {schema.seed.toString(16).slice(-6)}</span>
      </div>
      {retried > 0 && (
        <p className="gen-retry">
          {rejected.similar > 0 && `직전 결과와 비슷해 ${rejected.similar}번 다시 생성`}
          {rejected.similar > 0 && rejected.invalid > 0 && ' · '}
          {rejected.invalid > 0 && `원칙 위반 ${rejected.invalid}건 제외`}
        </p>
      )}

      <ul className="gen-rules">
        {rules.map((r) => (
          <li key={r.label} className={failed.includes(r.label) ? 'fail' : ''}>
            {r.label}
          </li>
        ))}
      </ul>

      <dl className="gen-attrs">
        {rows.map((r) => {
          const changed = before && before[r.key] !== r.value;
          return (
            <div key={r.key} className={changed ? 'changed' : ''}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          );
        })}
      </dl>
      {before && <p className="gen-legend">● 직전 결과에서 바뀐 항목</p>}
    </div>
  );
}

export default function NotesPanel({ variant, total, generation }) {
  return (
    <aside className="notes">
      <div className="notes-kicker">
        {variant.no} <span>/ {String(total).padStart(2, '0')}</span>
      </div>
      <h2 className="notes-title">{variant.name}</h2>
      <p className="notes-line">{variant.line}</p>

      <div className={`conditions${variant.final ? ' final' : ''}`}>
        <div className="side-label">{variant.conditionsTitle ?? '기본안 대비 이 단계의 조건'}</div>
        {variant.conditions.length ? (
          <ul>
            {variant.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="conditions-none">추가 조건 없음</p>
        )}
        {variant.allowed && (
          <p className="conditions-allowed">
            <span>허용</span>
            {variant.allowed.join(' · ')}
          </p>
        )}
      </div>

      {generation ? (
        <Generation variant={variant} generation={generation} />
      ) : (
        <div className="points">
          <div className="side-label">화면에서 볼 곳</div>
          <ol>
            {variant.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      )}
    </aside>
  );
}
