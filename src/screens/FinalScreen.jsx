import Shell, { TabBar } from './Shell.jsx';
import Icon from '../components/Icon.jsx';
import { brand, user, accounts, totalAssets, assetChange, card, transfer, transactionsByDay } from '../data/finance.js';
import { won, signed, pct } from '../lib/format.js';
import './final.css';

// 최종안: 금융앱의 기본 UX(총자산 → 대표 계좌·송금 → 카드 → 거래 → 하단 탭)는 그대로 두고,
// AI가 반복하는 평균적인 시각 패턴(카드 반복, 큰 radius, gradient·shadow, 장식 아이콘, 거대한 Hero)만 걷어낸다.
// - 총자산은 카드 없이 숫자로. 화면을 지배하지 않는 크기
// - 박스는 "대표 계좌 + 송금" 한 곳만 (기능 묶음이라 필요한 경우)
// - 나머지 구분은 간격·얇은 선·정렬, 강조색은 하나, 아이콘은 행동·상태에만

const [primary, ...others] = accounts;
const usage = Number(pct(card.spent, card.limit, 0));

function SectionHead({ title, meta, link }) {
  return (
    <div className="fn-sec-head">
      <h3>
        {title}
        {meta && <span>{meta}</span>}
      </h3>
      {link && (
        <span className="fn-link">
          {link}
          <Icon name="chevron" size={14} stroke={2} />
        </span>
      )}
    </div>
  );
}

export default function FinalScreen() {
  return (
    <Shell className="fn" nav={<TabBar mode="icon" />}>
      <header className="fn-head">
        <span className="fn-brand">{brand.name}</span>
        <span className="fn-bell" aria-label="알림 2건">
          <Icon name="bell" size={22} />
          <i />
        </span>
      </header>

      {/* 총자산: 카드 없이 숫자로 */}
      <section className="fn-total">
        <div className="fn-total-label">{user.name}님의 총자산</div>
        <div className="fn-total-amt num">
          {won(totalAssets)}
          <span>원</span>
        </div>
        <div className="fn-total-sub">
          <span>
            지난달보다 <b className="num">+{won(assetChange.amount)}원</b>
          </span>
          <span className="fn-link">
            자산 분석
            <Icon name="chevron" size={14} stroke={2} />
          </span>
        </div>
      </section>

      {/* 대표 계좌 + 송금: 화면에서 유일한 박스 */}
      <section className="fn-primary">
        <div className="fn-primary-top">
          <div>
            <div className="fn-primary-name">{primary.name}</div>
            <div className="fn-primary-no num">{primary.number}</div>
          </div>
          <span className="fn-tag">대표</span>
        </div>
        <div className="fn-primary-amt num">
          {won(primary.balance)}
          <span>원</span>
        </div>
        <div className="fn-primary-actions">
          <button className="fn-btn">내역</button>
          <button className="fn-btn primary">
            <Icon name="send" size={16} stroke={2.1} />
            송금
          </button>
        </div>
      </section>

      <div className="fn-recent">
        <span className="fn-recent-label">최근 보낸 사람</span>
        <div className="fn-chips">
          {transfer.recent.map((p) => (
            <span key={p.name} className="fn-chip">
              {p.name}
            </span>
          ))}
          <span className="fn-chip add">
            <Icon name="plus" size={13} stroke={2.2} />새 송금
          </span>
        </div>
      </div>

      {/* 다른 계좌 */}
      <section className="fn-sec">
        <SectionHead title="다른 계좌" meta={others.length} link="전체" />
        {others.map((a) => (
          <div key={a.id} className="fn-row">
            <div className="fn-row-main">
              <div className="fn-row-title">{a.name}</div>
              <div className="fn-row-sub">
                {a.type} · {a.note}
              </div>
            </div>
            <div className="fn-row-amt num">{won(a.balance)}원</div>
          </div>
        ))}
      </section>

      {/* 카드 사용금액 */}
      <section className="fn-sec">
        <SectionHead title="이번 달 카드" meta={card.name} link="내역" />
        <div className="fn-card-line">
          <span className="fn-card-amt num">
            {won(card.spent)}
            <span>원</span>
          </span>
          <span className="fn-card-due num">결제일 {card.due}</span>
        </div>
        <div className="fn-meter" role="img" aria-label={`한도의 ${usage}% 사용`}>
          <span style={{ width: `${usage}%` }} />
        </div>
        <div className="fn-card-foot num">
          <span>
            한도 {won(card.limit)}원 중 <b>{usage}%</b>
          </span>
          <span>지난달보다 {Math.abs(card.vsLastMonth)}% 적게 씀</span>
        </div>
      </section>

      {/* 최근 거래 */}
      <section className="fn-sec">
        <SectionHead title="최근 거래" link="전체" />
        {transactionsByDay.map((g) => (
          <div key={g.date}>
            <div className="fn-day">{g.day}</div>
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
