// 5개 상태가 모두 공유하는 단일 금융 데이터.
// 화면마다 표현만 달라지고, 값은 항상 여기서만 읽는다.

// 샘플 브랜드·사용자명은 여기서만 정한다. 원본 화면과 생성 화면이 모두 이 값을 읽는다.
export const brand = { name: '슬롭뱅크', short: '슬롭', mark: 'S' };

export const user = { name: '이소정', short: '소정' };

export const asOf = { date: '9월 28일 월요일', short: '9.28 (월)', time: '08:45' };

export const accounts = [
  { id: 'checking', name: `${brand.short} 입출금통장`, type: '입출금', number: '110-482-913572', balance: 3245800, icon: 'wallet' },
  { id: 'savings', name: '26주 자유적금', type: '적금', number: '220-17-004581', balance: 12000000, icon: 'layers', note: '연 3.4%' },
  { id: 'isa', name: 'ISA 중개형', type: '투자', number: '8014-2231-07', balance: 33080700, icon: 'trend', note: '수익률 +8.2%' },
];

export const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0); // 48,326,500

export const assetChange = { amount: 1284300, rate: 2.7 };

export const card = {
  name: `${brand.short} 플러스 카드`,
  spent: 872450,
  limit: 3000000,
  due: '10월 14일',
  dueShort: '10.14',
  dDay: 16,
  vsLastMonth: -12,
  categories: [
    { name: '식비', amount: 312400 },
    { name: '쇼핑', amount: 268900 },
    { name: '교통', amount: 94150 },
    { name: '기타', amount: 197000 },
  ],
};

export const transfer = {
  dailyLimit: 5000000,
  recent: [
    { name: '엄마', bank: '국민', tail: '2231' },
    { name: '이준호', bank: '신한', tail: '0417' },
    { name: '관리사무소', bank: '우리', tail: '8820' },
  ],
};

export const transactions = [
  { id: 1, date: '09.28', day: '오늘', time: '08:42', name: '스타벅스 역삼점', category: '카페', amount: -6500, icon: 'coffee' },
  { id: 2, date: '09.27', day: '어제', time: '18:10', name: '이준호', category: '이체 입금', amount: 58000, icon: 'transfer' },
  { id: 3, date: '09.27', day: '어제', time: '13:25', name: '쿠팡', category: '쇼핑', amount: -42800, icon: 'bag' },
  { id: 4, date: '09.26', day: '9월 26일', time: '09:00', name: '관리비 자동이체', category: '주거', amount: -186000, icon: 'home' },
  { id: 5, date: '09.25', day: '9월 25일', time: '22:14', name: 'GS25 선릉점', category: '편의점', amount: -4200, icon: 'store' },
  { id: 6, date: '09.25', day: '9월 25일', time: '10:00', name: '9월 급여', category: '급여', amount: 3420000, icon: 'won' },
];

export const transactionsByDay = transactions.reduce((groups, tx) => {
  const last = groups[groups.length - 1];
  if (last && last.date === tx.date) last.items.push(tx);
  else groups.push({ date: tx.date, day: tx.day, items: [tx] });
  return groups;
}, []);

export const transactionSummary = {
  spent: transactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0),
  earned: transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
};
