"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconDoor,
  IconShield,
  IconBuildingWarehouse,
  IconFence,
  IconStairs,
  IconTool,
  IconDoorEnter,
  IconWall,
  IconCar,
  IconBolt,
  IconRuler,
  IconHammer,
} from "@tabler/icons-react";

const services = [
  {
    icon: IconDoorEnter,
    name: "Main Gates",
    desc: "Heavy-duty MS & SS compound and entrance gates for homes and commercial spaces.",
  },
  {
    icon: IconShield,
    name: "Safety Doors",
    desc: "Security grill doors, MS doors and safety frames designed for maximum protection.",
  },
  {
    icon: IconBuildingWarehouse,
    name: "Rolling Shutters",
    desc: "Industrial and commercial rolling shutters for shops, warehouses and factories.",
  },
  {
    icon: IconFence,
    name: "Window Grills",
    desc: "Custom window grills — designer patterns, classic styles and heavy-duty security grills.",
  },
  {
    icon: IconStairs,
    name: "Staircase Railings",
    desc: "Elegant MS & SS railings for staircases, balconies and terraces in homes and buildings.",
  },
  {
    icon: IconDoor,
    name: "Collapsible Gates",
    desc: "Foldable collapsible gates for garages, entrances and narrow spaces.",
  },
  {
    icon: IconWall,
    name: "Compound Walls",
    desc: "MS fencing and grills for compound walls, boundary protection and privacy.",
  },
  {
    icon: IconCar,
    name: "Garage Doors",
    desc: "Custom garage doors and shutters — manual and automation-ready designs.",
  },
  {
    icon: IconBolt,
    name: "MS Fabrication",
    desc: "Any custom mild steel fabrication — frames, brackets, structures, supports.",
  },
  {
    icon: IconRuler,
    name: "Steel Structures",
    desc: "Small steel structures, canopies, shade frames and pergolas for outdoor spaces.",
  },
  {
    icon: IconHammer,
    name: "Repairs & Welding",
    desc: "Professional repair, welding and refurbishment of existing gates, doors and grills.",
  },
  {
    icon: IconTool,
    name: "Custom Orders",
    desc: "Bring your own design or idea — we fabricate exactly to your specifications.",
  },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

export default function Services() {
  const { ref, inView } = useInView();

  return (
    <section
      id="services"
      style={{
        padding: "80px 32px",
        background: "#f8f7f4",
        borderBottom: "1px solid #e4e0da",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 48,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(24px)",
            transition: "all 0.6s ease",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#b8860b",
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              fontWeight: 600,
            }}
          >
            What We Do
          </span>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#0f0f0f",
              letterSpacing: "-1px",
              marginTop: 8,
              marginBottom: 6,
            }}
          >
            Our Services
          </h2>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>
            ನಮ್ಮ ಸೇವೆಗಳು · Precision fabrication built to last a lifetime
          </p>
        </div>

        {/* Grid */}
        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                style={{
                  background: "#fff",
                  border: "1px solid #e4e0da",
                  borderRadius: 12,
                  padding: "22px 20px",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms, box-shadow 0.2s`,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 32px rgba(184,134,11,0.12)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "#e8d89a";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "#e4e0da";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "#faf6ed",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                    color: "#b8860b",
                  }}
                >
                  <Icon size={20} />
                </div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f0f0f",
                    marginBottom: 6,
                  }}
                >
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
                  {s.desc}
                </div>
                {/* <div style={{ fontSize: 11, color: '#b8860b', marginTop: 12, fontWeight: 600 }}>Learn more →</div> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
