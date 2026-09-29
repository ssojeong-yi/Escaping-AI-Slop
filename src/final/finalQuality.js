// 최종안 품질 검사 — 렌더링 전에 schema로 실행한다.
// schema.components 는 생성기가 화면에 넣을 컴포넌트 목록이고, 렌더러는 이 목록대로만 그린다.
import { finalDesignTokens as T } from './finalDesignTokens.js';

export const FINAL_QUALITY_CHECKS = [
  {
    id: 'buttonRadius',
    label: '버튼 radius 일관성',
    test: (s) => s.components.buttons.every((b) => T.buttonStyles[b.variant]?.radius === 'control' && b.radius === T.radius.control),
  },
  {
    id: 'sameStyle',
    label: '같은 역할 컴포넌트 스타일 일관성',
    test: (s) => {
      const styles = new Map();
      for (const c of [...s.components.buttons, ...s.components.rows]) {
        const key = `${c.role}`;
        if (styles.has(key) && styles.get(key) !== c.style) return false;
        styles.set(key, c.style);
      }
      return true;
    },
  },
  {
    id: 'icons',
    label: '아이콘 과다 사용 없음',
    test: (s) =>
      s.components.icons.length <= T.iconRules.maxPerScreen &&
      s.components.icons.every((i) => T.iconRules.allowed.includes(i.context) && i.size === T.iconRules.size[i.context]),
  },
  {
    id: 'cards',
    label: '카드 과다 사용 없음',
    test: (s) => s.components.cards.length <= T.cardRules.maxPerScreen && s.components.cards.every((c) => T.cardRules.allowedRoles.includes(c.role)),
  },
  {
    id: 'density',
    label: '첫 화면 정보량 적정',
    test: (s) =>
      s.content.accounts.length <= T.limits.accounts &&
      s.content.transactions.length <= T.limits.transactions &&
      s.content.actions.length >= T.limits.actionsMin &&
      s.content.actions.length <= T.limits.actionsMax,
  },
  {
    id: 'primaryCta',
    label: 'Primary CTA 1개',
    test: (s) => s.components.buttons.filter((b) => b.variant === 'primary').length === T.limits.primaryCta,
  },
  {
    id: 'ctaTop',
    label: 'Primary CTA가 첫 화면 상단에',
    test: (s) => s.layout.ctaPlacement !== 'inAccount' || s.layout.zoneOrder[0] === 'accounts',
  },
  {
    id: 'typeHierarchy',
    label: '타이포그래피 위계',
    test: (s) => ['display', 'title', 'body', 'caption'].every((l) => s.components.textLevels.includes(l)),
  },
  {
    id: 'coreInfo',
    label: '금융앱 홈 핵심 정보 포함',
    test: (s) =>
      s.content.total &&
      s.content.accounts.length >= 1 &&
      s.content.actions.some((a) => a.id === 'send') &&
      s.content.card &&
      s.content.transactions.length >= 1 &&
      s.bottomNav,
  },
];

export function runFinalQuality(schema) {
  const results = FINAL_QUALITY_CHECKS.map((c) => ({ id: c.id, label: c.label, pass: Boolean(c.test(schema)) }));
  return { pass: results.every((r) => r.pass), results };
}
