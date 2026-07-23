// Figma Code Connect — status: COMPLETE
// Mapped to the "DialogDefault" component set in the ui-react Figma file
// (node 6343:58898). Property names verified via get_context_for_code_connect:
// `variant` (variant enum), `hasLoading` (boolean), `DialogBody` (slot → children).
import figma from '@figma/code-connect';

import { DialogDefault } from './dialog-default';

figma.connect(
  DialogDefault,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6343-58898',
  {
    props: {
      variant: figma.enum('variant', {
        default: 'default',
        rename: 'rename',
        'save changes': 'save changes',
        'reset password': 'reset password',
        'discard changes': 'discard changes',
        accept: 'accept',
        'read-only': 'read-only',
      }),
      hasLoading: figma.boolean('hasLoading'),
      children: figma.children('DialogBody'),
    },
    example: ({ variant, hasLoading, children }) => (
      <DialogDefault variant={variant} hasLoading={hasLoading} defaultOpen>
        {children}
      </DialogDefault>
    ),
  }
);
