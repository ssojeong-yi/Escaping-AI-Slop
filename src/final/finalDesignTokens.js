// Slop Bank 최종안 디자인 시스템 — 6단계 전용, 재생성해도 절대 바뀌지 않는다.
// 렌더러(FinalHomeScreen)는 이 파일의 값만 읽고, 품질 검사(finalQuality)도 같은 값으로 검사한다.
// 참고 문서(design/banking/*.md)는 여기 값을 바꾸지 못한다. 문서는 구조·우선순위의 영감으로만 쓴다.

export const finalDesignTokens = {
  colors: {
    canvas: '#FFFFFF',
    ink: '#14171A', // 제목·금액
    sub: '#5F656D', // 본문 보조
    muted: '#979DA5', // 캡션·메타
    line: '#ECEEF0', // 행 구분
    band: '#F4F5F6', // 섹션 구분 면
    accent: '#0B7A5C', // 유일한 강조색 (Slop Bank mint 계열의 진한 톤)
    accentSoft: '#E8F4EF',
    onAccent: '#FFFFFF',
  },

  // 역할별 글자 단계. 크기·굵기·자간은 이 표 밖의 값을 쓰지 않는다.
  typography: {
    display: { size: 30, weight: 700, tracking: -1.0, lineHeight: 1.15 }, // 총자산
    amount: { size: 22, weight: 700, tracking: -0.6, lineHeight: 1.2 }, // 계좌·카드 금액
    title: { size: 17, weight: 700, tracking: -0.4, lineHeight: 1.3 }, // 섹션 제목
    body: { size: 15, weight: 500, tracking: -0.2, lineHeight: 1.4 }, // 목록 이름
    label: { size: 14, weight: 500, tracking: -0.2, lineHeight: 1.4 }, // 버튼·링크
    caption: { size: 12.5, weight: 400, tracking: 0, lineHeight: 1.4 }, // 보조 정보
    unitWeight: 500, // 금액 뒤 "원"
  },
  weights: [400, 500, 700],

  spacing: [4, 8, 12, 16, 20, 24, 32],
  layout: {
    gutter: 20,
    // 여백 밀도는 spacing 값 안에서만 고른다
    whitespace: {
      regular: { sectionGap: 24, row: 12 },
      airy: { sectionGap: 32, row: 14 },
    },
  },

  radius: { control: 8, group: 8, chip: 6, tag: 2, list: 0, meter: 0 },

  iconRules: {
    stroke: 1.8,
    size: { action: 18, txType: 18, status: 22, nav: 22, link: 14 }, // link: 더보기 › 표시 (개수 제한에서 제외)
    // 아이콘은 이 맥락에서만. 제목 앞·숫자 옆·장식 금지
    allowed: ['action', 'txType', 'status', 'nav'],
    maxPerScreen: 8, // 하단 탭 제외
  },

  buttonStyles: {
    primary: { height: 44, radius: 'control', fill: 'accent', text: 'onAccent', weight: 700 },
    secondary: { height: 44, radius: 'control', border: 'line', text: 'ink', weight: 700 },
  },

  dividerStyles: {
    section: { kind: 'band', size: 8, color: 'band' }, // 섹션 사이
    row: { kind: 'hairline', size: 1, color: 'line' }, // 목록 행 사이
  },

  cardRules: {
    // 카드는 상호작용 가능한 기능 묶음에만 (예: 대표 계좌 + 송금 버튼)
    allowedRoles: ['interactionGroup'],
    maxPerScreen: 1,
    border: 'line',
    radius: 'group',
    shadow: 'none',
  },

  bottomNav: { mode: 'icon', active: 'ink' },

  // 첫 화면 정보량 상한
  limits: { accounts: 2, transactions: 3, actionsMin: 2, actionsMax: 3, primaryCta: 1 },
};

/** 토큰 → CSS 변수 (렌더러 루트에 inline style로 넣는다) */
export function tokenCssVars(t = finalDesignTokens) {
  const c = t.colors;
  const ty = t.typography;
  const vars = {
    '--f-canvas': c.canvas,
    '--f-ink': c.ink,
    '--f-sub': c.sub,
    '--f-muted': c.muted,
    '--f-line': c.line,
    '--f-band': c.band,
    '--f-accent': c.accent,
    '--f-accent-soft': c.accentSoft,
    '--f-on-accent': c.onAccent,
    '--f-gutter': `${t.layout.gutter}px`,
    '--f-r-control': `${t.radius.control}px`,
    '--f-r-group': `${t.radius.group}px`,
    '--f-r-chip': `${t.radius.chip}px`,
    '--f-r-tag': `${t.radius.tag}px`,
    '--f-btn-h': `${t.buttonStyles.primary.height}px`,
    '--f-btn-weight': t.buttonStyles.primary.weight,
    '--f-band-size': `${t.dividerStyles.section.size}px`,
    '--f-unit-w': ty.unitWeight,
    '--tab-active': c.ink,
    '--tab-idle': '#A7ACB2',
  };
  for (const [role, v] of Object.entries(ty)) {
    if (typeof v !== 'object') continue;
    vars[`--f-${role}-size`] = `${v.size}px`;
    vars[`--f-${role}-weight`] = v.weight;
    vars[`--f-${role}-track`] = `${v.tracking}px`;
    vars[`--f-${role}-lh`] = v.lineHeight;
  }
  return vars;
}
