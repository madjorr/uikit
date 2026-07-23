import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

// Initial version ported from `@acronis-platform/shadcn-uikit`'s `dialog`
// (packages/ui-legacy/src/components/ui/dialog.tsx). A modal overlay built on
// the Base UI Dialog primitive (keyboard, focus trap, scroll lock, ARIA come
// from Base UI). A `--ui-dialog-*` / `--ui-button-icon-*` token tier now covers
// the container + close button (reconciled against the DialogDefault Figma node,
// 6343:58898); the composable DialogHeader / DialogFooter / DialogBody parts
// below are still un-reconciled (no Figma node of their own yet) and keep the
// prior semantic-token approach:
//   • overlay  -> var(--ui-background-backdrop-screen)   (legacy `bg-black/80`)
//   • popup    -> var(--ui-dialog-container-color) / var(--ui-dialog-container-border-radius)
//   • header / footer -> bg-background = --ui-background-surface-primary (white
//     bars over the muted body), divided by border-border
//   • title    -> text-foreground / description -> text-muted-foreground
//   • close    -> var(--ui-button-icon-global-icon-color-*) (idle/hover/active
//     share one blue in the default brand), bg via
//     var(--ui-button-icon-global-container-color-*), focus ring var(--ui-focus-primary)
// Enter/exit animations use `tw-animate-css` (imported in styles/index.css),
// keyed to Base UI's data-[open] / data-[closed] state attributes — overlay
// fades, popup fades + zooms. The `size` scale (max-width) mirrors the reference
// design's six widths; only `sm` (512px) has a Figma-defined token
// (`--ui-dialog-container-size-sm`) so far — the rest stay plain max-width
// utilities until the design ships them.

// Popup width scale. `sm` (512px) is the default and matches the pre-size width.
const dialogContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 flex w-full min-w-[var(--ui-dialog-container-width-min)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--ui-dialog-container-border-radius)] bg-[var(--ui-dialog-container-color)] text-foreground shadow-lg duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
  {
    variants: {
      size: {
        xs: 'max-w-[464px]',
        sm: 'max-w-[var(--ui-dialog-container-size-sm)]',
        md: 'max-w-2xl',
        lg: 'max-w-[832px]',
        xl: 'max-w-[992px]',
        '2xl': 'max-w-[1136px]',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[var(--ui-background-backdrop-screen)] duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>,
    VariantProps<typeof dialogContentVariants> {
  /**
   * Popup max-width. `sm` 512 · `xs` 464 · `md` 672 · `lg` 832 · `xl` 992 ·
   * `2xl` 1136 (px). Defaults to `sm`.
   */
  size?: VariantProps<typeof dialogContentVariants>['size'];
  /**
   * Render the content inside a portal (default `true`). Base UI requires the
   * Popup to sit in a Portal for correct stacking; set `false` for inline usage
   * (e.g. when the caller supplies its own `DialogPortal`, or in tests).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: DialogPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: DialogPrimitive.Portal.Props['keepMounted'];
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Popup>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;

    const popup = (
      <>
        <DialogOverlay />
        <DialogPrimitive.Popup
          ref={ref}
          className={cn(dialogContentVariants({ size }), className)}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </>
    );

    return portal ? (
      <DialogPrimitive.Portal container={resolvedContainer} keepMounted={keepMounted}>
        {popup}
      </DialogPrimitive.Portal>
    ) : (
      popup
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center gap-4 border-b border-border bg-background px-5 py-4',
      className
    )}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center justify-end gap-4 border-t border-border bg-background px-6 py-4',
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 overflow-auto p-6', className)} {...props} />
));
DialogBody.displayName = 'DialogBody';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'flex-1 text-2xl font-normal leading-8 text-foreground',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogCloseButton = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'rounded p-1 text-[var(--ui-button-icon-global-icon-color-idle)] transition-colors hover:bg-[var(--ui-button-icon-global-container-color-hover)] hover:text-[var(--ui-button-icon-global-icon-color-hover)] active:bg-[var(--ui-button-icon-global-container-color-active)] active:text-[var(--ui-button-icon-global-icon-color-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none disabled:text-[var(--ui-button-icon-global-icon-color-disabled)]',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
DialogCloseButton.displayName = 'DialogCloseButton';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogCloseButton,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
  DialogDescription,
  dialogContentVariants,
};
