// 참고 문서 프로필(designParser 결과) → 구조적 영감만 추출.
// 가져오는 것: 정보 우선순위, CTA 배치, grouping, 여백, 계좌 강조 방식, 총자산 배치.
// 가져오지 않는 것: 색, radius, 폰트, 버튼·아이콘 스타일 (→ finalDesignTokens 고정값을 쓴다)

const ZONE_OF = { accountList: 'accounts', cardSpend: 'spend', recentTransactions: 'activity' };

export function extractInspiration(ref) {
  const notes = [];
  const note = (label, value, source) => notes.push({ label, value, source });

  // 1) 정보 우선순위: 문서의 Primary tasks 순서 (송금은 영역이 아니라 CTA로 처리)
  const zoneOrder = ref.priority.map((k) => ZONE_OF[k]).filter(Boolean);
  const mentionedZones = ref.mentioned.map((k) => ZONE_OF[k]).filter(Boolean);
  const zoneName = { accounts: '계좌', spend: '카드 소비', activity: '최근 거래' };
  note('정보 우선순위', zoneOrder.map((z) => zoneName[z]).join(' → '), ref.tasks.length ? 'Primary tasks 순서' : '문서에 순서 없음 → 기본 순서');

  // 2) CTA 배치: 기능 묶음 컴포넌트가 있으면 계좌와 함께, 업무 메뉴·직접 입력 성격이면 상단 행동 줄, 아니면 총자산 아래
  let ctaPlacement = 'underTotal';
  let ctaWhy = '묶음·업무 메뉴 근거 없음 → 총자산 바로 아래';
  if (ref.primaryStyle === 'feature' || ref.primaryStyle === 'bordered') {
    ctaPlacement = 'inAccount';
    ctaWhy = ref.primaryStyle === 'feature' ? '문서의 featured 묶음 컴포넌트' : '문서의 카드·컨테이너 컴포넌트';
  } else if (ref.quickNav || ref.transferStyle === 'squareLinks' || ref.transferStyle === 'input') {
    ctaPlacement = 'actionRow';
    ctaWhy = ref.quickNav ? '문서의 업무 탭(조회·이체…) 구성' : ref.transferStyle === 'input' ? '문서의 직접 입력 컴포넌트' : '문서의 나란한 링크 목록';
  }
  // 사용성: 계좌가 첫 영역이 아니면 계좌 묶음 안의 송금 버튼이 첫 화면 밖으로 밀린다 → 총자산 아래로
  if (ctaPlacement === 'inAccount' && zoneOrder[0] !== 'accounts') {
    ctaPlacement = 'underTotal';
    ctaWhy += ' → 문서 우선순위상 계좌가 뒤라 송금은 총자산 아래로';
  }
  note('CTA 배치', { inAccount: '대표 계좌와 한 묶음', actionRow: '총자산 아래 행동 3개', underTotal: '총자산 아래 버튼 2개' }[ctaPlacement], ctaWhy);

  // 3) 계좌 강조: CTA를 계좌와 묶을 때만 상호작용 묶음(카드 1개)을 쓴다
  const accountEmphasis = ctaPlacement === 'inAccount' ? 'highlight' : 'rows';
  note('계좌 강조', accountEmphasis === 'highlight' ? '대표 계좌 1개를 묶음으로' : '목록 2줄, 대표 계좌만 굵게', 'CTA 배치에 따름');

  // 4) grouping: 촘촘한 문서는 카드 사용과 거래를 "이번 달 소비" 한 묶음으로
  const spendGrouping = ref.density === 'compact' || ref.txStyle === 'dense' ? 'combined' : 'separate';
  note('Grouping', spendGrouping === 'combined' ? '카드 사용 + 최근 거래를 한 묶음' : '카드 사용과 최근 거래를 따로', `문서 밀도: ${{ compact: '촘촘', regular: '보통', comfortable: '여유' }[ref.density]}`);

  // 4-1) 소비 정보 표현: 탭·인덱스처럼 나란히 비교하는 구조가 있는 문서는 총자산 아래 2열 요약으로
  const spendPresentation = spendGrouping === 'separate' && ref.sectionStyle === 'tabRule' ? 'grid' : 'zone';
  note(
    '정렬 · 그리드',
    spendPresentation === 'grid' ? '카드 사용 · 최근 지출을 총자산 아래 2열로' : '소비 정보는 아래쪽 영역에',
    spendPresentation === 'grid' ? '문서의 탭·인덱스 컴포넌트 (나란히 비교)' : '나란히 비교하는 구조 없음'
  );

  // 5) 여백: 여유 있는 문서만 넓은 간격 (값은 고정 spacing 안에서)
  const whitespace = ref.density === 'comfortable' ? 'airy' : 'regular';
  note('여백', whitespace === 'airy' ? '넓게 (섹션 32px)' : '보통 (섹션 24px)', 'spacing 토큰 안에서 선택');

  // 6) 총자산 배치: 큰 제목을 쓰는 문서는 총자산을 단독 줄로, 아니면 증감과 한 줄에
  const totalLayout = ref.totalScale === 'medium' ? 'split' : 'solo';
  note('총자산 배치', totalLayout === 'solo' ? '단독 줄 (강조)' : '금액과 증감을 한 줄에', ref.totalScale === 'medium' ? '문서 제목 크기 보통' : '문서가 큰 제목 사용');

  return { zoneOrder, mentionedZones, ctaPlacement, accountEmphasis, spendGrouping, spendPresentation, whitespace, totalLayout, notes };
}
