// UI가 부르는 유일한 진입점.
// 지금은 mock generator를 쓰고, 나중에 실제 AI를 붙일 때는 이 파일만 바꾸면 된다.
//
//   export async function generateLayout(modeKey, options) {
//     return generateWithAI(modeKey, options); // 같은 { schema, attempts, rejected } 형태로 돌려줄 것
//   }
//
// AI 결과도 validateSchema()로 원칙 검사를 거치면 mock과 같은 안전장치를 쓸 수 있다.

import { generateMockBankingLayout } from './mockLayoutGenerator.js';
import { getNextDesignReference, loadDesignReferences } from './designReferences.js';
import { generateFinalLayoutFromDesign } from '../final/finalGenerator.js';

/** 6단계 최종안이 참고 문서(design/banking/*.md)를 쓸 수 있는지 */
export const hasDesignReferences = () => loadDesignReferences().length > 0;

export async function generateLayout(modeKey, options = {}) {
  // 6단계만: 참고 문서를 셔플백으로 하나 골라, 그 구조적 영감을 Slop Bank 고정 디자인 시스템 안에서 재해석.
  // 문서가 없으면 기존 최종안 규칙으로.
  if (modeKey === 'final' && hasDesignReferences()) {
    const pick = getNextDesignReference();
    const result = generateFinalLayoutFromDesign(pick.reference);
    return { ...result, reference: pick.reference, cycle: { position: pick.position, total: pick.total, round: pick.round } };
  }
  return generateMockBankingLayout(modeKey, options);
}
