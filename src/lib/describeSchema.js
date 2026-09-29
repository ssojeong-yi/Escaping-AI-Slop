// schema → 발표 패널에 보여줄 한국어 요약.
const SECTION_NAMES = {
  assetSummary: '총자산',
  accountList: '계좌',
  transferAction: '송금',
  cardSpend: '카드',
  recentTransactions: '거래',
};

const VALUE_NAMES = {
  alignment: { left: '왼쪽', center: '가운데' },
  density: { comfortable: '여유', regular: '보통', compact: '촘촘' },
  dividerStyle: { none: '없음 (카드)', hairline: '얇은 선', rule: '굵은 선', band: '면 구분', space: '여백만' },
  iconUsage: { decorative: '장식 포함', functional: '행동만', none: '없음' },
  titleScale: { sm: '작게', md: '보통', lg: '크게' },
  numberWeight: { light: '가늘게', regular: '보통', bold: '굵게' },
  assetEmphasis: { hero: 'Hero 카드', xl: '아주 큰 숫자', large: '큰 숫자', medium: '중간 숫자', small: '작은 숫자' },
};

const SECTION_SHORT = { accountList: '계좌', transferAction: '송금', cardSpend: '카드', recentTransactions: '거래' };

function containerLabel(schema) {
  if (schema.container === 'card') return '카드';
  if (schema.container === 'tile') return '타일(카드)';
  return schema.callout ? `없음 + 강조 박스 1개 (${SECTION_SHORT[schema.callout]})` : '없음';
}

export function describeSchema(schema) {
  const order = schema.rows.map((r) => r.map((t) => SECTION_NAMES[t]).join('+')).join(' → ');
  const n = (key) => VALUE_NAMES[key][schema[key]];
  return [
    { key: 'order', label: '섹션 순서', value: order },
    { key: 'layout', label: '구조', value: schema.layoutStyle === 'mixed' ? '1열 + 2열' : '1열' },
    { key: 'container', label: '카드 사용', value: containerLabel(schema) },
    { key: 'assetEmphasis', label: '총자산 강조', value: n('assetEmphasis') },
    { key: 'alignment', label: '정렬', value: n('alignment') },
    { key: 'density', label: '밀도', value: n('density') },
    { key: 'dividerStyle', label: '구분', value: schema.container === 'none' ? n('dividerStyle') : '카드 간격' },
    { key: 'iconUsage', label: '아이콘', value: n('iconUsage') },
    { key: 'titleScale', label: '제목 크기', value: n('titleScale') },
    { key: 'numberWeight', label: '숫자 굵기', value: n('numberWeight') },
    ...(schema.tokens ? [{ key: 'radius', label: 'Radius', value: `${schema.tokens.radius}px` }] : []),
  ];
}
