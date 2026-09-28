import Shell, { TabBar } from './Shell.jsx';
import Icon from '../components/Icon.jsx';
import { accounts, totalAssets, assetChange, card, transfer, transactionsByDay } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './minimal.css';

function Section({ title, count, link, children }) {
  return (
    <section className="mc-sec">
      <div className="mc-sec-head">
        <h3>
          {title}
          {count && <span className="mc-count">{count}</span>}
        </h3>
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
        <span>모아뱅크</span>
        <Icon name="bell" size={22} />
      </header>

      <section className="mc-total">
        <div className="mc-label">총자산</div>
        <div className="mc-amount num">{won(totalAssets)}원</div>
        <div className="mc-change">
          지난달보다 <b className="num">+{won(assetChange.amount)}원</b> ({assetChange.rate}%)
        </div>
        <div className="mc-actions">
          <button className="mc-btn solid">송금</button>
          <button className="mc-btn">계좌 관리</button>
        </div>
      </section>

      <Section title="계좌" count={accounts.length} link="전체">
        {accounts.map((a) => (
          <div key={a.id} className="mc-row">
            <Icon name={a.icon} size={20} className="mc-row-icon" />
            <div className="mc-row-main">
              <div className="mc-row-title">{a.name}</div>
              <div className="mc-row-sub">{a.number}</div>
            </div>
            <div className="mc-row-amt num">{won(a.balance)}원</div>
          </div>
        ))}
      </Section>

      <Section title="송금" link={`1일 한도 ${won(transfer.dailyLimit)}원`}>
        <div className="mc-people">
          <span className="mc-person">
            <span className="mc-avatar">
              <Icon name="plus" size={18} />
            </span>
            새 송금
          </span>
          {transfer.recent.map((p) => (
            <span key={p.name} className="mc-person">
              <span className="mc-avatar">{p.name[0]}</span>
              {p.name}
            </span>
          ))}
        </div>
      </Section>

      <Section title="이번 달 카드" link={card.name}>
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

      <Section title="최근 거래" link="전체">
        {transactionsByDay.map((g) => (
          <div key={g.date}>
            <div className="mc-date">{g.day}</div>
            {g.items.map((t) => (
              <div key={t.id} className="mc-row">
                <div className="mc-row-main">
                  <div className="mc-row-title">{t.name}</div>
                  <div className="mc-row-sub">
                    {t.time} · {t.category}
                  </div>
                </div>
                <div className={`mc-row-amt num${t.amount > 0 ? ' plus' : ''}`}>{signed(t.amount)}원</div>
              </div>
            ))}
          </div>
        ))}
      </Section>
    </Shell>
  );
}
