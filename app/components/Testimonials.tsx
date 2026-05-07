'use client';
import { useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconQuote } from '@tabler/icons-react';

const testimonials = [
  { name: 'Ravi Kumar', location: 'Homeowner, Mysore', stars: 5, text: 'Shree Manjunatha Engineering Works did an excellent job on our main gate and compound grills. The quality is outstanding and they delivered exactly on time. Highly recommended to anyone looking for reliable fabrication in Mysore!' },
  { name: 'Suresh Gowda', location: 'Shop Owner, Mysore', stars: 5, text: 'Got our shop rolling shutter done here. Very professional team, very fair pricing and solid build quality. The shutter works perfectly even after 2 years. Will definitely recommend to all my friends.' },
  { name: 'Meena Prakash', location: 'Homeowner, Mysore', stars: 5, text: 'We got staircase railings and window grills done for our new house. The workmanship is excellent — they listened carefully to our design requirements and executed it perfectly. Very happy with the result.' },
  { name: 'Anand Murthy', location: 'Contractor, Mysore', stars: 5, text: 'I regularly use Shree Manjunatha for all fabrication work in my construction projects. They are consistent, reliable and always deliver top quality. A truly professional team with years of experience.' },
  { name: 'Lakshmi Devi', location: 'Homeowner, Mysore', stars: 5, text: 'The safety door they made for us is extremely sturdy and looks beautiful too. The team was very courteous and finished the work within the promised time. Best fabrication shop in Mysore without doubt.' },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCur((idx + testimonials.length) % testimonials.length);
      setAnimating(false);
    }, 300);
  };

  const startAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go((cur + 1) % testimonials.length), 4500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCur(prev => (prev + 1) % testimonials.length);
    }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const t = testimonials[cur];

  return (
    <section id="testimonials" style={{ padding: '80px 32px', background: '#0f0f0f', borderBottom: '1px solid #222' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: 48, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <span style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '2.5px', fontWeight: 600 }}>Testimonials</span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginTop: 8, marginBottom: 6 }}>
            What Customers Say
          </h2>
          <p style={{ fontSize: 14, color: '#666' }}>Real feedback from real customers across Mysore</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '40px 40px 32px',
          position: 'relative',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
        }}>
          {/* Quote icon */}
          <div style={{ position: 'absolute', top: 28, right: 32, color: 'rgba(184,134,11,0.2)' }}>
            <IconQuote size={48} />
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
            {Array.from({ length: t.stars }).map((_, i) => (
              <span key={i} style={{ color: '#b8860b', fontSize: 18 }}>★</span>
            ))}
          </div>

          {/* Quote text */}
          <p style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.8,
            fontStyle: 'italic',
            marginBottom: 28,
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.3s, transform 0.3s',
            minHeight: 100,
          }}>
            "{t.text}"
          </p>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: animating ? 0 : 1, transition: 'opacity 0.3s' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(184,134,11,0.15)', border: '1.5px solid rgba(184,134,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#b8860b' }}>
              {t.name[0]}
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{t.location}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 28 }}>
          <button onClick={() => { go(cur - 1); startAuto(); }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#b8860b')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}>
            <IconChevronLeft size={18} color="#fff" />
          </button>

          <div style={{ display: 'flex', gap: 7 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setCur(i); startAuto(); }} style={{
                width: i === cur ? 24 : 8, height: 8, borderRadius: 4, border: 'none',
                background: i === cur ? '#b8860b' : 'rgba(255,255,255,0.15)',
                cursor: 'pointer', transition: 'all 0.3s', padding: 0,
              }} />
            ))}
          </div>

          <button onClick={() => { go(cur + 1); startAuto(); }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#b8860b')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}>
            <IconChevronRight size={18} color="#fff" />
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#555' }}>
          {cur + 1} / {testimonials.length}
        </p>
      </div>
    </section>
  );
}
