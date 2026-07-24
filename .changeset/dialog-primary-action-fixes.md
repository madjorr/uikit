---
'@acronis-platform/ui-react': minor
---

Add an `onPrimaryAction` prop to `Dialog`, fired when the primary footer button is clicked. Previously six of the eight variants' primary buttons (`default`, `rename`, `save changes`, `reset password`, `discard changes`, `accept`) had no way to attach behavior — clicking "Save"/"Rename"/"Reset"/"Confirm"/"Accept" did nothing. The dialog does not close automatically after the callback fires; pair it with the existing `open`/`onOpenChange` to close once the action completes.

Add an `objectNameLabel` prop, overriding the `rename` variant's text field accessible name (previously a hardcoded `'Object name'` string with no way to translate it).

Re-export `DialogClose` from the package root — it's required by the `wide` variant's documented custom-`footer` example (`import { Button, DialogClose } from '@acronis-platform/ui-react'`).
