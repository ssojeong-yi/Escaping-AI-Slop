// UI가 부르는 유일한 진입점.
// 지금은 mock generator를 쓰고, 나중에 실제 AI를 붙일 때는 이 파일만 바꾸면 된다.
//
//   export async function generateLayout(modeKey, options) {
//     return generateWithAI(modeKey, options); // 같은 { schema, attempts, rejected } 형태로 돌려줄 것
//   }
//
// AI 결과도 validateSchema()로 원칙 검사를 거치면 mock과 같은 안전장치를 쓸 수 있다.

import { generateMockBankingLayout } from './mockLayoutGenerator.js';

export async function generateLayout(modeKey, options = {}) {
  return generateMockBankingLayout(modeKey, options);
}
