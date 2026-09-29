// 참고 문서 → 최종안 색 테마.
// 구조·타이포·간격·radius·아이콘은 finalDesignTokens 고정값을 쓰고, 색만 문서에서 가져온다.
// 원칙: 강조색은 Primary CTA·중요 상태에만, 본문은 중립색, 대비 4.5:1 이상.

/* ---------- 색 계산 ---------- */
const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const rgbToHex = (rgb) => `#${rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
function saturation(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const l = (max + min) / 2;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}
const mix = (hex, target, t) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex(a.map((v, i) => v + (b[i] - v) * t));
};
/** 같은 색상 계열을 유지하며 배경 대비가 min 이상이 될 때까지 어둡게 */
function ensureContrast(hex, bg, min = 4.5) {
  let c = hex;
  for (let t = 0.08; contrast(c, bg) < min && t <= 1; t += 0.08) c = mix(hex, '#000000', t);
  return c.toUpperCase();
}
const isChromatic = (hex) => saturation(hex) >= 0.35 && luminance(hex) > 0.01 && luminance(hex) < 0.95;

/* ---------- 설명 문장 기반 대체 palette ---------- */
const WORD_PALETTE = [
  [/yellow/i, '#FFD400'],
  [/teal|mint/i, '#00A39F'],
  [/green/i, '#0FA36B'],
  [/indigo|navy|deep blue/i, '#1B3FA0'],
  [/blue/i, '#1E6BFF'],
  [/red/i, '#D93A3A'],
  [/orange/i, '#F2780C'],
  [/purple|violet/i, '#6B4EE6'],
];

const NEUTRAL = { background: '#FFFFFF', surface: '#F4F5F6', text: '#14171A', sub: '#5F656D', muted: '#6F757D', divider: '#ECEEF0' };

export function extractReferenceTheme(ref) {
  const colors = ref.colors || [];
  const sources = [];
  const src = (label, value, from) => sources.push({ label, value, from });

  // 1) Primary accent: 문서 색 목록에서 처음 나오는 유채색 (문서가 대표 색을 먼저 적는다)
  const chroma = colors.filter((c) => isChromatic(c.hex));
  const uniq = chroma.filter((c, i) => chroma.findIndex((x) => x.hex === c.hex) === i);
  let primary = uniq[0]?.hex?.toUpperCase() || null;
  let primaryFrom = uniq[0] ? `${uniq[0].label}` : null;
  if (!primary) {
    // 색상값이 없으면 분위기 문장의 색 단어로
    const hit = WORD_PALETTE.find(([re]) => re.test(ref.atmosphere || ''));
    primary = hit ? hit[1] : NEUTRAL.text;
    primaryFrom = hit ? `문서 설명의 색 표현 (${hit[0].source})` : '색 근거 없음 → 중립 잉크';
  }
  // 2) Secondary accent: 두 번째 유채색 (링크·강조 표시에만)
  const secondary = uniq.find((c) => c.hex.toUpperCase() !== primary)?.hex?.toUpperCase() || null;

  // 3) 바탕·글자·구분선: 문서 값 우선
  const pickRole = (role) => colors.find((c) => c.role === role && !isChromatic(c.hex))?.hex;
  const background = (pickRole('canvas') || NEUTRAL.background).toUpperCase();
  const bgIsLight = luminance(background) > 0.6;
  const safeBg = bgIsLight ? background : NEUTRAL.background; // 금융앱 화면은 밝은 바탕 유지 (문서가 어두워도)
  const textPrimary = ensureContrast((pickRole('inkStrong') || pickRole('ink') || NEUTRAL.text).toUpperCase(), safeBg, 12);
  const textSecondary = ensureContrast((pickRole('sub') || NEUTRAL.sub).toUpperCase(), safeBg, 4.5);
  const textMuted = ensureContrast((pickRole('muted') || NEUTRAL.muted).toUpperCase(), safeBg, 4.0);
  const hairline = colors.find((c) => c.role === 'line' && /hairline|divider/i.test(c.label))?.hex;
  const dividerRaw = (hairline || pickRole('line') || NEUTRAL.divider).toUpperCase();
  const divider = contrast(dividerRaw, safeBg) > 1.6 ? mix(dividerRaw, safeBg, 0.4) : dividerRaw; // 너무 진한 선은 옅게
  const surfaceRaw = colors.find((c) => c.role === 'surface' && !isChromatic(c.hex) && !/tint|group/i.test(c.label))?.hex;
  const surface = (surfaceRaw || NEUTRAL.surface).toUpperCase();

  // 4) CTA: 문서가 명시한 행동 버튼 색 → 없으면 primary accent
  const ctaRaw = (ref.documentedCta || primary).toUpperCase();
  let ctaFrom = ref.documentedCta ? `문서의 행동 버튼 (${ref.documentedCtaFrom})` : 'primary accent';
  // 밝은 색(노랑 등)은 검정 글자, 중간 밝기 색은 흰 글자가 4.5:1이 되도록 같은 계열로 조금 어둡게
  let cta = ctaRaw;
  let onCta = '#FFFFFF';
  if (contrast(ctaRaw, '#FFFFFF') < 4.5) {
    if (luminance(ctaRaw) > 0.4) onCta = '#111111';
    else {
      cta = ensureContrast(ctaRaw, '#FFFFFF', 4.5);
      ctaFrom += ` · 흰 글자 대비 보정 ${ctaRaw}→${cta}`;
    }
  }

  // 5) 글자로 쓰는 강조색 (선택 상태·증가 금액·링크): 대비 4.5:1 이상으로 보정
  const accentInk = ensureContrast(primary, safeBg, 4.5);
  // 막대·점 같은 그래픽 요소: 배경 대비 3:1 이상일 때만 강조색, 아니면 중립 잉크 (탁한 색을 만들지 않는다)
  const lightAccent = contrast(primary, safeBg) < 3;
  const accentGraphic = lightAccent ? textPrimary : primary;
  // 선택 상태 태그: 옅은 강조색(노랑 등)은 색 면 + 검정 글자, 그 외는 옅은 틴트 + 진한 강조 글자
  const tagBg = lightAccent ? primary : mix(primary, safeBg, 0.88);
  const tagText = lightAccent ? '#111111' : ensureContrast(accentInk, tagBg, 4.5); // 틴트 위에서도 4.5:1
  const accentSoft = mix(primary, safeBg, 0.88);
  const link = secondary ? ensureContrast(secondary, safeBg, 4.5) : textSecondary;

  // 6) 상태 색 사용 방식: 문서들이 성공/오류 색을 따로 정의하지 않으면 증가만 강조색, 감소는 중립
  const hasSemantic = colors.some((c) => /success|positive|error|negative|danger/i.test(`${c.label} ${c.desc}`));
  const positive = accentInk;
  const negative = textPrimary;

  src('강조색', primary, primaryFrom);
  if (secondary) src('보조 강조색', secondary, '문서의 두 번째 색');
  src('CTA', cta, ctaFrom);
  src('바탕', `${safeBg} / 면 ${surface}`, pickRole('canvas') ? '문서 canvas' : '기본값');
  src('글자', `${textPrimary} · ${textSecondary}`, '문서 foreground·secondary (대비 보정)');
  src('상태 표현', hasSemantic ? '문서의 상태색' : '증가만 강조색, 감소는 중립', hasSemantic ? '문서 정의' : '문서에 상태색 정의 없음');

  return {
    primaryAccent: primary,
    secondaryAccent: secondary,
    cta,
    onCta,
    accentInk,
    accentGraphic,
    tagBg,
    tagText,
    accentSoft,
    link,
    background: safeBg,
    surface,
    textPrimary,
    textSecondary,
    textMuted,
    divider,
    positive,
    negative,
    contrast: {
      ctaText: contrast(cta, onCta),
      accentInk: contrast(accentInk, safeBg),
      graphic: contrast(accentGraphic, safeBg) >= 3 ? 4.5 : contrast(accentGraphic, safeBg), // 그래픽은 3:1 기준 (통과 시 4.5로 기록)
      tag: contrast(tagText, tagBg),
      textSecondary: contrast(textSecondary, safeBg),
      link: contrast(link, safeBg),
    },
    sources,
  };
}
