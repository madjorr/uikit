# Dialog

> **Internal-only.** Not exported from `@acronis-platform/ui-react`. This is
> the composable primitive `DialogDefault` is built on — use
> [`DialogDefault`](../dialog-default/README.md) instead. Documented here
> because its source lives alongside `DialogDefault`'s
> (`packages/ui-react/src/components/ui/dialog/`) and other internal code
> (tests, Storybook VR coverage) still references it directly.

A modal overlay that interrupts the user to show focused content or request a
decision. Composable from parts; built on the Base UI Dialog primitive.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Dialog`. There is no `--ui-dialog-*` token
> tier yet, so colors resolve to the shared semantic tokens. Enter/exit
> animations use `tw-animate-css` (overlay fade, popup fade + zoom), keyed to
> Base UI's open/closed state. Reconcile against Figma with
> `/figma-component Dialog <url> --update` once a mockup lands.

## When to use

- Never directly — it has no public export. Use `DialogDefault`; if none of
  its seven canned use-cases fit, that's a gap to raise with the design system
  team (a new variant), not a reason to reach for this primitive.

## Parts

| Part                             | Element (default)  | Purpose                                           |
| -------------------------------- | ------------------ | ------------------------------------------------- |
| `Dialog`                         | —                  | Root; owns the open state (Base UI `Root`).       |
| `DialogTrigger`                  | `button`           | Opens the dialog.                                 |
| `DialogContent`                  | `div[role=dialog]` | The portaled, centered popup (+ overlay).         |
| `DialogHeader`                   | `div`              | Top bar; holds the title and close button.        |
| `DialogTitle`                    | `h2`               | Accessible dialog name (`aria-labelledby`).       |
| `DialogCloseButton`              | `button`           | Icon button that dismisses the dialog.            |
| `DialogBody`                     | `div`              | Scrollable content region.                        |
| `DialogDescription`              | `p`                | Supporting copy (`aria-describedby`).             |
| `DialogFooter`                   | `div`              | Right-aligned action bar.                         |
| `DialogClose`                    | `button`           | Closes the dialog; wrap a Button via `render`.    |
| `DialogOverlay` / `DialogPortal` | —                  | Lower-level parts (`DialogContent` renders them). |

## Sizes

`DialogContent` takes a `size` prop controlling the popup max-width. Only `sm`
(512px, default) has a Figma-defined token (`--ui-dialog-container-size-sm`)
today; it stays a variant axis so a wider size can be added later without an
API change.

## Example (internal usage only)

```tsx
// NOT a public import — './dialog' is an internal module path, shown here
// only to document what DialogDefault composes internally.
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog';
import { Button } from '../button';

<Dialog>
  <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogCloseButton />
    </DialogHeader>
    <DialogBody>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogBody>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost">Cancel</Button>} />
      <Button variant="destructive">Delete account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```
