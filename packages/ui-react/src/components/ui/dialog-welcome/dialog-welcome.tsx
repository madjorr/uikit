import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
} from '../dialog';

// A higher-level "recipe" welcome/onboarding dialog built on the Dialog
// primitive parts (Dialog + DialogContent give the portal, backdrop, focus
// trap, scroll lock and open state; DialogTitle / DialogDescription wire the
// accessible name + description). It bakes in the Figma "DialogWelcome" body
// layout (node 6353:6164): an image/illustration slot above a centered title
// and description. `children` overrides the title + description text block.
//
// SCOPE: the footer carousel (step-dot indicator + Back/Next navigation) shown
// in the Figma frame is intentionally NOT part of this component. It is built
// separately as the `Carousel` / `CarouselDialogFooter` / `CarouselDialog`
// component set. Compose `DialogWelcome` with `CarouselDialogFooter` (or use
// `CarouselDialog`) when a stepped walkthrough footer is needed; DialogWelcome
// itself renders no footer.
//
// Colors resolve to shipped semantic tokens via the bridged Tailwind names the
// Dialog family already uses (bg-muted / text-foreground, the backdrop token
// inside DialogContent) — nothing is hand-authored.
//
// TODO(design-tokens): the container / body GEOMETRY below (radius, widths,
// paddings, gaps, image height) is hardcoded as Tailwind utilities because no
// `--ui-dialog-*` component token tier exists in tokens-pd yet — the Figma node
// references `components/Dialog/*` geometry variables that have no `--ui-*`
// equivalent. This is a deliberate, tracked exception (colors + typography ARE
// tokenized); replace these values with the tokens once a Dialog tier ships.
// Mirrors the geometry already hardcoded in `dialog.tsx` / `dialog-default.tsx`.

type DialogRootProps = React.ComponentPropsWithoutRef<typeof Dialog>;

export interface DialogWelcomeProps extends Omit<DialogRootProps, 'children'> {
  /** Illustration / image rendered in the media slot above the text. */
  image?: React.ReactNode;
  /** Step title (the dialog's accessible name). */
  title: string;
  /** Supporting copy shown below the title. */
  description: string;
  /**
   * Overrides the default title + description text block below the image. When
   * provided, supply your own accessible name (the default `DialogTitle` is not
   * rendered).
   */
  children?: React.ReactNode;
  /** Popup max-width (forwarded to `DialogContent`). Defaults to `sm` (512px). */
  size?: DialogContentProps['size'];
  /** Render inside a portal (forwarded to `DialogContent`). Defaults to `true`. */
  portal?: boolean;
  /** Portal container (forwarded to `DialogContent`). */
  portalContainer?: DialogContentProps['portalContainer'];
  /** Extra classes merged onto the popup container. */
  className?: string;
}

const DialogWelcome = React.forwardRef<HTMLDivElement, DialogWelcomeProps>(
  (
    {
      image,
      title,
      description,
      children,
      size = 'sm',
      portal,
      portalContainer,
      className,
      ...rootProps
    },
    ref
  ) => {
    return (
      <Dialog {...rootProps}>
        <DialogContent
          ref={ref}
          size={size}
          portal={portal}
          portalContainer={portalContainer}
          className={cn('min-w-[256px]', className)}
        >
          <div className="flex w-full flex-col gap-3 py-4">
            <div className="w-full px-4">
              <div className="h-[272px] w-full overflow-hidden rounded bg-muted">
                {image}
              </div>
            </div>

            {children ?? (
              <div className="flex w-full flex-col gap-1 px-4 text-center text-foreground">
                <DialogTitle className="text-2xl font-normal leading-8 text-foreground">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-foreground">
                  {description}
                </DialogDescription>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
DialogWelcome.displayName = 'DialogWelcome';

export { DialogWelcome };
