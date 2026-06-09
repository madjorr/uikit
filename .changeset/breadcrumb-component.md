---
'@acronis-platform/ui-react': minor
---

Add `Breadcrumb`: a composable set of breadcrumb primitives (`Breadcrumb`,
`BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`,
`BreadcrumbSeparator`, `BreadcrumbEllipsis`). Links are polymorphic via the
Base UI `render` prop (e.g. a router `Link`); the current page is marked with
`aria-current="page"`. Colors are wired to the `--ui-breadcrumb-*` tokens from
`@acronis-platform/tokens-pd`, and the separator uses the 16px chevron-right
icon. Includes tests, Storybook stories, and a Figma Code Connect mapping.
