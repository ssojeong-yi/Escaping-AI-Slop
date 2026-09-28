const commonInfo = ['총자산', '계좌', '송금', '카드 사용금액', '최근 거래'];

export default function StateTabs({ variants, activeIndex, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="side-label">비교 상태</div>
      <div className="state-tabs" role="tablist" aria-orientation="vertical">
        {variants.map((v, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={active}
              className={`state-tab${active ? ' active' : ''}`}
              onClick={() => onSelect(i)}
            >
              <span className="state-no">{v.no}</span>
              <span className="state-text">
                <span className="state-name">{v.name}</span>
                <span className="state-short">{v.short}</span>
              </span>
              <kbd>{i + 1}</kbd>
            </button>
          );
        })}
      </div>

      <div className="side-block">
        <div className="side-label">모든 상태에서 동일한 정보</div>
        <ul className="info-list">
          {commonInfo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="side-block side-keys">
        <div className="side-label">발표 단축키</div>
        <p>
          <kbd>1</kbd>–<kbd>5</kbd> 상태 선택
        </p>
        <p>
          <kbd>↑</kbd> <kbd>↓</kbd> 이전 / 다음
        </p>
        <p>
          <kbd>Space</kbd> 누르는 동안 기본안 보기
        </p>
      </div>
    </aside>
  );
}
