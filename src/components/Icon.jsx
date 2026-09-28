// 외부 아이콘 라이브러리 없이 쓰는 최소 선 아이콘 세트 (24×24, stroke).
const paths = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  chart: <path d="M5 19v-8M11 19V5M17 19v-5M3 21h18" />,
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  bell: <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9M10 20.5a2.2 2.2 0 0 0 4 0" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v.01M20 20h-3M20 17v3" />
    </>
  ),
  coffee: <path d="M17 8h1a3.5 3.5 0 0 1 0 7h-1M3 8h14v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM7 2v3M11 2v3M15 2v3" />,
  bag: <path d="M6 3 3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7l-3-4zM3 7h18M16 11a4 4 0 0 1-8 0" />,
  store: <path d="M3 9l1.5-5h15L21 9M4 9v12h16V9M3 9h18M9.5 21v-6h5v6" />,
  won: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 9l1.8 6L12 10l2.7 5 1.8-6M7 12h10" />
    </>
  ),
  transfer: <path d="M7 17 17 7M8 7h9v9" />,
  wallet: <path d="M19 7V4H5a2 2 0 0 0 0 4h15v12H5a2 2 0 0 1-2-2V6M16 14h.01" />,
  layers: <path d="M12 3 2 8l10 5 10-5zM2 16l10 5 10-5M2 12l10 5 10-5" />,
  trend: <path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

export default function Icon({ name, size = 20, stroke = 1.8, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
