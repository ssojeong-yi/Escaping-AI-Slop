import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { variants } from './data/variants.js';
import { screens } from './screens/index.js';
import StateTabs from './components/StateTabs.jsx';
import PhoneFrame from './components/PhoneFrame.jsx';
import NotesPanel from './components/NotesPanel.jsx';

const count = variants.length;
const baseline = variants[0];

export default function App() {
  const [index, setIndex] = useState(0);
  const [peek, setPeek] = useState(false); // Space를 누르고 있는 동안 기본안 표시

  const current = variants[index];
  const peeking = peek && current.id !== baseline.id;
  const shown = peeking ? baseline : current;
  const Screen = screens[shown.id];

  // 기본안 비교(peek) 중에도 스크롤 위치를 유지한다.
  // 들어갈 때는 같은 비율 지점으로, 나올 때는 원래 픽셀 위치로 되돌린다.
  const stageRef = useRef(null);
  const peekRef = useRef(false);
  const currentIdRef = useRef(current.id);
  currentIdRef.current = current.id;
  const scrollMemo = useRef(null); // { mode: 'enter' | 'leave', top, ratio }
  const getBody = () => stageRef.current?.querySelector('.screen-body');

  const startPeek = useCallback(() => {
    if (peekRef.current) return; // 키 반복 입력 무시
    peekRef.current = true;
    const body = getBody();
    // 기본안 단계에서는 화면이 바뀌지 않으므로 기억할 것이 없다.
    if (body && currentIdRef.current !== baseline.id) {
      const max = body.scrollHeight - body.clientHeight;
      scrollMemo.current = { mode: 'enter', top: body.scrollTop, ratio: max > 0 ? body.scrollTop / max : 0 };
    }
    setPeek(true);
  }, []);

  const endPeek = useCallback(() => {
    if (!peekRef.current) return;
    peekRef.current = false;
    if (scrollMemo.current) scrollMemo.current.mode = 'leave';
    setPeek(false);
  }, []);

  useLayoutEffect(() => {
    const memo = scrollMemo.current;
    const body = getBody();
    if (!memo || !body) return;
    if (memo.mode === 'enter') {
      body.scrollTop = memo.ratio * (body.scrollHeight - body.clientHeight);
    } else {
      body.scrollTop = memo.top;
      scrollMemo.current = null;
    }
  }, [shown.id]);

  // 단계를 바꾸면 새 화면은 맨 위에서 시작한다 (비교 중에 바꿨다면 떼는 순간 맨 위).
  useEffect(() => {
    if (peekRef.current && scrollMemo.current) scrollMemo.current.top = 0;
    else if (!peekRef.current) scrollMemo.current = null;
  }, [index]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= '1' && e.key <= String(count)) {
        setIndex(Number(e.key) - 1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setIndex((i) => (i + 1) % count);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setIndex((i) => (i - 1 + count) % count);
      } else if (e.code === 'Space') {
        e.preventDefault();
        startPeek();
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        endPeek();
      }
    };
    const reset = endPeek;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', reset);
    };
  }, [startPeek, endPeek]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>Escaping AI Slop</h1>
          <span>AI가 만든 비슷한 화면에서 벗어나기</span>
        </div>
        <div className="stepper">
          <button onClick={() => setIndex((index - 1 + count) % count)} aria-label="이전 단계">
            ←
          </button>
          <span className="stepper-count">
            <b>{current.no}</b> / 0{count}
          </span>
          <button onClick={() => setIndex((index + 1) % count)} aria-label="다음 단계">
            →
          </button>
        </div>
      </header>

      <main className="main">
        <StateTabs variants={variants} activeIndex={index} onSelect={setIndex} />

        <section className="stage" ref={stageRef}>
          <PhoneFrame>
            <Screen key={shown.id} />
          </PhoneFrame>
          <div className="stage-foot">
            {/* 버튼을 교체하지 않고 라벨만 바꿔야 pointerup이 같은 요소에서 잡힌다 */}
            <button
              className={`peek-btn${peeking ? ' on' : ''}`}
              disabled={current.id === baseline.id}
              onPointerDown={startPeek}
              onPointerUp={endPeek}
              onPointerLeave={endPeek}
            >
              {peeking ? '기본안 보는 중 · 떼면 돌아갑니다' : '누르고 있으면 기본안과 비교'}
            </button>
          </div>
        </section>

        <NotesPanel variant={current} />
      </main>
    </div>
  );
}
