import * as React from 'react';

export interface IconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'stroke' | 'fill' | 'strokeWidth'
> {
  /** Rendered size in px. Defaults to 24 — the canonical asset size. */
  size?: number;
  /**
   * Accessible label. When set, the icon is exposed as `role="img"` with this
   * label; otherwise it is `aria-hidden` (decorative). Default: decorative.
   */
  title?: string;
}

export interface SvgIconProps extends IconProps {
  mode: 'stroke' | 'solid';
  viewBox?: string;
  /**
   * Map of rendered size (px) → stroke width in viewBox user units, derived
   * from the design-assets scale + stroke rules at generation time. Stroke
   * mode only. Falls back to the canonical (24) value for unmapped sizes.
   */
  strokeWidthBySize?: Record<number, number>;
  children: React.ReactNode;
}

/**
 * Shared renderer for generated icon components. The design-assets master is a
 * 24px vector; the scale + stroke rules are baked into `strokeWidthBySize` so a
 * single source renders at any size with the designed stroke weight (e.g. 1.6px
 * at 16, 2.5px at 32). Color comes from `currentColor`, so icons inherit the
 * surrounding text color.
 */
export const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>(
  function SvgIcon(
    {
      mode,
      size = 24,
      viewBox = '0 0 24 24',
      strokeWidthBySize,
      title,
      children,
      ...props
    },
    ref
  ) {
    const a11y = title
      ? { role: 'img', 'aria-label': title }
      : { 'aria-hidden': true, focusable: false };

    const paint =
      mode === 'stroke'
        ? ({
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth:
              strokeWidthBySize?.[size] ?? strokeWidthBySize?.[24] ?? 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          } as const)
        : ({ fill: 'currentColor' } as const);

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        {...a11y}
        {...paint}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  }
);
