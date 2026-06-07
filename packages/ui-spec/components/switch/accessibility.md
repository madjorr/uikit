# Switch — Accessibility

- **Role:** `switch` (Base UI Switch.Root), with `aria-checked` reflecting the
  on/off state.
- **Accessible name:** associate a visible label (e.g. wrap with a `<label>` or
  use `aria-labelledby`); when there is no visible label, provide `aria-label`.
- **Keyboard:** Space (and Enter) toggle the switch while focused; Tab moves
  focus. A `disabled` switch is not focusable.
- **Focus visible:** 2px `--ui-focus-brand` ring with 2px offset via
  `:focus-visible`.
- **State, not color alone:** the on/off state is exposed via `aria-checked` and
  the thumb position, not color alone.
- **WCAG:** 2.1.1 (keyboard), 2.4.7 (focus visible), 4.1.2 (name/role/value),
  1.4.11 (non-text contrast).
