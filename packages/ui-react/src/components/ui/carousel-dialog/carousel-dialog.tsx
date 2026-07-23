import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  type CarouselProps,
} from '../carousel';
import {
  CarouselDialogFooter,
  type CarouselDialogFooterProps,
} from '../carousel-dialog-footer';
import {
  Dialog,
  DialogContent,
  type DialogContentProps,
} from '../dialog';

// PLTFRM-92693. Figma has no single node for this composite — only for the
// footer bar and its inner row (see CarouselDialogFooter). This is the whole
// modal: Dialog chrome (still on its own no-Figma-node bypass, see dialog.tsx)
// wrapping a Carousel, with CarouselDialogFooter reading canScrollPrev/
// canScrollNext/scrollPrev/scrollNext from the Carousel context it renders
// inside of.
//
// Step-position-in-URL sync is deliberately NOT baked in here — `setApi` and
// `opts.startIndex` are exposed so a consumer can seed/read the current slide
// externally (e.g. from their own router).
//
// Slide count is bounded to [MIN_SLIDES, MAX_SLIDES]: below the minimum there
// is nothing sensible to render (dev-warned, left to the caller to fix); above
// the maximum, only the first MAX_SLIDES children reach the Carousel — this
// keeps the footer's dot indicator (one dot per real Embla slide, see
// CarouselDialogFooter) from growing without bound. CarouselDialogFooter
// enforces the same [MIN_SLIDES, MAX_SLIDES] range on its own dot count —
// kept in sync with the literals here — for its standalone (non-CarouselDialog)
// usage, where this slice never runs.
const MIN_SLIDES = 1;
const MAX_SLIDES = 5;

interface CarouselDialogBaseProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'children'> {
  /** One `<CarouselItem>` per slide — same shape as `<Carousel>`'s own children. */
  children: React.ReactNode;
  /** Forwarded to the inner `<Carousel>`. */
  opts?: CarouselProps['opts'];
  /** Forwarded to the inner `<Carousel>`. */
  plugins?: CarouselProps['plugins'];
  /** Forwarded to the inner `<Carousel>`; called once with the Embla API instance. */
  setApi?: CarouselProps['setApi'];
  /** Forwarded to `<DialogContent>` (popup max-width). */
  size?: DialogContentProps['size'];
  /** Forwarded to `<DialogContent>`. */
  className?: string;
  /** Forwarded to the inner `<CarouselDialogFooter>`'s `positionLabel`. */
  positionLabel?: CarouselDialogFooterProps['positionLabel'];
  /** Forwarded to the inner `<CarouselDialogFooter>`'s `backLabel`. */
  backLabel?: CarouselDialogFooterProps['backLabel'];
  /** Forwarded to the inner `<CarouselDialogFooter>`'s `nextLabel`. */
  nextLabel?: CarouselDialogFooterProps['nextLabel'];
  /** Forwarded to the inner `<CarouselDialogFooter>`'s `closeLabel`. */
  closeLabel?: CarouselDialogFooterProps['closeLabel'];
}

// There is no `DialogTitle` slot here (the popup's only content is the
// carousel), so `aria-label`/`aria-labelledby` can't be optional the way
// Dialog's own props are — one of the two must be supplied for the dialog to
// have an accessible name (see `accessibility.md`), and this union enforces
// that at the type level rather than leaving it to a JSDoc note.
type CarouselDialogAccessibleNameProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type CarouselDialogProps = CarouselDialogBaseProps &
  CarouselDialogAccessibleNameProps;

function CarouselDialog({
  children,
  opts,
  plugins,
  setApi,
  size,
  className,
  positionLabel,
  backLabel,
  nextLabel,
  closeLabel,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...dialogProps
}: CarouselDialogProps) {
  const slides = React.Children.toArray(children);

  if (process.env.NODE_ENV !== 'production' && (slides.length < MIN_SLIDES || slides.length > MAX_SLIDES)) {
    console.error(
      `CarouselDialog: expected between ${MIN_SLIDES} and ${MAX_SLIDES} slides, received ${slides.length}.` +
        (slides.length > MAX_SLIDES ? ` Rendering only the first ${MAX_SLIDES}.` : '')
    );
  }

  return (
    <Dialog {...dialogProps}>
      <DialogContent
        size={size}
        className={className}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <Carousel opts={opts} plugins={plugins} setApi={setApi}>
          <CarouselContent>{slides.slice(0, MAX_SLIDES)}</CarouselContent>
          <CarouselDialogFooter
            positionLabel={positionLabel}
            backLabel={backLabel}
            nextLabel={nextLabel}
            closeLabel={closeLabel}
          />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
CarouselDialog.displayName = 'CarouselDialog';

export { CarouselDialog };
