# DialogWelcome

A higher-level "recipe" dialog for welcome / onboarding screens, built on top of
the Dialog primitive parts. It renders an illustration slot above a centered
title and description, so product code doesn't reassemble the same welcome-card
chrome each time.

> **Footer carousel is out of scope.** The step-dot indicator + Back/Next
> navigation shown in the Figma frame is **not** part of this component — it is
> built separately as the `Carousel` / `CarouselDialogFooter` / `CarouselDialog`
> component set (embla-based, ambient-context-driven first/middle/last states).
> Compose `DialogWelcome` with `CarouselDialogFooter` (or use `CarouselDialog`)
> when a stepped walkthrough footer is needed. DialogWelcome itself renders no
> footer.
>
> **Status: draft (design-pending geometry).** Colors and typography resolve to
> shipped semantic tokens, but there is no `--ui-dialog-*` token tier yet, so
> container/body geometry (radius, widths, paddings, gaps, image height) is
> applied as plain Tailwind utilities — a tracked exception, not an oversight.
> Reconcile with a Dialog tier once the design team ships one. See `tokens.yaml`.

## When to use

- A welcome / onboarding screen with an illustration above a short title and
  description.

## When not to use

- A confirmation / decision dialog — use `DialogDefault`.
- A bespoke layout or extra parts — compose the `Dialog` parts directly.
- Transient, non-blocking feedback — use a toast.

## Parts

| Part          | Element (default)  | Purpose                                     |
| ------------- | ------------------ | ------------------------------------------- |
| `container`   | `div[role=dialog]` | The portaled, centered popup card.          |
| `image`       | `div`              | Illustration / media slot above the text.   |
| `title`       | `h2`               | Accessible dialog name (`aria-labelledby`). |
| `description` | `p`                | Supporting copy (`aria-describedby`).       |

## Example

```tsx
import { useState } from 'react';
import { DialogWelcome } from '@acronis-platform/ui-react';

function Welcome() {
  const [open, setOpen] = useState(true);
  return (
    <DialogWelcome
      title="Welcome to the workspace"
      description="Take a quick tour of the features available to you."
      image={<img src="/welcome.png" alt="" />}
      open={open}
      onOpenChange={setOpen}
    />
  );
}

// Override the text block (image slot + dialog chrome preserved)
<DialogWelcome title="Title" description="…" defaultOpen>
  <div className="px-4 text-center">Any custom body content.</div>
</DialogWelcome>;
```
