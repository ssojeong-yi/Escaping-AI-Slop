import { useLayoutEffect, useRef, useState } from 'react';

// 화면은 항상 iPhone 논리 해상도(390×844)로 그리고, 남는 공간에 맞춰 비율 그대로 축소한다.
export const SCREEN_W = 390;
export const SCREEN_H = 844;
const RADIUS = 44;

export default function PhoneFrame({ children }) {
  const slotRef = useRef(null);
  const [scale, setScale] = useState(0.8);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const fit = () => {
      const { width, height } = slot.getBoundingClientRect();
      setScale(Math.min(1, width / SCREEN_W, height / SCREEN_H));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="phone-slot" ref={slotRef}>
      <div
        className="phone"
        style={{ width: SCREEN_W * scale, height: SCREEN_H * scale, borderRadius: RADIUS * scale }}
      >
        <div className="phone-screen" style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
