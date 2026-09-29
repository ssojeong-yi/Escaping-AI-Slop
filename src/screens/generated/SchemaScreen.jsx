// UI schema → 모바일 화면. 무엇을 어떤 순서·표현으로 그릴지는 전부 schema가 정한다.
import Shell, { TabBar } from '../Shell.jsx';
import Icon from '../../components/Icon.jsx';
import RoundIcon from '../RoundIcon.jsx';
import { avatarTones, iconTones, quickActions } from '../tones.js';
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
  transactionSummary,
} from '../../data/finance.js';
import { won, signed, pct } from '../../lib/format.js';
import './generated.css';

const TITLES = {
  accountList: '계좌',
  transferAction: '송금',
  cardSpend: '이번 달 카드',
  recentTransactions: '최근 거래',
};
const META = {
  accountList: `${accounts.length}개`,
  transferAction: `한도 ${won(transfer.dailyLimit)}`,
  cardSpend: `결제 ${card.dueShort}`,
  recentTransactions: '최근 7일',
};
// 왼쪽 라벨 열(정보 중심)은 폭이 좁아서 짧은 이름을 쓴다
const SHORT = {
  accountList: ['계좌', `${accounts.length}개`],
  transferAction: ['송금', '최근'],
  cardSpend: ['카드', '9월'],
  recentTransactions: ['거래', '7일'],
};
const GRAYS = ['var(--strong)', 'var(--mid)', 'var(--soft)', 'var(--line)'];
const usage = pct(card.spent, card.limit, 0);
const checking = accounts[0];

const isDeco = (s) => s.iconUsage === 'decorative';
const hasIcons = (s) => s.iconUsage !== 'none';

/* ---------- 공통 조각 ---------- */

function Title({ type, schema, link = '전체 ›' }) {
  const n = schema.sectionOrder.filter((t) => t !== 'assetSummary').indexOf(type) + 1;
  return (
    <div className="g-title">
      <h3>
        {schema.numberedTitles && <em>{String(n).padStart(2, '0')}</em>}
        {TITLES[type]}
        {type === 'accountList' && <span className="g-count">{accounts.length}</span>}
      </h3>
      <span className="g-link">{type === 'accountList' || type === 'recentTransactions' ? link : META[type]}</span>
    </div>
  );
}

function Amount({ value, unit = '원', className = '' }) {
  return (
    <span className={`g-amt num ${className}`}>
      {won(value)}
      <span className="g-unit">{unit}</span>
    </span>
  );
}

function PrimaryActions({ schema, secondary = 'QR 결제' }) {
  if (!hasIcons(schema)) {
    return (
      <div className="g-textlinks">
        <span>송금하기 →</span>
        <span>계좌 보기 →</span>
      </div>
    );
  }
  return (
    <div className="g-actions">
      <button className={`g-btn primary ${schema.accentStyle}`}>
        <Icon name="send" size={17} stroke={2} />
        송금하기
      </button>
      <button className="g-btn">
        {secondary === 'QR 결제' && <Icon name="qr" size={17} stroke={2} />}
        {secondary}
      </button>
    </div>
  );
}

function QuickIcons({ boxed }) {
  return (
    <div className={`g-quick${boxed ? ' g-box' : ''}`}>
      {quickActions.map(([icon, label]) => (
        <span key={label} className="g-quick-item">
          <span className="g-quick-icon">
            <Icon name={icon} size={22} stroke={2} />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}

/* ---------- 헤더 ---------- */

function Header({ schema }) {
  const deco = isDeco(schema);
  const icons = deco ? ['search', 'bell', 'menu'] : hasIcons(schema) ? ['bell'] : [];
  const brandMark = (
    <div className="g-brand">
      {deco && <span className="g-brand-mark">{brand.mark}</span>}
      {brand.name}
    </div>
  );
  const right = icons.length ? (
    <div className="g-head-icons">
      {icons.map((n) => (
        <Icon key={n} name={n} size={22} />
      ))}
    </div>
  ) : (
    <span className="g-head-meta">{asOf.date}</span>
  );

  switch (schema.header) {
    case 'greeting':
      return (
        <header className="g-head g-head-greeting">
          <div className="g-head-row">
            {brandMark}
            <span className="g-head-meta">{asOf.date}</span>
          </div>
          <h1>
            <span>좋은 아침이에요,</span>
            <br />
            {user.short}님.
          </h1>
        </header>
      );
    case 'date':
      return (
        <header className="g-head g-head-row">
          <div>
            <div className="g-head-meta">
              <b className="g-head-brand">{brand.name}</b> · {asOf.date}
            </div>
            <div className="g-head-title">{user.short}님의 오늘</div>
          </div>
          {right}
        </header>
      );
    case 'dateline':
      return (
        <header className="g-head g-head-row g-dateline">
          {brandMark}
          <span className="g-head-meta num">
            {asOf.short} {asOf.time} 기준
          </span>
        </header>
      );
    default:
      return (
        <header className="g-head">
          <div className="g-head-row">
            {brandMark}
            {right}
          </div>
          {schema.header === 'brandGreeting' && <p className="g-greet">{user.name}님, 좋은 하루 보내세요</p>}
        </header>
      );
  }
}

/* ---------- assetSummary ---------- */

function AssetSummary({ variant, schema }) {
  const change = (
    <>
      지난달보다 <b className="num">+{won(assetChange.amount)}원</b> · {assetChange.rate}%
    </>
  );

  if (variant === 'hero') {
    return (
      <div className="g-stack">
        <div className={`g-hero tone-${schema.heroTone} al-${schema.alignment}`}>
          <div className="g-hero-label">
            총자산 <Icon name="eye" size={16} />
          </div>
          <Amount value={totalAssets} className="g-hero-amt" />
          <div className="g-hero-chg">
            ▲ {won(assetChange.amount)}원 ({assetChange.rate}%) 지난달 대비
          </div>
          <div className="g-hero-actions">
            <button>계좌 보기</button>
            <button className="primary">송금하기</button>
          </div>
        </div>
        {schema.quickMenu && <QuickIcons boxed />}
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div className={`g-asset al-${schema.alignment} em-${schema.assetEmphasis}`}>
        <div className="g-label">
          총자산 {isDeco(schema) && <Icon name="eye" size={15} />}
        </div>
        <Amount value={totalAssets} className="g-asset-amt" />
        <div className="g-sub g-asset-chg">{change}</div>
        <PrimaryActions schema={schema} secondary={schema.skin === 'final' ? 'QR 결제' : '계좌 보기'} />
        {schema.quickMenu && <QuickIcons />}
      </div>
    );
  }

  if (variant === 'strip') {
    const cells = [
      ['총자산', totalAssets, `▲ ${assetChange.rate}% 지난달 대비`],
      ['바로 쓸 수 있는 돈', checking.balance, checking.name],
    ];
    return (
      <div className="g-strip">
        {cells.map(([label, value, sub]) => (
          <div key={label} className="g-strip-cell">
            <div className="g-label">{label}</div>
            <Amount value={value} className="g-strip-amt" />
            <div className="g-sub">{sub}</div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="g-inline">
        <div className="g-label">총자산</div>
        <div className="g-inline-line">
          <Amount value={totalAssets} className="g-inline-amt" />
          <span className="g-inline-delta num">
            +{won(assetChange.amount)} ({assetChange.rate}%)
          </span>
        </div>
        <div className="g-bars">
          {accounts.map((a, i) => (
            <span key={a.id} style={{ flex: a.balance, background: GRAYS[i] }} />
          ))}
        </div>
        <div className="g-legend">
          {accounts.map((a, i) => (
            <span key={a.id}>
              <i style={{ background: GRAYS[i] }} />
              {a.type} {pct(a.balance, totalAssets, 0)}%
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'total') {
    // 최종안: 카드 없이 숫자로, 화면을 지배하지 않는 크기
    return (
      <div className={`g-total em-${schema.assetEmphasis}`}>
        <div className="g-label">{user.name}님의 총자산</div>
        <Amount value={totalAssets} className="g-total-amt" />
        <div className="g-total-sub">
          <span>
            지난달보다 <b className="num">+{won(assetChange.amount)}원</b>
          </span>
          <span className="g-link-chev">
            자산 분석
            <Icon name="chevron" size={14} stroke={2} />
          </span>
        </div>
      </div>
    );
  }

  // compact: 다른 요약과 나란히 놓이는 크기
  return (
    <div className="g-compact">
      <div className="g-compact-label">
        총자산 {hasIcons(schema) && <Icon name="chart" size={15} />}
      </div>
      <Amount value={totalAssets} className="g-compact-amt" />
      <div className="g-sub">▲ {assetChange.rate}% 지난달 대비</div>
    </div>
  );
}

/* ---------- accountList ---------- */

function PrimaryAccount({ variant, schema }) {
  const [primary, ...others] = accounts;
  const inline = variant === 'primaryInline';
  return (
    <div>
      <div className={`g-primary${inline ? ' inline' : ''}`}>
        <div className="g-primary-top">
          <div>
            <div className="g-row-title">{primary.name}</div>
            <div className="g-sub num">{primary.number}</div>
          </div>
          {!inline && <span className="g-tag">대표</span>}
        </div>
        <div className="g-primary-body">
          <Amount value={primary.balance} className="g-primary-amt" />
          {inline ? (
            <button className={`g-btn primary ${schema.accentStyle} g-primary-send`}>
              <Icon name="send" size={15} stroke={2.1} />
              송금
            </button>
          ) : null}
        </div>
        {!inline && (
          <div className="g-primary-actions">
            <button className="g-btn">내역</button>
            <button className={`g-btn primary ${schema.accentStyle}`}>
              <Icon name="send" size={16} stroke={2.1} />
              송금
            </button>
          </div>
        )}
      </div>
      {schema.embedTransfer && (
        <div className="g-embedded">
          <TransferAction variant={schema.sections.find((x) => x.type === 'transferAction').variant} schema={schema} />
        </div>
      )}
      <div className="g-others">
        <div className="g-others-head">
          다른 계좌 <span>{others.length}</span>
        </div>
        {others.map((a) => (
          <div key={a.id} className="g-row-item">
            <div className="g-row-main">
              <div className="g-row-title">{a.name}</div>
              <div className="g-sub">
                {a.type} · {a.note}
              </div>
            </div>
            <span className="g-row-amt num">{won(a.balance)}원</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountList({ variant, schema, bare }) {
  const deco = isDeco(schema);
  if (variant === 'primary' || variant === 'primaryInline') return <PrimaryAccount variant={variant} schema={schema} />;
  return (
    <div>
      {!bare && <Title type="accountList" schema={schema} />}
      {variant === 'tiles' && (
        <div className="g-tiles">
          {accounts.map((a) => {
            const [bg, fg] = iconTones[a.icon];
            return (
              <div key={a.id} className="g-tile" style={deco ? { background: bg } : undefined}>
                <div className="g-tile-type" style={deco ? { color: fg } : undefined}>
                  {a.type}
                </div>
                <div className="g-tile-name">{a.name}</div>
                <Amount value={a.balance} className="g-tile-amt" />
              </div>
            );
          })}
        </div>
      )}
      {variant === 'table' && (
        <div className="g-table">
          <div className="g-tr g-th">
            <span>계좌</span>
            <span>비중</span>
            <span>잔액</span>
          </div>
          {accounts.map((a, i) => (
            <div key={a.id} className="g-tr">
              <span className="g-name">
                <i style={{ background: GRAYS[i] }} />
                {a.name}
                <small className="num">{a.number}</small>
              </span>
              <span className="g-pct num">{pct(a.balance, totalAssets)}%</span>
              <span className="g-row-amt num">{won(a.balance)}</span>
            </div>
          ))}
        </div>
      )}
      {variant === 'bigNumber' &&
        accounts.map((a) => (
          <div key={a.id} className="g-big">
            <Amount value={a.balance} className="g-big-amt" />
            <div className="g-sub">
              {a.name} · <span className="num">{a.number}</span>
            </div>
          </div>
        ))}
      {variant === 'rows' &&
        accounts.map((a) => (
          <div key={a.id} className="g-row-item">
            {deco && <RoundIcon name={a.icon} />}
            <div className="g-row-main">
              <div className="g-row-title">{a.name}</div>
              <div className="g-sub num">
                {a.type} · {a.number}
              </div>
            </div>
            <span className="g-row-amt num">{won(a.balance)}원</span>
          </div>
        ))}
    </div>
  );
}

/* ---------- transferAction ---------- */

function TransferAction({ variant, schema, bare }) {
  const deco = isDeco(schema);
  if (variant === 'compact') {
    return (
      <div className="g-compact">
        <div className="g-compact-label">
          송금 {hasIcons(schema) && <Icon name="send" size={15} />}
        </div>
        <div className="g-compact-names">{transfer.recent.map((p) => p.name).join(' · ')}</div>
        <button className={`g-btn primary sm ${schema.accentStyle}`}>보내기</button>
      </div>
    );
  }
  if (variant === 'chips') {
    return (
      <div className="g-chips-row">
        <span className="g-sub">최근 보낸 사람</span>
        <div className="g-chips">
          {transfer.recent.map((p) => (
            <span key={p.name} className="g-chip">
              {p.name}
            </span>
          ))}
          <span className="g-chip add">
            <Icon name="plus" size={13} stroke={2.2} />새 송금
          </span>
        </div>
      </div>
    );
  }
  return (
    <div>
      {!bare && <Title type="transferAction" schema={schema} />}
      {variant === 'avatars' && (
        <div className="g-people">
          <span className="g-person">
            <span className="g-avatar add">
              <Icon name="plus" size={20} stroke={2.2} />
            </span>
            새 송금
          </span>
          {transfer.recent.map((p, i) => (
            <span key={p.name} className="g-person">
              <span
                className={`g-avatar${deco ? '' : ' outline'}`}
                style={deco ? { background: avatarTones[i][0], color: avatarTones[i][1] } : undefined}
              >
                {p.name[0]}
              </span>
              {p.name}
            </span>
          ))}
        </div>
      )}
      {variant === 'buttonRow' && (
        <div className="g-send-row">
          <div className="g-sub">최근 보낸 사람 · {transfer.recent.map((p) => p.name).join(', ')}</div>
          <button className={`g-btn primary wide ${schema.accentStyle}`}>
            {hasIcons(schema) && <Icon name="send" size={17} stroke={2} />}
            송금하기
          </button>
        </div>
      )}
      {variant === 'textLink' && (
        <div className="g-send-text">
          <div className="g-send-big">
            송금하기<span>→</span>
          </div>
          <div className="g-sub">최근 보낸 사람 — {transfer.recent.map((p) => p.name).join(', ')}</div>
        </div>
      )}
      {variant === 'list' && (
        <div>
          {transfer.recent.map((p) => (
            <div key={p.name} className="g-row-item">
              <div className="g-row-main">
                <span className="g-row-title">{p.name}</span>{' '}
                <small className="g-sub num">
                  {p.bank} ···{p.tail}
                </small>
              </div>
              <span className="g-link-strong">보내기 →</span>
            </div>
          ))}
          <div className="g-foot">
            <span className="g-link-strong">+ 새 송금</span>
            <span>1일 한도 {won(transfer.dailyLimit)}원</span>
          </div>
        </div>
      )}
      {variant === 'box' && (
        <div className="g-sendbox">
          {transfer.recent.map((p) => (
            <span key={p.name} className="g-sendbox-item">
              <b>{p.name}</b>
              <small className="num">
                {p.bank} ···{p.tail}
              </small>
            </span>
          ))}
          <span className="g-sendbox-item new">
            <Icon name="plus" size={18} stroke={2} />
            새 송금
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- cardSpend ---------- */

function CardSpend({ variant, schema, bare }) {
  if (variant === 'compact') {
    return (
      <div className="g-compact">
        <div className="g-compact-label">
          이번 달 카드 {hasIcons(schema) && <Icon name="card" size={15} />}
        </div>
        <Amount value={card.spent} className="g-compact-amt" />
        <div className="g-meter">
          <span style={{ width: `${usage}%` }} />
        </div>
        <div className="g-sub num">
          한도 {usage}% · 결제 {card.dueShort}
        </div>
      </div>
    );
  }
  return (
    <div>
      {!bare && <Title type="cardSpend" schema={schema} />}
      {variant === 'barCategories' && (
        <>
          <div className="g-split">
            <Amount value={card.spent} className="g-card-amt" />
            <span className="g-sub num">결제일 {card.due}</span>
          </div>
          <div className="g-meter lg">
            <span style={{ width: `${usage}%` }} />
          </div>
          <div className="g-catlist">
            {card.categories.map((c) => (
              <span key={c.name}>
                {c.name} <b className="num">{won(c.amount)}</b>
              </span>
            ))}
          </div>
          <div className="g-foot">
            <span>
              한도 {won(card.limit)}원 중 {usage}%
            </span>
            <span>지난달보다 {Math.abs(card.vsLastMonth)}% 적게 씀</span>
          </div>
        </>
      )}
      {variant === 'bar' && (
        <>
          <Amount value={card.spent} className="g-card-amt" />
          <div className="g-meter lg">
            <span style={{ width: `${usage}%` }} />
          </div>
          <div className="g-foot">
            <span>
              한도 {won(card.limit)}원 중 {usage}%
            </span>
            <span>결제일 {card.due}</span>
          </div>
        </>
      )}
      {variant === 'breakdown' && (
        <>
          <div className="g-split">
            <Amount value={card.spent} className="g-card-amt" />
            <span className="g-sub num">
              / {won(card.limit)} · {usage}%
            </span>
          </div>
          <div className="g-bars">
            {card.categories.map((c, i) => (
              <span key={c.name} style={{ flex: c.amount, background: GRAYS[i] }} />
            ))}
          </div>
          <div className="g-cats">
            {card.categories.map((c, i) => (
              <span key={c.name} className="g-cat">
                <span>
                  <i style={{ background: GRAYS[i] }} />
                  {c.name}
                </span>
                <span className="num">{won(c.amount)}</span>
              </span>
            ))}
          </div>
          <div className="g-foot">
            <span>
              결제 {card.dueShort} (D-{card.dDay})
            </span>
            <span>전월 대비 {card.vsLastMonth}%</span>
          </div>
        </>
      )}
      {variant === 'sentence' && (
        <p className="g-sentence">
          이번 달 카드로 <b className="num">{won(card.spent)}원</b>을 썼어요. 한도의 <b>{usage}%</b>, 결제일은{' '}
          <b>{card.due}</b>이에요. 지난달보다 {Math.abs(card.vsLastMonth)}% 적게 썼어요.
        </p>
      )}
    </div>
  );
}

/* ---------- recentTransactions ---------- */

function TxRow({ t, schema }) {
  return (
    <div className="g-row-item">
      {isDeco(schema) && <RoundIcon name={t.icon} />}
      <div className="g-row-main">
        <div className="g-row-title">{t.name}</div>
        <div className="g-sub num">
          {t.category} · {t.day} {t.time}
        </div>
      </div>
      <span className={`g-row-amt num${t.amount > 0 ? ' in' : ''}`}>{signed(t.amount)}원</span>
    </div>
  );
}

function RecentTransactions({ variant, schema, bare }) {
  return (
    <div>
      {!bare && <Title type="recentTransactions" schema={schema} />}
      {schema.txSummary && (
        <div className="g-txsum">
          최근 7일 지출 <b className="num">{won(transactionSummary.spent)}</b> · 수입{' '}
          <b className="num in">{won(transactionSummary.earned)}</b>
        </div>
      )}
      {variant === 'flat' && transactions.map((t) => <TxRow key={t.id} t={t} schema={schema} />)}
      {variant === 'grouped' &&
        transactionsByDay.map((g) => (
          <div key={g.date}>
            <div className="g-day">
              {g.day} <span className="num">{g.date}</span>
            </div>
            {g.items.map((t) => (
              <div key={t.id} className="g-row-item">
                {isDeco(schema) && <RoundIcon name={t.icon} />}
                <div className="g-row-main">
                  <div className="g-row-title">{t.name}</div>
                  <div className="g-sub num">
                    {t.time} · {t.category}
                  </div>
                </div>
                <span className={`g-row-amt num${t.amount > 0 ? ' in' : ''}`}>{signed(t.amount)}원</span>
              </div>
            ))}
          </div>
        ))}
      {variant === 'ledger' &&
        transactionsByDay.map((g) =>
          g.items.map((t, i) => (
            <div key={t.id} className="g-ledger">
              <span className="g-ledger-date num">{i === 0 ? g.date : ''}</span>
              <span className="g-name">
                {t.name}
                <small className="num">
                  {t.time} · {t.category}
                </small>
              </span>
              <span className={`g-row-amt num${t.amount > 0 ? ' in' : ''}`}>{signed(t.amount)}</span>
            </div>
          ))
        )}
    </div>
  );
}

const RENDERERS = {
  assetSummary: AssetSummary,
  accountList: AccountList,
  transferAction: TransferAction,
  cardSpend: CardSpend,
  recentTransactions: RecentTransactions,
};

/* ---------- 줄(row) 배치 ---------- */

function Row({ sections, schema, first, joined }) {
  const boxed = schema.container !== 'none';
  const render = (s, bare) => {
    const R = RENDERERS[s.type];
    return <R variant={s.variant} schema={schema} bare={bare} />;
  };

  if (sections.length === 2) {
    return (
      <div className={`g-row g-pair${first ? ' first' : ' sep'}`}>
        <div className="g-inner">
          {sections.map((s) => (
            <div key={s.id} className={`g-cell${boxed ? ' g-box' : ''}`}>
              {render(s)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [s] = sections;
  // hero는 스스로 카드이므로 한 번 더 감싸지 않는다
  const selfBoxed = s.variant === 'hero';
  const labeled = schema.labelColumn && s.type !== 'assetSummary';
  const callout = !boxed && schema.callout === s.type;
  return (
    <div className={`g-row${first ? ' first' : ' sep'}${joined ? ' joined' : ''}`}>
      <div
        className={`g-inner${boxed && !selfBoxed ? ' g-box' : ''}${labeled ? ' g-labeled' : ''}${callout ? ' g-callout' : ''}`}
      >
        {labeled ? (
          <>
            <div className="g-col-label">
              {SHORT[s.type][0]}
              <span>{SHORT[s.type][1]}</span>
            </div>
            <div className="g-col-body">{render(s, true)}</div>
          </>
        ) : (
          render(s)
        )}
      </div>
    </div>
  );
}

export default function SchemaScreen({ schema }) {
  const byType = Object.fromEntries(schema.sections.map((s) => [s.type, s]));
  const className = [
    'gen',
    `skin-${schema.skin}`,
    `c-${schema.container}`,
    `d-${schema.density}`,
    `dv-${schema.dividerStyle}`,
    `ts-${schema.titleScale}`,
    `nw-${schema.numberWeight}`,
    `ic-${schema.iconUsage}`,
  ].join(' ');

  return (
    <Shell
      className={className}
      style={schema.tokens ? { '--r': `${schema.tokens.radius}px` } : undefined}
      nav={<TabBar mode={hasIcons(schema) ? 'icon' : 'text'} />}
    >
      <Header schema={schema} />
      {schema.rows.map((row, i) => {
        // 대표 계좌 안에 들어간 송금은 따로 줄을 만들지 않는다
        if (schema.embedTransfer && row.length === 1 && row[0] === 'transferAction') return null;
        // mode가 한 묶음으로 지정한 쌍(예: 대표 계좌 → 송금)은 구분선 없이 붙여 그린다
        const prev = schema.rows[i - 1];
        const joined =
          prev && row.length === 1 && prev.length === 1 && (schema.joins ?? []).some(([a, b]) => a === prev[0] && b === row[0]);
        return (
          <Row key={row.join('+')} sections={row.map((t) => byType[t])} schema={schema} first={i === 0} joined={joined} />
        );
      })}
      <div className="g-end" />
    </Shell>
  );
}
