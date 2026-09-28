import Icon from '../components/Icon.jsx';
import { iconTones } from './tones.js';

/** 색상 원 배경 위의 아이콘 (기본안 · 카드 최소화 공용) */
export default function RoundIcon({ name }) {
  const [bg, fg] = iconTones[name];
  return (
    <span className="round-icon" style={{ background: bg, color: fg }}>
      <Icon name={name} size={19} stroke={2} />
    </span>
  );
}
