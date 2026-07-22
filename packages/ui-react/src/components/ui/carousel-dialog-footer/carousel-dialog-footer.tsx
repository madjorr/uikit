import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../button';
import { DialogClose } from '../dialog';
import { useCarousel } from '../carousel';

// PLTFRM-92693. Backed by two real Figma nodes (fileKey lrU3ydIyvPYQNE6ixdsKtJ):
// the inner row is node 6353:4858 ("CarouselDialog" in Figma's own naming — a
// three-variant first/middle/last row); the bar wrapping it is node 6353:5864
// ("FooterCarousel" in Figma). This component implements both as one part —
// the bar's chrome plus the row inside it. State is never a prop: it is derived
// from the ambient <Carousel /> context (canScrollPrev/canScrollNext), exactly
// like Carousel's own previous-disabled/next-disabled internal state.
//
// Verified-real tokens (used directly): the Back/Next/Close buttons are
// ui-react's Button (secondary / default); each dot's glyph is a plain filled
// circle (Figma's own dot SVGs are pixel-identical circles, fill #1763CF) sized
// via the shared --ui-button-icon-* tier — idle and active dots share the SAME
// glyph color, only the container differs (transparent vs. the active fill).
//
// Five values below are TEMP hardcodes: real Figma-resolved numbers not yet
// synced into a tokens-pd tier, each flagged with the pending token name it
// stands in for so a future sync is a mechanical find-replace. The footer bar's
// own fill is flagged separately — Figma has no value bound there at all (its
// "unset" placeholder), so that one needs a design decision, not just a sync.
const DOT_COUNT = 3;
const DOT_INDICES = Array.from({ length: DOT_COUNT }, (_, index) => index);

type CarouselDialogFooterState = 'first' | 'middle' | 'last';

function getFooterState(
  canScrollPrev: boolean,
  canScrollNext: boolean
): CarouselDialogFooterState {
  if (!canScrollPrev) {
    return 'first';
  }
  if (!canScrollNext) {
    return 'last';
  }
  return 'middle';
}

const CarouselDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel();
  const state = getFooterState(canScrollPrev, canScrollNext);
  const activeDot = state === 'first' ? 0 : state === 'last' ? 2 : 1;

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        'h-16', // pending --ui-footer-global-height
        'gap-4', // pending --ui-footer-global-gap
        'px-4', // pending --ui-footer-global-paddingx
        // pending --ui-footer-carousel-color — Figma has no value bound here
        // (an open design decision, not a sync gap); bg-background is a
        // reasoned placeholder matching FooterDefault's real resolved white.
        'bg-background',
        className
      )}
      {...props}
    >
      {/* boxLeft/boxRight are equal flex-1 growers (Figma's own structure) so
          the dot indicator stays pinned dead-center regardless of whether
          Back/Next/Close are present — a plain justify-between would let the
          dots drift when a side slot is empty (state=first has no Back). */}
      <div className="flex flex-1 items-center">
        {state !== 'first' && (
          <Button variant="secondary" onClick={scrollPrev}>
            Back
          </Button>
        )}
      </div>
      <div
        role="list"
        aria-label="Slide position"
        className={cn('flex shrink-0 items-center', 'gap-1.5')} // pending --ui-carousel-dialog-listindicator-gap
      >
        {DOT_INDICES.map((index) => (
          <span
            key={index}
            role="listitem"
            aria-current={index === activeDot ? 'true' : undefined}
            className={cn(
              'flex size-8 items-center justify-center rounded-[var(--ui-button-icon-global-container-border-radius)]',
              index === activeDot
                ? 'bg-[var(--ui-button-icon-global-container-color-active)]'
                : 'bg-transparent'
            )}
          >
            <span
              aria-hidden="true"
              className="size-[9.6px] rounded-full bg-[var(--ui-button-icon-global-icon-color-idle)]"
            />
          </span>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-end">
        {state === 'last' ? (
          <DialogClose render={<Button variant="default">Close</Button>} />
        ) : (
          <Button variant="default" onClick={scrollNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
});
CarouselDialogFooter.displayName = 'CarouselDialogFooter';

export { CarouselDialogFooter, type CarouselDialogFooterState };
