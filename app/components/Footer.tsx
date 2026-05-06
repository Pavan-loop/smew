"use client";
import { IconBrandWhatsapp, IconPhone, IconMapPin } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", padding: "48px 32px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 12,
                letterSpacing: "-0.3px",
              }}
            >
              Shree <span style={{ color: "#b8860b" }}>Manjunatha</span>
              <br />
              Engineering Works
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              Built Once. Built Right. Serving Mysore with precision steel
              fabrication for gates, doors, shutters and more since 25+ years.
            </p>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
                fontStyle: "italic",
              }}
            >
              ಗುಣಮಟ್ಟದ ಕೆಲಸ, ಶಾಶ್ವತ ಫಲ
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#b8860b",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              Quick Links
            </div>
            {[
              "Home",
              "Services",
              "Work Gallery",
              "Why Choose Us",
              "Testimonials",
              "Contact",
            ].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  marginBottom: 8,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#b8860b")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
                }
              >
                {link}
              </a>
            ))}
          </div>

          {/* Services */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#b8860b",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              Our Services
            </div>
            {[
              "Main Gates",
              "Safety Doors",
              "Rolling Shutters",
              "Window Grills",
              "Staircase Railings",
              "Custom Fabrication",
            ].map((s) => (
              <div
                key={s}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 8,
                }}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#b8860b",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              Contact Us
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a
                href="tel:9986464819"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  fontSize: 13,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                <IconPhone size={15} color="#b8860b" /> 9986464819
              </a>
              <a
                href="https://wa.me/919986464819"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  fontSize: 13,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#25D366")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                <IconBrandWhatsapp size={15} color="#25D366" /> WhatsApp Us
              </a>
              <a
                href="https://share.google/rK3SeF47wLsuIKe83"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  fontSize: 13,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f2f2f2")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                <IconMapPin size={15} color="#ffffff" /> Google Maps Location
              </a>
            </div>
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919986464819"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 20,
                background: "#25D366",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                padding: "11px 20px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <IconBrandWhatsapp size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Shree Manjunatha Engineering Works. All
            rights reserved.
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            24/2, near basaveshwara temple, Kuppalur, Mysuru, Karnataka 570031
          </div>
        </div>
      </div>
    </footer>
  );
}
