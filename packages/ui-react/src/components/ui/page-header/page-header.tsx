import * as React from 'react';

import { cn } from '@/lib/utils';

// The page header region from the Figma "PageHeader" component (shadcn-uikit /
// ui-react file, node 2905-7678): a title row (title left, an optional edit
// icon-button, a tags slot, an actions slot) and an optional description row
// (text + an optional edit icon-button), capped at 512px. The design's
// breadcrumb is a separate sibling above PageHeader (see the "Breakpoints"
// page composition), not one of its own parts — render a `Breadcrumb` next to
// it, don't nest one inside. Title uses the design's `headings/title` style
// (24px/32px, regular) in `--ui-text-on-surface-primary`; the description uses
// `link/default` (14px/24px, regular) in `--ui-text-on-surface-secondary` — the
// only two colors here. The edit affordance is a plain `ButtonIcon` the
// consumer places as a sibling; PageHeader doesn't own a dedicated part for it
// since it's the same atom either row.

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header"
    role="banner"
    className={cn('flex w-full flex-col items-start gap-1', className)}
    {...props}
  />
));
PageHeader.displayName = 'PageHeader';

// The title row: title, optional edit button, tags slot, actions slot.
const PageHeaderRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-row"
    className={cn('flex w-full items-center gap-2', className)}
    {...props}
  />
));
PageHeaderRow.displayName = 'PageHeaderRow';

const PageHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    data-slot="page-header-title"
    className={cn(
      'shrink-0 whitespace-nowrap text-2xl font-normal leading-8 text-foreground',
      className
    )}
    {...props}
  />
));
PageHeaderTitle.displayName = 'PageHeaderTitle';

// The tags slot: grows to share the row's remaining width with the actions
// slot (so actions stay flush right even when tags are omitted entirely).
const PageHeaderTags = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-tags"
    className={cn('flex min-w-0 flex-1 items-center gap-2', className)}
    {...props}
  />
));
PageHeaderTags.displayName = 'PageHeaderTags';

const PageHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-actions"
    className={cn('flex min-w-0 flex-1 items-center justify-end gap-4', className)}
    {...props}
  />
));
PageHeaderActions.displayName = 'PageHeaderActions';

// The description row: caps the text (+ its optional edit button) at 512px,
// matching the Figma's explicit "Description max width 512px" note.
const PageHeaderDescriptionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="page-header-description-row"
    className={cn('flex max-w-lg items-center gap-2', className)}
    {...props}
  />
));
PageHeaderDescriptionRow.displayName = 'PageHeaderDescriptionRow';

const PageHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="page-header-description"
    className={cn(
      'min-w-0 flex-1 text-sm font-normal leading-6 text-muted-foreground',
      className
    )}
    {...props}
  />
));
PageHeaderDescription.displayName = 'PageHeaderDescription';

export {
  PageHeader,
  PageHeaderRow,
  PageHeaderTitle,
  PageHeaderTags,
  PageHeaderActions,
  PageHeaderDescriptionRow,
  PageHeaderDescription,
};
