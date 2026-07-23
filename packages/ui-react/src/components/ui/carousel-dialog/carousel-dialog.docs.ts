import type * as React from 'react';

import type { CarouselApi, CarouselProps } from '../carousel';
import type { DialogContentProps } from '../dialog/dialog.docs';

// Curated prop surface for the docs `<AutoTypeTable>`. The runtime type
// (`CarouselDialogProps` in carousel-dialog.tsx) is an intersection with a
// discriminated union enforcing `aria-label`/`aria-labelledby` at the type
// level, which AutoTypeTable can't render usefully — this flattens it into
// one table, with the "exactly one of the two" constraint called out in prose
// instead. (The runtime type lives in carousel-dialog.tsx; this file is
// never bundled.)

/** Props for `CarouselDialog` — a modal, paged walkthrough. */
export interface CarouselDialogProps {
  /** One `<CarouselItem>` per slide — the same shape as `<Carousel>`'s own children. */
  children: React.ReactNode;
  /** Forwarded to the inner `<Carousel>`. `opts.startIndex` seeds the initial slide. */
  opts?: CarouselProps['opts'];
  /** Forwarded to the inner `<Carousel>` verbatim. */
  plugins?: CarouselProps['plugins'];
  /** Forwarded to the inner `<Carousel>`; called once with the Embla API instance. */
  setApi?: (api: CarouselApi) => void;
  /** Forwarded to `DialogContent` (popup max-width). */
  size?: DialogContentProps['size'];
  /** Forwarded to `DialogContent`. */
  className?: string;
  /** Accessible name for the dialog. Exactly one of `aria-label`/`aria-labelledby` is required. */
  'aria-label'?: string;
  /** Accessible name via reference to an element id rendered inside a slide. */
  'aria-labelledby'?: string;
  /** Controlled open state. Forwarded to Dialog's root. */
  open?: boolean;
  /** Initial open state when uncontrolled. Forwarded to Dialog's root. */
  defaultOpen?: boolean;
  /** Fires when the dialog opens or closes. Forwarded to Dialog's root. */
  onOpenChange?: (open: boolean) => void;
  /** Forwarded to the inner `CarouselDialogFooter`'s `positionLabel` (default `'Slide position'`). */
  positionLabel?: string;
  /** Forwarded to the inner `CarouselDialogFooter`'s `backLabel` (default `'Back'`). */
  backLabel?: string;
  /** Forwarded to the inner `CarouselDialogFooter`'s `nextLabel` (default `'Next'`). */
  nextLabel?: string;
  /** Forwarded to the inner `CarouselDialogFooter`'s `closeLabel` (default `'Close'`). */
  closeLabel?: string;
}
