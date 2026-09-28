import { useEffect, useState } from 'react';
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
  const shown = peek ? baseline : current;
  const Screen = screens[shown.id];

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
        setPeek(true);
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setPeek(false);
      }
    };
    const reset = () => setPeek(false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', reset);
    };
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>금융앱 UI 제약 실험</strong>
          <span>같은 정보 · 다른 디자인 제약 · 5가지 결과 비교</span>
        </div>
        <div className="stepper">
          <button onClick={() => setIndex((index - 1 + count) % count)} aria-label="이전 상태">
            ←
          </button>
          <span className="stepper-count">
            <b>{current.no}</b> / 0{count}
          </span>
          <button onClick={() => setIndex((index + 1) % count)} aria-label="다음 상태">
            →
          </button>
        </div>
      </header>

      <main className="main">
        <StateTabs variants={variants} activeIndex={index} onSelect={setIndex} />

        <section className="stage">
          <div className={`stage-tag${peek && current.id !== baseline.id ? ' peek' : ''}`}>
            {peek && current.id !== baseline.id ? '기본안 보는 중 — Space를 떼면 돌아갑니다' : `${shown.no} ${shown.name}`}
          </div>
          <PhoneFrame>
            <Screen key={shown.id} />
          </PhoneFrame>
          <div className="stage-actions">
            <button
              className="peek-btn"
              disabled={current.id === baseline.id}
              onPointerDown={() => setPeek(true)}
              onPointerUp={() => setPeek(false)}
              onPointerLeave={() => setPeek(false)}
            >
              누르고 있으면 기본안과 비교
            </button>
            <span className="stage-hint">화면 안에서 스크롤할 수 있습니다</span>
          </div>
        </section>

        <NotesPanel variant={current} baseline={baseline} />
      </main>
    </div>
  );
}
