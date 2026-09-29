// 6단계 Final Generator:
// 참고 문서의 구조적 영감 + Slop Bank 고정 디자인 시스템 = 최종 금융앱 홈 schema.
// 바뀌는 것: 섹션 순서 일부, 강조할 계좌, grouping, 강조 방식, 참고 문서, 일부 정렬
// 바뀌지 않는 것: 컴포넌트 스타일, 버튼, radius, 타이포, 아이콘, 색 (finalDesignTokens)
import { finalDesignTokens as T } from './finalDesignTokens.js';
import { extractInspiration } from './finalInspiration.js';
import { runFinalQuality } from './finalQuality.js';
import { accounts, transactions } from '../data/finance.js';

const MAX_ATTEMPTS = 6;

// 행동 정의 (아이콘은 행동에만)
const ACTIONS = {
  send: { id: 'send', label: '송금', icon: 'send' },
  pay: { id: 'pay', label: 'QR 결제', icon: 'qr' },
  history: { id: 'history', label: '이체내역', icon: 'chart' },
  detail: { id: 'detail', label: '내역', icon: null },
};

function actionsFor(placement, rand) {
  if (placement === 'inAccount') return [{ ...ACTIONS.detail, variant: 'secondary' }, { ...ACTIONS.send, variant: 'primary' }];
  if (placement === 'actionRow')
    return [{ ...ACTIONS.send, variant: 'primary' }, { ...ACTIONS.pay, variant: 'secondary' }, { ...ACTIONS.history, variant: 'secondary' }];
  const second = rand() < 0.5 ? ACTIONS.pay : ACTIONS.history;
  return [{ ...ACTIONS.send, variant: 'primary' }, { ...second, variant: 'secondary' }];
}

/** 화면에 들어갈 컴포넌트 목록 (렌더러가 이 목록대로 그리고, 품질 검사도 이 목록을 본다) */
function inventory(layout, content) {
  const buttons = content.actions.map((a) => ({
    role: `button.${a.variant}`,
    variant: a.variant,
    radius: T.radius[T.buttonStyles[a.variant].radius],
    style: `btn-${a.variant}`,
  }));
  const rows = [
    ...content.accounts.map(() => ({ role: 'row.account', style: 'row-account' })),
    ...content.transactions.map(() => ({ role: 'row.tx', style: 'row-tx' })),
  ];
  const icons = [
    { context: 'status', size: T.iconRules.size.status }, // 알림
    ...content.actions.filter((a) => a.icon).map(() => ({ context: 'action', size: T.iconRules.size.action })),
    ...content.transactions.map(() => ({ context: 'txType', size: T.iconRules.size.txType })),
  ];
  const cards = layout.accountEmphasis === 'highlight' ? [{ role: 'interactionGroup' }] : [];
  const textLevels = ['display', 'amount', 'title', 'body', 'label', 'caption'];
  return { buttons, rows, icons, cards, textLevels };
}

function buildSchema(ref, insp, rand, attempt) {
  // 섹션 순서: 문서가 언급한 영역은 그 순서 그대로, 언급하지 않은 영역끼리만 바꿀 수 있다
  let zones = [...insp.zoneOrder];
  const free = zones.filter((z) => !insp.mentionedZones.includes(z) && !(insp.ctaPlacement === 'inAccount' && z === 'accounts'));
  if (free.length >= 2 && rand() < 0.5) {
    const [a, b] = free.slice(-2);
    const ia = zones.indexOf(a);
    const ib = zones.indexOf(b);
    [zones[ia], zones[ib]] = [zones[ib], zones[ia]];
  }
  // 소비 묶음: 카드 + 거래를 한 영역으로
  if (insp.spendGrouping === 'combined') {
    const first = zones.findIndex((z) => z === 'spend' || z === 'activity');
    zones = zones.filter((z) => z !== 'spend' && z !== 'activity');
    zones.splice(first, 0, 'spending');
  }

  // 2열 요약을 쓰면 카드 영역은 요약으로 올라간다
  if (insp.spendPresentation === 'grid') zones = zones.filter((z) => z !== 'spend');

  // 강조할 계좌: 입출금 또는 투자 계좌 중 하나, 나머지 하나를 같이 보여주고 그 외는 더보기
  const checking = accounts.find((a) => a.type === '입출금');
  const invest = accounts.find((a) => a.type === '투자');
  const highlight = rand() < 0.5 ? checking : invest;
  const other = highlight === checking ? invest : checking;
  const shownAccounts = [highlight, other].slice(0, T.limits.accounts);

  const layout = {
    zoneOrder: zones,
    ctaPlacement: insp.ctaPlacement,
    accountEmphasis: insp.accountEmphasis,
    spendGrouping: insp.spendGrouping,
    spendPresentation: insp.spendPresentation,
    whitespace: insp.whitespace,
    totalLayout: insp.totalLayout,
  };
  const content = {
    total: true,
    card: true,
    highlightAccount: highlight.id,
    accounts: shownAccounts.map((a) => a.id),
    hiddenAccounts: accounts.length - shownAccounts.length,
    transactions: transactions.slice(0, T.limits.transactions).map((t) => t.id),
    hiddenTransactions: Math.max(0, transactions.length - T.limits.transactions),
    actions: actionsFor(insp.ctaPlacement, rand),
  };
  return {
    kind: 'finalHome',
    id: `final-${ref.id}-${Date.now().toString(36)}-${attempt}-${Math.floor(rand() * 1e6)}`,
    refId: ref.id,
    refName: ref.name,
    refFile: ref.file,
    layout,
    content,
    components: inventory(layout, content),
    bottomNav: true,
  };
}

/** 검사를 모두 통과하는 기본 배치 (재생성이 계속 실패할 때만 사용) */
function safeFallback(ref) {
  const insp = {
    zoneOrder: ['accounts', 'spend', 'activity'],
    mentionedZones: ['accounts', 'spend', 'activity'],
    ctaPlacement: 'inAccount',
    accountEmphasis: 'highlight',
    spendGrouping: 'separate',
    spendPresentation: 'zone',
    whitespace: 'regular',
    totalLayout: 'solo',
  };
  return buildSchema(ref, insp, () => 0.1, 'fallback');
}

export function generateFinalLayoutFromDesign(reference, { rand = Math.random } = {}) {
  const insp = extractInspiration(reference);
  let failedAttempts = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const schema = buildSchema(reference, insp, rand, attempt);
    const quality = runFinalQuality(schema);
    if (quality.pass) {
      return { schema, inspiration: insp, quality, attempts: attempt, fallback: false, rejected: { invalid: failedAttempts, similar: 0 } };
    }
    failedAttempts++;
  }
  const schema = safeFallback(reference);
  return { schema, inspiration: insp, quality: runFinalQuality(schema), attempts: MAX_ATTEMPTS, fallback: true, rejected: { invalid: failedAttempts, similar: 0 } };
}
