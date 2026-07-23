import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `DialogContentProps` and
// `DialogDefaultProps` in dialog.tsx extend Base UI Dialog props, which expand
// to a large, noisy table; this companion documents only the props callers set
// directly. (The runtime types live in dialog.tsx; this file is never bundled.)
// `DialogContentProps` is internal (Dialog isn't exported from the package
// root) but stays documented here for engineers reading DialogDefault's source.

/** Props for `DialogContent` — the portaled, centered dialog popup. */
export interface DialogContentProps {
  /** Popup max-width. Only `sm` (512px) is defined today. */
  size?: 'sm';
  /**
   * Render the content inside a portal (default `true`). Disable only when you
   * supply your own `DialogPortal` ancestor (e.g. inline usage).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
  /** Keep the content mounted while closed. */
  keepMounted?: boolean;
  /** Extra classes merged onto the popup. */
  className?: string;
  children?: React.ReactNode;
}

/** Props for `DialogDefault` — the public, variant-driven dialog recipe. */
export interface DialogDefaultProps {
  /** Selects the canned title / body / footer preset. Defaults to `'default'`. */
  variant?:
    | 'default'
    | 'rename'
    | 'save changes'
    | 'reset password'
    | 'discard changes'
    | 'accept'
    | 'read-only';
  /** Show a spinner overlay across the body + footer. */
  hasLoading?: boolean;
  /** Overrides the variant's default body content. */
  children?: React.ReactNode;
  /** Overrides the variant's default title. */
  title?: string;
  /**
   * Overrides the variant's default secondary (dismiss) button label. Passing
   * this on a variant with no secondary button by default (e.g. `read-only`)
   * also makes the button appear.
   */
  secondaryLabel?: string;
  /** Overrides the variant's default primary button label. */
  primaryLabel?: string;
  /** Overrides the close button's accessible name. Defaults to `'Close'`. */
  closeLabel?: string;
  /** Popup max-width. Only `sm` (512px) is defined today. */
  size?: 'sm';
  /** Render inside a portal (default `true`). */
  portal?: boolean;
  /** Portal container. Pass a shadow-root mount for isolated-style previews. */
  portalContainer?: HTMLElement | null;
  /** Extra classes merged onto the popup container. */
  className?: string;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Open on mount, uncontrolled. */
  defaultOpen?: boolean;
  /** Modal behavior — focus trap and scroll lock while open. Defaults to `true`. */
  modal?: boolean | 'trap-focus';
  /** Fires when the dialog opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
}
