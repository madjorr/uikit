import * as React from 'react';

import { Button } from '../button';
import { InputText } from '../input-text';
import { Spinner } from '../spinner';
import {
  Dialog,
  DialogCloseButton,
  DialogClose,
  DialogContent,
  DialogTitle,
  type DialogContentProps,
} from '../dialog';

// A higher-level "recipe" built on top of the Dialog primitive parts (Dialog +
// DialogContent give the portal, backdrop, focus trap, scroll lock and open
// state; DialogTitle wires the accessible name; DialogCloseButton / DialogClose
// give the dismiss controls). It bakes in the seven Figma "DialogDefault"
// use-cases (node 6343:58898): each `variant` picks a canned title, body copy
// and footer buttons; `children` overrides only the body slot; `hasLoading`
// drops a spinner overlay over the body + footer.
//
// Colors resolve to shipped semantic tokens via the bridged Tailwind names the
// Dialog family already uses (text-foreground, the backdrop + focus tokens
// inside DialogContent / DialogCloseButton) and the Button / InputText token
// tiers — nothing is hand-authored. The loading scrim is surface-secondary at
// 95% alpha (`bg-muted/95`), matching the design's translucent surface fill.
//
// Container geometry/color comes from DialogContent's `--ui-dialog-container-*`
// tokens (dialog.tsx). Header + footer geometry/color below resolve to the
// `--ui-dialog-header-*` / `--ui-footer-*` tiers, reconciled against the
// DialogDefault Figma node (6343:58898).

export type DialogDefaultVariant =
  | 'default'
  | 'rename'
  | 'save changes'
  | 'reset password'
  | 'discard changes'
  | 'accept'
  | 'read-only';

interface VariantContent {
  title: string;
  body: React.ReactNode;
  /** Secondary (dismiss) button label. Omitted when the variant has none. */
  secondaryLabel?: string;
  primaryLabel: string;
  primaryVariant: 'default' | 'destructive';
  /** Whether the primary button dismisses the dialog (e.g. read-only "Done"). */
  primaryCloses?: boolean;
}

const VARIANT_CONTENT: Record<DialogDefaultVariant, VariantContent> = {
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

type DialogRootProps = React.ComponentPropsWithoutRef<typeof Dialog>;

export interface DialogDefaultProps extends Omit<DialogRootProps, 'children'> {
  /** Selects the canned title / body / footer preset. Defaults to `default`. */
  variant?: DialogDefaultVariant;
  /** Show a spinner overlay across the body + footer. */
  hasLoading?: boolean;
  /** Overrides the variant's default body content. */
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

const DialogDefault = React.forwardRef<HTMLDivElement, DialogDefaultProps>(
  (
    {
      variant = 'default',
      hasLoading = false,
      children,
      size = 'sm',
      portal,
      portalContainer,
      className,
      ...rootProps
    },
    ref
  ) => {
    const content = VARIANT_CONTENT[variant];
    const bodyContent = children ?? content.body;

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
            <DialogTitle>{content.title}</DialogTitle>
            <DialogCloseButton />
          </div>

          <div className="flex min-h-[var(--ui-dialog-body-height-min)] flex-col justify-center gap-[var(--ui-dialog-body-gap)] px-4 py-[var(--ui-dialog-body-padding-y)]">
            {typeof bodyContent === 'string' ? (
              <p className="text-sm leading-6 text-foreground">{bodyContent}</p>
            ) : (
              bodyContent
            )}
          </div>

          <div className="flex h-[var(--ui-footer-global-height)] items-center justify-end gap-[var(--ui-footer-global-gap)] border-t-[length:var(--ui-footer-default-border-width)] border-[var(--ui-footer-default-border-color)] bg-[var(--ui-footer-default-color)] px-[var(--ui-footer-global-padding-x)]">
            {content.secondaryLabel && (
              <DialogClose
                render={
                  <Button variant="secondary">{content.secondaryLabel}</Button>
                }
              />
            )}
            {content.primaryCloses ? (
              <DialogClose
                render={
                  <Button variant={content.primaryVariant}>
                    {content.primaryLabel}
                  </Button>
                }
              />
            ) : (
              <Button variant={content.primaryVariant}>
                {content.primaryLabel}
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

export { DialogDefault };
