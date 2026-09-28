// 디자인 상태(mode)별 생성 규칙.
// - 각 배열 = generator가 고를 수 있는 선택지 (여기 없는 값은 절대 생성되지 않는다)
// - rules = 생성된 schema가 반드시 통과해야 하는 핵심 원칙 (통과 못 하면 다시 생성)
//
// 섹션 타입: assetSummary · accountList · transferAction · cardSpend · recentTransactions

export const SECTION_TYPES = ['assetSummary', 'accountList', 'transferAction', 'cardSpend', 'recentTransactions'];

const sec = (s, type) => s.sections.find((x) => x.type === type);
const rowOf = (s, type) => s.rows.findIndex((r) => r.includes(type));
// 컨테이너(둥근 박스)로 그려지는 섹션 수
const boxedCount = (s) =>
  s.container !== 'none'
    ? s.sections.length
    : s.sections.filter((x) => ['hero', 'box', 'tiles'].includes(x.variant)).length;

export const designModes = {
  baseline: {
    label: '기본안',
    skin: 'baseline',
    header: ['brand', 'brandGreeting'],
    container: ['card'],
    alignment: ['left', 'center'],
    density: ['comfortable', 'regular'],
    dividerStyle: ['none'],
    iconUsage: ['decorative'],
    titleScale: ['md', 'lg'],
    numberWeight: ['bold'],
    assetEmphasis: ['hero'],
    heroTone: ['blue', 'navy', 'violet'],
    quickMenu: [true, false],
    labelColumn: [false],
    numberedTitles: [false],
    pairable: ['cardSpend', 'transferAction'],
    pairChance: 0.5,
    sections: {
      assetSummary: ['hero'],
      accountList: ['rows', 'tiles'],
      transferAction: ['avatars', 'buttonRow'],
      cardSpend: ['bar'],
      recentTransactions: ['flat', 'grouped'],
    },
    rules: [
      { label: '큰 Hero 영역 사용', test: (s) => sec(s, 'assetSummary').variant === 'hero' },
      { label: '둥근 카드 컨테이너 사용', test: (s) => s.container === 'card' },
      { label: '색상 아이콘 사용', test: (s) => s.iconUsage === 'decorative' },
    ],
  },

  reducedCards: {
    label: '카드 최소화',
    skin: 'reducedCards',
    header: ['brand', 'brandGreeting'],
    container: ['none'],
    alignment: ['left', 'center'],
    density: ['comfortable', 'regular', 'compact'],
    dividerStyle: ['hairline', 'band', 'space'],
    iconUsage: ['decorative', 'functional'],
    titleScale: ['md', 'lg'],
    numberWeight: ['bold', 'regular'],
    assetEmphasis: ['large', 'medium'],
    heroTone: [null],
    quickMenu: [true, false],
    labelColumn: [false],
    numberedTitles: [false],
    pairable: ['cardSpend', 'transferAction'],
    pairChance: 0.35,
    sections: {
      assetSummary: ['block'],
      accountList: ['rows'],
      transferAction: ['avatars', 'buttonRow', 'list'],
      cardSpend: ['bar', 'breakdown'],
      recentTransactions: ['flat', 'grouped'],
    },
    rules: [
      { label: '둥근 카드 컨테이너 없음', test: (s) => boxedCount(s) === 0 },
      { label: '구분은 여백·구분선으로', test: (s) => ['hairline', 'band', 'space'].includes(s.dividerStyle) },
      { label: '총자산에 박스 없음', test: (s) => sec(s, 'assetSummary').variant === 'block' },
    ],
  },

  typographyFirst: {
    label: '타이포그래피 중심',
    skin: 'typographyFirst',
    header: ['greeting', 'brand'],
    container: ['none'],
    alignment: ['left', 'center'],
    density: ['comfortable', 'regular'],
    dividerStyle: ['rule', 'hairline'],
    iconUsage: ['none'],
    titleScale: ['sm', 'lg'],
    numberWeight: ['light', 'regular'],
    assetEmphasis: ['xl', 'large'],
    heroTone: [null],
    quickMenu: [false],
    labelColumn: [false],
    numberedTitles: [true, false],
    pairable: [],
    pairChance: 0,
    sections: {
      assetSummary: ['block'],
      accountList: ['rows', 'bigNumber'],
      transferAction: ['textLink', 'list'],
      cardSpend: ['sentence', 'bar'],
      recentTransactions: ['grouped', 'flat'],
    },
    rules: [
      { label: '장식 아이콘 없음', test: (s) => s.iconUsage === 'none' },
      { label: '박스·배경색 없음', test: (s) => boxedCount(s) === 0 },
      { label: '총자산을 글자 크기로 강조', test: (s) => ['xl', 'large'].includes(s.assetEmphasis) },
    ],
  },

  distributedFocus: {
    label: '대표영역 분산',
    skin: 'distributedFocus',
    header: ['date', 'brand'],
    container: ['tile'],
    alignment: ['left'],
    density: ['regular', 'compact'],
    dividerStyle: ['hairline'],
    iconUsage: ['functional', 'decorative'],
    titleScale: ['sm', 'md'],
    numberWeight: ['bold', 'regular'],
    assetEmphasis: ['medium'],
    heroTone: [null],
    quickMenu: [false],
    labelColumn: [false],
    numberedTitles: [false],
    pairable: ['cardSpend', 'transferAction'],
    pairChance: 0.6,
    sections: {
      assetSummary: ['compact', 'strip'],
      accountList: ['rows', 'tiles'],
      transferAction: ['buttonRow', 'list'],
      cardSpend: ['bar'],
      recentTransactions: ['flat', 'grouped'],
    },
    rules: [
      { label: '큰 Hero 영역 없음', test: (s) => ['compact', 'strip'].includes(sec(s, 'assetSummary').variant) },
      {
        label: '첫 줄에 2개 이상 정보 병렬',
        test: (s) => s.rows[0].length > 1 || sec(s, 'assetSummary').variant === 'strip',
      },
      { label: '요약 금액 크기 통일', test: (s) => s.assetEmphasis === 'medium' },
    ],
  },

  informationFirst: {
    label: '정보 중심 배치',
    skin: 'informationFirst',
    header: ['dateline'],
    container: ['none'],
    alignment: ['left'],
    density: ['regular', 'compact'],
    dividerStyle: ['rule', 'hairline'],
    iconUsage: ['none'],
    titleScale: ['sm', 'md'],
    numberWeight: ['bold', 'regular'],
    assetEmphasis: ['medium', 'small'],
    heroTone: [null],
    quickMenu: [false],
    labelColumn: [true, false],
    numberedTitles: [false, true],
    pairable: ['cardSpend', 'transferAction'],
    pairChance: 0.3,
    sections: {
      assetSummary: ['inline', 'strip'],
      accountList: ['table', 'rows'],
      transferAction: ['list'],
      cardSpend: ['breakdown', 'bar'],
      recentTransactions: ['ledger', 'grouped'],
    },
    rules: [
      { label: '카드 컨테이너 없음', test: (s) => boxedCount(s) === 0 },
      { label: '선 기반 구분', test: (s) => ['rule', 'hairline'].includes(s.dividerStyle) },
      { label: '장식 아이콘 없음', test: (s) => s.iconUsage === 'none' },
    ],
  },

  final: {
    label: '최종안',
    skin: 'final',
    header: ['brand', 'date'],
    container: ['none'],
    alignment: ['left'],
    density: ['regular', 'compact'],
    dividerStyle: ['hairline', 'rule'],
    iconUsage: ['functional'],
    titleScale: ['md', 'sm'],
    numberWeight: ['bold'],
    assetEmphasis: ['large', 'medium'],
    heroTone: [null],
    quickMenu: [false],
    labelColumn: [false],
    numberedTitles: [false],
    pairable: ['cardSpend', 'transferAction'],
    pairChance: 0.4,
    requirePairAfterBlock: true,
    transferWithinRows: 3,
    sections: {
      assetSummary: ['block', 'strip'],
      accountList: ['rows', 'table'],
      transferAction: ['box', 'list', 'buttonRow'],
      cardSpend: ['bar', 'breakdown'],
      recentTransactions: ['grouped', 'ledger', 'flat'],
    },
    rules: [
      { label: '박스는 최대 1개', test: (s) => boxedCount(s) <= 1 },
      {
        label: '대표영역 분산',
        test: (s) => sec(s, 'assetSummary').variant === 'strip' || (s.rows[1] && s.rows[1].length > 1),
      },
      { label: '행동 아이콘만 사용', test: (s) => s.iconUsage === 'functional' },
      { label: '송금은 상단 3줄 안', test: (s) => rowOf(s, 'transferAction') < 3 },
    ],
  },
};
