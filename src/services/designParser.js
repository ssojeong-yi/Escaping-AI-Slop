// design/*.md (금융앱 디자인 분석 문서) → 디자인 프로필.
// 파일명이 아니라 본문을 읽는다: 섹션 표시(<!-- design-md:section ... -->), 색상 목록, 타이포 표,
// 컴포넌트 블록, 레이아웃 문장, Primary tasks 목록. 문서가 "폐기"로 표시한 <details> 블록은 읽지 않는다.
// 프로필의 모든 값에는 근거(evidence)가 따라붙어 UI에서 "무엇을 읽어서 반영했는지" 보여줄 수 있다.

const HEX = /#[0-9a-fA-F]{6}\b/;

const stripSuperseded = (md) => md.replace(/<details>[\s\S]*?<\/details>/g, '');

/** <!-- design-md:section name --> 마커로 섹션 분리 */
function splitSections(md) {
  const out = {};
  const re = /<!--\s*design-md:section\s+([\w-]+)\s*-->/g;
  const marks = [...md.matchAll(re)];
  marks.forEach((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : md.length;
    out[m[1]] = md.slice(start, end);
  });
  return out;
}

/** 소제목(### / ####) 아래 본문 */
function subsection(text = '', pattern) {
  const lines = text.split('\n');
  const i = lines.findIndex((l) => /^#{2,4}\s/.test(l) && pattern.test(l));
  if (i < 0) return '';
  const level = lines[i].match(/^#+/)[0].length;
  const rest = lines.slice(i + 1);
  const j = rest.findIndex((l) => new RegExp(`^#{2,${level}}\\s`).test(l));
  return (j < 0 ? rest : rest.slice(0, j)).join('\n');
}

const countOf = (text, re) => (text.match(new RegExp(re.source, 'gi')) || []).length;

/* ---------- 이름 ---------- */
function parseName(md, file) {
  const h1 = (md.match(/^# (.+)$/m) || [])[1] || file;
  const service = h1.replace(/\s*(—.*|Reference Design System.*)$/i, '').trim();
  const ko = service.match(/\(([^)]*[가-힣][^)]*)\)/);
  if (ko) return { name: ko[1].trim(), service };
  if (/[가-힣]/.test(service)) return { name: service, service };
  // 본문 첫머리에 "하나은행 (Hana Bank" 처럼 한국어 이름이 먼저 나오면 사용
  const intro = md.slice(0, 1500).match(/([가-힣]{2,}(?:은행|뱅크))\s*\(/);
  return { name: intro ? intro[1] : service, service };
}

/* ---------- 색상 ---------- */
const BRAND_ONLY = /official .*brand|brand[- ]asset|brand color|identity|logo|\bci\b|symbol|group identity/i;
const ACTION_DESC = /primary action|action background|computed fill|\bcta\b|compact action|brand-tier ctas?/i;

function classifyColor(label, desc) {
  const l = label.toLowerCase();
  if (/canvas/.test(l) || (!label && /canvas/i.test(desc))) return 'canvas';
  if (/hairline|border|divider|\bline\b/.test(l)) return 'line';
  if (/surface|section|tint|off-white/.test(l)) return 'surface';
  if (/muted|caption|metadata|placeholder/.test(l)) return 'muted';
  if (/secondary|body|supporting|neutral/.test(l) && !/action/.test(l)) return 'sub';
  if (/foreground|\bink\b|heading|near-black|\btext\b/.test(l)) return /strong/.test(l) ? 'inkStrong' : 'ink';
  if (/action|cta|button|control|link|accent|primary/.test(l) || ACTION_DESC.test(desc)) return 'action';
  if (!label && /structural text|foreground/i.test(desc)) return 'ink';
  return 'other';
}

function parseColors(foundations) {
  // 색상 소제목이 여러 개로 나뉜 문서가 있어 foundations 전체에서 색 항목을 읽는다
  const colorText = foundations;
  const colors = [];
  for (const line of colorText.split('\n')) {
    if (!/^\s*-\s/.test(line)) continue;
    const found = [];
    // - **Label** (`#hex`) ... 한 줄에 여러 개일 수 있다 (예: **Canvas** (`#fff`) and **Foreground** (`#000`))
    for (const m of line.matchAll(/\*\*([^*]+)\*\*\s*\(`?(#[0-9a-fA-F]{6})`?\)/g)) found.push([m[1], m[2]]);
    // - `#hex` — description
    const m2 = line.match(/^\s*-\s*`(#[0-9a-fA-F]{6})`\s*[—–-]\s*(.*)$/);
    if (!found.length && m2) found.push(['', m2[1]]);
    if (!found.length) continue;
    const desc = (line.split(/\)\s*:\s*/).slice(1).join('): ') || m2?.[2] || '').trim();
    for (const [label, hex] of found) {
      const role = classifyColor(label.trim(), desc);
      const brandOnly = BRAND_ONLY.test(`${label} ${desc}`) && !ACTION_DESC.test(desc);
      const textOnly = /text and border|text\/border|text value|inline link|link treatment/i.test(desc) || /link/i.test(label);
      // 색 설명 자체가 버튼·채움 용도를 부정하면 채움 금지 (예: "not a universal button")
      const noFill = /not (?:a )?universal (?:button|cta|fill)|not .*(?:cta|button fill|product control)|not promoted to product controls/i.test(desc);
      colors.push({ label: label.trim() || hex, hex: hex.toLowerCase(), desc, role, brandOnly, textOnly, noFill });
    }
  }
  return colors;
}

/** "Do not turn `#3182f6` into a universal filled CTA" 같은 금지 문장 → 채움 버튼에 쓰지 말 색 */
function parseNoFill(md) {
  const bad = new Set();
  const sentences = md.split(/\n|(?<=[.;])\s+/);
  for (const s of sentences) {
    if (!/do not|don't|not a universal|not proof|not automatic|not .*token/i.test(s)) continue;
    if (!/cta|fill|button|control|transfer/i.test(s)) continue;
    for (const h of s.match(/#[0-9a-fA-F]{6}/g) || []) bad.add(h.toLowerCase());
  }
  return bad;
}

/* ---------- 타이포 ---------- */
function parseTypeScale(typo) {
  const rows = [];
  for (const line of typo.split('\n')) {
    if (!/^\s*\|/.test(line) || /---/.test(line)) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    const size = cells.find((c) => /^\d+(\.\d+)?px$/.test(c));
    const weight = cells.find((c) => /^[1-9]00$/.test(c) || /^[1-9]00[–-][1-9]00$/.test(c));
    if (!size) continue;
    rows.push({ role: cells[0], size: parseFloat(size), weight: weight ? parseInt(weight, 10) : null });
  }
  return rows;
}

/* ---------- 컴포넌트 ---------- */
function parseComponents(comp) {
  const blocks = [];
  let group = '';
  let cur = null;
  const push = () => cur && blocks.push(cur);
  for (const raw of comp.split('\n')) {
    const line = raw.trim();
    const h = line.match(/^#{3,4}\s+(.+)$/);
    const bold = line.match(/^\*\*(.+?)\*\*(?:\s*[—–-].*)?$/);
    if (h) {
      push();
      group = h[1];
      cur = { name: group, props: {}, text: '' };
      continue;
    }
    if (bold) {
      const label = bold[1];
      if (/^(default|selected)$/i.test(label) && cur) {
        cur.state = label; // K bank: ### 이름 + **Default**
        continue;
      }
      push();
      cur = { name: label, group, props: {}, text: '' };
      continue;
    }
    if (!cur) continue;
    cur.text += ` ${line}`;
    const p = line.match(/^-\s*(Background|Text|Border|Radius|Padding|Height|Font|Use):\s*(.+)$/i);
    if (p) cur.props[p[1].toLowerCase()] = p[2];
    // 카카오뱅크 형식: "- Transparent / black, 0px radius, 62px height"
    const inline = line.match(/^-\s*([A-Za-z#0-9]+)\s*\/\s*([A-Za-z#0-9]+),\s*(\d+)px radius/i);
    if (inline) {
      cur.props.background = inline[1];
      cur.props.text = inline[2];
      cur.props.radius = `${inline[3]}px`;
    }
    const h2 = line.match(/(\d+)px height/i);
    if (h2 && !cur.props.height) cur.props.height = `${h2[1]}px`;
  }
  push();
  return blocks
    .filter((b) => Object.keys(b.props).length)
    .map((b) => {
      const radius = b.props.radius ? parseFloat(b.props.radius.replace(/`/g, '')) : null;
      const kind = /tab/i.test(b.name)
        ? 'tab'
        : /input/i.test(`${b.name} ${b.group}`)
          ? 'input'
          : /chip/i.test(b.name)
            ? 'chip'
            : /featured|fill\)/i.test(b.name)
              ? 'featureCard'
              : /card|container/i.test(`${b.name} ${b.group}`)
                ? 'card'
                : /row|item|anchor|list/i.test(`${b.name} ${b.group}`)
                  ? 'row'
                  : /text button|full-width/i.test(b.name)
                    ? 'textButton'
                    : /action|button|cta|pill|select|download/i.test(`${b.name} ${b.group}`)
                      ? 'button'
                      : /nav/i.test(b.name)
                        ? 'nav'
                        : 'other';
      const bg = (b.props.background || '').match(HEX)?.[0]?.toLowerCase() || (/^black$/i.test(b.props.background) ? '#000000' : null);
      const onlyMarketing = /marketing evidence only|marketing|group site|footer|documentation|doc chrome/i.test(`${b.props.use || ''} ${b.name} ${b.group}`);
      return { name: b.name, kind, radius, bg, height: parseFloat(String(b.props.height).replace(/`/g, '')) || null, font: b.props.font || '', onlyMarketing, use: b.props.use || '' };
    });
}

/* ---------- 메인 파서 ---------- */
export function parseDesignMarkdown(markdown, file) {
  const md = stripSuperseded(markdown);
  const s = splitSections(md);
  const { name, service } = parseName(md, file);
  const evidence = [];
  const note = (label, value, source) => evidence.push({ label, value, source });

  // 1) Primary tasks → 섹션 우선순위
  const tasks = (subsection(s.experience, /primary tasks/i).match(/^\s*-\s+.+$/gm) || []).map((t) => t.replace(/^\s*-\s+/, ''));
  const taskText = tasks.join(' \n ').toLowerCase();
  const KEYS = {
    transferAction: /transfer|move money|send/,
    cardSpend: /\bcards?\b/,
    recentTransactions: /transaction|dense lists|lists of|spending|receipt/,
    accountList: /balance|account|deposit|savings|everyday banking/,
  };
  const firstHit = (re) => {
    const m = taskText.match(re);
    return m ? m.index : Infinity;
  };
  const priority = Object.keys(KEYS).sort((a, b) => firstHit(KEYS[a]) - firstHit(KEYS[b]));
  const mentioned = priority.filter((k) => firstHit(KEYS[k]) < Infinity);

  // 2) 색상
  const colors = parseColors(s.foundations || '');
  const noFill = parseNoFill(md);
  for (const c of colors) if (c.noFill) noFill.add(c.hex);
  const pick = (role) => colors.find((c) => c.role === role && !c.brandOnly);
  const canvas = pick('canvas')?.hex || '#ffffff';
  const ink = pick('inkStrong')?.hex || pick('ink')?.hex || '#111111';
  const sub = pick('sub')?.hex || null;
  const muted = pick('muted')?.hex || sub;
  const line = pick('line')?.hex || null;
  const surface = (colors.find((c) => c.role === 'surface' && !c.brandOnly && !/tint|group/i.test(c.label)) || pick('surface'))?.hex || null;
  const brandOnly = colors.filter((c) => c.brandOnly).map((c) => c.hex);

  // 3) 컴포넌트
  const comps = parseComponents(s['components-states'] || '');
  const kinds = new Set(comps.map((c) => c.kind));
  const product = comps.filter((c) => !c.onlyMarketing);

  // 채움 버튼 색: 문서가 "행동"에 쓴다고 한 색 → 컴포넌트 버튼 배경 → 없으면 잉크(검정)
  const actionColors = colors.filter((c) => c.role === 'action' && !c.brandOnly);
  const fillCandidate =
    actionColors.find((c) => ACTION_DESC.test(c.desc) && !noFill.has(c.hex) && !c.textOnly) ||
    null;
  const compButton = product.find((c) => c.kind === 'button' && c.bg && c.bg !== '#ffffff' && c.bg !== '#fdfdfe');
  let actionFill = fillCandidate?.hex || compButton?.bg || null;
  let actionFrom = fillCandidate ? `색상: ${fillCandidate.label}` : compButton ? `컴포넌트: ${compButton.name}` : null;
  if (actionFill && noFill.has(actionFill)) actionFill = null;
  const accentText =
    (actionColors.find((c) => c.hex !== actionFill && c.textOnly) ||
      actionColors.find((c) => c.hex !== actionFill && !noFill.has(c.hex)) ||
      actionColors.find((c) => c.hex !== actionFill && c.textOnly === false && /text|border/i.test(c.desc)))?.hex || null;

  let actionStyle = 'fill';
  if (!actionFill) {
    // 채움 버튼 근거가 없으면 채우지 않는다: 텍스트 강조색이 있으면 윤곽선, 없으면 잉크
    actionStyle = accentText ? 'outline' : 'ink';
    actionFill = accentText || ink;
    actionFrom = accentText ? '채움 CTA 근거 없음 → 강조색 윤곽선' : '채움 CTA 근거 없음 → 잉크 버튼';
  }
  note('주요 버튼', `${actionStyle === 'fill' ? '채움' : actionStyle === 'outline' ? '윤곽선' : '잉크'} ${actionFill}`, actionFrom);
  if (brandOnly.length) note('제외한 색', brandOnly.join(', '), '문서가 브랜드·정체성 전용으로 표시');
  if (noFill.size) note('채움 금지', [...noFill].join(', '), "Don't 문장");

  // 강조(입금·상태) 색: 행동 색 → 텍스트 강조색 → 없으면 단색(굵기로만 구분)
  const accent = actionStyle === 'fill' && actionFill !== ink && actionFill !== '#000000' ? actionFill : accentText || null;
  note('강조 색', accent || '없음 (굵기로만 구분)', accent ? '행동·링크 색' : '문서가 단색 위주');

  // 4) radius: 제품 컴포넌트 중 버튼·카드 (pill·마케팅 전용 제외)
  const radii = product.filter((c) => ['button', 'card', 'featureCard', 'input', 'chip'].includes(c.kind) && c.radius != null);
  const usable = radii.filter((c) => c.radius <= 12);
  const rejected = radii.filter((c) => c.radius > 12).map((c) => `${c.name} ${c.radius}px`);
  // 버튼·카드 radius가 없으면 목록·컨트롤의 radius를 쓴다 (예: 각진 0px 링크만 있는 문서)
  const controlR = product.find((c) => ['row', 'tab', 'textButton', 'nav'].includes(c.kind) && c.radius != null && c.radius <= 12);
  const buttonR = usable.find((c) => c.kind === 'button') || usable.find((c) => c.kind !== 'input') || usable[0] || controlR;
  const radius = buttonR ? buttonR.radius : null;
  const listSquare = comps.some((c) => ['tab', 'row', 'nav', 'textButton'].includes(c.kind) && c.radius === 0) || /square|0px/i.test(s['layout-platforms'] || '');
  note('Radius', radius != null ? `${radius}px (${buttonR.name})` : '문서에 근거 없음 → 8px', rejected.length ? `과한 값 제외: ${rejected.join(', ')}` : '컴포넌트 블록');

  // 5) 깊이
  const depth = s.foundations || '';
  const flat = /box-shadow:\s*none|shadow-free|no shadow|flat|shadows were not observed/i.test(`${depth}\n${s.governance || ''}`);
  note('그림자', flat ? '없음' : '문서에 명시 없음 → 없음', flat ? 'box-shadow: none / flat' : '');

  // 6) 타이포
  const typeRows = parseTypeScale(md);
  const body = typeRows.find((r) => /body|list/i.test(r.role));
  const headings = typeRows.filter((r) => /heading|title|display|hero|\bh1\b|\bh2\b/i.test(r.role));
  const maxHeading = Math.max(0, ...headings.map((r) => r.size));
  const sectionHeading = headings.filter((r) => r.size <= 32).sort((a, b) => b.size - a.size)[0];
  const bodySize = body ? Math.min(16, Math.max(13, body.size)) : 15;
  const bodyWeight = body?.weight || 400;
  const titleWeight = sectionHeading?.weight || headings[0]?.weight || 700;
  const totalScale = maxHeading >= 60 ? 'xl' : maxHeading >= 40 ? 'large' : 'medium';
  note('본문', body ? `${body.size}px / ${bodyWeight} → ${bodySize}px` : '표에 없음 → 15px', body ? `타이포 표: ${body.role}` : '');
  note('총자산 크기', { xl: '아주 크게', large: '크게', medium: '보통' }[totalScale], maxHeading ? `문서 최대 제목 ${maxHeading}px` : '제목 크기 없음');
  const usesPretendard = /pretendard/i.test(s['typography-assets'] || '');

  // 7) 밀도·구분 (레이아웃 + 분위기 문장)
  const layoutText = `${s['layout-platforms'] || ''}\n${subsection(s.experience, /visual theme/i)}`;
  const dense = countOf(layoutText, /dense|density|packs|compact|information-dense/);
  const airy = countOf(layoutText, /generous|breathing|large type|vertical rhythm|very large|sparse/);
  const density = dense > airy ? 'compact' : airy > dense ? 'comfortable' : 'regular';
  note('밀도', { compact: '촘촘', regular: '보통', comfortable: '여유' }[density], `dense ${dense}회 · generous ${airy}회`);

  const bandHits = countOf(`${layoutText}\n${depth}`, /section fill|section-level|section surface|background (?:color|tint) shift|surface tint|pale-gray section|quiet public section|alternating content sections/);
  const ruleHits = countOf(`${layoutText}\n${depth}\n${s['components-states'] || ''}`, /hairline|\brule\b|divider|bottom rule|top rule/);
  const sectionStyle = kinds.has('tab') && product.some((c) => c.kind === 'tab') ? 'tabRule' : bandHits >= ruleHits && surface ? 'band' : 'hairline';
  note('섹션 구분', { tabRule: '탭형 제목 + 아래 선', band: `회색 면 ${surface || ''}`, hairline: '얇은 선' }[sectionStyle], `면 ${bandHits}회 · 선 ${ruleHits}회${kinds.has('tab') ? ' · 탭 컴포넌트' : ''}`);

  // 8) 컴포넌트 → 화면 구조
  const featureCard = product.find((c) => c.kind === 'featureCard');
  const primaryStyle = featureCard ? 'feature' : kinds.has('card') ? 'bordered' : 'plain';
  note('대표 계좌', { feature: `채움 블록 (${featureCard?.name})`, bordered: '윤곽선 블록', plain: '박스 없이 목록 첫 줄' }[primaryStyle], '컴포넌트 목록');

  const transferStyle = kinds.has('input') ? 'input' : kinds.has('chip') ? 'chips' : product.some((c) => c.kind === 'row' && /outline/i.test(c.name)) ? 'squareLinks' : 'buttons';
  note('송금', { input: '계좌번호 입력 줄', chips: '받는 사람 칩', squareLinks: '각진 윤곽선 링크', buttons: '버튼 + 최근 이름' }[transferStyle], '컴포넌트 목록');

  const quickNav = /조회|이체|공과금/.test(md) || product.some((c) => /nav|tab/i.test(c.kind) && /banking/i.test(c.name));
  const txStyle = product.some((c) => /disclosure/i.test(c.name)) ? 'disclosure' : dense > airy ? 'dense' : 'grouped';
  note('거래 목록', { disclosure: '펼침 행 (›)', dense: '촘촘한 원장', grouped: '날짜별 묶음' }[txStyle], '컴포넌트·밀도');
  if (quickNav) note('빠른 메뉴', '텍스트 업무 메뉴 (조회·이체…)', '문서 내 업무 탭 표기');
  if (mentioned.length) note('정보 순서', mentioned.map((k) => ({ accountList: '계좌', transferAction: '송금', cardSpend: '카드', recentTransactions: '거래' })[k]).join(' → '), 'Primary tasks');

  return {
    id: file,
    file,
    name,
    service,
    tasks,
    priority,
    mentioned,
    excludedColors: brandOnly,
    // 최종안 색 테마용 원본: 문서 순서 그대로의 색 목록, 문서가 명시한 행동(CTA) 색, 분위기 문장
    colors,
    documentedCta: fillCandidate?.hex || compButton?.bg || null,
    documentedCtaFrom: fillCandidate ? `색상: ${fillCandidate.label}` : compButton ? `컴포넌트: ${compButton.name}` : null,
    atmosphere: subsection(s.experience, /visual theme/i),
    tokens: {
      canvas,
      ink,
      sub: sub || '#555555',
      muted: muted || '#888888',
      line: line || '#e6e6e6',
      surface: surface || '#f5f5f5',
      action: actionFill,
      accent,
      radius: radius != null ? radius : 8,
      shadow: 'none',
      bodySize,
      bodyWeight,
      titleWeight,
    },
    actionStyle,
    totalScale,
    density,
    sectionStyle,
    primaryStyle,
    transferStyle,
    txStyle,
    quickNav,
    listSquare,
    usesPretendard,
    evidence,
  };
}
