# DialogDefault

A higher-level "recipe" dialog built on top of the Dialog primitive parts. One
`variant` prop selects a ready-made title, body copy and footer for the seven
most common dialog use-cases, so product code doesn't reassemble the same
`Dialog` + `DialogHeader` + `DialogFooter` boilerplate each time.

> **Status: draft (design-pending geometry).** Colors and typography resolve to
> shipped semantic tokens, but there is no `--ui-dialog-*`/`--ui-footer-*` token
> tier yet, so container/header/footer geometry (radius, widths, heights,
> paddings, gaps, divider widths) is applied as plain Tailwind utilities — a
> tracked exception, not an oversight. Reconcile with a Dialog/Footer tier once
> the design team ships one. See `tokens.yaml`.

## When to use

- One of the seven canned use-cases fits: `default`, `rename`, `save changes`,
  `reset password`, `discard changes`, `accept`, `read-only`.
- You want a consistent confirmation/decision dialog without hand-composing the
  Dialog parts.

## When not to use

- You need a bespoke layout or extra parts — compose the `Dialog` parts directly.
- For transient, non-blocking feedback — use a toast.
- For contextual hints anchored to an element — use a tooltip or popover.

## Variants

| Variant           | Title              | Footer                              |
| ----------------- | ------------------ | ----------------------------------- |
| `default`         | Dialog title       | Cancel · Label                      |
| `rename`          | Rename object name | Cancel · Rename (body: text field)  |
| `save changes`    | Save changes       | Go back · Save                      |
| `reset password`  | Reset password     | Cancel · Reset                      |
| `discard changes` | Discard changes    | Go back · **Confirm** (destructive) |
| `accept`          | Accept object name | Cancel · Accept                     |
| `read-only`       | License agreement  | Done (single primary action)        |

## Parts

| Part              | Element (default)  | Purpose                                     |
| ----------------- | ------------------ | ------------------------------------------- |
| `container`       | `div[role=dialog]` | The portaled, centered popup card.          |
| `header`          | `div`              | Top bar; title + close button.              |
| `title`           | `h2`               | Accessible dialog name (`aria-labelledby`). |
| `close-button`    | `button`           | Icon button that dismisses the dialog.      |
| `body`            | `div`              | Variant copy or the `children` override.    |
| `footer`          | `div`              | Right-aligned action bar.                   |
| `loading-overlay` | `div`              | Spinner scrim shown while `hasLoading`.     |

## Example

```tsx
import { DialogDefault } from '@acronis-platform/ui-react';

// Canned use-case, controlled open state
<DialogDefault variant="discard changes" open={open} onOpenChange={setOpen} />;

// Override the body slot (header + footer chrome preserved)
<DialogDefault variant="default" defaultOpen>
  <p>Any custom body content.</p>
</DialogDefault>;

// Busy state
<DialogDefault variant="save changes" hasLoading open />;
```
