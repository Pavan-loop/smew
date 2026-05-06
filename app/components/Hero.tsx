"use client";
import { useEffect, useState } from "react";
import {
  IconPhone,
  IconBrandWhatsapp,
  IconArrowDown,
} from "@tabler/icons-react";

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      id="home"
      style={{
        background: "#fff",
        paddingTop: 120,
        paddingBottom: 80,
        borderBottom: "1px solid #e4e0da",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background geometric accent */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,134,11,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,134,11,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            ...fade(0),
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#faf6ed",
            border: "1px solid #e8d89a",
            color: "#b8860b",
            fontSize: 11,
            padding: "6px 18px",
            borderRadius: 40,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: "#b8860b",
              borderRadius: "50%",
              display: "inline-block",
              animation: "pulse-gold 2s ease-in-out infinite",
            }}
          />
          Established · 25+ Years in Mysore
        </div>

        {/* Heading */}
        <h1
          style={{
            ...fade(120),
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(28px, 7vw, 64px)",
            fontWeight: 800,
            color: "#0f0f0f",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            marginBottom: 10,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Shree <span style={{ color: "#b8860b" }}>Manjunatha</span>
          <br />
          Engineering Works
        </h1>

        {/* Kannada */}
        <p
          style={{
            ...fade(220),
            fontSize: 15,
            color: "#aaa",
            marginBottom: 16,
            letterSpacing: "0.5px",
          }}
        >
          ಶ್ರೀ ಮಂಜುನಾಥ ಎಂಜಿನಿಯರಿಂಗ್ ವರ್ಕ್ಸ್
        </p>

        {/* Tagline */}
        <p
          style={{
            ...fade(320),
            fontSize: 17,
            color: "#666",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.75,
            fontWeight: 400,
          }}
        >
          <em style={{ fontStyle: "italic", color: "#b8860b" }}>
            Built Once. Built Right.
          </em>{" "}
          Precision steel fabrication for gates, doors, shutters & more —
          serving Mysore for over 25 years.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            ...fade(420),
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="tel:9986464819"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#0f0f0f",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              padding: "14px 28px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b8860b";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0f0f0f";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <IconPhone size={16} /> Get a Free Quote
          </a>
          <a
            href="https://wa.me/919986464819"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              color: "#111",
              border: "1.5px solid #ddd",
              fontSize: 14,
              fontWeight: 500,
              padding: "13px 28px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#25D366";
              e.currentTarget.style.color = "#25D366";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#111";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <IconBrandWhatsapp size={16} /> WhatsApp Us
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            ...fade(600),
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#bbb",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Scroll to explore
          </span>
          <IconArrowDown
            size={16}
            color="#b8860b"
            style={{ animation: "bounce 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,134,11,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(184,134,11,0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}
