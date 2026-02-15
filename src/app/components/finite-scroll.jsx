'use client';

/**
 * FiniteScroll
 *
 * Same smooth wheel/touch scroll behavior as InfiniteScroll, but scroll stops
 * at the end of content. No infinite loop - content is rendered once.
 * Accepts optional endContent to display after the main content.
 */

import * as React from 'react';

const LERP_FACTOR = 0.05;
const LERP_THRESHOLD = 0.01;
const LINE_HEIGHT = 100 / 6;
const WHEEL_MULTIPLIER = 1;
const TOUCH_MULTIPLIER = 2;

export function FiniteScroll({
  children,
  endContent,
  style,
  ...rest
}) {
  const contentRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const targetScrollRef = React.useRef(0);
  const animatedScrollRef = React.useRef(0);
  const touchStartRef = React.useRef({ x: 0, y: 0 });
  const [contentHeight, setContentHeight] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const lastContentHeightRef = React.useRef(0);
  const lastContainerHeightRef = React.useRef(0);

  const maxScroll = React.useMemo(() => {
    if (contentHeight === 0 || containerHeight === 0) return 0;
    return Math.max(0, contentHeight - containerHeight);
  }, [contentHeight, containerHeight]);

  const clampTarget = React.useCallback(
    (value) => Math.max(0, Math.min(maxScroll, value)),
    [maxScroll]
  );

  const animate = React.useCallback(() => {
    const element = scrollRef.current;

    if (!element || contentHeight === 0) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const target = clampTarget(targetScrollRef.current);
    const current = animatedScrollRef.current;
    const distance = Math.abs(target - current);
    const next =
      distance < LERP_THRESHOLD
        ? target
        : current + (target - current) * LERP_FACTOR;

    animatedScrollRef.current = next;
    element.scrollTo({ top: animatedScrollRef.current, behavior: 'instant' });

    rafRef.current = requestAnimationFrame(animate);
  }, [clampTarget, contentHeight]);

  const handleWheel = React.useCallback(
    (event) => {
      event.preventDefault();

      const { deltaY, deltaMode } = event;
      const multiplier =
        deltaMode === 1
          ? LINE_HEIGHT
          : deltaMode === 2
            ? containerHeight || window.innerHeight
            : 1;

      const delta = deltaY * multiplier * WHEEL_MULTIPLIER;
      targetScrollRef.current = clampTarget(targetScrollRef.current + delta);
    },
    [containerHeight, clampTarget]
  );

  const handleTouchStart = React.useCallback((event) => {
    const touch = event.targetTouches?.[0] ?? event.changedTouches?.[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = React.useCallback(
    (event) => {
      event.preventDefault();

      const touch = event.targetTouches?.[0] ?? event.changedTouches?.[0];
      if (!touch) return;

      const deltaY =
        -(touch.clientY - touchStartRef.current.y) * TOUCH_MULTIPLIER;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };

      targetScrollRef.current = clampTarget(
        targetScrollRef.current + deltaY
      );
    },
    [clampTarget]
  );

  React.useLayoutEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [animate]);

  React.useLayoutEffect(() => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  React.useLayoutEffect(() => {
    if (!contentRef.current || !scrollRef.current) return;

    const contentEl = contentRef.current;
    const scrollEl = scrollRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === contentEl) {
          const measured = contentEl.offsetHeight;
          if (measured !== lastContentHeightRef.current) {
            lastContentHeightRef.current = measured;
            setContentHeight(measured);
          }
        } else if (entry.target === scrollEl) {
          const measured = scrollEl.clientHeight;
          if (measured !== lastContainerHeightRef.current) {
            lastContainerHeightRef.current = measured;
            setContainerHeight(measured);
          }
        }
      }
    });

    resizeObserver.observe(contentEl);
    resizeObserver.observe(scrollEl);

    scrollEl.scrollTop = 0;
    targetScrollRef.current = 0;
    animatedScrollRef.current = 0;

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{
        overflowY: 'auto',
        overscrollBehavior: 'none',
        overflowAnchor: 'none',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        ...style,
      }}
      {...rest}
    >
      <div ref={contentRef}>
        {children}
        {endContent}
      </div>
    </div>
  );
}
