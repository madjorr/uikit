// Figma Code Connect — status: COMPLETE
// Mapped to the "Button" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Button } from './button';

figma.connect(
  Button,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1173-2789',
  {
    props: {
      // Figma's `Variant` property labels its text-only style "Link"; the code
      // variant (and its `--ui-button-ghost-*` tokens) is named `ghost`.
      variant: figma.enum('Variant', {
        Primary: 'default',
        Secondary: 'secondary',
        Link: 'ghost',
        Destructive: 'destructive',
        Ai: 'ai',
        Inverted: 'inverted',
      }),
      // The Figma button encodes interaction state as a variant; only the
      // Disabled state maps to a code prop (Idle/Hover/Active/Focus are visual).
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      // The Figma button has two same-named "Icon" properties — a boolean
      // visibility toggle and an instance-swap slot — so they're referenced by
      // their full `Name#id` to disambiguate. When the toggle is on, the
      // swapped icon instance is rendered as the button's leading child.
      icon: figma.boolean('Icon#1173:2', {
        true: figma.instance('Icon#1173:0'),
        false: undefined,
      }),
    },
    example: ({ variant, disabled, icon }) => (
      <Button variant={variant} disabled={disabled}>
        {icon}
        Label
      </Button>
    ),
  }
);
