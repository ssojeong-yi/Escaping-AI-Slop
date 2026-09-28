import Icon from '../components/Icon.jsx';
import './shell.css';

const tabs = [
  { label: '홈', icon: 'home' },
  { label: '자산', icon: 'chart' },
  { label: '송금', icon: 'send' },
  { label: '카드', icon: 'card' },
  { label: '전체', icon: 'menu' },
];

function StatusBar() {
  return (
    <div className="sb">
      <span className="num">9:41</span>
      <span className="sb-icons" aria-hidden="true">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="6" rx="1" />
          <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="15" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8 .5 10.2 10.2 0 0 0 .8 3.4L2 4.6a8.5 8.5 0 0 1 6-2.4zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.8 6.8 0 0 0 8 3.8a6.8 6.8 0 0 0-4.8 1.9l1.2 1.2c1-.9 2.2-1.4 3.6-1.4zM8 8.8c.5 0 1 .2 1.3.5L8 10.6 6.7 9.3c.3-.3.8-.5 1.3-.5z" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
          <path d="M24 4v4c.8-.3 1.3-1.1 1.3-2S24.8 4.3 24 4z" fill="currentColor" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/** mode: 'icon' = 아이콘 + 라벨, 'text' = 텍스트 전용 */
export function TabBar({ mode = 'icon' }) {
  return (
    <nav className={`tabbar tabbar-${mode}`}>
      {tabs.map((t, i) => (
        <span key={t.label} className={`tabbar-item${i === 0 ? ' active' : ''}`}>
          {mode === 'icon' && <Icon name={t.icon} size={22} stroke={i === 0 ? 2.1 : 1.8} />}
          {t.label}
        </span>
      ))}
    </nav>
  );
}

/** 모든 화면이 공유하는 뼈대: 상태바 / 스크롤 영역 / 탭바 / 홈 인디케이터 */
export default function Shell({ className, nav, children }) {
  return (
    <div className={`screen ${className}`}>
      <StatusBar />
      <div className="screen-body">{children}</div>
      {nav}
    </div>
  );
}
