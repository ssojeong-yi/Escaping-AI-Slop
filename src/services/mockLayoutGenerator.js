// 규칙 기반 mock generator.
// designModes 의 선택지 안에서만 값을 골라 UI schema를 조합하고,
// 원칙(rules) 검사와 직전 결과와의 유사도 검사를 통과한 schema만 돌려준다.
// HTML은 만들지 않는다. 렌더링은 SchemaScreen 컴포넌트가 schema를 읽어서 한다.

import { designModes, SECTION_TYPES } from '../config/designModes.js';

const MAX_ATTEMPTS = 40;
const MIN_DISTANCE = 4; // 직전 결과와 최소 이만큼의 속성이 달라야 새 결과로 인정

// 시드 기반 난수 (같은 seed → 같은 schema, 재현·디버깅용)
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rand) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const COMPACT_VARIANT = 'compact';

/** mode 규칙 → schema 한 개 (검사 전) */
export function buildSchema(modeKey, seed) {
  const mode = designModes[modeKey];
  const rand = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  const variants = Object.fromEntries(SECTION_TYPES.map((t) => [t, pick(mode.sections[t])]));

  // 1) 순서: 총자산은 항상 첫 줄(사용성). 나머지 4개는 섞는다.
  let rest = shuffle(SECTION_TYPES.slice(1), rand);

  // 2) 줄(row) 구성: 한 줄에 1개 또는 2개(2열)
  const rows = [];
  const canPair = (t) => mode.pairable.includes(t);

  if (variants.assetSummary === COMPACT_VARIANT) {
    // 대표영역 분산: 총자산 타일 옆에 다른 요약을 나란히
    const partner = rest.find(canPair);
    rest = rest.filter((t) => t !== partner);
    variants[partner] = COMPACT_VARIANT;
    rows.push(['assetSummary', partner]);
  } else {
    rows.push(['assetSummary']);
  }

  const forcePair = mode.requirePairAfterBlock && variants.assetSummary === 'block';
  if (forcePair) {
    // 큰 총자산 다음 줄은 반드시 2열 요약 → 한 영역이 화면을 지배하지 않게
    const pair = mode.pairable.filter((t) => rest.includes(t)).slice(0, 2);
    pair.forEach((t) => (variants[t] = COMPACT_VARIANT));
    rest = rest.filter((t) => !pair.includes(t));
    rows.push(pair);
  }

  for (let i = 0; i < rest.length; i++) {
    const cur = rest[i];
    const next = rest[i + 1];
    if (next && canPair(cur) && canPair(next) && rand() < mode.pairChance) {
      variants[cur] = COMPACT_VARIANT;
      variants[next] = COMPACT_VARIANT;
      rows.push([cur, next]);
      i++;
    } else {
      rows.push([cur]);
    }
  }

  // 사용성 규칙: 송금은 상단 N줄 안
  if (mode.transferWithinRows) {
    const idx = rows.findIndex((r) => r.includes('transferAction'));
    if (idx >= mode.transferWithinRows) {
      const [row] = rows.splice(idx, 1);
      rows.splice(Math.min(2, rows.length), 0, row);
    }
  }

  // 강조 박스(callout): 허용된 mode에서만, 한 줄을 혼자 차지하는 섹션 하나에만
  let callout = null;
  if (mode.calloutable && rand() < mode.calloutChance) {
    const candidates = rows.filter((r) => r.length === 1 && mode.calloutable.includes(r[0])).map((r) => r[0]);
    if (candidates.length) callout = pick(candidates);
  }

  const schema = {
    id: `${modeKey}-${seed.toString(16)}`,
    mode: modeKey,
    skin: mode.skin,
    seed,
    header: pick(mode.header),
    container: pick(mode.container),
    alignment: pick(mode.alignment),
    density: pick(mode.density),
    dividerStyle: pick(mode.dividerStyle),
    iconUsage: pick(mode.iconUsage),
    titleScale: pick(mode.titleScale),
    numberWeight: pick(mode.numberWeight),
    assetEmphasis: pick(mode.assetEmphasis),
    accentStyle: pick(mode.accentStyle ?? ['fill', 'outline']),
    heroTone: pick(mode.heroTone),
    quickMenu: pick(mode.quickMenu),
    labelColumn: pick(mode.labelColumn),
    numberedTitles: pick(mode.numberedTitles),
    txSummary: rand() < 0.5,
    callout,
    rows,
    sections: rows.flat().map((type) => ({ id: type, type, variant: variants[type] })),
  };
  schema.sectionOrder = schema.sections.map((s) => s.type);
  schema.layoutStyle = rows.some((r) => r.length > 1) ? 'mixed' : 'single';
  return schema;
}

/** 원칙 검사: 실패한 규칙 목록 (빈 배열이면 통과) */
export function validateSchema(schema) {
  return designModes[schema.mode].rules.filter((r) => !r.test(schema)).map((r) => r.label);
}

const COMPARE_KEYS = [
  'header', 'alignment', 'density', 'dividerStyle', 'iconUsage', 'titleScale',
  'numberWeight', 'assetEmphasis', 'accentStyle', 'heroTone', 'quickMenu', 'labelColumn', 'numberedTitles', 'txSummary',
  'container', 'callout',
];

/** 두 schema가 얼마나 다른지 (다른 속성 수). 순서·줄 구성·섹션 표현은 2점씩 */
export function schemaDistance(a, b) {
  if (!a || !b) return Infinity;
  let d = COMPARE_KEYS.filter((k) => a[k] !== b[k]).length;
  if (a.sectionOrder.join() !== b.sectionOrder.join()) d += 2;
  if (a.rows.map((r) => r.length).join() !== b.rows.map((r) => r.length).join()) d += 2;
  d += 2 * a.sections.filter((s) => b.sections.find((x) => x.type === s.type).variant !== s.variant).length;
  return d;
}

/** 구조가 완전히 같으면(순서·줄·섹션 표현) 속성만 바뀌어도 "비슷함"으로 본다 */
function tooSimilar(a, b) {
  if (!b) return false;
  const sameStructure =
    a.sectionOrder.join() === b.sectionOrder.join() &&
    a.rows.map((r) => r.length).join() === b.rows.map((r) => r.length).join() &&
    a.sections.every((s) => b.sections.find((x) => x.type === s.type).variant === s.variant);
  return sameStructure || schemaDistance(a, b) < MIN_DISTANCE;
}

let seedCounter = 0;
const nextSeed = () => ((Date.now() & 0xffff) * 65536 + ((seedCounter += 7919) & 0xffff)) >>> 0;

/**
 * 현재 mode의 규칙으로 새 UI schema를 만든다.
 * @returns {{ schema, attempts, rejected: { invalid: number, similar: number } }}
 */
export function generateMockBankingLayout(modeKey, { previous = null } = {}) {
  const rejected = { invalid: 0, similar: 0 };
  let fallback = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const schema = buildSchema(modeKey, nextSeed());
    if (validateSchema(schema).length) {
      rejected.invalid++;
      continue;
    }
    fallback = schema;
    if (tooSimilar(schema, previous)) {
      rejected.similar++;
      continue;
    }
    return { schema, attempts: attempt, rejected };
  }
  // 선택지가 적은 mode에서 드물게 도달: 원칙은 지킨 마지막 결과를 쓴다
  return { schema: fallback, attempts: MAX_ATTEMPTS, rejected };
}
