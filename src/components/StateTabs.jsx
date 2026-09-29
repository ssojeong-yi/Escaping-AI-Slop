export default function StateTabs({ variants, activeIndex, onSelect }) {
  return (
    <aside className="sidebar">
      <nav className="steps" role="tablist" aria-orientation="vertical" aria-label="실험 단계">
        {variants.map((v, i) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={i === activeIndex}
            className={`step${i === activeIndex ? ' active' : ''}${v.final ? ' final' : ''}`}
            onClick={() => onSelect(i)}
          >
            <span className="step-no">{v.no}</span>
            {v.name}
          </button>
        ))}
      </nav>

      <div className="side-foot">
        <p>
          <kbd>1</kbd>–<kbd>{variants.length}</kbd> 단계 &nbsp;<kbd>↑</kbd>
          <kbd>↓</kbd> 이동
          <br />
          <kbd>R</kbd> 다시 생성 &nbsp;<kbd>Space</kbd> 기본안 비교
        </p>
      </div>
    </aside>
  );
}
