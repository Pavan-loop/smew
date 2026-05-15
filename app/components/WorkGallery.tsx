"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconZoomIn,
} from "@tabler/icons-react";

const categories = [
  "All",
  "Gates",
  // "Safety Doors",
  // "Shutters",
  // "Window Grills",
  // "Railings",
  // "Custom",
  "Stairs",
  "Roofing",
  "Balcony",
];

const photos = [
  // ── All (general showcase) ──
  { id: 1,  category: "All",     label: "Our Work",  src: "/Gallery/all1.jpeg" },
  { id: 2,  category: "All",     label: "Our Work",  src: "/Gallery/all2.jpeg" },
  { id: 3,  category: "All",     label: "Our Work",  src: "/Gallery/all3.jpeg" },
  { id: 4,  category: "All",     label: "Our Work",  src: "/Gallery/all4.jpeg" },
  { id: 5,  category: "All",     label: "Our Work",  src: "/Gallery/all5.jpeg" },
  { id: 6,  category: "All",     label: "Our Work",  src: "/Gallery/all6.jpeg" },
  // ── Gates ──
  { id: 7,  category: "Gates",   label: "Main Gate", src: "/Gallery/gate1.jpeg" },
  { id: 8,  category: "Gates",   label: "Main Gate", src: "/Gallery/gate2.jpeg" },
  { id: 9,  category: "Gates",   label: "Main Gate", src: "/Gallery/gate3.jpeg" },
  { id: 10, category: "Gates",   label: "Main Gate", src: "/Gallery/gate4.jpeg" },
  // ── Stairs ──
  { id: 11, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs1.jpeg" },
  { id: 12, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs2.jpeg" },
  { id: 13, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs3.jpeg" },
  { id: 14, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs4.jpeg" },
  { id: 15, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs5.jpeg" },
  { id: 16, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs6.jpeg" },
  { id: 17, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs7.jpeg" },
  { id: 18, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs8.jpeg" },
  { id: 19, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs9.jpeg" },
  { id: 20, category: "Stairs",  label: "Staircase", src: "/Gallery/stairs10.jpeg" },
  // ── Roofing ──
  { id: 21, category: "Roofing", label: "Roofing",   src: "/Gallery/roofing.jpeg" },
  { id: 22, category: "Roofing", label: "Roofing",   src: "/Gallery/roofing1.jpeg" },
  { id: 23, category: "Roofing", label: "Roofing",   src: "/Gallery/roofing2.jpeg" },
  // ── Balcony ──
  { id: 24, category: "Balcony", label: "Balcony",   src: "/Gallery/balcony1.jpeg" },
  { id: 25, category: "Balcony", label: "Balcony",   src: "/Gallery/balcony2.jpeg" },
  // ── Railings & Safety (in All until categories are enabled) ──
  { id: 26, category: "All",     label: "Railings",  src: "/Gallery/railings1.jpeg" },
  { id: 27, category: "All",     label: "Safety Door", src: "/Gallery/safety1.jpeg" },
  { id: 28, category: "All",     label: "Safety Door", src: "/Gallery/safety2.jpeg" },
];

export default function WorkGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<null | number>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered =
    activeFilter === "All"
      ? photos
      : photos.filter((p) => p.category === activeFilter);
  const maxSlide = filtered.length - 1;

  const goTo = useCallback(
    (idx: number) => {
      setSlideIndex(Math.max(0, Math.min(idx, maxSlide)));
    },
    [maxSlide],
  );

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 3500);
  }, [maxSlide]);

  useEffect(() => {
    startAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [startAuto, activeFilter]);
  useEffect(() => {
    setSlideIndex(0);
  }, [activeFilter]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.05 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const lbIndex =
    lightbox != null ? filtered.findIndex((p) => p.id === lightbox) : -1;
  const lbPhoto = lbIndex >= 0 ? filtered[lbIndex] : null;
  const lbPrev = () => {
    if (lbIndex > 0) setLightbox(filtered[lbIndex - 1].id);
  };
  const lbNext = () => {
    if (lbIndex < filtered.length - 1) setLightbox(filtered[lbIndex + 1].id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, lbIndex]);

  const currentPhoto = filtered[slideIndex];

  return (
    <section
      id="gallery"
      style={{
        padding: "80px 0",
        background: "#fff",
        borderBottom: "1px solid #e4e0da",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div
          ref={ref}
          style={{
            marginBottom: 36,
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
            Our Work
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
            Work Gallery
          </h2>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>
            40+ completed projects across Mysore — real work, real quality
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 32,
            opacity: inView ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: 40,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                border:
                  activeFilter === cat
                    ? "1.5px solid #b8860b"
                    : "1.5px solid #e4e0da",
                background: activeFilter === cat ? "#faf6ed" : "#fff",
                color: activeFilter === cat ? "#b8860b" : "#666",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Single-photo slider */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
            transform: `translateX(${-slideIndex * 100}%)`,
          }}
        >
          {filtered.map((photo, pi) => (
            <div
              key={photo.id}
              style={{
                minWidth: "100%",
                padding: "0 32px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <div
                  onClick={() => {
                    setLightbox(photo.id);
                    if (autoRef.current) clearInterval(autoRef.current);
                  }}
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#f0ede8",
                    border: "1px solid #e4e0da",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "scale(1)" : "scale(0.96)",
                    transition: `opacity 0.5s ease ${pi * 20}ms, transform 0.5s ease ${pi * 20}ms`,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    (
                      el.querySelector(".overlay") as HTMLDivElement
                    ).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    (
                      el.querySelector(".overlay") as HTMLDivElement
                    ).style.opacity = "0";
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    className="overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(15,15,15,0.5)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <IconZoomIn size={36} color="#fff" />
                    <span
                      style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}
                    >
                      {photo.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.85)",
                        background: "rgba(184,134,11,0.85)",
                        padding: "4px 14px",
                        borderRadius: 20,
                      }}
                    >
                      {photo.category}
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 14,
                    padding: "0 4px",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                      flexShrink: 1,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f0f0f",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {photo.label}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 11,
                        color: "#b8860b",
                        background: "#faf6ed",
                        border: "1px solid #e8d89a",
                        padding: "3px 12px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {photo.category}
                    </span>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 12,
                      color: "#bbb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pi + 1} / {filtered.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {(["prev", "next"] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => {
              goTo(dir === "prev" ? slideIndex - 1 : slideIndex + 1);
              startAuto();
            }}
            disabled={
              (dir === "prev" && slideIndex === 0) ||
              (dir === "next" && slideIndex === maxSlide)
            }
            style={{
              position: "absolute",
              top: "45%",
              transform: "translateY(-50%)",
              [dir === "prev" ? "left" : "right"]: 8,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#fff",
              border: "1.5px solid #e4e0da",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              opacity:
                (dir === "prev" && slideIndex === 0) ||
                (dir === "next" && slideIndex === maxSlide)
                  ? 0.35
                  : 1,
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#b8860b";
              b.style.borderColor = "#b8860b";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "#fff";
              b.style.borderColor = "#e4e0da";
            }}
          >
            {dir === "prev" ? (
              <IconChevronLeft size={20} color="#555" />
            ) : (
              <IconChevronRight size={20} color="#555" />
            )}
          </button>
        ))}
      </div>

      {/* Dots — show only first 10 for sanity */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 7,
          marginTop: 20,
          flexWrap: "wrap",
          padding: "0 32px",
        }}
      >
        {filtered.slice(0, 10).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i);
              startAuto();
            }}
            style={{
              width: i === slideIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: i === slideIndex ? "#b8860b" : "#e4e0da",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
        {filtered.length > 10 && (
          <span style={{ fontSize: 11, color: "#bbb", alignSelf: "center" }}>
            +{filtered.length - 10} more
          </span>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && lbPhoto && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <IconX size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              lbPrev();
            }}
            disabled={lbIndex === 0}
            style={{
              position: "absolute",
              left: 20,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: lbIndex === 0 ? 0.3 : 1,
            }}
          >
            <IconChevronLeft size={24} color="#fff" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "80vw", maxHeight: "80vh" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lbPhoto.src}
              alt={lbPhoto.label}
              style={{
                maxWidth: "80vw",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 8,
                display: "block",
              }}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 12,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {lbPhoto.label}
              <span
                style={{
                  marginLeft: 10,
                  background: "#b8860b",
                  padding: "3px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                }}
              >
                {lbPhoto.category}
              </span>
            </div>
            <p
              style={{
                textAlign: "center",
                marginTop: 6,
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {lbIndex + 1} / {filtered.length}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              lbNext();
            }}
            disabled={lbIndex === filtered.length - 1}
            style={{
              position: "absolute",
              right: 20,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: lbIndex === filtered.length - 1 ? 0.3 : 1,
            }}
          >
            <IconChevronRight size={24} color="#fff" />
          </button>
        </div>
      )}
    </section>
  );
}
