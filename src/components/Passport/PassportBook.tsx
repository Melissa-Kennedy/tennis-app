import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface PageSpec {
  key: string;
  kind: 'cover' | 'back-cover' | 'paper';
  /** Shown in the quick-jump tabs */
  label?: string;
  /** Printed page number for paper pages */
  number?: number;
  content: React.ReactNode;
}

interface PassportBookProps {
  pages: PageSpec[];
  /** Index of the page in view (in two-page mode, either page of the open spread) */
  page: number;
  onPageChange: (page: number) => void;
  /** Single-page mode for narrow screens */
  single: boolean;
  keyboardEnabled: boolean;
}

const FLIP_MS = 900;

const PassportBook: React.FC<PassportBookProps> = ({ pages, page, onPageChange, single, keyboardEnabled }) => {
  const leafCount = pages.length / 2;
  // Two-page mode: leaf i holds pages 2i (front, right side) and 2i+1 (back, left side once turned).
  const turned = Math.ceil(page / 2);

  const previousTurned = useRef(turned);
  const [flipping, setFlipping] = useState<{ from: number; to: number } | null>(null);
  useLayoutEffect(() => {
    if (previousTurned.current === turned) return;
    setFlipping({ from: previousTurned.current, to: turned });
    previousTurned.current = turned;
    const timer = setTimeout(() => setFlipping(null), FLIP_MS);
    return () => clearTimeout(timer);
  }, [turned]);

  const previousPage = useRef(page);
  const direction = page >= previousPage.current ? 'forward' : 'back';
  useEffect(() => {
    previousPage.current = page;
  }, [page]);

  const canPrev = single ? page > 0 : turned > 0;
  const canNext = single ? page < pages.length - 1 : turned < leafCount;
  const goPrev = () => canPrev && onPageChange(single ? page - 1 : Math.max(0, 2 * (turned - 1) - 1));
  const goNext = () => canNext && onPageChange(single ? page + 1 : 2 * turned + 1);

  const navRef = useRef({ goPrev, goNext });
  navRef.current = { goPrev, goNext };
  useEffect(() => {
    if (!keyboardEnabled) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowRight') navRef.current.goNext();
      if (event.key === 'ArrowLeft') navRef.current.goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keyboardEnabled]);

  const touchStartX = useRef<number | null>(null);
  const swipeHandlers = {
    onTouchStart: (event: React.TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
    },
    onTouchEnd: (event: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = event.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (dx < -50) goNext();
      if (dx > 50) goPrev();
    },
  };

  const zIndexFor = (leaf: number) => {
    if (flipping) {
      const { from, to } = flipping;
      // Leaves mid-turn ride above both stacks, in the order they'll land.
      if (to > from && leaf >= from && leaf < to) return leafCount + 1 + (leaf - from);
      if (to < from && leaf >= to && leaf < from) return leafCount + 1 + (from - 1 - leaf);
    }
    return leaf < turned ? leaf + 1 : leafCount - leaf;
  };

  const renderFace = (spec: PageSpec, side: 'front' | 'back' | 'single', visible: boolean) => (
    <div className={`book-page page-${spec.kind} page-side-${side}`} inert={!visible}>
      <div className="page-content">{spec.content}</div>
      {spec.number !== undefined && <span className="page-number">{spec.number}</span>}
      {visible && side === 'front' && spec.kind !== 'cover' && (
        <button className="page-corner corner-next" onClick={goNext} aria-label="Next page" disabled={!canNext} />
      )}
      {visible && side === 'back' && (
        <button className="page-corner corner-prev" onClick={goPrev} aria-label="Previous page" />
      )}
    </div>
  );

  const offset = turned === 0 ? '-25%' : turned === leafCount ? '25%' : '0%';

  return (
    <div className="passport-viewer">
      {single ? (
        <div className="book-single" {...swipeHandlers}>
          <div key={page} className={`single-sheet turn-${direction}`}>
            {renderFace(pages[page], 'single', true)}
          </div>
        </div>
      ) : (
        <div className="book-stage" {...swipeHandlers}>
          <div className="book" style={{ transform: `translateX(${offset})` }}>
            {Array.from({ length: leafCount }, (_, leaf) => {
              const isTurned = leaf < turned;
              return (
                <div key={pages[2 * leaf].key} className={isTurned ? 'leaf is-turned' : 'leaf'} style={{ zIndex: zIndexFor(leaf) }}>
                  <div className="leaf-face leaf-front">{renderFace(pages[2 * leaf], 'front', leaf === turned)}</div>
                  <div className="leaf-face leaf-back">{renderFace(pages[2 * leaf + 1], 'back', leaf === turned - 1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="book-controls">
        <button className="round-button" onClick={goPrev} disabled={!canPrev} aria-label="Previous page">←</button>
        <div className="book-tabs" role="tablist" aria-label="Passport sections">
          {pages.map((spec, index) =>
            spec.label ? (
              <button
                key={spec.key}
                role="tab"
                aria-selected={single ? page === index : turned === Math.ceil(index / 2)}
                className="book-tab"
                onClick={() => onPageChange(index)}
              >
                {spec.label}
              </button>
            ) : null
          )}
        </div>
        <button className="round-button" onClick={goNext} disabled={!canNext} aria-label="Next page">→</button>
      </div>
      <p className="book-hint">{single ? 'Swipe to turn pages' : 'Use ← → keys or click a page corner to turn'}</p>
    </div>
  );
};

export default PassportBook;
