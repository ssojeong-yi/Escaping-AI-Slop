import { designModes } from '../config/designModes.js';
import { validateSchema } from '../services/mockLayoutGenerator.js';
import { describeSchema } from '../lib/describeSchema.js';
import { REFERENCE_RULES, validateReferenceSchema } from '../services/referenceLayoutGenerator.js';

// 6단계: 참고 문서(design/banking/*.md)에서 읽어 반영한 것 + 원칙 검사
function ReferenceGeneration({ generation }) {
  const { reference, schema, count } = generation;
  const failed = validateReferenceSchema(schema);
  return (
    <section className="notes-sec gen-info">
      <h3>
        문서에서 읽어 반영한 것
        <span>생성 {count}</span>
      </h3>
      <dl className="ref-evidence">
        {reference.evidence.map((e) => (
          <div key={e.label}>
            <dt>{e.label}</dt>
            <dd title={e.source}>{e.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="ref-rules-head">
        금융앱 공통 원칙
        <span>
          {REFERENCE_RULES.length - failed.length}/{REFERENCE_RULES.length} 통과
        </span>
      </h3>
      <ul className="gen-rules">
        {REFERENCE_RULES.map((r) => (
          <li key={r.label} className={failed.includes(r.label) ? 'fail' : ''}>
            {r.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

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
      {generation?.reference && (
        <p className="ref-used">
          이번 생성에 참고한 디자인: <b>{generation.reference.name}</b>
          <span>
            {generation.reference.file} · {generation.cycle.position}/{generation.cycle.total}
          </span>
        </p>
      )}

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

      {generation &&
        (generation.reference ? (
          <ReferenceGeneration generation={generation} />
        ) : (
          <Generation variant={variant} generation={generation} />
        ))}
    </aside>
  );
}
