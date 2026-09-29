// 디자인 상태(mode)별 생성 규칙.
// - 각 배열 = generator가 고를 수 있는 선택지 (여기 없는 값은 절대 생성되지 않는다)
// - rules = 생성된 schema가 반드시 통과해야 하는 핵심 원칙 (통과 못 하면 다시 생성)
//
// 2~5단계는 누적이 아니라 "기본안 + 제약 하나"의 독립 실험이다.
// - 각 mode는 자기 블록만 읽는다. 다른 mode의 선택지·규칙을 상속하거나 합치지 않는다.
// - 카드 금지는 reducedCards(2단계)에만 있다. 3·4·5단계는 container 선택지에 카드를 포함한다.
// - final(6단계)만 앞선 실험의 원칙을 골라 조합한다. 이 조합도 상속이 아니라 final 블록에 직접 적는다.
//
// 섹션 타입: assetSummary · accountList · transferAction · cardSpend · recentTransactions

export const SECTION_TYPES = ['assetSummary', 'accountList', 'transferAction', 'cardSpend', 'recentTransactions'];

const sec = (s, type) => s.sections.find((x) => x.type === type);
const rowOf = (s, type) => s.rows.findIndex((r) => r.includes(type));
// 컨테이너(둥근 박스)로 그려지는 섹션 수
const boxedCount = (s) =>
  s.container !== 'none'
    ? s.sections.length
    : s.sections.filter((x) => ['hero', 'box', 'tiles', 'primary', 'primaryInline'].includes(x.variant)).length + (s.callout ? 1 : 0);

export const designModes = {
  // 1단계: 추가 제약 없음.
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

  // 2단계: 카드 관련 제약은 이 단계에만 있다.
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

  // 3단계: 글자 크기·굵기·행간·여백으로 위계. 카드는 금지하지 않는다(필요하면 사용).
  typographyFirst: {
    label: '타이포그래피 중심',
    skin: 'typographyFirst',
    header: ['greeting', 'brand'],
    container: ['none', 'card'],
    alignment: ['left', 'center'],
    density: ['comfortable', 'regular'],
    dividerStyle: ['rule', 'hairline'],
    iconUsage: ['none', 'functional'],
    titleScale: ['sm', 'lg'],
    numberWeight: ['light', 'regular'],
    assetEmphasis: ['xl', 'large'],
    accentStyle: ['text'],
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
      { label: '총자산을 글자 크기로 강조', test: (s) => ['xl', 'large'].includes(s.assetEmphasis) && sec(s, 'assetSummary').variant === 'block' },
      { label: '색보다 타이포그래피 우선', test: (s) => s.accentStyle === 'text' },
      { label: '장식 아이콘 없음', test: (s) => s.iconUsage !== 'decorative' },
    ],
  },

  // 4단계: 큰 대표영역(Hero) 제거 + 정보 균형 배치. 카드(타일) 사용 가능.
  distributedFocus: {
    label: '대표영역 분산',
    skin: 'distributedFocus',
    header: ['date', 'brand'],
    container: ['tile', 'none'],
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

  // 5단계: 전형적 금융앱 구조 대신 잡지·정보 페이지처럼. 카드는 필요하면 1개까지, 반복 구조는 금지.
  informationFirst: {
    label: '정보 중심 배치',
    skin: 'informationFirst',
    header: ['dateline'],
    container: ['none'],
    alignment: ['left'],
    density: ['regular', 'compact'],
    dividerStyle: ['rule', 'hairline'],
    iconUsage: ['none', 'functional'],
    titleScale: ['sm', 'md'],
    numberWeight: ['bold', 'regular'],
    assetEmphasis: ['medium', 'small'],
    heroTone: [null],
    quickMenu: [false],
    labelColumn: [true, false],
    numberedTitles: [false, true],
    pairable: ['cardSpend', 'transferAction'],
    pairChance: 0.3,
    // 강조 박스(callout): 정보 하나를 박스로 띄울 수 있다. 최대 1개라 카드 반복이 되지 않는다.
    calloutable: ['cardSpend', 'transferAction', 'accountList'],
    calloutChance: 0.5,
    sections: {
      assetSummary: ['inline', 'strip'],
      accountList: ['table', 'rows'],
      transferAction: ['list'],
      cardSpend: ['breakdown', 'bar'],
      recentTransactions: ['ledger', 'grouped'],
    },
    rules: [
      { label: '카드 반복 구조 없음 (박스 최대 1개)', test: (s) => boxedCount(s) <= 1 },
      {
        label: '전형적 금융앱 구조 탈피',
        test: (s) =>
          sec(s, 'assetSummary').variant !== 'hero' &&
          (s.labelColumn || sec(s, 'accountList').variant === 'table' || sec(s, 'recentTransactions').variant === 'ledger'),
      },
      { label: '선·여백 기반 구분', test: (s) => ['rule', 'hairline'].includes(s.dividerStyle) },
      { label: '장식 아이콘 없음', test: (s) => s.iconUsage !== 'decorative' },
    ],
  },

  // 6단계 최종안: "금융앱인데 기존 AI 결과와는 다른" 화면.
  // 금융앱 기본 UX(총자산 → 대표 계좌·송금 → 카드·거래 → 하단 탭)는 고정하고,
  // AI 평균 패턴(카드 반복, 큰 radius, gradient·shadow, 장식 아이콘, 거대한 Hero)만 배제한다.
  // 다른 실험 탭과 달리 순서·표현의 변화 폭을 좁게 둔다. (2~5단계 설정을 상속하지 않고 여기 직접 적는다)
  final: {
    label: '최종안',
    skin: 'final',
    header: ['brand'],
    container: ['none'],
    alignment: ['left'],
    density: ['regular', 'compact'],
    dividerStyle: ['band', 'hairline'],
    iconUsage: ['functional'],
    titleScale: ['md'],
    numberWeight: ['bold'],
    assetEmphasis: ['large', 'medium'],
    accentStyle: ['fill'],
    heroTone: [null],
    quickMenu: [false],
    labelColumn: [false],
    numberedTitles: [false],
    pairable: [],
    pairChance: 0,
    // 총자산 다음 순서. 대표 계좌·송금은 항상 바로 이어지고, 카드·거래 순서만 바뀐다.
    orders: [
      ['accountList', 'transferAction', 'cardSpend', 'recentTransactions'],
      ['accountList', 'transferAction', 'recentTransactions', 'cardSpend'],
    ],
    // 디자인 토큰: design/ 참고 문서(국내 은행 7곳) 공통 원칙 — 그림자 없음, 작고 역할별인 radius.
    // 렌더러가 이 값으로 그리고, 아래 rules가 같은 값을 검사한다.
    tokens: {
      radius: [6, 8], // 박스·버튼 (칩은 radius - 2, 목록·막대는 0)
      shadow: ['none'],
    },
    // 송금(최근 보낸 사람)은 대표 계좌 박스 바로 아래, 다른 계좌보다 먼저 그린다
    embedTransferInAccount: true,
    // 앞 섹션과 한 묶음으로 붙여 그리는 쌍 (사이에 구분선·면 구분을 넣지 않는다)
    joins: [
      ['assetSummary', 'accountList'],
      ['accountList', 'transferAction'],
    ],
    sections: {
      assetSummary: ['total'],
      accountList: ['primary', 'primaryInline'],
      transferAction: ['chips'],
      cardSpend: ['bar', 'barCategories'],
      recentTransactions: ['grouped', 'flat'],
    },
    rules: [
      { label: '거대한 Hero 카드 없음', test: (s) => sec(s, 'assetSummary').variant === 'total' },
      { label: '박스는 대표 계좌 1곳만', test: (s) => boxedCount(s) <= 1 },
      {
        label: '금융앱 기본 흐름 유지',
        test: (s) => s.sectionOrder[0] === 'assetSummary' && s.sectionOrder[1] === 'accountList' && s.sectionOrder[2] === 'transferAction',
      },
      { label: '아이콘은 행동·상태에만', test: (s) => s.iconUsage === 'functional' },
      { label: '강조색 1개', test: (s) => s.accentStyle === 'fill' && s.skin === 'final' },
      { label: '그림자 없음', test: (s) => s.tokens?.shadow === 'none' },
      { label: 'Radius 8px 이하', test: (s) => s.tokens?.radius <= 8 },
    ],
  },
};
