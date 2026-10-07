import React, { useId } from 'react';
import { Address } from '../../types/Address';
import { stampDateParts } from '../../utils/dates';
import { getRegion } from '../../utils/region';
import './Stamp.css';

const INKS = ['#a4243b', '#1d4e89', '#2a7f62', '#6a4c93', '#b5562f', '#0f6f73', '#7a4e2d'];

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Each court always gets the same ink, tilt and shape, so its stamp is recognisable. */
export function stampStyle(courtId: string) {
  const h = hash(`court-${courtId}`);
  return {
    ink: INKS[h % INKS.length],
    rotation: ((h >>> 4) % 25) - 12,
    shape: (h >>> 9) % 3 === 0 ? 'ticket' : 'round',
    seed: h % 97,
  };
}

function shortName(name: string, max: number): string {
  const trimmed = name.replace(/\s*-\s*.*$/, '').replace(/\s+(Tennis Club|Tennis Courts?)$/i, '');
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

interface StampProps {
  court: Address;
  date: string;
  className?: string;
  /** Plays the "thunk" animation when the stamp first appears */
  animate?: boolean;
}

const Stamp: React.FC<StampProps> = ({ court, date, className = '', animate = false }) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const { ink, rotation, shape, seed } = stampStyle(court.id);
  const { day, month, year } = stampDateParts(date);
  const region = getRegion(court).toUpperCase();
  const name = shortName(court.name, shape === 'round' ? 24 : 20).toUpperCase();

  return (
    <svg
      className={`stamp ${animate ? 'stamp-animate' : ''} ${className}`}
      viewBox="0 0 120 120"
      style={{ '--stamp-rotation': `${rotation}deg`, color: ink } as React.CSSProperties}
      role="img"
      aria-label={`Stamp for ${court.name}, ${day} ${month} ${year}`}
    >
      <defs>
        <filter id={`rough-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
        </filter>
        <path id={`top-${id}`} d="M21,60 A39,39 0 0,1 99,60" />
        <path id={`bottom-${id}`} d="M15,60 A45,45 0 0,0 105,60" />
      </defs>

      <g filter={`url(#rough-${id})`} fill="currentColor" stroke="currentColor">
        {shape === 'round' ? (
          <>
            <circle cx="60" cy="60" r="55" fill="none" strokeWidth="3.5" />
            <circle cx="60" cy="60" r="50" fill="none" strokeWidth="1.2" />
            <circle cx="60" cy="60" r="33" fill="none" strokeWidth="1.2" />
            <text fontSize="8.5" fontWeight="700" letterSpacing="0.8" stroke="none">
              <textPath
                href={`#top-${id}`}
                startOffset="50%"
                textAnchor="middle"
                {...(name.length > 18 ? { textLength: 114, lengthAdjust: 'spacingAndGlyphs' } : {})}
              >
                {name}
              </textPath>
            </text>
            <text fontSize="7" fontWeight="600" letterSpacing="1.4" stroke="none">
              <textPath href={`#bottom-${id}`} startOffset="50%" textAnchor="middle">
                {`${region} · ON`}
              </textPath>
            </text>
            <text x="21" y="63" fontSize="7" stroke="none" textAnchor="middle">★</text>
            <text x="99" y="63" fontSize="7" stroke="none" textAnchor="middle">★</text>
            <TennisBall cx={60} cy={41} r={6} />
            <text x="60" y="65" fontSize="13" fontWeight="800" textAnchor="middle" stroke="none">{`${day} ${month}`}</text>
            <text x="60" y="78" fontSize="9" fontWeight="600" letterSpacing="1.5" textAnchor="middle" stroke="none">{year}</text>
          </>
        ) : (
          <>
            <rect x="5" y="20" width="110" height="80" rx="7" fill="none" strokeWidth="3.5" />
            <rect x="10" y="25" width="100" height="70" rx="3" fill="none" strokeWidth="1.2" />
            <text x="60" y="37" fontSize="6.5" fontWeight="600" letterSpacing="1.6" textAnchor="middle" stroke="none">
              TORONTO TENNIS
            </text>
            <text
              x="60"
              y="51"
              fontSize="9.5"
              fontWeight="800"
              textAnchor="middle"
              stroke="none"
              {...(name.length > 15 ? { textLength: 92, lengthAdjust: 'spacingAndGlyphs' } : {})}
            >
              {name}
            </text>
            <line x1="18" y1="57" x2="102" y2="57" strokeWidth="1" />
            <text x="60" y="74" fontSize="13" fontWeight="800" textAnchor="middle" stroke="none">{`${day} ${month} ${year}`}</text>
            <text x="60" y="88" fontSize="6.5" fontWeight="600" letterSpacing="1.4" textAnchor="middle" stroke="none">
              {`· ${region} ·`}
            </text>
          </>
        )}
      </g>
    </svg>
  );
};

const TennisBall: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g fill="none" strokeWidth="1.2">
    <circle cx={cx} cy={cy} r={r} />
    <path d={`M${cx - r * 0.75},${cy - r * 0.65} Q${cx - r * 0.1},${cy} ${cx - r * 0.75},${cy + r * 0.65}`} />
    <path d={`M${cx + r * 0.75},${cy - r * 0.65} Q${cx + r * 0.1},${cy} ${cx + r * 0.75},${cy + r * 0.65}`} />
  </g>
);

export default Stamp;
