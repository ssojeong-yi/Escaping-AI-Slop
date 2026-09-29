// 최종안(6단계) 전용 렌더러: design/banking/*.md 에서 읽은 프로필로 만든 schema를 그린다.
// 금융앱 기능 구조(총자산 → 대표 계좌·송금 → 계좌·송금·카드·거래 → 하단 탭)는 항상 같고,
// 섹션 순서·표현 방식·구분 방식·밀도·버튼·색은 schema(= 참고 문서 내용)가 정한다.
import Shell, { TabBar } from '../Shell.jsx';
import Icon from '../../components/Icon.jsx';
import {
  brand,
  user,
  asOf,
  accounts,
  totalAssets,
  assetChange,
  card,
  transfer,
  transactions,
  transactionsByDay,
} from '../../data/finance.js';
import { won, signed, pct } from '../../lib/format.js';
import './reference.css';

const [primary, ...others] = accounts;
const usage = pct(card.spent, card.limit, 0);

function Amount({ value, className = '' }) {
  return (
    <span className={`rf-amt num ${className}`}>
      {won(value)}
      <span className="rf-unit">원</span>
    </span>
  );
}

function SectionHead({ title, meta, link }) {
  return (
    <div className="rf-sec-head">
      <h3>
        {title}
        {meta != null && <span>{meta}</span>}
      </h3>
      {link && (
        <span className="rf-link">
          {link}
          <Icon name="chevron" size={14} stroke={2} />
        </span>
      )}
    </div>
  );
}

function Header({ schema }) {
  return (
    <>
      <header className="rf-head">
        <span className="rf-brand">{brand.name}</span>
        {schema.header.meta === 'bell' ? (
          <Icon name="bell" size={21} />
        ) : (
          <span className="rf-head-date num">{asOf.short}</span>
        )}
      </header>
      {schema.header.quickNav && (
        <nav className="rf-quick">
          {['조회', '이체', '카드', '공과금', '전체'].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </nav>
      )}
    </>
  );
}

function Total() {
  return (
    <section className="rf-total">
      <div className="rf-label">{user.name}님의 총자산</div>
      <Amount value={totalAssets} className="rf-total-amt" />
      <div className="rf-total-sub">
        <span>
          지난달보다 <b className="num in">+{won(assetChange.amount)}원</b>
        </span>
        <span className="rf-link">
          자산 분석
          <Icon name="chevron" size={14} stroke={2} />
        </span>
      </div>
    </section>
  );
}

function Primary({ schema }) {
  return (
    <section className={`rf-primary ${schema.primary.style}`}>
      <div className="rf-primary-top">
        <div>
          <div className="rf-primary-name">{primary.name}</div>
          <div className="rf-sub num">{primary.number}</div>
        </div>
        <span className="rf-tag">대표</span>
      </div>
      <Amount value={primary.balance} className="rf-primary-amt" />
      <div className="rf-actions">
        <button className="rf-btn">내역</button>
        <button className="rf-btn primary">
          <Icon name="send" size={16} stroke={2.1} />
          송금
        </button>
      </div>
    </section>
  );
}

/* ---------- 섹션 본문 ---------- */

function Others() {
  return (
    <>
      <SectionHead title="다른 계좌" meta={others.length} link="전체" />
      {others.map((a) => (
        <div key={a.id} className="rf-row">
          <div className="rf-row-main">
            <div className="rf-row-title">{a.name}</div>
            <div className="rf-sub">
              {a.type} · {a.note}
            </div>
          </div>
          <span className="rf-row-amt num">{won(a.balance)}원</span>
        </div>
      ))}
    </>
  );
}

function Transfer({ schema }) {
  const style = schema.transfer.style;
  const names = transfer.recent.map((p) => p.name);
  return (
    <>
      <SectionHead title="송금" meta={style === 'input' ? null : '최근 보낸 사람'} link={null} />
      {style === 'input' ? (
        <>
          <div className="rf-input-row">
            <span className="rf-input">받는 분 계좌번호 입력</span>
            <button className="rf-btn primary sm">보내기</button>
          </div>
          <div className="rf-sub rf-recent-line">최근 · {names.join(' · ')}</div>
        </>
      ) : (
        <div className={`rf-recipients ${style}`}>
          {transfer.recent.map((p) => (
            <span key={p.name} className="rf-recipient">
              {p.name}
            </span>
          ))}
          <span className="rf-recipient add">
            <Icon name="plus" size={13} stroke={2.2} />새 송금
          </span>
        </div>
      )}
      <div className="rf-foot">
        <span>1일 이체한도 {won(transfer.dailyLimit)}원</span>
      </div>
    </>
  );
}

function Card({ schema }) {
  return (
    <>
      <SectionHead title="이번 달 카드" meta={card.name} link="내역" />
      <div className="rf-card-line">
        <Amount value={card.spent} className="rf-card-amt" />
        <span className="rf-sub num">결제일 {card.due}</span>
      </div>
      <div className="rf-meter" role="img" aria-label={`한도의 ${usage}% 사용`}>
        <span style={{ width: `${usage}%` }} />
      </div>
      {schema.card.detail && (
        <div className="rf-cats">
          {card.categories.map((c) => (
            <span key={c.name}>
              {c.name} <b className="num">{won(c.amount)}</b>
            </span>
          ))}
        </div>
      )}
      <div className="rf-foot num">
        <span>
          한도 {won(card.limit)}원 중 {usage}%
        </span>
        <span>지난달보다 {Math.abs(card.vsLastMonth)}% 적게 씀</span>
      </div>
    </>
  );
}

function Tx({ schema }) {
  const style = schema.tx.style;
  const amount = (t) => <span className={`rf-row-amt num${t.amount > 0 ? ' in' : ''}`}>{signed(t.amount)}원</span>;
  return (
    <>
      <SectionHead title="최근 거래" link="전체" />
      {style === 'grouped' &&
        transactionsByDay.map((g) => (
          <div key={g.date}>
            <div className="rf-day">{g.day}</div>
            {g.items.map((t) => (
              <div key={t.id} className="rf-row">
                <div className="rf-row-main">
                  <div className="rf-row-title">{t.name}</div>
                  <div className="rf-sub num">
                    {t.time} · {t.category}
                  </div>
                </div>
                {amount(t)}
              </div>
            ))}
          </div>
        ))}
      {style === 'flat' &&
        transactions.map((t) => (
          <div key={t.id} className="rf-row">
            <div className="rf-row-main">
              <div className="rf-row-title">{t.name}</div>
              <div className="rf-sub num">
                {t.day} {t.time} · {t.category}
              </div>
            </div>
            {amount(t)}
          </div>
        ))}
      {style === 'dense' &&
        transactionsByDay.map((g) =>
          g.items.map((t, i) => (
            <div key={t.id} className="rf-ledger">
              <span className="rf-ledger-date num">{i === 0 ? g.date : ''}</span>
              <span className="rf-ledger-name">
                {t.name}
                <small>{t.category}</small>
              </span>
              {amount(t)}
            </div>
          ))
        )}
      {style === 'disclosure' &&
        transactions.map((t) => (
          <div key={t.id} className="rf-row rf-disclosure">
            <div className="rf-row-main">
              <div className="rf-row-title">{t.name}</div>
              <div className="rf-sub num">
                {t.day} {t.time} · {t.category}
              </div>
            </div>
            {amount(t)}
            <Icon name="chevron" size={16} stroke={2} className="rf-chev" />
          </div>
        ))}
    </>
  );
}

const UNITS = { others: Others, transfer: Transfer, card: Card, tx: Tx };

export default function ReferenceScreen({ schema }) {
  const t = schema.tokens;
  const style = {
    '--canvas': t.canvas,
    '--ink': t.ink,
    '--sub': t.sub,
    '--muted': t.muted,
    '--line': t.line,
    '--surface': t.surface,
    '--action': t.action,
    '--accent': t.accent || t.ink,
    '--r': `${t.radius}px`,
    '--body': `${t.bodySize}px`,
    '--bw': t.bodyWeight,
    '--tw': t.titleWeight,
  };
  const className = [
    'rf',
    `act-${schema.actionStyle}`,
    `d-${schema.density}`,
    `sec-${schema.sectionStyle}`,
    `total-${schema.total.scale}`,
    schema.listSquare ? 'square' : '',
    t.accent ? 'has-accent' : 'mono',
  ].join(' ');

  return (
    <Shell className={className} style={style} nav={<TabBar mode="icon" />}>
      <Header schema={schema} />
      <Total />
      <Primary schema={schema} />
      {schema.order.map((u) => {
        const Unit = UNITS[u];
        return (
          <section key={u} className={`rf-sec rf-${u}`}>
            <Unit schema={schema} />
          </section>
        );
      })}
      <div className="rf-end" />
    </Shell>
  );
}
