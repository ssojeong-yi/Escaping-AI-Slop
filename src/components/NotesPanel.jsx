import { designModes } from '../config/designModes.js';
import { validateSchema } from '../services/mockLayoutGenerator.js';
import { describeSchema } from '../lib/describeSchema.js';

// 생성 결과: 원칙 통과 여부와 직전 결과에서 바뀐 점만 짧게
function Generation({ variant, generation }) {
  const { schema, previous, rejected, count } = generation;
  const failed = validateSchema(schema);
  const rules = designModes[variant.modeKey].rules;
  const now = describeSchema(schema);
  const before = previous ? Object.fromEntries(describeSchema(previous).map((r) => [r.key, r.value])) : null;
  const changed = before ? now.filter((r) => before[r.key] !== r.value).map((r) => r.label) : [];

  return (
    <section className="notes-sec gen-info">
      <h3>
        생성 결과 {count}
        <span>
          원칙 {rules.length - failed.length}/{rules.length} 통과
        </span>
      </h3>
      <ul className="gen-rules">
        {rules.map((r) => (
          <li key={r.label} className={failed.includes(r.label) ? 'fail' : ''}>
            {r.label}
          </li>
        ))}
      </ul>
      {changed.length > 0 && (
        <p className="gen-changed">
          <b>직전 결과와 다른 점</b>
          {changed.join(' · ')}
        </p>
      )}
      {rejected.similar > 0 && <p className="gen-note">직전 결과와 비슷한 후보 {rejected.similar}개는 버림</p>}
    </section>
  );
}

export default function NotesPanel({ variant, generation }) {
  return (
    <aside className="notes">
      <div className="notes-no">{variant.no}</div>
      <h2 className="notes-title">{variant.name}</h2>
      <p className="notes-line">{variant.line}</p>

      <section className="notes-sec conditions">
        <h3>{variant.conditionsTitle ?? '기본안 대비 바꾼 것'}</h3>
        {variant.conditions.length ? (
          <ul>
            {variant.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="conditions-none">추가 조건 없음 — 다른 단계의 비교 기준</p>
        )}
        {variant.allowed && <p className="conditions-allowed">허용 · {variant.allowed.join(' · ')}</p>}
      </section>

      {generation && <Generation variant={variant} generation={generation} />}
    </aside>
  );
}
