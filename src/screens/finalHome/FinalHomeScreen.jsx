// 6단계 최종안 렌더러. 스타일은 finalDesignTokens(고정)만 쓰고, 배치는 schema.layout, 내용은 schema.content 를 따른다.
// 같은 역할의 컴포넌트는 항상 같은 클래스(.f-btn-primary, .f-row, .t-title …)로 그려진다.
import Shell, { TabBar } from '../Shell.jsx';
import Icon from '../../components/Icon.jsx';
import { brand, user, accounts, totalAssets, assetChange, card, transactions, transactionSummary } from '../../data/finance.js';
import { won, signed, pct } from '../../lib/format.js';
import { finalDesignTokens as T, tokenCssVars } from '../../final/finalDesignTokens.js';
import './finalHome.css';

const usage = pct(card.spent, card.limit, 0);
const byId = (list, id) => list.find((x) => x.id === id);

function Amount({ value, level = 'amount' }) {
  return (
    <span className={`t-${level} num`}>
      {won(value)}
      <span className="f-unit">원</span>
    </span>
  );
}

function MoreLink({ children, accent }) {
  return (
    <span className={`f-more t-label${accent ? ' f-link-accent' : ''}`}>
      {children}
      <Icon name="chevron" size={T.iconRules.size.link} stroke={T.iconRules.stroke} />
    </span>
  );
}

function Button({ action }) {
  return (
    <button className={`f-btn f-btn-${action.variant} t-label`}>
      {action.icon && <Icon name={action.icon} size={T.iconRules.size.action} stroke={T.iconRules.stroke} />}
      {action.label}
    </button>
  );
}

function Actions({ actions }) {
  return (
    <div className="f-actions" style={{ gridTemplateColumns: `repeat(${actions.length}, 1fr)` }}>
      {actions.map((a) => (
        <Button key={a.id} action={a} />
      ))}
    </div>
  );
}

function SectionHead({ title, meta, more }) {
  return (
    <div className="f-sec-head">
      <h3 className="t-title">
        {title}
        {meta && <span className="t-caption">{meta}</span>}
      </h3>
      {more && <MoreLink>{more}</MoreLink>}
    </div>
  );
}

/* ---------- 상단: 총자산 (+ 행동) ---------- */
function Total({ schema }) {
  const { totalLayout, ctaPlacement } = schema.layout;
  return (
    <section className={`f-total ${totalLayout}`}>
      {totalLayout === 'solo' ? (
        <>
          <div className="t-caption f-sub">{user.name}님의 총자산</div>
          <Amount value={totalAssets} level="display" />
          <div className="f-total-foot">
            <span className="t-caption f-sub">
              지난달보다 <b className="f-up num">+{won(assetChange.amount)}원</b>
            </span>
            <MoreLink accent>자산 분석</MoreLink>
          </div>
        </>
      ) : (
        <>
          <div className="f-total-foot">
            <span className="t-caption f-sub">{user.name}님의 총자산</span>
            <MoreLink accent>자산 분석</MoreLink>
          </div>
          <div className="f-total-line">
            <Amount value={totalAssets} level="display" />
            <span className="t-caption f-up num">+{assetChange.rate}%</span>
          </div>
        </>
      )}
      {ctaPlacement !== 'inAccount' && <Actions actions={schema.content.actions} />}
    </section>
  );
}

/* 2열 요약: 카드 사용 | 최근 지출 (선 하나로 나눈 그리드, 카드 아님) */
function OverviewGrid() {
  return (
    <section className="f-overview">
      <div>
        <div className="t-caption f-sub">이번 달 카드</div>
        <Amount value={card.spent} />
        <div className="f-meter" role="img" aria-label={`한도의 ${usage}% 사용`}>
          <span style={{ width: `${usage}%` }} />
        </div>
        <div className="t-caption f-muted num">결제일 {card.dueShort}</div>
      </div>
      <div>
        <div className="t-caption f-sub">최근 7일 지출</div>
        <Amount value={transactionSummary.spent} />
        <div className="f-overview-gap" />
        <div className="t-caption f-muted num">수입 {won(transactionSummary.earned)}원</div>
      </div>
    </section>
  );
}

/* ---------- 영역들 ---------- */
function AccountRow({ account, highlight }) {
  return (
    <div className="f-row">
      <div className="f-row-main">
        <div className="t-body">
          {account.name}
          {highlight && <span className="f-tag t-caption">주 계좌</span>}
        </div>
        <div className="t-caption f-muted num">{account.number}</div>
      </div>
      <span className="f-row-amt num">{won(account.balance)}원</span>
    </div>
  );
}

function AccountsZone({ schema }) {
  const { content, layout } = schema;
  const shown = content.accounts.map((id) => byId(accounts, id));
  const [first, ...rest] = shown;
  const more = content.hiddenAccounts ? `계좌 ${content.hiddenAccounts}개 더보기` : null;
  if (layout.accountEmphasis === 'highlight') {
    return (
      <>
        <SectionHead title="내 계좌" />
        {/* 상호작용 묶음: 화면에서 유일한 카드 */}
        <div className="f-group">
          <div className="t-body">
            {first.name}
            <span className="f-tag t-caption">주 계좌</span>
          </div>
          <div className="t-caption f-muted num">{first.number}</div>
          <div className="f-group-amt">
            <Amount value={first.balance} />
          </div>
          {layout.ctaPlacement === 'inAccount' && <Actions actions={content.actions} />}
        </div>
        {rest.map((a) => (
          <AccountRow key={a.id} account={a} />
        ))}
        {more && <div className="f-more-row">{<MoreLink>{more}</MoreLink>}</div>}
      </>
    );
  }
  return (
    <>
      <SectionHead title="내 계좌" more={more} />
      {shown.map((a, i) => (
        <AccountRow key={a.id} account={a} highlight={i === 0} />
      ))}
    </>
  );
}

function CardSummary({ compact }) {
  return (
    <>
      <div className="f-card-line">
        <Amount value={card.spent} />
        <span className="t-caption f-muted num">결제일 {card.due}</span>
      </div>
      <div className="f-meter" role="img" aria-label={`한도의 ${usage}% 사용`}>
        <span style={{ width: `${usage}%` }} />
      </div>
      {!compact && (
        <div className="f-card-foot t-caption f-muted num">
          <span>
            한도 {won(card.limit)}원 중 {usage}%
          </span>
          <span>지난달보다 {Math.abs(card.vsLastMonth)}% 적게 씀</span>
        </div>
      )}
    </>
  );
}

function TxRows({ schema }) {
  return schema.content.transactions.map((id) => {
    const t = byId(transactions, id);
    return (
      <div key={id} className="f-row f-row-tx">
        <span className="f-tx-icon">
          <Icon name={t.icon} size={T.iconRules.size.txType} stroke={T.iconRules.stroke} />
        </span>
        <div className="f-row-main">
          <div className="t-body">{t.name}</div>
          <div className="t-caption f-muted num">
            {t.day} {t.time} · {t.category}
          </div>
        </div>
        <span className={`f-row-amt num${t.amount > 0 ? ' f-up' : ''}`}>{signed(t.amount)}원</span>
      </div>
    );
  });
}

function SpendZone() {
  return (
    <>
      <SectionHead title="이번 달 카드" meta={card.name} more="내역" />
      <CardSummary />
    </>
  );
}

function ActivityZone({ schema }) {
  const more = schema.content.hiddenTransactions ? `${schema.content.hiddenTransactions}건 더보기` : null;
  return (
    <>
      <SectionHead title="최근 거래" more={more} />
      <TxRows schema={schema} />
    </>
  );
}

function SpendingZone({ schema }) {
  const more = schema.content.hiddenTransactions ? `거래 ${schema.content.hiddenTransactions}건 더보기` : null;
  return (
    <>
      <SectionHead title="이번 달 소비" meta={card.name} />
      <CardSummary compact />
      <div className="f-sublabel t-caption f-sub">최근 거래</div>
      <TxRows schema={schema} />
      {more && <div className="f-more-row">{<MoreLink>{more}</MoreLink>}</div>}
    </>
  );
}

const ZONES = { accounts: AccountsZone, spend: SpendZone, activity: ActivityZone, spending: SpendingZone };

export default function FinalHomeScreen({ schema }) {
  const ws = T.layout.whitespace[schema.layout.whitespace];
  const style = { ...tokenCssVars(schema.theme), '--f-gap': `${ws.sectionGap}px`, '--f-row': `${ws.row}px` };
  return (
    <Shell className="fh" style={style} nav={<TabBar mode="icon" />}>
      <header className="f-head">
        <span className="f-brand">{brand.name}</span>
        <span className="f-bell" aria-label="새 알림 있음">
          <Icon name="bell" size={T.iconRules.size.status} stroke={T.iconRules.stroke} />
          <i />
        </span>
      </header>
      <Total schema={schema} />
      {schema.layout.spendPresentation === 'grid' && <OverviewGrid />}
      {schema.layout.zoneOrder.map((z) => {
        const Zone = ZONES[z];
        return (
          <section key={z} className={`f-sec f-${z}`}>
            <Zone schema={schema} />
          </section>
        );
      })}
      <div className="f-end" />
    </Shell>
  );
}
