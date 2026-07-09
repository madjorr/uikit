import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// Resizable panels: a thin wrapper over `react-resizable-panels` (v4: `Group` /
// `Panel` / `Separator`) themed with the next-gen `--ui-resizable-*` token tier,
// following the shadcn composition (`ResizablePanelGroup` / `ResizablePanel` /
// `ResizableHandle`). Base UI has no resizable primitive, so this is the one
// component that wraps a third-party panel library instead.
//
// The handle is the 9px-wide draggable `Separator` (Figma node 4649:6681,
// 1px divider + 4px padding each side for hover hit area). It paints a centered
// 1px divider line (`--ui-resizable-border-width`) — `--ui-border-on-surface-border`
// at rest (idle), `--ui-resizable-border-color-hover` on pointer hover,
// `--ui-resizable-border-color-active` while dragging (`:active`). Keyboard focus
// paints a 3px `--ui-focus-primary` ring; the resting cursor is
// `--ui-resizable-cursor` (`ew-resize`). Each interaction state is wired to its
// own token so brands can diverge.
//
// `orientation="vertical"` (panels stacked) flips the layout: the Group goes
// `flex-col`, the Separator becomes a horizontal line (`aria-orientation=horizontal`),
// and the cursor becomes `ns-resize`.

function ResizablePanelGroup({ className, ...props }: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      className={cn('flex h-full w-full aria-[orientation=vertical]:flex-col', className)}
      {...props}
    />
  );
}

function ResizablePanel(props: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel {...props} />;
}

export type ResizableHandleProps = ResizablePrimitive.SeparatorProps;

function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        // 9px hit area: 1px divider + 4px padding each side.
        'relative flex w-[9px] items-center justify-center',
        'cursor-[var(--ui-resizable-cursor)] outline-none',
        // Centered 1px divider line (idle → semantic border, hover → hover token, drag → active token).
        // Uses a CSS border (not width+background) so the browser pixel-snaps the line
        // and it doesn't blur across device pixels when the handle lands at a fractional position.
        // The vertical divider is a zero-width box painted by its inline-start
        // (left) border; the horizontal override below swaps to the block-start
        // (top) border. Color is set with `border-color` (all sides) so it
        // applies regardless of which side carries the width.
        'after:absolute after:inset-y-0 after:inset-x-0 after:mx-auto after:w-0',
        'after:[border-inline-start-width:var(--ui-resizable-border-width)] after:border-solid after:[border-color:var(--ui-border-on-surface-border)]',
        'hover:after:[border-color:var(--ui-resizable-border-color-hover)]',
        'active:after:[border-color:var(--ui-resizable-border-color-active)]',
        // Focus ring: 3px box-shadow on the line itself so it auto-centers (Figma 4649:6686).
        'focus-visible:after:[box-shadow:0_0_0_3px_var(--ui-focus-primary)] focus-visible:after:[border-color:var(--ui-resizable-border-color-active)]',
        'active:after:shadow-none',
        // orientation=horizontal = panels stacked → horizontal divider line.
        // Draw it with the block-start (top) border and reset the inline-start
        // border used for the vertical line, so the full-width line renders.
        'aria-[orientation=horizontal]:h-[9px] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-[ns-resize]',
        'aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:inset-y-auto aria-[orientation=horizontal]:after:start-auto aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-0 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0',
        'aria-[orientation=horizontal]:after:[border-inline-start-width:0] aria-[orientation=horizontal]:after:[border-block-start-width:var(--ui-resizable-border-width)]',
        className
      )}
      {...props}
    />
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
