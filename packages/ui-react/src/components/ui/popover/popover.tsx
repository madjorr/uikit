import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { cn } from '@/lib/utils';
import { usePortalContainer } from '@/lib/portal-container';

// Ported from `@acronis-platform/shadcn-uikit`'s `popover`
// (packages/ui-legacy/src/components/ui/popover.tsx). A floating panel anchored
// to a trigger, built on the Base UI Popover primitive (positioning, focus
// management, outside-press / Esc dismissal, ARIA come from Base UI). Themed by
// the `--ui-popover-*` tier (container chrome: color, border, radius, min/max
// width) per Figma node 6364:17907. The optional `PopoverBody`/`PopoverFooter`
// parts mirror that node's `Body` slot and `FooterDefault` recipe — `PopoverBody`
// from `--ui-popover-body-*`, `PopoverFooter` from the shared `--ui-footer-*`
// tier (also used by other components' default action-row footer). Text color
// stays on the bridged semantic token (--ui-text-on-surface-primary), which the
// design references directly rather than a Popover-specific token.
// Enter/exit animations use `tw-animate-css` keyed to Base UI's data-[open] /
// data-[closed] / data-[side] attributes.

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverPortal = PopoverPrimitive.Portal;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> {
  /** Which side of the trigger to render on. */
  side?: PopoverPrimitive.Positioner.Props['side'];
  /** Alignment along the chosen side. */
  align?: PopoverPrimitive.Positioner.Props['align'];
  /** Distance in px from the trigger. */
  sideOffset?: number;
  /**
   * Render inside a portal (default `true`). Set `false` for inline usage
   * (e.g. when supplying your own `PopoverPortal`).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: PopoverPrimitive.Portal.Props['container'];
  /** Keep the content mounted while closed (Base UI `Portal` prop). */
  keepMounted?: PopoverPrimitive.Portal.Props['keepMounted'];
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(
  (
    {
      className,
      side = 'bottom',
      align = 'center',
      sideOffset = 4,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;

    const positioner = (
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={cn(
            'min-w-[var(--ui-popover-container-min-width)] max-w-[var(--ui-popover-container-max-width)] rounded-[var(--ui-popover-container-border-radius)] border-[length:var(--ui-popover-container-border-width)] border-solid border-[var(--ui-popover-container-border-color)] bg-[var(--ui-popover-container-color)] text-foreground outline-none',
            'duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-95 data-[closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    );

    return portal ? (
      <PopoverPrimitive.Portal container={resolvedContainer} keepMounted={keepMounted}>
        {positioner}
      </PopoverPrimitive.Portal>
    ) : (
      positioner
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

/**
 * Vertical-rhythm wrapper for a `PopoverContent`'s main content — the `Body`
 * slot in the Figma node. Themed from `--ui-popover-body-*` (gap, padding-y);
 * horizontal inset is a plain utility since the design has no dedicated
 * component token for it.
 */
const PopoverBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex w-full flex-col gap-[var(--ui-popover-body-gap)] px-4 py-[var(--ui-popover-body-padding-y)]',
        className
      )}
      {...props}
    />
  )
);
PopoverBody.displayName = 'PopoverBody';

/**
 * Default action-row footer — the `FooterDefault` (`variant=default`) recipe
 * from the Figma node. Themed from the shared `--ui-footer-*` tier.
 */
const PopoverFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-[var(--ui-footer-global-height)] w-full shrink-0 items-center justify-end gap-[var(--ui-footer-global-gap)] border-t-[length:var(--ui-footer-default-border-width)] border-solid border-[var(--ui-footer-default-border-color)] bg-[var(--ui-footer-default-color)] px-[var(--ui-footer-global-padding-x)]',
        className
      )}
      {...props}
    />
  )
);
PopoverFooter.displayName = 'PopoverFooter';

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
};
