'use client';
import { useEffect, useRef, useState } from 'react';
import { IconMedal, IconShieldCheck, IconClock, IconCurrencyRupee, IconUsers, IconStar } from '@tabler/icons-react';

const reasons = [
  { num: '01', icon: IconMedal, title: '25+ Years of Expertise', desc: 'Trusted by thousands of families and businesses across Mysore for over two and a half decades of quality work.' },
  { num: '02', icon: IconShieldCheck, title: 'Premium Quality Steel', desc: 'We use only high-grade MS (Mild Steel) and SS (Stainless Steel) materials that stand the test of time and weather.' },
  { num: '03', icon: IconClock, title: 'On-Time Delivery', desc: 'We respect your time. Every project is completed and delivered on the promised date, every single time.' },
  { num: '04', icon: IconCurrencyRupee, title: 'Affordable Pricing', desc: 'Best value fabrication in Mysore. Competitive pricing with absolutely no compromise on quality or finish.' },
  { num: '05', icon: IconUsers, title: 'Experienced Team', desc: 'Our skilled craftsmen bring decades of hands-on fabrication experience to every project, big or small.' },
  { num: '06', icon: IconStar, title: 'Customer Satisfaction', desc: '1000+ satisfied customers across Mysore. We don\'t just build structures — we build lasting relationships.' },
];

export default function WhyUs() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="why" style={{ padding: '80px 32px', background: '#f8f7f4', borderBottom: '1px solid #e4e0da' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <span style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '2.5px', fontWeight: 600 }}>Why Us</span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f0f0f', letterSpacing: '-1px', marginTop: 8, marginBottom: 6 }}>
            Why Choose Us?
          </h2>
          <p style={{ fontSize: 14, color: '#888' }}>ಏಕೆ ನಮ್ಮನ್ನು ಆರಿಸಬೇಕು? · Here's what sets us apart</p>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={r.num} style={{
                background: '#fff',
                border: '1px solid #e4e0da',
                borderRadius: 12,
                padding: '26px 22px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(28px)',
                transition: `all 0.55s ease ${i * 80}ms`,
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#e8d89a';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(184,134,11,0.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#e4e0da';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#e8d89a', marginBottom: 12, lineHeight: 1 }}>{r.num}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, background: '#faf6ed', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8860b', flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#0f0f0f' }}>{r.title}</div>
                </div>
                <p style={{ fontSize: 13, color: '#777', lineHeight: 1.7 }}>{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
