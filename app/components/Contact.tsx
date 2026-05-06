"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconPhone,
  IconBrandWhatsapp,
  IconMapPin,
  IconClock,
  IconMail,
} from "@tabler/icons-react";

export default function Contact() {
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

  const fade = (d: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `all 0.6s ease ${d}ms`,
  });

  return (
    <section
      id="contact"
      style={{
        padding: "80px 32px",
        background: "#f8f7f4",
        borderBottom: "1px solid #e4e0da",
      }}
    >
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ ...fade(0), marginBottom: 48 }}>
          <span
            style={{
              fontSize: 11,
              color: "#b8860b",
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              fontWeight: 600,
            }}
          >
            Get In Touch
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
            Contact Us
          </h2>
          <p style={{ fontSize: 14, color: "#888" }}>
            ಸಂಪರ್ಕಿಸಿ · We're here to help, Mon–Sat 9am–7pm
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {/* Call card */}
          <a
            href="tel:9986464819"
            style={{
              ...fade(100),
              textDecoration: "none",
              background: "#0f0f0f",
              borderRadius: 14,
              padding: "28px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "#b8860b",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconPhone size={22} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Call Us
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                9986464819
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 4,
                }}
              >
                Tap to call directly
              </div>
            </div>
          </a>

          {/* WhatsApp card */}
          <a
            href="https://wa.me/919986464819"
            target="_blank"
            rel="noreferrer"
            style={{
              ...fade(200),
              textDecoration: "none",
              background: "#fff",
              border: "1px solid #e4e0da",
              borderRadius: 14,
              padding: "28px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(37,211,102,0.12)";
              e.currentTarget.style.borderColor = "#25D366";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e4e0da";
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "#25D366",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconBrandWhatsapp size={24} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                WhatsApp
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f0f0f",
                }}
              >
                Chat With Us
              </div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                Quick response guaranteed
              </div>
            </div>
          </a>

          {/* Location card */}
          <a
            href="https://maps.google.com/?q=Shree+Manjunatha+Engineering+Works+Mysore"
            target="_blank"
            rel="noreferrer"
            style={{
              ...fade(300),
              textDecoration: "none",
              background: "#fff",
              border: "1px solid #e4e0da",
              borderRadius: 14,
              padding: "28px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(184,134,11,0.12)";
              e.currentTarget.style.borderColor = "#b8860b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e4e0da";
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "#faf6ed",
                border: "1px solid #e8d89a",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#b8860b",
              }}
            >
              <IconMapPin size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Location
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f0f0f",
                }}
              >
                Mysore, Karnataka
              </div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                Click to view on Google Maps
              </div>
            </div>
          </a>

          {/* Hours card */}
          <div
            style={{
              ...fade(400),
              background: "#fff",
              border: "1px solid #e4e0da",
              borderRadius: 14,
              padding: "28px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "#faf6ed",
                border: "1px solid #e8d89a",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#b8860b",
              }}
            >
              <IconClock size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Working Hours
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f0f0f",
                }}
              >
                Mon – Sat
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#b8860b",
                  marginTop: 2,
                  fontWeight: 600,
                }}
              >
                9:00 AM – 7:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
