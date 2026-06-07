# Switch

A binary on/off toggle whose change takes effect immediately.

## When to use

- Toggling a single setting that applies instantly (e.g. "Enable notifications").

## When not to use

- A choice that only applies after submitting a form — use a checkbox.
- Selecting one of several options — use radios or a segmented control.

## Example (React — implemented)

```tsx
import { Switch } from '@acronis-platform/ui-react';

const [enabled, setEnabled] = useState(false);

<Switch aria-label="Wireless" checked={enabled} onCheckedChange={setEnabled} />;
```

> **Note:** the implementation is not yet wired to the `--ui-switch-*` tokens
> (see `tokens.yaml`/`behavior.md`). Vue and Web Component implementations are
> planned against the same contract.
