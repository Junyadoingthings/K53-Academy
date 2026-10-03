import * as React from "react";
import type { RoadSign, SignSymbol } from "@/lib/data/types";

/**
 * Renders a South African road sign entirely in SVG, following SARTSM
 * shape & colour conventions. No image assets required — every sign is
 * drawn from its declarative spec in lib/data/signs.ts.
 */
export function RoadSignSVG({
  sign,
  size = 96,
  title,
}: {
  sign: RoadSign;
  size?: number;
  title?: string;
}) {
  const { shape, fill, stroke, symbol, symbolColor = "#0B0E1A" } = sign;
  const V = 100;
  const c = V / 2;

  const shapeEl = (() => {
    switch (shape) {
      case "octagon": {
        const r = 48;
        const pts = Array.from({ length: 8 }, (_, i) => {
          const a = (Math.PI / 4) * i + Math.PI / 8;
          // Round so SSR and client serialise identical strings (no hydration mismatch).
          return `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`;
        }).join(" ");
        return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={6} />;
      }
      case "triangle": {
        // Yield (regulatory) points down; warnings point up.
        const down = sign.category === "Regulatory";
        const pts = down ? "6,20 94,20 50,92" : "50,8 94,88 6,88";
        return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={7} strokeLinejoin="round" />;
      }
      case "diamond":
        return (
          <polygon
            points="50,4 96,50 50,96 4,50"
            fill={fill}
            stroke={stroke}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        );
      case "rectangle":
        return <rect x={6} y={16} width={88} height={68} rx={8} fill={fill} stroke={stroke} strokeWidth={5} />;
      case "pentagon":
        return <polygon points="50,4 96,40 78,96 22,96 4,40" fill={fill} stroke={stroke} strokeWidth={5} />;
      case "circle":
      default:
        return <circle cx={c} cy={c} r={46} fill={fill} stroke={stroke} strokeWidth={6} />;
    }
  })();

  return (
    <svg
      viewBox={`0 0 ${V} ${V}`}
      width={size}
      height={size}
      role="img"
      aria-label={title ?? `${sign.name} sign: ${sign.meaning}`}
    >
      <title>{title ?? `${sign.name} — ${sign.meaning}`}</title>
      {shapeEl}
      <SymbolLayer symbol={symbol} color={symbolColor} center={c} />
    </svg>
  );
}

function SymbolLayer({
  symbol,
  color,
  center: c,
}: {
  symbol: SignSymbol;
  color: string;
  center: number;
}) {
  switch (symbol.kind) {
    case "text": {
      const scale = symbol.scale ?? 1;
      const fontSize = (symbol.value.length > 3 ? 26 : 40) * scale;
      return (
        <text
          x={c}
          y={c}
          fill={color}
          fontSize={fontSize}
          fontWeight={800}
          fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {symbol.value}
        </text>
      );
    }
    case "bar":
      return <rect x={22} y={44} width={56} height={12} rx={2} fill={color} />;
    case "cross":
      return (
        <g stroke={color} strokeWidth={11} strokeLinecap="round">
          <line x1={30} y1={30} x2={70} y2={70} />
          <line x1={70} y1={30} x2={30} y2={70} />
        </g>
      );
    case "ring":
      return <circle cx={c} cy={c} r={30} fill="none" stroke={color} strokeWidth={8} />;
    case "arrow": {
      const rot = symbol.rotate ?? 0;
      return (
        <g transform={`rotate(${rot} ${c} ${c})`} fill={color}>
          <path d="M50 24 L50 76 M50 24 L38 40 M50 24 L62 40" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );
    }
    case "pedestrian":
      return (
        <g fill={color}>
          <circle cx={50} cy={26} r={7} />
          <path d="M50 33 L50 60 M50 42 L38 52 M50 42 L62 50 M50 60 L40 78 M50 60 L60 78" stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
        </g>
      );
    case "children":
      return (
        <g fill={color} stroke={color}>
          <circle cx={38} cy={30} r={6} />
          <path d="M38 36 L38 58 M38 44 L30 52 M38 44 L46 50 M38 58 L31 76 M38 58 L45 74" strokeWidth={5} strokeLinecap="round" fill="none" />
          <circle cx={64} cy={34} r={5} />
          <path d="M64 39 L64 58 M64 46 L57 52 M64 46 L71 52 M64 58 L58 74 M64 58 L70 74" strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      );
    case "bend": {
      const m = symbol.mirror;
      return (
        <g transform={m ? "scale(-1 1) translate(-100 0)" : undefined}>
          <path d="M42 82 L42 50 Q42 34 58 34 L64 34" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M58 24 L72 34 L58 44 Z" fill={color} />
        </g>
      );
    }
    case "robot":
      return (
        <g>
          <rect x={40} y={20} width={20} height={54} rx={6} fill={color} />
          <circle cx={50} cy={30} r={5} fill="#E63946" />
          <circle cx={50} cy={46} r={5} fill="#FFB020" />
          <circle cx={50} cy={62} r={5} fill="#00D97E" />
        </g>
      );
    case "hump":
      return (
        <g stroke={color} strokeWidth={8} fill="none" strokeLinecap="round">
          <path d="M20 64 Q50 28 80 64" />
          <line x1={16} y1={64} x2={84} y2={64} />
        </g>
      );
    case "slippery":
      return (
        <g fill={color} stroke={color}>
          <rect x={40} y={26} width={20} height={34} rx={4} />
          <path d="M28 72 Q40 60 52 72 T76 72" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "roundabout":
      return (
        <g fill="none" stroke={color} strokeWidth={7}>
          <circle cx={50} cy={52} r={20} />
          <path d="M50 24 L50 30 M40 18 L50 24 M60 18 L50 24" strokeLinecap="round" />
        </g>
      );
    case "digger":
      // Roadworks: a worker shovelling a mound of earth.
      return (
        <g fill={color} stroke={color}>
          <circle cx={40} cy={26} r={5} />
          <path
            d="M40 31 L40 50 M40 38 L52 30 M40 50 L34 70 M40 50 L47 68"
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
          />
          {/* shovel */}
          <path d="M52 30 L66 22" strokeWidth={4} strokeLinecap="round" />
          <path d="M63 17 L72 20 L69 27 Z" strokeWidth={2} />
          {/* mound */}
          <path d="M24 78 Q42 58 76 78 Z" strokeWidth={2} />
        </g>
      );
    case "overtake":
      // No overtaking: two cars side by side (left highlighted).
      return (
        <g fill={color}>
          <g transform="translate(24 38)">
            <rect x={0} y={8} width={22} height={12} rx={3} />
            <path d="M3 8 L6 1 L16 1 L19 8 Z" />
          </g>
          <g opacity={0.55} transform="translate(54 38)">
            <rect x={0} y={8} width={22} height={12} rx={3} />
            <path d="M3 8 L6 1 L16 1 L19 8 Z" />
          </g>
        </g>
      );
    case "none":
    default:
      return null;
  }
}
