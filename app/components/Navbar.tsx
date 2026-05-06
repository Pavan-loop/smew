"use client";
import { useState, useEffect } from "react";
import { IconMenu2, IconX, IconPhone } from "@tabler/icons-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Why Us", href: "#why" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid #e4e0da"
            : "1px solid transparent",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 17,
              fontWeight: 800,
              color: "#0f0f0f",
              letterSpacing: "-0.3px",
            }}
          >
            {isDesktop ? (
              <>
                Shree <span style={{ color: "#b8860b" }}>Manjunatha</span>{" "}
                Engineering
              </>
            ) : (
              <span style={{ color: "#b8860b" }}>SMEW</span>
            )}
          </div>

          {/* Desktop nav */}
          {isDesktop && (
            <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: 13,
                    color: "#555",
                    fontWeight: 500,
                    textDecoration: "none",
                    letterSpacing: "0.2px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#b8860b")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          {/* Desktop CTA */}
          {isDesktop && (
            <a
              href="tel:9986464819"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "#0f0f0f",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: 8,
                textDecoration: "none",
                letterSpacing: "0.3px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#b8860b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#0f0f0f")
              }
            >
              <IconPhone size={14} /> Call Now
            </a>
          )}

          {/* Hamburger — mobile only */}
          {!isDesktop && (
            <button
              onClick={() => setOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#111",
                padding: 4,
              }}
            >
              <IconMenu2 size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Sidebar overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sidebar panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 201,
          width: 280,
          background: "#fff",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #e4e0da",
          }}
        >
          <div
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            <span style={{ color: "#b8860b" }}>SMEW</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#111",
              padding: 4,
            }}
          >
            <IconX size={22} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 24px",
                fontSize: 15,
                fontWeight: 500,
                color: "#222",
                textDecoration: "none",
                borderBottom: "1px solid #f5f2ee",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#b8860b";
                e.currentTarget.style.paddingLeft = "30px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#222";
                e.currentTarget.style.paddingLeft = "24px";
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Sidebar CTA */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid #e4e0da" }}>
          <a
            href="tel:9986464819"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "#b8860b",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              padding: "14px 20px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            <IconPhone size={16} /> Call 9986464819
          </a>
        </div>
      </div>
    </>
  );
}
