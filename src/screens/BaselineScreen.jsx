import Shell, { TabBar } from './Shell.jsx';
import Icon from '../components/Icon.jsx';
import { user, accounts, totalAssets, assetChange, card, transfer, transactions } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './baseline.css';

const tones = {
  wallet: ['#EAF1FF', '#2A62F0'],
  layers: ['#FFF3E0', '#EE8A00'],
  trend: ['#E6F7EE', '#12A05C'],
  coffee: ['#F5EDE6', '#8A5A33'],
  transfer: ['#EAF1FF', '#2A62F0'],
  bag: ['#FDECEF', '#E0445E'],
  home: ['#EEF0F3', '#4E5968'],
  store: ['#E9F7F5', '#0E9F8E'],
  won: ['#EAF1FF', '#2A62F0'],
};
const avatarTones = [['#FFE8E8', '#E0445E'], ['#E6F7EE', '#12A05C'], ['#F1EDFF', '#6B4EE6']];

function RoundIcon({ name }) {
  const [bg, fg] = tones[name];
  return (
    <span className="bl-row-icon" style={{ background: bg, color: fg }}>
      <Icon name={name} size={19} stroke={2} />
    </span>
  );
}

export default function BaselineScreen() {
  const usage = Number(pct(card.spent, card.limit, 0));
  return (
    <Shell className="bl" nav={<TabBar mode="icon" />}>
      <header className="bl-header">
        <div className="bl-logo">
          <span className="bl-logo-mark">M</span>모아뱅크
        </div>
        <div className="bl-header-icons">
          <Icon name="search" size={22} />
          <Icon name="bell" size={22} />
          <Icon name="menu" size={22} />
        </div>
      </header>

      <p className="bl-greet">{user.name}님, 좋은 하루 보내세요 👋</p>

      <section className="bl-hero">
        <div className="bl-hero-top">
          총자산 <Icon name="eye" size={16} />
        </div>
        <div className="bl-hero-amount num">
          {won(totalAssets)}
          <small>원</small>
        </div>
        <div className="bl-hero-change">
          ▲ {won(assetChange.amount)}원 ({assetChange.rate}%) 지난달 대비
        </div>
        <div className="bl-hero-actions">
          <button>계좌 보기</button>
          <button className="primary">송금하기</button>
        </div>
      </section>

      <section className="bl-card bl-quick">
        {[
          ['send', '송금'],
          ['qr', 'QR 결제'],
          ['card', '카드'],
          ['trend', '투자'],
        ].map(([icon, label]) => (
          <span key={label} className="bl-quick-item">
            <span className="bl-quick-icon">
              <Icon name={icon} size={22} stroke={2} />
            </span>
            {label}
          </span>
        ))}
      </section>

      <section className="bl-card">
        <div className="bl-card-head">
          <h3>내 계좌</h3>
          <span className="bl-more">전체보기 ›</span>
        </div>
        {accounts.map((a) => (
          <div key={a.id} className="bl-row">
            <RoundIcon name={a.icon} />
            <div className="bl-row-main">
              <div className="bl-row-title">{a.name}</div>
              <div className="bl-row-sub">{a.number}</div>
            </div>
            <div className="bl-row-amt num">{won(a.balance)}원</div>
          </div>
        ))}
      </section>

      <section className="bl-card">
        <div className="bl-card-head">
          <h3>이번 달 카드 사용</h3>
          <span className="bl-badge">지난달보다 {Math.abs(card.vsLastMonth)}% ↓</span>
        </div>
        <div className="bl-card-amt num">{won(card.spent)}원</div>
        <div className="bl-progress">
          <span style={{ width: `${usage}%` }} />
        </div>
        <div className="bl-meta">
          <span>한도 {won(card.limit)}원 중 {usage}%</span>
          <span>결제일 {card.due}</span>
        </div>
      </section>

      <section className="bl-card">
        <div className="bl-card-head">
          <h3>최근 송금</h3>
          <span className="bl-more">한도 {won(transfer.dailyLimit)}원</span>
        </div>
        <div className="bl-people">
          <span className="bl-person">
            <span className="bl-avatar bl-avatar-add">
              <Icon name="plus" size={20} stroke={2.2} />
            </span>
            새 송금
          </span>
          {transfer.recent.map((p, i) => (
            <span key={p.name} className="bl-person">
              <span className="bl-avatar" style={{ background: avatarTones[i][0], color: avatarTones[i][1] }}>
                {p.name[0]}
              </span>
              {p.name}
            </span>
          ))}
        </div>
      </section>

      <section className="bl-card">
        <div className="bl-card-head">
          <h3>최근 거래</h3>
          <span className="bl-more">더보기 ›</span>
        </div>
        {transactions.map((t) => (
          <div key={t.id} className="bl-row">
            <RoundIcon name={t.icon} />
            <div className="bl-row-main">
              <div className="bl-row-title">{t.name}</div>
              <div className="bl-row-sub">
                {t.category} · {t.day} {t.time}
              </div>
            </div>
            <div className={`bl-row-amt num${t.amount > 0 ? ' plus' : ''}`}>{signed(t.amount)}원</div>
          </div>
        ))}
      </section>
      <div className="bl-end" />
    </Shell>
  );
}
