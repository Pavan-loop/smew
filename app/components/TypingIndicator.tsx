"use client";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";

export type TypingAvatar =
  | "welder"
  | "welder-at-work"
  | "torch"
  | "grinder"
  | "mask-expressive"
  | "weld-bead"
  | "worker"
  | "gate";
// Switch the chat's typing avatar here (any TypingAvatar value above).
export const TYPING_AVATAR: TypingAvatar = "welder-at-work";

// [dx, rise, fall, delay(s), radius]: each spark arcs up by `rise` then drops to `fall`.
type Spark = readonly [number, number, number, number, number?];

function Sparks({
  x,
  y,
  sparks,
  className = "",
}: {
  x: number;
  y: number;
  sparks: readonly Spark[];
  className?: string;
}) {
  return (
    <g className={`smew-sparks ${className}`}>
      {sparks.map(([dx, rise, fall, delay, r = 1], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          style={
            {
              "--dx": `${dx}px`,
              "--up": `${rise}px`,
              "--dy": `${fall}px`,
              animationDelay: `${delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </g>
  );
}

function WelderAvatar() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <path
        d="M10.5 13.5Q20 4.5 29.5 13.5L31.5 24Q31 32.5 20 34.5Q9 32.5 8.5 24Z"
        className="smew-av-gold"
      />
      <path d="M14 12.6Q20 8.6 26 12.6" className="smew-av-shine" />
      <circle cx="8.9" cy="20.5" r="1.8" className="smew-av-light" />
      <circle cx="31.1" cy="20.5" r="1.8" className="smew-av-light" />
      <rect
        x="12.5"
        y="15"
        width="15"
        height="7.5"
        rx="1.6"
        className="smew-av-dark"
      />
      <rect
        x="13.8"
        y="16.3"
        width="12.4"
        height="4.9"
        rx="1"
        className="smew-weld-visor"
      />
      <path d="M15 17.6h3" className="smew-av-glint" />
      <path d="M15.5 27.5h9M16.8 30h6.4" className="smew-av-vent" />
      <path d="M38 38.5L33.4 34.2" className="smew-av-torch" />
      <g className="smew-weld-sparks">
        <circle cx="32.6" cy="33.6" r="1.3" />
        <circle cx="32.6" cy="33.6" r="1.1" />
        <circle cx="32.6" cy="33.6" r="1.2" />
        <circle cx="32.6" cy="33.6" r="1" />
        <circle cx="32.6" cy="33.6" r="1.1" />
      </g>
      <circle cx="32.6" cy="33.6" r="1.3" className="smew-weld-tip" />
    </svg>
  );
}

function WorkerAvatar() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <circle cx="19" cy="24" r="8.5" className="smew-av-skin" />
      <g className="smew-worker-eyes">
        <circle cx="16" cy="23.5" r="1.25" />
        <circle cx="22" cy="23.5" r="1.25" />
      </g>
      <path d="M15.8 27.4q3.2 2.6 6.4 0" className="smew-av-smile" />
      <circle cx="13.7" cy="26.6" r="1.2" className="smew-av-cheek" />
      <circle cx="24.3" cy="26.6" r="1.2" className="smew-av-cheek" />
      <path
        d="M9.5 19.5C9.5 12.5 13.8 8.5 19 8.5s9.5 4 9.5 11z"
        className="smew-av-gold"
      />
      <rect
        x="17.6"
        y="8.6"
        width="2.8"
        height="10.9"
        rx="1.4"
        className="smew-av-light"
      />
      <rect
        x="6.5"
        y="18.6"
        width="25"
        height="3.2"
        rx="1.6"
        className="smew-av-brim"
      />
      <g className="smew-worker-hammer">
        <path d="M33.5 35V26.5" className="smew-av-handle" />
        <rect
          x="29.6"
          y="23.6"
          width="7.8"
          height="3.6"
          rx="0.9"
          className="smew-av-steel"
        />
      </g>
      <g className="smew-worker-tap">
        <path d="M28.6 22.4l-1.6-1.2M28.3 25.2l-2 0.2" />
      </g>
    </svg>
  );
}

function GateAvatar() {
  const bars = [11.6, 14.2, 16.8];
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <rect
        x="5.5"
        y="11"
        width="3"
        height="23"
        rx="0.8"
        className="smew-av-gold"
      />
      <rect
        x="31.5"
        y="11"
        width="3"
        height="23"
        rx="0.8"
        className="smew-av-gold"
      />
      <circle cx="7" cy="9.6" r="1.9" className="smew-av-light" />
      <circle cx="33" cy="9.6" r="1.9" className="smew-av-light" />
      {[undefined, "matrix(-1 0 0 1 40 0)"].map((mirror) => (
        <g key={mirror ?? "left"} transform={mirror}>
          <g className="smew-gate-leaf">
            <path
              d="M9 17q6-1.2 11-5.4M9 32h11M9 17v15M19.6 12v20"
              className="smew-av-bar"
            />
            {bars.map((x, i) => (
              <g key={x}>
                <path
                  d={`M${x} ${16.4 - i * 1.3}V32`}
                  className="smew-av-bar thin"
                />
                <path
                  d={`M${x - 1} ${16.6 - i * 1.3}l1-2.2 1 2.2z`}
                  className="smew-av-light"
                />
              </g>
            ))}
            <circle cx="14.2" cy="25" r="2" className="smew-av-ring" />
          </g>
        </g>
      ))}
      <g className="smew-gate-burst">
        <path d="M20 25l4.5-3.5M20 25l5.2 0.6M20 25l3.8 3.6M20 25l0.8 5M20 25l-3.6 3.4" />
      </g>
      <circle cx="20" cy="25" r="1.4" className="smew-gate-hot" />
    </svg>
  );
}

function WelderAtWorkAvatar() {
  const bead = [
    "#7d7a73",
    "#93836a",
    "#a8864a",
    "#b8860b",
    "#d9962a",
    "#ff8a1f",
  ];
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <circle cx="27.6" cy="30" r="7.5" className="smew-arc-light" />
      <path
        d="M10 18.5Q16 17.5 19.5 20.5L18 25Q12 27.5 7.5 31H4.5Q4.5 23 10 18.5Z"
        className="smew-av-jacket"
      />
      <path
        d="M9.5 8.5Q13 4.8 18 6.6L23.2 14.6Q22.6 17.8 18.6 18.8L12.4 19Q8.6 17.4 8.4 12.6Q8.5 10 9.5 8.5Z"
        className="smew-av-gold"
      />
      <path d="M11 9.2Q13.6 6.6 17 7.6" className="smew-av-shine" />
      <circle cx="13" cy="12.8" r="1.5" className="smew-av-light" />
      <path d="M18 8.2L22.8 15L20 16.8L15.8 10.4Z" className="smew-av-dark" />
      <path
        d="M18 9.6L21.4 14.6L20.2 15.4L16.9 10.5Z"
        className="smew-waw-visor"
      />
      <rect
        x="13"
        y="30.6"
        width="22"
        height="3.4"
        rx="0.8"
        className="smew-av-plate"
      />
      <path d="M13.6 30.9H34.4" className="smew-av-plate-edge" />
      {bead.map((color, i) => (
        <circle
          key={color}
          cx={17.5 + i * 1.7}
          cy="30.8"
          r="1.05"
          fill={color}
        />
      ))}
      <g className="smew-waw-hand">
        <path d="M16 21.5Q20 23 23.4 25.8" className="smew-av-arm" />
        <circle cx="23.8" cy="26.1" r="1.8" className="smew-av-light" />
        <path d="M23.4 25.2L27.2 29.4" className="smew-av-torch thin" />
        <path d="M24.6 30.2h6M27.6 27.2v6" className="smew-arc-flare" />
        <circle cx="27.6" cy="30.2" r="1.5" className="smew-arc-core" />
        <Sparks
          x={27.6}
          y={30.2}
          sparks={[
            [5, -4, 6, 0, 1.1],
            [7, -2.5, 4, 0.13],
            [-4, -3.5, 5, 0.26, 0.9],
            [3, -5, 7, 0.39, 1.1],
            [-6, -2, 3, 0.52],
            [8, -1.5, 3, 0.65, 0.9],
            [1.5, -4.5, 6, 0.78],
          ]}
        />
      </g>
    </svg>
  );
}

function TorchAvatar() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <rect
        x="16"
        y="31.2"
        width="19"
        height="3.4"
        rx="0.8"
        className="smew-av-plate"
      />
      <path d="M16.6 31.5H34.4" className="smew-av-plate-edge" />
      <ellipse
        cx="27.6"
        cy="31.6"
        rx="3.2"
        ry="1.1"
        className="smew-torch-hot"
      />
      <path d="M5.5 9.5L12.6 16.6" className="smew-torch-grip" />
      <path
        d="M6.6 13.4l2.8-2.8M8.8 15.6l2.8-2.8"
        className="smew-torch-ring"
      />
      <path d="M12.6 16.6L17.2 21.2" className="smew-av-torch" />
      <path d="M16.9 20.9L19.9 23.9" className="smew-torch-nozzle" />
      <g transform="translate(20.2 24.2) rotate(45)">
        <g className="smew-flame">
          <path
            d="M0-2.8Q6-2.7 10.4 0Q6 2.7 0 2.8Z"
            className="smew-flame-outer"
          />
          <path
            d="M0-1.9Q4.2-1.7 7 0Q4.2 1.7 0 1.9Z"
            className="smew-flame-mid"
          />
          <path d="M0-1Q2.5-.9 4.2 0Q2.5.9 0 1Z" className="smew-flame-core" />
        </g>
      </g>
      <Sparks
        x={27.6}
        y={31.2}
        sparks={[
          [6, -5, 2, 0, 1.1],
          [-5, -4, 3, 0.12],
          [8, -3, 1, 0.24, 0.9],
          [3, -6.5, 1, 0.36, 1.1],
          [-7, -2.5, 2, 0.48, 0.9],
          [5, -2, 3, 0.6],
        ]}
      />
    </svg>
  );
}

function GrinderAvatar() {
  const fan: readonly (readonly [number, number])[] = [
    [4, 0.3],
    [-3, 0],
    [-9, 0.24],
    [-15, 0.09],
    [-21, 0.33],
    [-27, 0.15],
    [-33, 0.39],
    [-40, 0.06],
    [-48, 0.21],
  ];
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <rect
        x="5"
        y="29"
        width="29"
        height="4"
        rx="0.8"
        className="smew-av-plate"
      />
      <path d="M5.6 29.3H33.4" className="smew-av-plate-edge" />
      <g className="smew-grind-tool">
        <g className="smew-grind-disc">
          <circle cx="22" cy="21.5" r="7.4" className="smew-av-disc" />
          <circle cx="22" cy="21.5" r="5.2" className="smew-disc-ring" />
          <path
            d="M22 21.5V14.6M22 21.5L28 25M22 21.5L16 25"
            className="smew-disc-spoke"
          />
          <path
            d="M16.6 18.4A6.2 6.2 0 0 1 19.4 15.8"
            className="smew-disc-label"
          />
        </g>
        <path
          d="M13.6 21.5A8.4 8.4 0 0 1 27.9 15.6"
          className="smew-grind-guard"
        />
        <rect
          x="2.8"
          y="14.4"
          width="16"
          height="5.6"
          rx="2.8"
          className="smew-av-gold"
        />
        <path
          d="M6.5 15.9v2.6M8.5 15.9v2.6M10.5 15.9v2.6"
          className="smew-av-vent"
        />
        <rect
          x="17.6"
          y="15.4"
          width="8"
          height="4.6"
          rx="1.4"
          className="smew-av-brim"
        />
        <path d="M22.5 15.4L25 9" className="smew-grind-handle" />
        <circle cx="22" cy="21.5" r="1.5" className="smew-av-light" />
      </g>
      <circle cx="23" cy="29" r="1.7" className="smew-grind-hot" />
      <g className="smew-grind-sparks">
        {fan.map(([angle, delay]) => (
          <g key={angle} transform={`translate(23.4 28.6) rotate(${angle})`}>
            <path d="M0 0h4" style={{ animationDelay: `${delay}s` }} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function MaskExpressiveAvatar() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <path
        d="M10.5 13.5Q20 4.5 29.5 13.5L31.5 24Q31 32.5 20 34.5Q9 32.5 8.5 24Z"
        className="smew-av-gold"
      />
      <path d="M14 11.6Q20 8 26 11.6" className="smew-av-shine" />
      <circle cx="8.9" cy="20.5" r="1.8" className="smew-av-light" />
      <circle cx="31.1" cy="20.5" r="1.8" className="smew-av-light" />
      <rect
        x="12.5"
        y="14.6"
        width="15"
        height="8.2"
        rx="1.8"
        className="smew-av-dark"
      />
      <g className="smew-mask-eyes">
        <ellipse
          cx="16.7"
          cy="18.7"
          rx="2.1"
          ry="2.4"
          className="smew-mask-eye"
        />
        <ellipse
          cx="23.3"
          cy="18.7"
          rx="2.1"
          ry="2.4"
          className="smew-mask-eye"
        />
        <g className="smew-mask-pupils">
          <circle cx="17" cy="19" r="1.15" />
          <circle cx="23.6" cy="19" r="1.15" />
        </g>
      </g>
      <path d="M15.5 27.5h9M16.8 30h6.4" className="smew-av-vent" />
      <g className="smew-mask-visor">
        <rect
          x="11.4"
          y="13.6"
          width="17.2"
          height="10"
          rx="2"
          className="smew-av-brim"
        />
        <rect
          x="13.2"
          y="15.3"
          width="13.6"
          height="6.6"
          rx="1.1"
          className="smew-av-dark"
        />
        <rect
          x="14.2"
          y="16.3"
          width="11.6"
          height="4.6"
          rx="0.8"
          className="smew-mask-glow"
        />
        <path d="M15.2 17.4h2.8" className="smew-av-glint" />
      </g>
      <path
        d="M20 9.6V7.2M27.6 12.2l1.8-1.6M12.4 12.2l-1.8-1.6M30.4 18.6h2.4M9.6 18.6H7.2"
        className="smew-mask-flash"
      />
      <path d="M38 38.5L33.4 34.2" className="smew-av-torch" />
      <g className="smew-mask-work">
        <Sparks
          x={32.6}
          y={33.6}
          sparks={[
            [4, -5, -6, 0, 1.2],
            [7, -2, 0, 0.16, 1.1],
            [-5, -2, 3, 0.32, 1.1],
            [1, 1, 5, 0.48, 1],
            [-2, -6, -4, 0.64, 1.1],
          ]}
        />
        <circle cx="32.6" cy="33.6" r="1.3" className="smew-weld-tip" />
      </g>
    </svg>
  );
}

function WeldBeadAvatar() {
  const ripples = Array.from({ length: 14 }, (_, i) => 9 + i * 1.74);
  return (
    <svg viewBox="0 0 40 40" width="34" height="34">
      <rect
        x="6"
        y="12"
        width="28"
        height="9"
        rx="0.8"
        className="smew-bead-plate"
      />
      <rect
        x="6"
        y="21"
        width="28"
        height="9"
        rx="0.8"
        className="smew-bead-plate low"
      />
      <path d="M6.6 12.5H33.4" className="smew-av-plate-edge" />
      <path d="M6 21H34" className="smew-bead-seam" />
      <g className="smew-bead-run">
        {ripples.map((x) => (
          <circle key={x} cx={x} cy="21" r="1.5" className="smew-bead-ripple" />
        ))}
      </g>
      <g className="smew-bead-cover">
        <rect
          x="9"
          y="19.3"
          width="22.8"
          height="1.7"
          className="smew-bead-plate"
        />
        <rect
          x="9"
          y="21"
          width="22.8"
          height="1.8"
          className="smew-bead-plate low"
        />
        <path d="M9 21H31.8" className="smew-bead-seam" />
      </g>
      <g className="smew-bead-torch">
        <ellipse
          cx="7.4"
          cy="21"
          rx="3.6"
          ry="1.7"
          className="smew-bead-glow"
        />
        <path d="M9.8 18.6L10.9 15.2" className="smew-torch-nozzle" />
        <path d="M10.9 15.2L12 11.6" className="smew-av-torch thin" />
        <path d="M12 11.6L13.6 6.4" className="smew-torch-grip thin" />
        <circle cx="9.2" cy="21" r="1.5" className="smew-arc-core" />
        <Sparks
          x={9.2}
          y={21}
          sparks={[
            [-3, -4, -1, 0, 0.8],
            [2.5, -4.5, -2, 0.15, 0.8],
            [-4.5, -2, 2, 0.3, 0.7],
            [4, -2.5, 2.5, 0.45, 0.8],
          ]}
        />
      </g>
    </svg>
  );
}

const AVATARS = {
  welder: WelderAvatar,
  "welder-at-work": WelderAtWorkAvatar,
  torch: TorchAvatar,
  grinder: GrinderAvatar,
  "mask-expressive": MaskExpressiveAvatar,
  "weld-bead": WeldBeadAvatar,
  worker: WorkerAvatar,
  gate: GateAvatar,
} satisfies Record<TypingAvatar, () => ReactElement>;

export default function TypingIndicator({
  label,
  steps,
  variant = TYPING_AVATAR,
}: {
  label: string;
  // Status words per variant; `default` covers variants without their own copy.
  steps: Partial<Record<TypingAvatar, readonly string[]>> & {
    default: readonly string[];
  };
  variant?: TypingAvatar;
}) {
  const words = steps[variant] ?? steps.default;
  const Avatar = AVATARS[variant];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setStep((current) => (current + 1) % words.length),
      1800,
    );
    return () => clearInterval(timer);
  }, [words.length]);
  return (
    <div
      className={`smew-typing smew-typing--${variant}`}
      role="status"
      aria-live="polite"
    >
      <span className="smew-typing-avatar" aria-hidden="true">
        <Avatar />
      </span>
      <span className="smew-typing-bubble" aria-hidden="true">
        <span className="smew-typing-dots">
          <i />
          <i />
          <i />
        </span>
        <span key={step} className="smew-typing-word">
          {words[step % words.length]}
        </span>
      </span>
      <span className="smew-sr-only">{label}</span>
    </div>
  );
}
