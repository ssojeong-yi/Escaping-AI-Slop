import Shell, { TabBar } from './Shell.jsx';
import {
  brand,
  asOf,
  accounts,
  totalAssets,
  assetChange,
  card,
  transfer,
  transactionsByDay,
  transactionSummary,
} from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './infofirst.css';

// 색 대신 명도 단계로 구성 비율을 구분한다.
const shades = ['#0E0E0E', '#6E6E6E', '#B4B4B4', '#DCDCDC'];

function Row({ label, meta, children }) {
  return (
    <section className="if-sec">
      <div className="if-sec-label">
        {label}
        {meta && <span>{meta}</span>}
      </div>
      <div className="if-sec-body">{children}</div>
    </section>
  );
}

export default function InfoFirstScreen() {
  return (
    <Shell className="if" nav={<TabBar mode="text" />}>
      <header className="if-head">
        <strong>{brand.name}</strong>
        <span className="num">
          {asOf.short} {asOf.time} 기준
        </span>
      </header>

      <section className="if-total">
        <div className="if-total-label">총자산</div>
        <div className="if-total-line">
          <span className="if-total-num">{won(totalAssets)}</span>
          <span className="if-unit">원</span>
          <span className="if-total-delta">
            +{won(assetChange.amount)} ({assetChange.rate}%)
          </span>
        </div>
        <div className="if-bar">
          {accounts.map((a, i) => (
            <span key={a.id} style={{ flex: a.balance, background: shades[i] }} />
          ))}
        </div>
      </section>

      <Row label="계좌" meta={`${accounts.length}`}>
        <div className="if-tr if-th">
          <span>계좌</span>
          <span>비중</span>
          <span>잔액</span>
        </div>
        {accounts.map((a, i) => (
          <div key={a.id} className="if-tr">
            <span className="if-name">
              <i style={{ background: shades[i] }} />
              {a.name}
              <small>{a.number}</small>
            </span>
            <span className="if-pct">{pct(a.balance, totalAssets)}%</span>
            <span className="if-amt">{won(a.balance)}</span>
          </div>
        ))}
      </Row>

      <Row label="송금" meta="최근">
        {transfer.recent.map((p) => (
          <div key={p.name} className="if-send">
            <span className="if-name">
              {p.name}
              <small>
                {p.bank} ···{p.tail}
              </small>
            </span>
            <span className="if-link">보내기 →</span>
          </div>
        ))}
        <div className="if-foot">
          <span className="if-link">+ 새 송금</span>
          <span>1일 한도 {won(transfer.dailyLimit)}</span>
        </div>
      </Row>

      <Row label="카드" meta="9월">
        <div className="if-card-line">
          <span className="if-card-num">
            {won(card.spent)}
            <span className="if-unit">원</span>
          </span>
          <span className="if-muted">
            / {won(card.limit)} · {pct(card.spent, card.limit, 0)}%
          </span>
        </div>
        <div className="if-bar if-bar-sm">
          {card.categories.map((c, i) => (
            <span key={c.name} style={{ flex: c.amount, background: shades[i] }} />
          ))}
        </div>
        <div className="if-cats">
          {card.categories.map((c, i) => (
            <span key={c.name} className="if-cat">
              <span>
                <i style={{ background: shades[i] }} />
                {c.name}
              </span>
              <span className="if-amt">{won(c.amount)}</span>
            </span>
          ))}
        </div>
        <div className="if-foot">
          <span>
            결제 {card.dueShort} (D-{card.dDay})
          </span>
          <span>전월 대비 {card.vsLastMonth}%</span>
        </div>
      </Row>

      <Row label="거래" meta="7일">
        <div className="if-sum">
          <span>
            지출 <b>{won(transactionSummary.spent)}</b>
          </span>
          <span>
            수입 <b className="if-in">{won(transactionSummary.earned)}</b>
          </span>
        </div>
        {transactionsByDay.map((g) =>
          g.items.map((t, i) => (
            <div key={t.id} className={`if-tx${i === g.items.length - 1 ? ' last' : ''}`}>
              <span className="if-date">{i === 0 ? g.date : ''}</span>
              <span className="if-name">
                {t.name}
                <small>
                  {t.time} · {t.category}
                </small>
              </span>
              <span className={`if-amt${t.amount > 0 ? ' if-in' : ''}`}>{signed(t.amount)}</span>
            </div>
          ))
        )}
      </Row>
      <div className="if-end" />
    </Shell>
  );
}
