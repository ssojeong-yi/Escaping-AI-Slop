// design/banking/*.md 를 빌드 시점에 raw 텍스트로 불러와 디자인 프로필로 파싱한다.
// 6단계 최종안에서만 사용한다. (1~5단계는 config/designModes.js 규칙을 그대로 쓴다)
import { parseDesignMarkdown } from './designParser.js';

const files = import.meta.glob('/design/banking/*.md', { query: '?raw', import: 'default', eager: true });

let cache = null;

/** 디자인 참고 문서 목록 (design-md 형식이 아닌 md는 제외) */
export function loadDesignReferences() {
  if (!cache) {
    cache = Object.entries(files)
      .filter(([, md]) => typeof md === 'string' && md.includes('design-md:section'))
      .map(([path, md]) => parseDesignMarkdown(md, path.split('/').pop()))
      .sort((a, b) => a.file.localeCompare(b.file));
  }
  return cache;
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 셔플백: 모든 문서를 한 번씩 쓰기 전에는 반복하지 않고, 다 쓰면 다시 섞는다.
// 새로 섞은 첫 문서가 직전 문서와 같으면 순서를 바꿔 연속 반복을 막는다.
let bag = [];
let lastId = null;
let round = 0;

/** @returns {{ reference, position: number, total: number, round: number } | null} */
export function getNextDesignReference() {
  const refs = loadDesignReferences();
  if (!refs.length) return null;
  if (!bag.length) {
    bag = shuffle(refs.map((r) => r.id));
    round += 1;
    if (bag.length > 1 && bag[bag.length - 1] === lastId) {
      [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
  }
  const id = bag.pop();
  lastId = id;
  return {
    reference: refs.find((r) => r.id === id),
    position: refs.length - bag.length,
    total: refs.length,
    round,
  };
}
