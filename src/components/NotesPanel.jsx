import { designModes } from '../config/designModes.js';
import { validateSchema } from '../services/mockLayoutGenerator.js';
import { describeSchema } from '../lib/describeSchema.js';

// 6단계: 참고 문서에서 가져온 구조 + 고정 디자인 시스템 + 품질 검사
function ReferenceGeneration({ generation }) {
  const { inspiration, quality, count, fallback, rejected } = generation;
  const passed = quality.results.filter((r) => r.pass).length;
  return (
    <section className="notes-sec gen-info">
      <h3>
        레퍼런스에서 가져온 구조
        <span>생성 {count}</span>
      </h3>
      <dl className="ref-evidence">
        {inspiration.notes.map((e) => (
          <div key={e.label}>
            <dt>{e.label}</dt>
            <dd title={e.source}>{e.value}</dd>
          </div>
        ))}
      </dl>
      {generation.theme && (
        <>
          <h3 className="ref-rules-head">레퍼런스에서 가져온 색</h3>
          <dl className="ref-evidence">
            {generation.theme.sources.map((e) => (
              <div key={e.label}>
                <dt>{e.label}</dt>
                <dd title={e.from}>{e.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <p className="gen-note">색만 레퍼런스를 따르고, 타이포 · 간격 · radius · 버튼 형태 · 아이콘 · 구분선은 Slop Bank 시스템 고정</p>
      <h3 className="ref-rules-head">
        품질 검사
        <span>
          {passed}/{quality.results.length} 통과
        </span>
      </h3>
      <ul className="gen-rules">
        {quality.results.map((r) => (
          <li key={r.id} className={r.pass ? '' : 'fail'}>
            {r.label}
          </li>
        ))}
      </ul>
      {(rejected.invalid > 0 || fallback) && (
        <p className="gen-note">
          {rejected.invalid > 0 && `검사 실패 후보 ${rejected.invalid}개 재생성`}
          {fallback && ' · 안전한 기본 배치 적용'}
        </p>
      )}
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
        <div className="ref-used">
          <p>
            참고 디자인 <b>{generation.reference.name}</b>
            <span className="ref-file">
              {generation.reference.file} · {generation.cycle.position}/{generation.cycle.total}
            </span>
          </p>
          {generation.theme && (
            <p className="ref-color">
              강조색
              <i style={{ background: generation.theme.primaryAccent }} />
              <b className="num">{generation.theme.primaryAccent}</b>
              {generation.theme.cta !== generation.theme.primaryAccent && (
                <>
                  <span>CTA</span>
                  <i style={{ background: generation.theme.cta }} />
                  <b className="num">{generation.theme.cta}</b>
                </>
              )}
            </p>
          )}
        </div>
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
