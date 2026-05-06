'use client';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 25, suffix: '+', label: 'Years of Experience' },
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 1000, suffix: '+', label: 'Happy Customers' },
  { value: 100, suffix: '%', label: 'Quality Assured' },
];

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCountUp(value, active);
  return (
    <div style={{ textAlign: 'center', padding: '0 16px' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: '#0f0f0f',
      padding: '36px 32px',
      display: 'flex',
      justifyContent: 'center',
      gap: 'clamp(24px, 6vw, 80px)',
      flexWrap: 'wrap',
    }}>
      {stats.map(s => <StatItem key={s.label} {...s} active={active} />)}
    </div>
  );
}
