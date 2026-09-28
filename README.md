# Escaping AI Slop

AI가 만든 비슷한 화면에서 벗어나기 — 같은 금융 정보를 5단계 디자인 조건으로 탐색하고 최종안으로 정리한 발표용 프로토타입입니다.

## 발표 PC에서 여는 방법 (Node 불필요)

`Escaping-AI-Slop.html` 파일을 Chrome이나 Safari로 더블클릭해서 엽니다.
JS·CSS·폰트가 모두 파일 안에 들어 있어 인터넷 없이 동작합니다.
브라우저 창은 전체 화면(Chrome: `⌃⌘F`)으로 두는 것을 권장합니다.

## 단축키

- `1`–`6` 단계 선택
- `↑` `↓` 이전 / 다음
- `R` (또는 "다시 생성" 버튼) 같은 원칙 안에서 새 화면 생성
- `Space` 누르고 있는 동안 기본안 보기

## 수정하고 다시 만들기 (Node 필요)

```bash
npm install
npm run dev            # http://localhost:5173 에서 개발
npm run build:single   # dist-single/index.html 한 파일로 빌드
```

- 금액 데이터: `src/data/finance.js`
- 상태별 설명·제약 문구: `src/data/variants.js`
- 화면: `src/screens/` (원본), `src/screens/generated/SchemaScreen.jsx` (생성 결과 렌더러)
- 생성 규칙: `src/config/designModes.js` (mode별 선택지 + 반드시 지킬 원칙)
- 생성기: `src/services/mockLayoutGenerator.js` → `src/services/layoutService.js`의 `generateLayout()`이 유일한 진입점.
  실제 AI를 붙일 때는 `layoutService.js`만 `generateWithAI()`로 바꾸면 된다.
