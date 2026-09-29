import Shell, { TabBar } from './Shell.jsx';
import Icon from '../components/Icon.jsx';
import { brand, user, asOf, accounts, totalAssets, assetChange, card, transfer, transactions } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './nohero.css';

function Tile({ label, icon, value, sub, children }) {
  return (
    <div className="nh-tile">
      <div className="nh-tile-label">
        {label}
        <Icon name={icon} size={16} />
      </div>
      {value && (
        <div className="nh-tile-value num">
          {value}
          <span>원</span>
        </div>
      )}
      {children}
      {sub && <div className="nh-tile-sub">{sub}</div>}
    </div>
  );
}

export default function NoHeroScreen() {
  const usage = pct(card.spent, card.limit, 0);
  const checking = accounts[0];
  return (
    <Shell className="nh" nav={<TabBar mode="icon" />}>
      <header className="nh-head">
        <div>
          <div className="nh-date">
            <b>{brand.name}</b> · {asOf.date}
          </div>
          <div className="nh-title">{user.short}님의 오늘</div>
        </div>
        <div className="nh-head-btns">
          <span>
            <Icon name="bell" size={19} />
          </span>
          <span>
            <Icon name="user" size={19} />
          </span>
        </div>
      </header>

      <div className="nh-grid">
        <Tile label="총자산" icon="chart" value={won(totalAssets)} sub={`▲ ${assetChange.rate}% 지난달 대비`} />
        <Tile label="이번 달 카드" icon="card" value={won(card.spent)} sub={`한도의 ${usage}% · 결제 ${card.dueShort}`}>
          <div className="nh-minibar">
            <span style={{ width: `${usage}%` }} />
          </div>
        </Tile>
        <Tile label="바로 쓸 수 있는 돈" icon="wallet" value={won(checking.balance)} sub={checking.name} />
        <Tile label="송금" icon="send">
          <div className="nh-send-names">{transfer.recent.map((p) => p.name).join(' · ')}</div>
          <button className="nh-send-btn">보내기</button>
        </Tile>
      </div>

      <section className="nh-mod">
        <div className="nh-mod-head">
          계좌 <span>{accounts.length}개 · 전체</span>
        </div>
        {accounts.map((a) => (
          <div key={a.id} className="nh-row">
            <div>
              <div className="nh-row-title">{a.name}</div>
              <div className="nh-row-sub">
                {a.type} · {a.number}
              </div>
            </div>
            <div className="nh-row-amt num">{won(a.balance)}원</div>
          </div>
        ))}
      </section>

      <section className="nh-mod">
        <div className="nh-mod-head">
          최근 거래 <span>전체</span>
        </div>
        {transactions.map((t) => (
          <div key={t.id} className="nh-row">
            <div>
              <div className="nh-row-title">{t.name}</div>
              <div className="nh-row-sub">
                {t.day} {t.time} · {t.category}
              </div>
            </div>
            <div className={`nh-row-amt num${t.amount > 0 ? ' plus' : ''}`}>{signed(t.amount)}원</div>
          </div>
        ))}
      </section>
      <div className="nh-end" />
    </Shell>
  );
}
