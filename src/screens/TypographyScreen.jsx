import Shell, { TabBar } from './Shell.jsx';
import { brand, user, asOf, accounts, totalAssets, assetChange, card, transfer, transactionsByDay } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './typography.css';

function Section({ index, title, aside, children }) {
  return (
    <section className="ty-sec">
      <div className="ty-sec-title">
        <span>
          <em>{index}</em>
          {title}
        </span>
        {aside && <span className="ty-aside">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

export default function TypographyScreen() {
  return (
    <Shell className="ty" nav={<TabBar mode="text" />}>
      <header className="ty-head">
        <span className="ty-brand">{brand.name}</span>
        <span className="ty-head-meta">{asOf.date}</span>
      </header>

      <h1 className="ty-greet">
        <span>좋은 아침이에요,</span>
        <br />
        {user.short}님.
      </h1>

      <section className="ty-total">
        <div className="ty-kicker">총자산</div>
        <div className="ty-total-num num">
          {won(totalAssets)}
          <span>원</span>
        </div>
        <p className="ty-total-sub">
          지난달보다 <b className="num">{won(assetChange.amount)}원</b> 늘었어요 · {assetChange.rate}%
        </p>
      </section>

      <Section index="01" title="계좌" aside={`${accounts.length}개`}>
        {accounts.map((a) => (
          <div key={a.id} className="ty-acc">
            <div>
              <div className="ty-acc-name">{a.name}</div>
              <div className="ty-acc-no num">{a.number}</div>
            </div>
            <div className="ty-acc-amt num">{won(a.balance)}</div>
          </div>
        ))}
      </Section>

      <Section index="02" title="송금" aside={`한도 ${won(transfer.dailyLimit)}원`}>
        <div className="ty-send">
          송금하기<span>→</span>
        </div>
        <p className="ty-send-recent">
          최근 보낸 사람 — {transfer.recent.map((p) => p.name).join(', ')}
        </p>
      </Section>

      <Section index="03" title="이번 달 카드" aside={card.name}>
        <div className="ty-card-num num">
          {won(card.spent)}
          <span>원</span>
        </div>
        <p className="ty-card-lines">
          한도 {won(card.limit)}원 중 <b>{pct(card.spent, card.limit, 0)}%</b> 사용
          <br />
          결제일 <b>{card.due}</b> · 지난달보다 {Math.abs(card.vsLastMonth)}% 적게 썼어요
        </p>
      </Section>

      <Section index="04" title="최근 거래" aside="전체보기">
        {transactionsByDay.map((g) => (
          <div key={g.date} className="ty-day-group">
            <div className="ty-day">
              {g.day} <span className="num">{g.date}</span>
            </div>
            {g.items.map((t) => (
              <div key={t.id} className={`ty-tx${t.amount > 0 ? ' in' : ''}`}>
                <span className="ty-tx-name">
                  {t.name}
                  <small>{t.category}</small>
                </span>
                <span className="ty-tx-amt num">{signed(t.amount)}</span>
              </div>
            ))}
          </div>
        ))}
      </Section>
    </Shell>
  );
}
