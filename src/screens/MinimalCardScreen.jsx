import Shell, { TabBar } from './Shell.jsx';
import Icon from '../components/Icon.jsx';
import RoundIcon from './RoundIcon.jsx';
import { avatarTones, quickActions } from './tones.js';
import { brand, user, accounts, totalAssets, assetChange, card, transfer, transactions } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './minimal.css';

// 기본안과 같은 순서·색·아이콘을 유지하고 "카드 컨테이너"만 걷어낸 버전.
function Section({ title, link, children }) {
  return (
    <section className="mc-sec">
      <div className="mc-sec-head">
        <h3>{title}</h3>
        {link && <span className="mc-link">{link}</span>}
      </div>
      {children}
    </section>
  );
}

export default function MinimalCardScreen() {
  const usage = pct(card.spent, card.limit, 0);
  return (
    <Shell className="mc" nav={<TabBar mode="icon" />}>
      <header className="mc-head">
        <div className="mc-logo">
          <span className="mc-logo-mark">{brand.mark}</span>
          {brand.name}
        </div>
        <div className="mc-head-icons">
          <Icon name="search" size={22} />
          <Icon name="bell" size={22} />
          <Icon name="menu" size={22} />
        </div>
      </header>

      <section className="mc-total">
        <p className="mc-greet">{user.name}님, 좋은 하루 보내세요</p>
        <div className="mc-label">
          총자산 <Icon name="eye" size={15} />
        </div>
        <div className="mc-amount num">
          {won(totalAssets)}
          <small>원</small>
        </div>
        <div className="mc-change">
          <b className="num">▲ {won(assetChange.amount)}원</b> ({assetChange.rate}%) 지난달 대비
        </div>
        <div className="mc-actions">
          <button className="mc-btn">계좌 보기</button>
          <button className="mc-btn solid">송금하기</button>
        </div>
      </section>

      <div className="mc-quick">
        {quickActions.map(([icon, label]) => (
          <span key={label} className="mc-quick-item">
            <Icon name={icon} size={24} stroke={1.9} />
            {label}
          </span>
        ))}
      </div>

      <Section title="내 계좌" link="전체보기 ›">
        {accounts.map((a) => (
          <div key={a.id} className="mc-row">
            <RoundIcon name={a.icon} />
            <div className="mc-row-main">
              <div className="mc-row-title">{a.name}</div>
              <div className="mc-row-sub">{a.number}</div>
            </div>
            <div className="mc-row-amt num">{won(a.balance)}원</div>
          </div>
        ))}
      </Section>

      <Section title="이번 달 카드 사용" link={`지난달보다 ${Math.abs(card.vsLastMonth)}% ↓`}>
        <div className="mc-card-amt num">{won(card.spent)}원</div>
        <div className="mc-bar">
          <span style={{ width: `${usage}%` }} />
        </div>
        <div className="mc-meta">
          <span>
            한도 {won(card.limit)}원 중 {usage}%
          </span>
          <span>결제일 {card.due}</span>
        </div>
      </Section>

      <Section title="최근 송금" link={`한도 ${won(transfer.dailyLimit)}원`}>
        <div className="mc-people">
          <span className="mc-person">
            <span className="mc-avatar mc-avatar-add">
              <Icon name="plus" size={20} stroke={2.2} />
            </span>
            새 송금
          </span>
          {transfer.recent.map((p, i) => (
            <span key={p.name} className="mc-person">
              <span className="mc-avatar" style={{ background: avatarTones[i][0], color: avatarTones[i][1] }}>
                {p.name[0]}
              </span>
              {p.name}
            </span>
          ))}
        </div>
      </Section>

      <Section title="최근 거래" link="더보기 ›">
        {transactions.map((t) => (
          <div key={t.id} className="mc-row">
            <RoundIcon name={t.icon} />
            <div className="mc-row-main">
              <div className="mc-row-title">{t.name}</div>
              <div className="mc-row-sub">
                {t.category} · {t.day} {t.time}
              </div>
            </div>
            <div className={`mc-row-amt num${t.amount > 0 ? ' plus' : ''}`}>{signed(t.amount)}원</div>
          </div>
        ))}
      </Section>
    </Shell>
  );
}
