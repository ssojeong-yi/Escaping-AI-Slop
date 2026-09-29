// 디자인 프로필(design/banking/*.md 파싱 결과) → 최종안 화면 schema.
// 구조(섹션 순서, 대표 계좌·송금·거래 표현, 섹션 구분, 밀도, 버튼 방식)는 프로필이 정하고,
// 같은 문서 안에서의 변주는 작게만 준다(헤더 정보, 카드 상세, 거래 묶음, 문서가 언급하지 않은 섹션 순서).

const UNIT_OF = { accountList: 'others', transferAction: 'transfer', cardSpend: 'card', recentTransactions: 'tx' };

/** 금융앱으로서 항상 지키는 기능 구조 + 과한 표현 금지 */
export const REFERENCE_RULES = [
  { label: '금융앱 기본 정보 모두 포함', test: (s) => ['others', 'transfer', 'card', 'tx'].every((u) => s.order.includes(u)) && s.bottomNav },
  { label: '대표 계좌와 송금 버튼이 상단에', test: (s) => s.primary.hasSend },
  { label: '거대한 Hero 카드 없음', test: (s) => s.total.boxed === false },
  { label: '박스는 최대 1개', test: (s) => (s.primary.style === 'plain' ? 0 : 1) <= 1 },
  { label: '그림자 없음', test: (s) => s.tokens.shadow === 'none' },
  { label: 'Radius 12px 이하', test: (s) => s.tokens.radius <= 12 },
  { label: '브랜드 전용색 미사용', test: (s) => !s.excludedColors.includes(s.tokens.action) && !s.excludedColors.includes(s.tokens.accent) },
];

export function validateReferenceSchema(schema) {
  return REFERENCE_RULES.filter((r) => !r.test(schema)).map((r) => r.label);
}

let counter = 0;

export function generateFinalLayoutFromDesign(reference, { previous = null } = {}) {
  const rand = Math.random;
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  // 1) 순서: 대표 계좌 블록은 항상 맨 위. 그 아래는 문서의 Primary tasks 순서.
  const order = reference.priority.map((k) => UNIT_OF[k]);
  // 문서가 언급하지 않은 뒤쪽 섹션끼리만 순서를 바꿀 수 있다
  const mentionedUnits = reference.mentioned.map((k) => UNIT_OF[k]);
  const free = order.filter((u) => !mentionedUnits.includes(u));
  if (free.length >= 2 && rand() < 0.5) {
    const [a, b] = free.slice(-2);
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    [order[ia], order[ib]] = [order[ib], order[ia]];
  }

  // 2) 같은 문서 안의 작은 변주
  const txStyle = reference.txStyle === 'grouped' ? pick(['grouped', 'flat']) : reference.txStyle;
  const cardDetail = pick([true, false]);
  const headerMeta = pick(['bell', 'date']);

  counter += 1;
  const schema = {
    kind: 'reference',
    id: `ref-${reference.id}-${Date.now().toString(36)}-${counter}`,
    refId: reference.id,
    refName: reference.name,
    refFile: reference.file,
    tokens: { ...reference.tokens },
    excludedColors: reference.excludedColors,
    actionStyle: reference.actionStyle,
    density: reference.density,
    sectionStyle: reference.sectionStyle,
    listSquare: reference.listSquare,
    header: { meta: headerMeta, quickNav: reference.quickNav },
    total: { scale: reference.totalScale, boxed: false },
    primary: { style: reference.primaryStyle, hasSend: true },
    transfer: { style: reference.transferStyle },
    card: { detail: cardDetail },
    tx: { style: txStyle },
    order,
    bottomNav: true,
  };
  const failed = validateReferenceSchema(schema);
  return { schema, attempts: 1, rejected: { similar: 0, invalid: failed.length }, previous };
}
