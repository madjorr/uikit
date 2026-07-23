import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

import { Button } from '../button';
import { InputText } from '../input-text';
import { Spinner } from '../spinner';

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
// fades, popup fades + zooms. `size` only has one value (`sm`, 512px) — the
// one width with a Figma-defined token (`--ui-dialog-container-size-sm`); it
// stays a cva axis (rather than a fixed value) so a design-shipped wider size
// can be added later without an API change.
//
// Dialog's composable primitive parts (this file) are internal-only — not
// re-exported from the package root. `DialogDefault` below is the only
// sanctioned public entry point; it's built on these parts internally.

const dialogContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 flex w-full min-w-[var(--ui-dialog-container-width-min)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--ui-dialog-container-border-radius)] bg-[var(--ui-dialog-container-color)] text-foreground shadow-lg duration-200 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95',
  {
    variants: {
      size: {
        sm: 'max-w-[var(--ui-dialog-container-size-sm)]',
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
  /** Popup max-width. Only `sm` (512px) is defined today. Defaults to `sm`. */
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

export interface DialogCloseButtonProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  /** Accessible name for screen readers. Defaults to `'Close'`. */
  closeLabel?: string;
}

const DialogCloseButton = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseButtonProps
>(({ className, closeLabel = 'Close', ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'cursor-pointer rounded p-1 text-[var(--ui-button-icon-global-icon-color-idle)] transition-colors hover:bg-[var(--ui-button-icon-global-container-color-hover)] hover:text-[var(--ui-button-icon-global-icon-color-hover)] active:bg-[var(--ui-button-icon-global-container-color-active)] active:text-[var(--ui-button-icon-global-icon-color-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none disabled:cursor-default disabled:text-[var(--ui-button-icon-global-icon-color-disabled)]',
      className
    )}
    {...props}
  >
    <TimesIcon size={24} />
    <span className="sr-only">{closeLabel}</span>
  </DialogPrimitive.Close>
));
DialogCloseButton.displayName = 'DialogCloseButton';

// A higher-level "recipe" built on top of the Dialog primitive parts above
// (Dialog + DialogContent give the portal, backdrop, focus trap, scroll lock
// and open state; DialogTitle wires the accessible name; DialogCloseButton /
// DialogClose give the dismiss controls). It bakes in the seven Figma
// "DialogDefault" use-cases (node 6343:58898): each `variant` picks a canned
// title, body copy and footer buttons; `children` overrides only the body
// slot; `hasLoading` drops a spinner overlay over the body + footer.
//
// Colors resolve to shipped semantic tokens via the bridged Tailwind names the
// Dialog family already uses (text-foreground, the backdrop + focus tokens
// inside DialogContent / DialogCloseButton) and the Button / InputText token
// tiers — nothing is hand-authored. The loading scrim is surface-secondary at
// 95% alpha (`bg-muted/95`), matching the design's translucent surface fill.
//
// Header + footer geometry/color resolve to the `--ui-dialog-header-*` /
// `--ui-footer-*` tiers, reconciled against the DialogDefault Figma node.

export type DialogDefaultVariant =
  | 'default'
  | 'rename'
  | 'save changes'
  | 'reset password'
  | 'discard changes'
  | 'accept'
  | 'read-only';

interface DialogDefaultVariantContent {
  title: string;
  body: React.ReactNode;
  /** Secondary (dismiss) button label. Omitted when the variant has none. */
  secondaryLabel?: string;
  primaryLabel: string;
  primaryVariant: 'default' | 'destructive';
  /** Whether the primary button dismisses the dialog (e.g. read-only "Done"). */
  primaryCloses?: boolean;
}

const DIALOG_DEFAULT_VARIANT_CONTENT: Record<
  DialogDefaultVariant,
  DialogDefaultVariantContent
> = {
  default: {
    title: 'Dialog title',
    body: 'Drop any content into this slot.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Label',
    primaryVariant: 'default',
  },
  rename: {
    title: 'Rename object name',
    body: <InputText aria-label="Object name" defaultValue="Current name" />,
    secondaryLabel: 'Cancel',
    primaryLabel: 'Rename',
    primaryVariant: 'default',
  },
  'save changes': {
    title: 'Save changes',
    body: 'You have unsaved changes. Do you want to save them before leaving?',
    secondaryLabel: 'Go back',
    primaryLabel: 'Save',
    primaryVariant: 'default',
  },
  'reset password': {
    title: 'Reset password',
    body: 'Further instructions will be sent to your email address.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Reset',
    primaryVariant: 'default',
  },
  'discard changes': {
    title: 'Discard changes',
    body: (
      <p className="text-sm leading-6 text-foreground">
        Are you sure you want to discard the unsaved changes to{' '}
        <strong className="font-semibold">Object name</strong>?
      </p>
    ),
    secondaryLabel: 'Go back',
    primaryLabel: 'Confirm',
    primaryVariant: 'destructive',
  },
  accept: {
    title: 'Accept object name',
    body: 'Click Accept to confirm that you have read, understood, and agree to the terms and conditions below.',
    secondaryLabel: 'Cancel',
    primaryLabel: 'Accept',
    primaryVariant: 'default',
  },
  'read-only': {
    title: 'License agreement',
    body: 'This is a read-only dialog used to view legal documents such as the License Agreement, EULA updates, Terms of Service, and other legal documents.',
    primaryLabel: 'Done',
    primaryVariant: 'default',
    primaryCloses: true,
  },
};

type DialogDefaultRootProps = React.ComponentPropsWithoutRef<typeof Dialog>;

export interface DialogDefaultProps
  extends Omit<DialogDefaultRootProps, 'children'> {
  /** Selects the canned title / body / footer preset. Defaults to `default`. */
  variant?: DialogDefaultVariant;
  /** Show a spinner overlay across the body + footer. */
  hasLoading?: boolean;
  /** Overrides the variant's default body content. */
  children?: React.ReactNode;
  /** Overrides the variant's default title. */
  title?: string;
  /**
   * Overrides the variant's default secondary (dismiss) button label. Passing
   * this for a variant with no secondary button by default (e.g. `read-only`)
   * also makes the button appear.
   */
  secondaryLabel?: string;
  /** Overrides the variant's default primary button label. */
  primaryLabel?: string;
  /** Overrides the close button's accessible name. Defaults to `'Close'`. */
  closeLabel?: string;
  /** Popup max-width (forwarded to `DialogContent`). Defaults to `sm` (512px). */
  size?: DialogContentProps['size'];
  /** Render inside a portal (forwarded to `DialogContent`). Defaults to `true`. */
  portal?: boolean;
  /** Portal container (forwarded to `DialogContent`). */
  portalContainer?: DialogContentProps['portalContainer'];
  /** Extra classes merged onto the popup container. */
  className?: string;
}

const DialogDefault = React.forwardRef<HTMLDivElement, DialogDefaultProps>(
  (
    {
      variant = 'default',
      hasLoading = false,
      children,
      title,
      secondaryLabel,
      primaryLabel,
      closeLabel,
      size = 'sm',
      portal,
      portalContainer,
      className,
      ...rootProps
    },
    ref
  ) => {
    const content = DIALOG_DEFAULT_VARIANT_CONTENT[variant];
    const bodyContent = children ?? content.body;
    const titleText = title ?? content.title;
    const secondaryLabelText = secondaryLabel ?? content.secondaryLabel;
    const primaryLabelText = primaryLabel ?? content.primaryLabel;

    return (
      <Dialog {...rootProps}>
        <DialogContent
          ref={ref}
          size={size}
          portal={portal}
          portalContainer={portalContainer}
          className={className}
        >
          <div className="flex h-[var(--ui-dialog-header-height)] items-center gap-[var(--ui-dialog-header-gap)] border-b-[length:var(--ui-dialog-header-border-width)] border-[var(--ui-dialog-header-border-color)] bg-[var(--ui-dialog-header-color)] px-[var(--ui-dialog-header-padding-x)]">
            <DialogTitle>{titleText}</DialogTitle>
            <DialogCloseButton closeLabel={closeLabel} />
          </div>

          <div className="flex min-h-[var(--ui-dialog-body-height-min)] flex-col justify-center gap-[var(--ui-dialog-body-gap)] px-4 py-[var(--ui-dialog-body-padding-y)]">
            {typeof bodyContent === 'string' ? (
              <p className="text-sm leading-6 text-foreground">{bodyContent}</p>
            ) : (
              bodyContent
            )}
          </div>

          <div className="flex h-[var(--ui-footer-global-height)] items-center justify-end gap-[var(--ui-footer-global-gap)] border-t-[length:var(--ui-footer-default-border-width)] border-[var(--ui-footer-default-border-color)] bg-[var(--ui-footer-default-color)] px-[var(--ui-footer-global-padding-x)]">
            {secondaryLabelText && (
              <DialogClose
                render={
                  <Button variant="secondary">{secondaryLabelText}</Button>
                }
              />
            )}
            {content.primaryCloses ? (
              <DialogClose
                render={
                  <Button variant={content.primaryVariant}>
                    {primaryLabelText}
                  </Button>
                }
              />
            ) : (
              <Button variant={content.primaryVariant}>
                {primaryLabelText}
              </Button>
            )}
          </div>

          {hasLoading && (
            <div className="absolute inset-x-0 bottom-0 top-16 flex items-center justify-center bg-muted/95">
              <Spinner size="xl" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);
DialogDefault.displayName = 'DialogDefault';

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
  DialogDefault,
};
