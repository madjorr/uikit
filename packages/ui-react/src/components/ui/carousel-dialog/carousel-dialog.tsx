import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  type CarouselProps,
} from '../carousel';
import { CarouselDialogFooter } from '../carousel-dialog-footer';
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
export interface CarouselDialogProps
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
  /**
   * Accessible name for the dialog, forwarded to `<DialogContent>`. There is
   * no `DialogTitle` slot here (the popup's only content is the carousel), so
   * one of `aria-label`/`aria-labelledby` is required for the dialog to have
   * an accessible name — see Dialog's own `accessibility.md`.
   */
  'aria-label'?: string;
  /**
   * Accessible name via reference to an element id rendered inside a slide,
   * forwarded to `<DialogContent>`. Prefer this over `aria-label` when the
   * name is also visible on-screen.
   */
  'aria-labelledby'?: string;
}

function CarouselDialog({
  children,
  opts,
  plugins,
  setApi,
  size,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...dialogProps
}: CarouselDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent
        size={size}
        className={className}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <Carousel opts={opts} plugins={plugins} setApi={setApi}>
          <CarouselContent>{children}</CarouselContent>
          <CarouselDialogFooter />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
CarouselDialog.displayName = 'CarouselDialog';

export { CarouselDialog };
