const commonInfo = ['총자산', '계좌', '송금', '카드 사용금액', '최근 거래'];

export default function StateTabs({ variants, activeIndex, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="side-label">단계</div>
      <div className="state-tabs" role="tablist" aria-orientation="vertical">
        {variants.map((v, i) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={i === activeIndex}
            className={`state-tab${i === activeIndex ? ' active' : ''}`}
            onClick={() => onSelect(i)}
          >
            <span className="state-no">{v.no}</span>
            <span className="state-name">{v.name}</span>
          </button>
        ))}
      </div>

      <div className="side-foot">
        <div className="side-label">모든 단계에서 동일한 정보</div>
        <p className="side-info">{commonInfo.join(' · ')}</p>
        <p className="side-keys">
          <kbd>1</kbd>–<kbd>5</kbd> 단계 선택 &nbsp; <kbd>↑</kbd>
          <kbd>↓</kbd> 이동
          <br />
          <kbd>Space</kbd> 누르는 동안 기본안
        </p>
      </div>
    </aside>
  );
}
