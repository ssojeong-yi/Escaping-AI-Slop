import Shell, { TabBar } from './Shell.jsx';
import Icon from '../components/Icon.jsx';
import { brand, asOf, accounts, totalAssets, assetChange, card, transfer, transactionsByDay } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './final.css';

// 최종안: 앞선 실험에서 효과가 좋았던 원칙만 골라 실제 뱅킹앱 수준으로 정리.
// - 총자산은 박스 없이 타이포그래피로 (02·03)
// - 카드 사용액·잔액을 총자산 바로 아래 나란히 (04)
// - 구분은 선·여백·정렬로 (05), 박스는 기능 묶음인 송금 하나만
// - 아이콘은 행동을 설명할 때만, 강조색은 하나
function SectionHead({ title, count, link }) {
  return (
    <div className="fn-sec-head">
      <h3>
        {title}
        {count != null && <span>{count}</span>}
      </h3>
      {link && <span className="fn-link">{link}</span>}
    </div>
  );
}

export default function FinalScreen() {
  const usage = pct(card.spent, card.limit, 0);
  const checking = accounts[0];
  return (
    <Shell className="fn" nav={<TabBar mode="icon" />}>
      <header className="fn-head">
        <span className="fn-brand">{brand.name}</span>
        <span className="fn-head-right">
          <span className="num">{asOf.short}</span>
          <Icon name="bell" size={21} />
        </span>
      </header>

      <section className="fn-total">
        <div className="fn-label">총자산</div>
        <div className="fn-amount num">
          {won(totalAssets)}
          <span>원</span>
        </div>
        <div className="fn-delta">
          지난달보다 <b className="num">+{won(assetChange.amount)}원</b> · {assetChange.rate}%
        </div>
        <div className="fn-actions">
          <button className="fn-btn primary">
            <Icon name="send" size={17} stroke={2} />
            송금
          </button>
          <button className="fn-btn">
            <Icon name="qr" size={17} stroke={2} />
            QR 결제
          </button>
        </div>
      </section>

      <section className="fn-summary">
        <div className="fn-cell">
          <div className="fn-cell-label">이번 달 카드</div>
          <div className="fn-cell-value num">
            {won(card.spent)}
            <span>원</span>
          </div>
          <div className="fn-meter">
            <span style={{ width: `${usage}%` }} />
          </div>
          <div className="fn-cell-sub num">
            한도 {usage}% · 결제 {card.dueShort}
          </div>
        </div>
        <div className="fn-cell">
          <div className="fn-cell-label">바로 쓸 수 있는 돈</div>
          <div className="fn-cell-value num">
            {won(checking.balance)}
            <span>원</span>
          </div>
          <div className="fn-cell-sub fn-cell-sub-gap">{checking.name}</div>
        </div>
      </section>

      <section className="fn-sec">
        <SectionHead title="계좌" count={accounts.length} link="전체 ›" />
        {accounts.map((a) => (
          <div key={a.id} className="fn-row">
            <div className="fn-row-main">
              <div className="fn-row-title">{a.name}</div>
              <div className="fn-row-sub num">
                {a.type} · {a.number}
              </div>
            </div>
            <div className="fn-row-amt num">{won(a.balance)}원</div>
          </div>
        ))}
      </section>

      <section className="fn-sec">
        <SectionHead title="송금" link={`1일 한도 ${won(transfer.dailyLimit)}원`} />
        <div className="fn-send">
          {transfer.recent.map((p) => (
            <span key={p.name} className="fn-send-item">
              <b>{p.name}</b>
              <small className="num">
                {p.bank} ···{p.tail}
              </small>
            </span>
          ))}
          <span className="fn-send-item fn-send-new">
            <Icon name="plus" size={18} stroke={2} />
            새 송금
          </span>
        </div>
      </section>

      <section className="fn-sec">
        <SectionHead title="최근 거래" link="전체 ›" />
        {transactionsByDay.map((g) => (
          <div key={g.date}>
            <div className="fn-day">
              {g.day} <span className="num">{g.date}</span>
            </div>
            {g.items.map((t) => (
              <div key={t.id} className="fn-row fn-tx">
                <div className="fn-row-main">
                  <div className="fn-row-title">{t.name}</div>
                  <div className="fn-row-sub num">
                    {t.time} · {t.category}
                  </div>
                </div>
                <div className={`fn-row-amt num${t.amount > 0 ? ' in' : ''}`}>{signed(t.amount)}원</div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </Shell>
  );
}
