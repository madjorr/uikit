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
// The Back/Next/Close buttons are ui-react's Button (secondary / default);
// each dot's glyph is a plain filled circle (Figma's own dot SVGs are
// pixel-identical circles, fill #1763CF) sized via the shared
// --ui-button-icon-* tier — idle and active dots share the SAME glyph color,
// only the container differs (transparent vs. the active fill). The bar's own
// geometry and fill come from the Footer tier and the dot gap from the
// Carousel tier — Figma's own "unset" placeholder for the bar fill resolved
// to a literal transparent in tokens-pd, so no separate design decision was
// needed there.
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

interface CarouselDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the 3-dot slide-position indicator. */
  positionLabel?: string;
  /** Label for the "scroll to previous slide" control. */
  backLabel?: string;
  /** Label for the "scroll to next slide" control. */
  nextLabel?: string;
  /** Label for the "close the dialog" control (shown on the last slide). */
  closeLabel?: string;
}

const CarouselDialogFooter = React.forwardRef<HTMLDivElement, CarouselDialogFooterProps>(
  (
    {
      className,
      positionLabel = 'Slide position',
      backLabel = 'Back',
      nextLabel = 'Next',
      closeLabel = 'Close',
      ...props
    },
    ref
  ) => {
    const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel();
    const state = getFooterState(canScrollPrev, canScrollNext);
    const activeDot = state === 'first' ? 0 : state === 'last' ? 2 : 1;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          'h-[var(--ui-footer-global-height)]',
          'gap-[var(--ui-footer-global-gap)]',
          'px-[var(--ui-footer-global-padding-x)]',
          'bg-[var(--ui-footer-carousel-color)]',
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
              {backLabel}
            </Button>
          )}
        </div>
        <div
          role="list"
          aria-label={positionLabel}
          className={cn('flex shrink-0 items-center', 'gap-[var(--ui-carousel-dialog-list-indicator-gap)]')}
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
            <DialogClose render={<Button variant="default">{closeLabel}</Button>} />
          ) : (
            <Button variant="default" onClick={scrollNext}>
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
CarouselDialogFooter.displayName = 'CarouselDialogFooter';

export { CarouselDialogFooter, type CarouselDialogFooterProps, type CarouselDialogFooterState };
